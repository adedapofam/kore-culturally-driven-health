import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Droplets, Dumbbell, Pill, Plus, Sparkles, ChevronRight, type LucideIcon } from "lucide-react";
import { MobileShell } from "@/components/kore/MobileShell";
import { ProgressRing } from "@/components/kore/ProgressRing";
import { MacroBar } from "@/components/kore/MacroBar";
import { useKore } from "@/store/koreStore";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const k = useKore();
  if (!k.profile) return null;
  const t = k.targets();
  const totals = k.todayTotals();
  const water = k.todayWaterMl();
  const supps = k.todaySupplementCompletion();
  const workout = k.todayWorkout();
  const isGym = k.isGymDayToday();
  const greet = (() => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  })();

  return (
    <MobileShell>
      <div className="px-5 pt-4 relative">
        {/* header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start mb-6">
          <div>
            <div className="text-xs text-muted-foreground">{greet},</div>
            <h1 className="font-display text-3xl font-semibold leading-tight">{k.profile.name}</h1>
          </div>
          <button onClick={k.toggleGymDay} className="flex flex-col items-end">
            <span className={`text-[10px] uppercase tracking-widest ${isGym ? "text-accent" : "text-muted-foreground"}`}>
              {isGym ? "Gym day" : "Rest day"}
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">tap to switch</span>
          </button>
        </motion.div>

        {/* main calorie ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-6 relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30" style={{ background: "var(--gradient-glow)" }} />
          <div className="flex items-center gap-5 relative">
            <ProgressRing
              value={totals.calories}
              max={t.calories}
              size={140}
              label="kcal"
              sublabel={`of ${t.calories}`}
            />
            <div className="flex-1 space-y-3">
              <MacroBar label="Protein" value={totals.protein} max={t.protein} color="hsl(var(--protein))" />
              <MacroBar label="Carbs" value={totals.carbs} max={t.carbs} color="hsl(var(--carbs))" />
              <MacroBar label="Fat" value={totals.fat} max={t.fat} color="hsl(var(--fat))" />
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Flame size={14} className="text-accent" /> {Math.max(0, t.calories - totals.calories)} kcal remaining</span>
            <Link to="/app/meals" className="text-accent font-medium flex items-center gap-1">Log meal <ChevronRight size={14} /></Link>
          </div>
        </motion.div>

        {/* streak + check-in */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mt-4 grid grid-cols-2 gap-3">
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs"><Flame size={14} className="text-accent" /> Streak</div>
            <div className="font-display text-3xl font-semibold mt-1 tabular-nums">{k.streak}<span className="text-sm text-muted-foreground font-sans ml-1">days</span></div>
          </div>
          <Link to="/app/checkin" className="glass-card rounded-2xl p-4 flex flex-col justify-between hover:border-accent/40 transition group">
            <div className="flex items-center gap-2 text-muted-foreground text-xs"><Sparkles size={14} className="text-accent" /> Check-in</div>
            <div className="flex justify-between items-end mt-1">
              <span className="font-medium text-sm">Open today</span>
              <ChevronRight size={16} className="text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        </motion.div>

        {/* tracker grid */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mt-4 grid grid-cols-2 gap-3">
          <TrackerTile to="/app/water" icon={Droplets} color="hsl(var(--water))"
            label="Hydration" primary={`${(water/1000).toFixed(1)}L`} sub={`of ${(t.waterMl/1000).toFixed(1)}L`}
            pct={Math.min(1, water / t.waterMl)} />
          <TrackerTile to="/app/supplements" icon={Pill} color="hsl(var(--gold))"
            label="Supplements" primary={`${supps.taken}/${supps.total || "—"}`} sub={supps.total ? "taken today" : "build your stack"}
            pct={supps.total ? supps.taken / supps.total : 0} />
          <TrackerTile to="/app/gym" icon={Dumbbell} color="hsl(var(--protein))"
            label="Workout"
            primary={workout ? `${workout.exercises.length}` : "—"}
            sub={workout ? "exercises logged" : isGym ? "no session yet" : "rest day"}
            pct={workout ? Math.min(1, workout.exercises.length / 5) : 0}
          />
          <TrackerTile to="/app/meals" icon={Plus} color="hsl(var(--accent))"
            label="Meals" primary={`${k.todayMeals().length}`} sub="logged today"
            pct={Math.min(1, k.todayMeals().length / 4)} />
        </motion.div>

        {/* recent meals */}
        {k.todayMeals().length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-display text-lg font-semibold">Today's plate</h2>
              <Link to="/app/meals" className="text-xs text-accent font-medium">See all</Link>
            </div>
            <div className="space-y-2">
              {k.todayMeals().slice(-3).reverse().map(m => (
                <div key={m.id} className="glass-card rounded-2xl px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/60 flex items-center justify-center text-xl">{m.emoji || "🍽️"}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{m.name}</div>
                    <div className="text-[11px] text-muted-foreground capitalize">{m.slot} · {m.protein}g P</div>
                  </div>
                  <div className="text-sm font-semibold tabular-nums">{m.calories}<span className="text-[10px] text-muted-foreground ml-0.5">kcal</span></div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <Link to="/app/meals" className="block mt-6">
          <Button className="w-full h-14 rounded-2xl text-base font-semibold gap-2"
            style={{ background: "var(--gradient-gold)", color: "hsl(var(--primary-foreground))", boxShadow: "var(--shadow-gold)" }}>
            <Plus size={18} /> Log a meal
          </Button>
        </Link>
      </div>
    </MobileShell>
  );
}

function TrackerTile({ to, icon: Icon, color, label, primary, sub, pct }: {
  to: string; icon: LucideIcon;
  color: string; label: string; primary: string; sub: string; pct: number;
}) {
  return (
    <Link to={to} className="glass-card rounded-2xl p-4 relative overflow-hidden group hover:border-accent/40 transition">
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/40">
        <div className="h-full transition-all duration-700" style={{ width: `${pct * 100}%`, background: color }} />
      </div>
      <div className="flex justify-between items-start">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}1f`, color }}>
          <Icon size={18} />
        </div>
        <ChevronRight size={14} className="text-muted-foreground group-hover:text-foreground transition" />
      </div>
      <div className="text-xs text-muted-foreground mt-3">{label}</div>
      <div className="font-display text-2xl font-semibold tabular-nums leading-tight">{primary}</div>
      <div className="text-[11px] text-muted-foreground">{sub}</div>
    </Link>
  );
}
