import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Flame, Beef, Dumbbell, Droplets } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, CartesianGrid } from "recharts";
import { MobileShell } from "@/components/kore/MobileShell";
import { PageHeader } from "@/components/kore/PageHeader";
import { useKore } from "@/store/koreStore";
import { cn } from "@/lib/utils";

type Range = 7 | 14 | 30;

export default function History() {
  const k = useKore();
  const [range, setRange] = useState<Range>(7);

  const series = useMemo(() => {
    const days: { date: string; label: string; calories: number; protein: number; carbs: number; fat: number; volume: number; waterMl: number }[] = [];
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      const meals = k.meals.filter(m => m.date === ds);
      const calories = meals.reduce((a, m) => a + m.calories * (m.portions ?? 1), 0);
      const protein = meals.reduce((a, m) => a + m.protein * (m.portions ?? 1), 0);
      const carbs = meals.reduce((a, m) => a + m.carbs * (m.portions ?? 1), 0);
      const fat = meals.reduce((a, m) => a + m.fat * (m.portions ?? 1), 0);
      const w = k.workouts.find(x => x.date === ds);
      const volume = w ? w.exercises.reduce((a, e) => a + e.sets.reduce((b, s) => b + s.reps * s.weightKg, 0), 0) : 0;
      const waterMl = k.hydration.filter(h => h.date === ds).reduce((a, h) => a + h.ml, 0);
      days.push({
        date: ds, label: d.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 2),
        calories, protein, carbs, fat, volume, waterMl,
      });
    }
    return days;
  }, [k.meals, k.workouts, k.hydration, range]);

  const avg = (key: "calories" | "protein" | "volume" | "waterMl") => {
    const vals = series.map(d => d[key]).filter(v => v > 0);
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  };

  const t = k.targets();
  const trainedDays = series.filter(d => d.volume > 0).length;
  const proteinHits = series.filter(d => d.protein >= t.protein * 0.9).length;

  return (
    <MobileShell>
      <PageHeader title="History" subtitle="Your patterns, surfaced." />
      <div className="px-5 space-y-4">
        <div className="flex gap-2">
          {([7, 14, 30] as Range[]).map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={cn("flex-1 h-10 rounded-xl text-xs font-medium transition",
                range === r ? "bg-accent text-accent-foreground" : "bg-secondary/40 border border-border/60 text-muted-foreground")}>
              {r}d
            </button>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
          <Stat icon={Flame} label="Avg calories" value={avg("calories")} unit="kcal" color="hsl(var(--carbs))" />
          <Stat icon={Beef} label="Avg protein" value={avg("protein")} unit="g" color="hsl(var(--protein))" />
          <Stat icon={Dumbbell} label="Trained" value={trainedDays} unit={`/ ${range}d`} color="hsl(var(--accent))" />
          <Stat icon={Droplets} label="Avg water" value={(avg("waterMl") / 1000).toFixed(1) as any} unit="L" color="hsl(var(--water))" />
        </motion.div>

        <Section title="Calories" subtitle={`Target ${t.calories} kcal`}>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                <Line type="monotone" dataKey="calories" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Protein" subtitle={`${proteinHits}/${range} days at goal`}>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="protein" fill="hsl(var(--protein))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Workout volume" subtitle="Total kg moved per session">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number) => `${Math.round(v)} kg`} />
                <Bar dataKey="volume" fill="hsl(var(--gold))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <div className="glass-card rounded-2xl p-5">
          <div className="text-[11px] uppercase tracking-widest text-accent mb-2 flex items-center gap-1.5">
            <TrendingUp size={12} /> Pattern
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {trainedDays >= range * 0.7
              ? `Training ${trainedDays}/${range} days — that's a foundation. Keep it.`
              : trainedDays === 0
              ? `No sessions logged in ${range} days. Even one this week resets the rhythm.`
              : `${trainedDays} sessions in ${range} days. Aiming for ${Math.ceil(range * 0.5)}+ would compound fast.`}
            {" "}
            {proteinHits >= range * 0.7
              ? `Protein consistency is strong.`
              : `Protein hit goal on ${proteinHits}/${range} days — the cheapest win you can grab.`}
          </p>
        </div>
      </div>
    </MobileShell>
  );
}

function Stat({ icon: Icon, label, value, unit, color }: any) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
        style={{ background: `${color}1f`, color }}>
        <Icon size={16} />
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-display text-2xl font-semibold tabular-nums leading-tight">
        {value}<span className="text-xs text-muted-foreground font-sans ml-1">{unit}</span>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex justify-between items-baseline mb-3">
        <h3 className="font-display text-base font-semibold">{title}</h3>
        <span className="text-[11px] text-muted-foreground">{subtitle}</span>
      </div>
      {children}
    </div>
  );
}