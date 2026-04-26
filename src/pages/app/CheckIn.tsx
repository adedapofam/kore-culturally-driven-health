import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Sun, Moon, CheckCircle2 } from "lucide-react";
import { MobileShell } from "@/components/kore/MobileShell";
import { PageHeader } from "@/components/kore/PageHeader";
import { Button } from "@/components/ui/button";
import { useKore } from "@/store/koreStore";
import { cn } from "@/lib/utils";

const MOODS = [
  { v: 1, e: "😩", l: "Drained" },
  { v: 2, e: "😕", l: "Off" },
  { v: 3, e: "🙂", l: "Steady" },
  { v: 4, e: "😊", l: "Strong" },
  { v: 5, e: "🔥", l: "Locked in" },
];

export default function CheckIn() {
  const k = useKore();
  const isMorning = new Date().getHours() < 14;
  const [step, setStep] = useState<"intro" | "mood" | "notes" | "summary">("intro");
  const [mood, setMood] = useState(3);
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);

  const totals = k.todayTotals();
  const t = k.targets();
  const supps = k.todaySupplementCompletion();
  const workout = k.todayWorkout();
  const isGym = k.isGymDayToday();

  const submit = () => {
    k.recordCheckIn({ type: isMorning ? "morning" : "evening", mood, notes });
    setDone(true);
  };

  const recommendation = (() => {
    const calRem = t.calories - totals.calories;
    const protRem = t.protein - totals.protein;
    if (isGym && !workout) return `It's a gym day — even 30 minutes of focused work today protects your momentum. Try one compound lift if time is tight.`;
    if (protRem > 40) return `You're still ${protRem}g short on protein. A bowl of dal with paneer, suya, or jerk chicken would close the gap warmly.`;
    if (calRem > 600) return `${calRem} calories left in the tank. A solid plate of jollof or biryani fits your target without overshooting.`;
    if (mood <= 2) return `Off days happen. Hydrate, eat something familiar, and protect your sleep tonight. Tomorrow resets.`;
    if (mood >= 4) return `Great energy. Use it — log everything you eat today, the data compounds.`;
    return `You're on track. Stay consistent with hydration and your evening supplements to finish strong.`;
  })();

  return (
    <MobileShell>
      <PageHeader
        title={isMorning ? "Morning check-in" : "Evening reflection"}
        subtitle={isMorning ? "How are we starting today?" : "Let's wrap the day"}
      />

      <div className="px-5">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {step === "intro" && (
                <div className="space-y-5">
                  <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-30" style={{ background: "var(--gradient-glow)" }} />
                    <Sparkles size={20} className="text-accent" />
                    <h2 className="font-display text-2xl font-semibold mt-3 leading-tight">
                      {isMorning ? `A warm hello, ${k.profile?.name}.` : `Welcome back, ${k.profile?.name}.`}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {isMorning
                        ? `It's a ${isGym ? "gym day" : "rest day"} today. Targets adjusted automatically. Take a minute — how are you walking in?`
                        : `Let's see what today looked like. No judgement, just data.`}
                    </p>
                  </div>
                  <Button onClick={() => setStep("mood")} className="w-full h-14 rounded-2xl text-base font-semibold gap-2"
                    style={{ background: "var(--gradient-gold)", color: "hsl(var(--primary-foreground))" }}>
                    Begin <ArrowRight size={18} />
                  </Button>
                </div>
              )}

              {step === "mood" && (
                <div className="space-y-6">
                  <h2 className="font-display text-2xl font-semibold leading-tight">How's your energy right now?</h2>
                  <div className="space-y-2">
                    {MOODS.map(m => (
                      <button key={m.v} onClick={() => setMood(m.v)}
                        className={cn("w-full flex items-center gap-4 p-4 rounded-2xl border transition-all",
                          mood === m.v ? "border-accent bg-accent/10" : "border-border/60 bg-secondary/40")}>
                        <span className="text-3xl">{m.e}</span>
                        <span className="font-medium">{m.l}</span>
                      </button>
                    ))}
                  </div>
                  <Button onClick={() => setStep("notes")} className="w-full h-14 rounded-2xl text-base font-semibold gap-2"
                    style={{ background: "var(--gradient-gold)", color: "hsl(var(--primary-foreground))" }}>
                    Continue <ArrowRight size={18} />
                  </Button>
                </div>
              )}

              {step === "notes" && (
                <div className="space-y-5">
                  <h2 className="font-display text-2xl font-semibold leading-tight">
                    {isMorning ? "Anything on your mind for today?" : "What stood out today?"}
                  </h2>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder={isMorning ? "e.g. Big meeting at 3pm, will train after work..." : "e.g. Hit my protein for the first time this week..."}
                    rows={5}
                    className="w-full p-4 rounded-2xl bg-secondary/40 border border-border/60 outline-none text-sm resize-none focus:border-accent/40" />
                  <Button onClick={submit} className="w-full h-14 rounded-2xl text-base font-semibold gap-2"
                    style={{ background: "var(--gradient-gold)", color: "hsl(var(--primary-foreground))" }}>
                    Complete check-in <CheckCircle2 size={18} />
                  </Button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
              <div className="glass-card rounded-3xl p-6 relative overflow-hidden text-center">
                <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-glow)" }} />
                <div className="relative">
                  <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center" style={{ background: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}>
                    {isMorning ? <Sun size={24} className="text-primary-foreground" /> : <Moon size={24} className="text-primary-foreground" />}
                  </div>
                  <h2 className="font-display text-2xl font-semibold mt-4">Streak: {k.streak} days</h2>
                  <p className="text-sm text-muted-foreground mt-1">Consistency compounds.</p>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5">
                <div className="text-[11px] uppercase tracking-widest text-accent mb-2 flex items-center gap-1.5"><Sparkles size={12} /> Kōre says</div>
                <p className="text-sm leading-relaxed">{recommendation}</p>
              </div>

              <div className="glass-card rounded-2xl p-5 space-y-3">
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Today at a glance</div>
                <Row label="Calories" value={`${totals.calories} / ${t.calories}`} />
                <Row label="Protein" value={`${totals.protein}g / ${t.protein}g`} />
                <Row label="Workout" value={workout ? `${workout.exercises.length} exercises` : isGym ? "Not logged" : "Rest day"} />
                <Row label="Supplements" value={`${supps.taken} / ${supps.total || 0}`} />
                <Row label="Hydration" value={`${(k.todayWaterMl()/1000).toFixed(1)}L`} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}
