import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, X, Trash2, TrendingUp } from "lucide-react";
import { MobileShell } from "@/components/kore/MobileShell";
import { PageHeader } from "@/components/kore/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKore, type LoggedExercise, type SetEntry } from "@/store/koreStore";
import { EXERCISE_DB, type Exercise } from "@/data/exercises";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Gym() {
  const k = useKore();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [building, setBuilding] = useState<{ ex: Exercise; sets: SetEntry[]; notes: string } | null>(null);

  const workout = k.todayWorkout();
  const totalVolume = workout?.exercises.reduce((a, e) => a + e.sets.reduce((s, x) => s + x.reps * x.weightKg, 0), 0) ?? 0;
  const muscles = Array.from(new Set(workout?.exercises.map(e => e.muscle) ?? []));

  const lastSession = (exId: string): LoggedExercise | undefined => {
    for (let i = k.workouts.length - 1; i >= 0; i--) {
      const w = k.workouts[i];
      if (w.date === new Date().toISOString().slice(0,10) && workout?.id === w.id) continue;
      const found = w.exercises.find(e => e.id === exId);
      if (found) return found;
    }
    return undefined;
  };

  return (
    <MobileShell>
      <PageHeader title={k.isGymDayToday() ? "Today's session" : "Rest day"}
        subtitle={workout ? `${workout.exercises.length} exercises · ${Math.round(totalVolume)}kg total volume` : "Tap below to log your workout"} />

      {workout && (
        <div className="px-5 mb-4 grid grid-cols-2 gap-3">
          <div className="glass-card rounded-2xl p-4">
            <div className="text-xs text-muted-foreground">Volume</div>
            <div className="font-display text-2xl font-semibold tabular-nums">{Math.round(totalVolume)}<span className="text-sm text-muted-foreground font-sans ml-1">kg</span></div>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <div className="text-xs text-muted-foreground">Muscles worked</div>
            <div className="font-display text-base font-semibold mt-1 leading-tight">{muscles.length ? muscles.join(", ") : "—"}</div>
          </div>
        </div>
      )}

      <div className="px-5 space-y-3">
        {workout?.exercises.map((e, idx) => (
          <motion.div key={e.id + idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-display text-lg font-semibold">{e.name}</h3>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{e.muscle}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Top set</div>
                <div className="font-semibold tabular-nums text-sm">
                  {Math.max(...e.sets.map(s => s.weightKg))}kg × {e.sets.find(s => s.weightKg === Math.max(...e.sets.map(x => x.weightKg)))?.reps}
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              {e.sets.map((s, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-md bg-secondary text-xs font-semibold flex items-center justify-center text-muted-foreground">{i+1}</span>
                  <span className="tabular-nums font-medium">{s.weightKg}kg</span>
                  <span className="text-muted-foreground">×</span>
                  <span className="tabular-nums font-medium">{s.reps} reps</span>
                </div>
              ))}
            </div>
            {e.notes && <p className="mt-3 pt-3 border-t border-border/60 text-xs text-muted-foreground italic">"{e.notes}"</p>}
          </motion.div>
        ))}

        {!workout && (
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">🏋🏾</div>
            <p className="text-sm text-muted-foreground">No exercises logged yet. Add your first lift.</p>
          </div>
        )}

        <Button onClick={() => setPickerOpen(true)}
          className="w-full h-14 rounded-2xl text-base font-semibold gap-2 mt-2"
          style={{ background: "var(--gradient-gold)", color: "hsl(var(--primary-foreground))", boxShadow: "var(--shadow-gold)" }}>
          <Plus size={18} /> Add exercise
        </Button>
      </div>

      <AnimatePresence>
        {pickerOpen && !building && (
          <ExercisePicker onClose={() => setPickerOpen(false)} onPick={(ex) => setBuilding({ ex, sets: [{ reps: 8, weightKg: 60 }], notes: "" })} />
        )}
        {building && (
          <SetBuilder
            exercise={building.ex}
            previous={lastSession(building.ex.id)}
            onClose={() => { setBuilding(null); setPickerOpen(false); }}
            onSave={(sets, notes) => {
              k.addWorkout({ exercises: [{ id: building!.ex.id, name: building!.ex.name, muscle: building!.ex.muscle, sets, notes }] });
              toast.success(`Logged ${building!.ex.name}`);
              setBuilding(null); setPickerOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </MobileShell>
  );
}

function ExercisePicker({ onClose, onPick }: { onClose: () => void; onPick: (e: Exercise) => void }) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const ql = q.toLowerCase();
    return EXERCISE_DB.filter(e => !ql || e.name.toLowerCase().includes(ql) || e.muscle.toLowerCase().includes(ql));
  }, [q]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end">
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="w-full max-w-md mx-auto max-h-[88vh] bg-card border-t border-border rounded-t-3xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border/60">
          <div className="font-display text-lg font-semibold">Choose exercise</div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"><X size={16} /></button>
        </div>
        <div className="p-4 pb-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search exercise or muscle..."
              className="pl-9 h-12 rounded-xl bg-secondary/60 border-border/60" />
          </div>
        </div>
        <div className="overflow-y-auto px-4 pb-6 flex-1 space-y-1.5">
          {list.map(e => (
            <button key={e.id} onClick={() => onPick(e)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 transition text-left">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-base">🏋🏾</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{e.name}</div>
                <div className="text-[11px] text-muted-foreground">{e.muscle} · {e.category}</div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function SetBuilder({ exercise, previous, onClose, onSave }: {
  exercise: Exercise; previous?: LoggedExercise;
  onClose: () => void; onSave: (sets: SetEntry[], notes: string) => void;
}) {
  const [sets, setSets] = useState<SetEntry[]>(previous?.sets || [{ reps: 8, weightKg: 60 }]);
  const [notes, setNotes] = useState("");

  const update = (i: number, key: keyof SetEntry, val: number) =>
    setSets(s => s.map((x, idx) => idx === i ? { ...x, [key]: val } : x));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end">
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="w-full max-w-md mx-auto max-h-[90vh] bg-card border-t border-border rounded-t-3xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border/60">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Logging</div>
            <div className="font-display text-lg font-semibold">{exercise.name}</div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"><X size={16} /></button>
        </div>

        {previous && (
          <div className="mx-4 mt-3 rounded-xl border border-accent/20 bg-accent/5 p-3 text-xs flex items-center gap-2">
            <TrendingUp size={14} className="text-accent" />
            <span className="text-muted-foreground">Last time: </span>
            <span className="font-medium tabular-nums">{Math.max(...previous.sets.map(s => s.weightKg))}kg × {Math.max(...previous.sets.map(s => s.reps))}</span>
          </div>
        )}

        <div className="overflow-y-auto px-4 py-4 flex-1 space-y-2">
          {sets.map((s, i) => (
            <div key={i} className="flex items-center gap-2 bg-secondary/60 rounded-xl p-3">
              <div className="w-7 h-7 rounded-md bg-background text-xs font-semibold flex items-center justify-center text-muted-foreground">{i+1}</div>
              <SetField label="kg" value={s.weightKg} onChange={v => update(i, "weightKg", v)} />
              <SetField label="reps" value={s.reps} onChange={v => update(i, "reps", v)} />
              {sets.length > 1 && (
                <button onClick={() => setSets(arr => arr.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive transition p-1">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
          <button onClick={() => setSets(s => [...s, s[s.length - 1] || { reps: 8, weightKg: 60 }])}
            className="w-full py-3 rounded-xl border border-dashed border-border/80 text-sm text-muted-foreground hover:text-foreground hover:border-accent/40 transition">
            + Add set
          </button>

          <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes (form, modification...)"
            className="mt-3 rounded-xl bg-secondary/60 border-border/60" />
        </div>

        <div className="p-4 border-t border-border/60">
          <Button onClick={() => onSave(sets, notes)} className="w-full h-12 rounded-xl font-semibold"
            style={{ background: "var(--gradient-gold)", color: "hsl(var(--primary-foreground))" }}>
            Save exercise
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SetField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex-1 flex items-center gap-2 bg-background rounded-lg px-3 py-2">
      <input value={value} onChange={e => onChange(parseFloat(e.target.value.replace(/[^\d.]/g, "")) || 0)}
        inputMode="decimal" className={cn("w-full bg-transparent outline-none font-semibold tabular-nums text-base text-center")} />
      <span className="text-[10px] text-muted-foreground uppercase">{label}</span>
    </div>
  );
}
