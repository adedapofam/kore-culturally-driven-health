import { createContext, useContext, useEffect, useMemo, useRef, useState, ReactNode } from "react";
import type { CulturalCuisine } from "@/data/foods";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

export type Goal = "muscle_gain" | "fat_loss" | "maintenance";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "very_active";
export type MealSlot = "breakfast" | "lunch" | "dinner" | "snacks";
export type SupplementTiming = "morning" | "pre_workout" | "post_workout" | "evening" | "before_bed";

export interface Profile {
  name: string;
  age: number;
  weightKg: number;
  heightCm: number;
  goal: Goal;
  cuisines: CulturalCuisine[];
  activity: ActivityLevel;
  gymDaysPerWeek: number;
}

export interface MealEntry {
  id: string; date: string; slot: MealSlot;
  name: string;
  /** Macros below are for ONE portion at `grams` (if known). */
  calories: number; protein: number; carbs: number; fat: number; emoji?: string;
  /** Weight in grams of one portion, when known (parsed from the food's serving). */
  grams?: number;
  /** How many portions were eaten. Totals multiply by this. */
  portions: number;
}

export interface SetEntry { reps: number; weightKg: number; }
export interface LoggedExercise { id: string; name: string; muscle: string; sets: SetEntry[]; notes?: string; }
export interface Workout { id: string; date: string; exercises: LoggedExercise[]; }

export interface Supplement {
  id: string; name: string; timing: SupplementTiming; emoji: string; isFoodBased?: boolean;
}
export interface SupplementLog { date: string; supplementId: string; taken: boolean; }

export interface HydrationLog { date: string; ml: number; }

export interface CheckIn { date: string; type: "morning" | "evening"; mood: number; notes: string; }

interface State {
  profile: Profile | null;
  meals: MealEntry[];
  workouts: Workout[];
  supplements: Supplement[];
  supplementLogs: SupplementLog[];
  hydration: HydrationLog[];
  checkIns: CheckIn[];
  isGymDayOverride: Record<string, boolean | undefined>; // by date (local-device preference)
  streak: number;
  lastCheckInDate: string | null;
}

interface Ctx extends State {
  user: User | null;
  authLoading: boolean;
  /** True once cloud data for the signed-in user has been loaded (or the user is a guest). */
  cloudSynced: boolean;
  signOut: () => Promise<void>;
  setProfile: (p: Profile) => void;
  addMeal: (m: Omit<MealEntry, "id" | "date" | "portions"> & { portions?: number }) => void;
  updateMeal: (id: string, patch: Partial<Pick<MealEntry, "name" | "calories" | "protein" | "carbs" | "fat" | "grams" | "portions">>) => void;
  removeMeal: (id: string) => void;
  addWorkout: (w: Omit<Workout, "id" | "date">) => void;
  addSupplement: (s: Omit<Supplement, "id">) => void;
  removeSupplement: (id: string) => void;
  toggleSupplement: (supplementId: string) => void;
  addWater: (ml: number) => void;
  toggleGymDay: () => void;
  isGymDayToday: () => boolean;
  targets: () => { calories: number; protein: number; carbs: number; fat: number; waterMl: number };
  todayMeals: () => MealEntry[];
  todayTotals: () => { calories: number; protein: number; carbs: number; fat: number };
  todayWaterMl: () => number;
  todaySupplementCompletion: () => { taken: number; total: number };
  todayWorkout: () => Workout | undefined;
  recordCheckIn: (c: Omit<CheckIn, "date">) => void;
  reset: () => void;
}

const KoreContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "kore_state_v1";
const MIGRATED_KEY = (uid: string) => `kore_migrated_${uid}`;
const CLOUD_WINDOW_DAYS = 90; // how much history we hydrate into the client
const todayStr = () => new Date().toISOString().slice(0, 10);

const initial: State = {
  profile: null, meals: [], workouts: [], supplements: [],
  supplementLogs: [], hydration: [], checkIns: [],
  isGymDayOverride: {}, streak: 0, lastCheckInDate: null,
};

function calcTargets(p: Profile, isGym: boolean) {
  // Mifflin–St Jeor (assume male coefficient as default — open MVP)
  const bmr = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + 5;
  const activityMult = { sedentary: 1.3, light: 1.45, moderate: 1.6, very_active: 1.75 }[p.activity];
  let tdee = bmr * activityMult;
  if (p.goal === "fat_loss") tdee -= 400;
  if (p.goal === "muscle_gain") tdee += 300;
  const calories = Math.round(isGym ? tdee + 200 : tdee - 150);
  const protein = Math.round(p.weightKg * (isGym ? 2.2 : 1.8));
  const fat = Math.round((calories * 0.27) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  const waterMl = Math.round(p.weightKg * 35);
  return { calories, protein, carbs, fat, waterMl };
}

function isGymScheduled(p: Profile | null): boolean {
  if (!p) return false;
  const day = new Date().getDay(); // 0=Sun..6=Sat
  const monIdx = (day + 6) % 7; // 0=Mon..6=Sun
  return monIdx < p.gymDaysPerWeek;
}

/** Derive streak + last check-in date from a list of check-ins (source of truth: cloud). */
export function deriveStreak(checkIns: CheckIn[]): { streak: number; lastCheckInDate: string | null } {
  if (checkIns.length === 0) return { streak: 0, lastCheckInDate: null };
  const dates = new Set(checkIns.map(c => c.date));
  const last = [...dates].sort().pop() ?? null;
  const cursor = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  // A streak is alive if the user checked in today or yesterday.
  if (!dates.has(iso(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (dates.has(iso(cursor))) { streak++; cursor.setDate(cursor.getDate() - 1); }
  return { streak, lastCheckInDate: last };
}

/** Report a background sync failure once, without interrupting the user's flow. */
let syncErrorShown = false;
function reportSyncError(op: string, error: unknown) {
  console.error(`[kore sync] ${op}`, error);
  if (!syncErrorShown) {
    syncErrorShown = true;
    toast.error("Couldn't sync to cloud — your data is saved on this device and will sync next time you open the app.");
  }
}

// ---------- Cloud row mappers ----------

type MealsRow = { id: string; log_date: string; slot: string; name: string; calories: number; protein: number; carbs: number; fat: number; emoji: string | null; grams: number | null; portions: number | null };
type WorkoutRow = { id: string; log_date: string; exercises: unknown };
type SupplementRow = { id: string; name: string; timing: string; emoji: string | null; is_food_based: boolean | null };
type SupplementLogRow = { log_date: string; supplement_id: string; taken: boolean };
type HydrationRow = { log_date: string; ml: number };
type CheckInRow = { log_date: string; type: string; mood: number; notes: string | null };

const mapMeal = (r: MealsRow): MealEntry => ({
  id: r.id, date: r.log_date, slot: r.slot as MealSlot, name: r.name,
  calories: Number(r.calories), protein: Number(r.protein), carbs: Number(r.carbs), fat: Number(r.fat),
  emoji: r.emoji ?? undefined,
  grams: r.grams != null ? Number(r.grams) : undefined,
  portions: r.portions != null ? Number(r.portions) : 1,
});
const mapWorkout = (r: WorkoutRow): Workout => ({
  id: r.id, date: r.log_date,
  exercises: Array.isArray(r.exercises) ? (r.exercises as LoggedExercise[]) : [],
});
const mapSupplement = (r: SupplementRow): Supplement => ({
  id: r.id, name: r.name, timing: r.timing as SupplementTiming,
  emoji: r.emoji ?? "💊", isFoodBased: r.is_food_based ?? false,
});
const mapSupplementLog = (r: SupplementLogRow): SupplementLog => ({
  date: r.log_date, supplementId: r.supplement_id, taken: r.taken,
});
const mapHydration = (r: HydrationRow): HydrationLog => ({ date: r.log_date, ml: r.ml });
const mapCheckIn = (r: CheckInRow): CheckIn => ({
  date: r.log_date, type: (r.type === "evening" ? "evening" : "morning"), mood: r.mood, notes: r.notes ?? "",
});

// ---------- One-time migration of guest (localStorage) data to the cloud ----------

async function migrateLocalToCloud(uid: string) {
  if (localStorage.getItem(MIGRATED_KEY(uid))) return;
  let local: State | null = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    local = raw ? { ...initial, ...JSON.parse(raw) } : null;
  } catch { local = null; }
  if (!local) { localStorage.setItem(MIGRATED_KEY(uid), "1"); return; }

  const hasContent = local.meals.length || local.workouts.length || local.supplements.length ||
    local.hydration.length || local.checkIns.length || local.profile;
  if (!hasContent) { localStorage.setItem(MIGRATED_KEY(uid), "1"); return; }

  try {
    if (local.profile) {
      const p = local.profile;
      await supabase.from("profiles").upsert({
        id: uid, name: p.name, age: p.age, weight_kg: p.weightKg, height_cm: p.heightCm,
        goal: p.goal, cuisines: p.cuisines, activity: p.activity, gym_days_per_week: p.gymDaysPerWeek,
      });
    }
    if (local.meals.length) {
      await supabase.from("meals").upsert(
        local.meals.map(m => ({
          id: m.id, user_id: uid, log_date: m.date, slot: m.slot, name: m.name,
          calories: m.calories, protein: m.protein, carbs: m.carbs, fat: m.fat, emoji: m.emoji ?? null,
          grams: m.grams ?? null, portions: m.portions ?? 1,
        })),
        { onConflict: "id", ignoreDuplicates: true },
      );
    }
    if (local.workouts.length) {
      await supabase.from("workouts").upsert(
        local.workouts.map(w => ({ user_id: uid, log_date: w.date, exercises: w.exercises as unknown as never })),
        { onConflict: "user_id,log_date", ignoreDuplicates: true },
      );
    }
    if (local.supplements.length) {
      await supabase.from("supplements").upsert(
        local.supplements.map(s => ({
          id: s.id, user_id: uid, name: s.name, timing: s.timing,
          emoji: s.emoji, is_food_based: s.isFoodBased ?? false,
        })),
        { onConflict: "id", ignoreDuplicates: true },
      );
      if (local.supplementLogs.length) {
        await supabase.from("supplement_logs").upsert(
          local.supplementLogs.map(l => ({
            user_id: uid, supplement_id: l.supplementId, log_date: l.date, taken: l.taken,
          })),
          { onConflict: "user_id,supplement_id,log_date", ignoreDuplicates: true },
        );
      }
    }
    if (local.hydration.length) {
      await supabase.from("hydration_logs").insert(
        local.hydration.map(h => ({ user_id: uid, log_date: h.date, ml: h.ml })),
      );
    }
    if (local.checkIns.length) {
      await supabase.from("check_ins").insert(
        local.checkIns.map(c => ({ user_id: uid, log_date: c.date, type: c.type, mood: c.mood, notes: c.notes })),
      );
    }
    localStorage.setItem(MIGRATED_KEY(uid), "1");
  } catch (e) {
    // Don't set the flag — we'll retry on next launch. Local data is untouched.
    reportSyncError("migration", e);
  }
}

// ---------- Fetch the user's cloud data ----------

async function fetchCloudState(uid: string): Promise<Partial<State>> {
  const since = new Date();
  since.setDate(since.getDate() - CLOUD_WINDOW_DAYS);
  const sinceStr = since.toISOString().slice(0, 10);

  const [prof, meals, workouts, supps, suppLogs, hydra, checkins] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
    supabase.from("meals").select("id,log_date,slot,name,calories,protein,carbs,fat,emoji,grams,portions").eq("user_id", uid).gte("log_date", sinceStr).order("created_at"),
    supabase.from("workouts").select("id,log_date,exercises").eq("user_id", uid).gte("log_date", sinceStr).order("log_date"),
    supabase.from("supplements").select("id,name,timing,emoji,is_food_based").eq("user_id", uid).order("created_at"),
    supabase.from("supplement_logs").select("log_date,supplement_id,taken").eq("user_id", uid).gte("log_date", sinceStr),
    supabase.from("hydration_logs").select("log_date,ml").eq("user_id", uid).gte("log_date", sinceStr).order("created_at"),
    supabase.from("check_ins").select("log_date,type,mood,notes").eq("user_id", uid).order("log_date"),
  ]);

  const firstError = [prof, meals, workouts, supps, suppLogs, hydra, checkins].find(r => r.error)?.error;
  if (firstError) throw firstError;

  const next: Partial<State> = {
    meals: (meals.data ?? []).map(mapMeal),
    workouts: (workouts.data ?? []).map(w => mapWorkout(w as WorkoutRow)),
    supplements: (supps.data ?? []).map(mapSupplement),
    supplementLogs: (suppLogs.data ?? []).map(mapSupplementLog),
    hydration: (hydra.data ?? []).map(mapHydration),
    checkIns: (checkins.data ?? []).map(mapCheckIn),
  };

  const p = prof.data;
  if (p && p.age && p.weight_kg) {
    next.profile = {
      name: p.name || "Friend",
      age: p.age,
      weightKg: Number(p.weight_kg),
      heightCm: Number(p.height_cm ?? 175),
      goal: (p.goal as Goal) ?? "maintenance",
      cuisines: (p.cuisines ?? []) as CulturalCuisine[],
      activity: (p.activity as ActivityLevel) ?? "moderate",
      gymDaysPerWeek: p.gym_days_per_week ?? 3,
    };
  }

  const { streak, lastCheckInDate } = deriveStreak(next.checkIns ?? []);
  next.streak = streak;
  next.lastCheckInDate = lastCheckInDate;
  return next;
}

// ---------- Provider ----------

export function KoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return initial;
      const parsed = { ...initial, ...JSON.parse(raw) } as State;
      // Older cached entries predate the portions field
      parsed.meals = (parsed.meals ?? []).map(m => ({ ...m, portions: m.portions ?? 1 }));
      return parsed;
    } catch { return initial; }
  });
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cloudSynced, setCloudSynced] = useState(false);
  const userRef = useRef<User | null>(null);
  userRef.current = user;

  // Local cache persistence (offline / guest support)
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  // Auth bootstrap
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setAuthLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Cloud hydration: migrate guest data once, then load cloud state (cloud is source of truth).
  useEffect(() => {
    if (!user) { setCloudSynced(false); return; }
    let cancelled = false;
    (async () => {
      try {
        await migrateLocalToCloud(user.id);
        const cloud = await fetchCloudState(user.id);
        if (cancelled) return;
        setState(s => ({ ...s, ...cloud }));
      } catch (e) {
        reportSyncError("initial load", e);
        // Fall through — the localStorage cache keeps the app usable offline.
      } finally {
        if (!cancelled) setCloudSynced(true);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo<Ctx>(() => {
    const today = todayStr();
    const uid = user?.id ?? null;

    const isGymDayToday = () => {
      const ov = state.isGymDayOverride[today];
      return ov !== undefined ? ov : isGymScheduled(state.profile);
    };
    const todayMeals = () => state.meals.filter(m => m.date === today);
    const todayTotals = () => todayMeals().reduce((a, m) => {
      const n = m.portions ?? 1;
      return {
        calories: a.calories + m.calories * n, protein: a.protein + m.protein * n,
        carbs: a.carbs + m.carbs * n, fat: a.fat + m.fat * n,
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    const todayWaterMl = () => state.hydration.filter(h => h.date === today).reduce((a, h) => a + h.ml, 0);
    const todaySupplementCompletion = () => {
      const total = state.supplements.length;
      const taken = state.supplementLogs.filter(l => l.date === today && l.taken).length;
      return { taken, total };
    };
    const todayWorkout = () => state.workouts.find(w => w.date === today);
    const targets = () => state.profile
      ? calcTargets(state.profile, isGymDayToday())
      : { calories: 2200, protein: 140, carbs: 240, fat: 70, waterMl: 2500 };

    return {
      ...state,
      user,
      authLoading,
      cloudSynced,
      signOut: async () => {
        // Cloud is the source of truth for signed-in users; clearing the local
        // cache on sign-out no longer destroys anything.
        await supabase.auth.signOut();
        try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
        setState(initial);
      },
      setProfile: (p) => {
        setState(s => ({ ...s, profile: p }));
        if (uid) {
          supabase.from("profiles").upsert({
            id: uid, name: p.name, age: p.age, weight_kg: p.weightKg,
            height_cm: p.heightCm, goal: p.goal, cuisines: p.cuisines,
            activity: p.activity, gym_days_per_week: p.gymDaysPerWeek,
          }).then(({ error }) => { if (error) reportSyncError("profile", error); });
        }
      },
      addMeal: (m) => {
        const id = crypto.randomUUID();
        const entry: MealEntry = { ...m, portions: m.portions ?? 1, id, date: today };
        setState(s => ({ ...s, meals: [...s.meals, entry] }));
        if (uid) {
          supabase.from("meals").insert({
            id, user_id: uid, log_date: today, slot: entry.slot, name: entry.name,
            calories: Math.round(entry.calories), protein: entry.protein, carbs: entry.carbs, fat: entry.fat,
            emoji: entry.emoji ?? null, grams: entry.grams ?? null, portions: entry.portions,
          }).then(({ error }) => { if (error) reportSyncError("meal", error); });
        }
      },
      updateMeal: (id, patch) => {
        setState(s => ({ ...s, meals: s.meals.map(m => m.id === id ? { ...m, ...patch } : m) }));
        if (uid) {
          const dbPatch: Record<string, unknown> = {};
          if (patch.name !== undefined) dbPatch.name = patch.name;
          if (patch.calories !== undefined) dbPatch.calories = Math.round(patch.calories);
          if (patch.protein !== undefined) dbPatch.protein = patch.protein;
          if (patch.carbs !== undefined) dbPatch.carbs = patch.carbs;
          if (patch.fat !== undefined) dbPatch.fat = patch.fat;
          if (patch.grams !== undefined) dbPatch.grams = patch.grams ?? null;
          if (patch.portions !== undefined) dbPatch.portions = patch.portions;
          supabase.from("meals").update(dbPatch).eq("id", id)
            .then(({ error }) => { if (error) reportSyncError("meal update", error); });
        }
      },
      removeMeal: (id) => {
        setState(s => ({ ...s, meals: s.meals.filter(m => m.id !== id) }));
        if (uid) {
          supabase.from("meals").delete().eq("id", id)
            .then(({ error }) => { if (error) reportSyncError("meal delete", error); });
        }
      },
      addWorkout: (w) => {
        const existing = state.workouts.find(x => x.date === today);
        const mergedExercises = existing ? [...existing.exercises, ...w.exercises] : w.exercises;
        setState(s => {
          const ex = s.workouts.find(x => x.date === today);
          if (ex) {
            return { ...s, workouts: s.workouts.map(x => x.date === today ? { ...x, exercises: [...x.exercises, ...w.exercises] } : x) };
          }
          return { ...s, workouts: [...s.workouts, { ...w, id: crypto.randomUUID(), date: today }] };
        });
        if (uid) {
          supabase.from("workouts").upsert(
            { user_id: uid, log_date: today, exercises: mergedExercises as unknown as never },
            { onConflict: "user_id,log_date" },
          ).then(({ error }) => { if (error) reportSyncError("workout", error); });
        }
      },
      addSupplement: (sup) => {
        const id = crypto.randomUUID();
        setState(s => ({ ...s, supplements: [...s.supplements, { ...sup, id }] }));
        if (uid) {
          supabase.from("supplements").insert({
            id, user_id: uid, name: sup.name, timing: sup.timing,
            emoji: sup.emoji, is_food_based: sup.isFoodBased ?? false,
          }).then(({ error }) => { if (error) reportSyncError("supplement", error); });
        }
      },
      removeSupplement: (id) => {
        setState(s => ({
          ...s, supplements: s.supplements.filter(x => x.id !== id),
          supplementLogs: s.supplementLogs.filter(l => l.supplementId !== id),
        }));
        if (uid) {
          supabase.from("supplements").delete().eq("id", id)
            .then(({ error }) => { if (error) reportSyncError("supplement delete", error); });
        }
      },
      toggleSupplement: (supplementId) => {
        const existing = state.supplementLogs.find(l => l.date === today && l.supplementId === supplementId);
        const newTaken = existing ? !existing.taken : true;
        setState(s => {
          const ex = s.supplementLogs.find(l => l.date === today && l.supplementId === supplementId);
          if (ex) return { ...s, supplementLogs: s.supplementLogs.map(l => l === ex ? { ...l, taken: newTaken } : l) };
          return { ...s, supplementLogs: [...s.supplementLogs, { date: today, supplementId, taken: newTaken }] };
        });
        if (uid) {
          supabase.from("supplement_logs").upsert(
            { user_id: uid, supplement_id: supplementId, log_date: today, taken: newTaken },
            { onConflict: "user_id,supplement_id,log_date" },
          ).then(({ error }) => { if (error) reportSyncError("supplement log", error); });
        }
      },
      addWater: (ml) => {
        setState(s => ({ ...s, hydration: [...s.hydration, { date: today, ml }] }));
        if (uid) {
          supabase.from("hydration_logs").insert({ user_id: uid, log_date: today, ml })
            .then(({ error }) => { if (error) reportSyncError("hydration", error); });
        }
      },
      toggleGymDay: () => setState(s => {
        const cur = s.isGymDayOverride[today];
        const base = cur !== undefined ? cur : isGymScheduled(s.profile);
        return { ...s, isGymDayOverride: { ...s.isGymDayOverride, [today]: !base } };
      }),
      isGymDayToday, todayMeals, todayTotals, todayWaterMl, todaySupplementCompletion, todayWorkout, targets,
      recordCheckIn: (c) => {
        setState(s => {
          const next = { ...s, checkIns: [...s.checkIns, { ...c, date: today }] };
          const { streak, lastCheckInDate } = deriveStreak(next.checkIns);
          return { ...next, streak, lastCheckInDate };
        });
        if (uid) {
          supabase.from("check_ins").insert({ user_id: uid, log_date: today, type: c.type, mood: c.mood, notes: c.notes })
            .then(({ error }) => { if (error) reportSyncError("check-in", error); });
        }
      },
      reset: () => setState(initial),
    };
  }, [state, user, authLoading, cloudSynced]);

  return <KoreContext.Provider value={value}>{children}</KoreContext.Provider>;
}

export function useKore() {
  const ctx = useContext(KoreContext);
  if (!ctx) throw new Error("useKore must be used within KoreProvider");
  return ctx;
}
