import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { CulturalCuisine } from "@/data/foods";

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
  name: string; calories: number; protein: number; carbs: number; fat: number; emoji?: string;
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
  isGymDayOverride: Record<string, boolean | undefined>; // by date
  streak: number;
  lastCheckInDate: string | null;
}

interface Ctx extends State {
  setProfile: (p: Profile) => void;
  addMeal: (m: Omit<MealEntry, "id" | "date">) => void;
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
  // simple: gym days = first N days of week (Mon-based)
  const day = new Date().getDay(); // 0=Sun..6=Sat
  const monIdx = (day + 6) % 7; // 0=Mon..6=Sun
  return monIdx < p.gymDaysPerWeek;
}

export function KoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...initial, ...JSON.parse(raw) } : initial;
    } catch { return initial; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  const value = useMemo<Ctx>(() => {
    const today = todayStr();
    const isGymDayToday = () => {
      const ov = state.isGymDayOverride[today];
      return ov !== undefined ? ov : isGymScheduled(state.profile);
    };
    const todayMeals = () => state.meals.filter(m => m.date === today);
    const todayTotals = () => todayMeals().reduce((a, m) => ({
      calories: a.calories + m.calories, protein: a.protein + m.protein,
      carbs: a.carbs + m.carbs, fat: a.fat + m.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
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
      setProfile: (p) => setState(s => ({ ...s, profile: p })),
      addMeal: (m) => setState(s => ({ ...s, meals: [...s.meals, { ...m, id: crypto.randomUUID(), date: today }] })),
      removeMeal: (id) => setState(s => ({ ...s, meals: s.meals.filter(m => m.id !== id) })),
      addWorkout: (w) => setState(s => {
        const existing = s.workouts.find(x => x.date === today);
        if (existing) {
          return { ...s, workouts: s.workouts.map(x => x.date === today ? { ...x, exercises: [...x.exercises, ...w.exercises] } : x) };
        }
        return { ...s, workouts: [...s.workouts, { ...w, id: crypto.randomUUID(), date: today }] };
      }),
      addSupplement: (sup) => setState(s => ({ ...s, supplements: [...s.supplements, { ...sup, id: crypto.randomUUID() }] })),
      removeSupplement: (id) => setState(s => ({
        ...s, supplements: s.supplements.filter(x => x.id !== id),
        supplementLogs: s.supplementLogs.filter(l => l.supplementId !== id),
      })),
      toggleSupplement: (supplementId) => setState(s => {
        const existing = s.supplementLogs.find(l => l.date === today && l.supplementId === supplementId);
        if (existing) return { ...s, supplementLogs: s.supplementLogs.map(l => l === existing ? { ...l, taken: !l.taken } : l) };
        return { ...s, supplementLogs: [...s.supplementLogs, { date: today, supplementId, taken: true }] };
      }),
      addWater: (ml) => setState(s => ({ ...s, hydration: [...s.hydration, { date: today, ml }] })),
      toggleGymDay: () => setState(s => {
        const cur = s.isGymDayOverride[today];
        const base = cur !== undefined ? cur : isGymScheduled(s.profile);
        return { ...s, isGymDayOverride: { ...s.isGymDayOverride, [today]: !base } };
      }),
      isGymDayToday, todayMeals, todayTotals, todayWaterMl, todaySupplementCompletion, todayWorkout, targets,
      recordCheckIn: (c) => setState(s => {
        const yest = new Date(); yest.setDate(yest.getDate() - 1);
        const yestStr = yest.toISOString().slice(0, 10);
        let streak = s.streak;
        if (s.lastCheckInDate !== today) {
          streak = s.lastCheckInDate === yestStr ? streak + 1 : 1;
        }
        return { ...s, checkIns: [...s.checkIns, { ...c, date: today }], streak, lastCheckInDate: today };
      }),
      reset: () => setState(initial),
    };
  }, [state]);

  return <KoreContext.Provider value={value}>{children}</KoreContext.Provider>;
}

export function useKore() {
  const ctx = useContext(KoreContext);
  if (!ctx) throw new Error("useKore must be used within KoreProvider");
  return ctx;
}
