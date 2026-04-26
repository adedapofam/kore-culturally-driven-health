import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Logo } from "@/components/kore/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKore, type Goal, type ActivityLevel } from "@/store/koreStore";
import { CUISINES, type CulturalCuisine } from "@/data/foods";
import { cn } from "@/lib/utils";

const STEPS = ["You", "Body", "Goal", "Culture", "Activity", "Schedule"] as const;

export default function Onboarding() {
  const nav = useNavigate();
  const { setProfile } = useKore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState("28");
  const [weight, setWeight] = useState("75");
  const [height, setHeight] = useState("175");
  const [goal, setGoal] = useState<Goal>("muscle_gain");
  const [cuisines, setCuisines] = useState<CulturalCuisine[]>([]);
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [gymDays, setGymDays] = useState(4);

  const next = () => setStep(s => Math.min(STEPS.length - 1, s + 1));
  const back = () => step === 0 ? nav("/") : setStep(s => s - 1);

  const finish = () => {
    setProfile({
      name: name.trim() || "Friend",
      age: parseInt(age) || 28,
      weightKg: parseFloat(weight) || 75,
      heightCm: parseFloat(height) || 175,
      goal,
      cuisines: cuisines.length ? cuisines : ["Western"],
      activity,
      gymDaysPerWeek: gymDays,
    });
    nav("/app");
  };

  const canNext = () => {
    if (step === 0) return name.trim().length > 0;
    if (step === 3) return cuisines.length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 glow-bg pointer-events-none" />
      <div className="mx-auto max-w-md min-h-screen px-6 pt-8 pb-10 flex flex-col relative z-10">
        <div className="flex items-center justify-between mb-6">
          <button onClick={back} className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary/60 hover:bg-secondary transition">
            <ArrowLeft size={18} />
          </button>
          <Logo size={24} />
          <div className="w-10" />
        </div>

        {/* progress */}
        <div className="flex gap-1.5 mb-8">
          {STEPS.map((_, i) => (
            <div key={i} className={cn("h-1 flex-1 rounded-full transition-all duration-500",
              i <= step ? "bg-accent" : "bg-muted")} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-4xl font-semibold leading-tight">What should we<br />call you?</h1>
                  <p className="text-muted-foreground mt-2 text-sm">First name is fine — we like keeping it personal.</p>
                </div>
                <Input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Amara"
                  className="h-14 text-lg rounded-2xl border-border/60 bg-secondary/40" />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-4xl font-semibold leading-tight">A few numbers</h1>
                  <p className="text-muted-foreground mt-2 text-sm">So we can dial in your targets.</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Age" suffix="yrs" value={age} onChange={setAge} />
                  <Field label="Weight" suffix="kg" value={weight} onChange={setWeight} />
                  <Field label="Height" suffix="cm" value={height} onChange={setHeight} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-4xl font-semibold leading-tight">What's the goal?</h1>
                  <p className="text-muted-foreground mt-2 text-sm">You can change this anytime.</p>
                </div>
                <div className="space-y-3">
                  {[
                    { id: "muscle_gain", label: "Build muscle", desc: "Higher calories, lots of protein" },
                    { id: "fat_loss", label: "Lose fat", desc: "Slight deficit, protein protected" },
                    { id: "maintenance", label: "Maintain & feel good", desc: "Hold weight, build the habit" },
                  ].map(opt => (
                    <Card key={opt.id} active={goal === opt.id} onClick={() => setGoal(opt.id as Goal)}>
                      <div className="flex-1">
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-4xl font-semibold leading-tight">Your <span className="gradient-text italic">food culture</span></h1>
                  <p className="text-muted-foreground mt-2 text-sm">Pick everything that's part of your kitchen. We'll prioritise these foods.</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {CUISINES.map(c => {
                    const active = cuisines.includes(c);
                    return (
                      <button
                        key={c}
                        onClick={() => setCuisines(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                        className={cn("relative px-4 py-4 rounded-2xl border text-left text-sm font-medium transition-all",
                          active ? "border-accent bg-accent/10 text-foreground" : "border-border/60 bg-secondary/40 text-muted-foreground hover:text-foreground")}
                      >
                        {c}
                        {active && <Check size={14} className="absolute top-2.5 right-2.5 text-accent" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-4xl font-semibold leading-tight">Daily activity</h1>
                  <p className="text-muted-foreground mt-2 text-sm">Outside the gym — how much do you move?</p>
                </div>
                <div className="space-y-3">
                  {[
                    { id: "sedentary", label: "Mostly sitting", desc: "Desk job, little walking" },
                    { id: "light", label: "Light", desc: "Some walking, occasional movement" },
                    { id: "moderate", label: "Moderate", desc: "On your feet, regular walks" },
                    { id: "very_active", label: "Very active", desc: "Manual work or constant movement" },
                  ].map(opt => (
                    <Card key={opt.id} active={activity === opt.id} onClick={() => setActivity(opt.id as ActivityLevel)}>
                      <div className="flex-1">
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-4xl font-semibold leading-tight">Gym days per week</h1>
                  <p className="text-muted-foreground mt-2 text-sm">We'll automatically switch your calorie & protein targets on training days.</p>
                </div>
                <div className="text-center py-6">
                  <div className="font-display text-7xl font-semibold gradient-text tabular-nums">{gymDays}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mt-2">sessions per week</div>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {[0,1,2,3,4,5,6,7].map(n => (
                    <button key={n} onClick={() => setGymDays(n)}
                      className={cn("h-12 rounded-xl text-sm font-semibold transition",
                        gymDays === n ? "bg-accent text-accent-foreground" : "bg-secondary/60 text-muted-foreground")}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="pt-6">
          {step < STEPS.length - 1 ? (
            <Button onClick={next} disabled={!canNext()} className="w-full h-14 rounded-2xl text-base font-semibold gap-2"
              style={canNext() ? { background: "var(--gradient-gold)", color: "hsl(var(--primary-foreground))" } : undefined}>
              Continue <ArrowRight size={18} />
            </Button>
          ) : (
            <Button onClick={finish} className="w-full h-14 rounded-2xl text-base font-semibold gap-2"
              style={{ background: "var(--gradient-gold)", color: "hsl(var(--primary-foreground))", boxShadow: "var(--shadow-gold)" }}>
              Enter Kōre <ArrowRight size={18} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, suffix }: { label: string; value: string; onChange: (v: string) => void; suffix: string }) {
  return (
    <div className="rounded-2xl bg-secondary/40 border border-border/60 p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="flex items-baseline gap-1 mt-1">
        <input value={value} onChange={e => onChange(e.target.value.replace(/[^\d.]/g, ""))}
          inputMode="decimal" className="w-full bg-transparent outline-none font-display text-2xl font-semibold tabular-nums" />
        <span className="text-xs text-muted-foreground">{suffix}</span>
      </div>
    </div>
  );
}

function Card({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn(
      "w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all",
      active ? "border-accent bg-accent/10" : "border-border/60 bg-secondary/40 hover:bg-secondary"
    )}>
      {children}
      <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition",
        active ? "border-accent bg-accent" : "border-border")}>
        {active && <Check size={12} className="text-accent-foreground" />}
      </div>
    </button>
  );
}
