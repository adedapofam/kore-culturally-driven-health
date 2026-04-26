import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check, Trash2 } from "lucide-react";
import { MobileShell } from "@/components/kore/MobileShell";
import { PageHeader } from "@/components/kore/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKore, type SupplementTiming } from "@/store/koreStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TIMINGS: { id: SupplementTiming; label: string; emoji: string }[] = [
  { id: "morning", label: "Morning", emoji: "🌅" },
  { id: "pre_workout", label: "Pre-workout", emoji: "⚡" },
  { id: "post_workout", label: "Post-workout", emoji: "💪" },
  { id: "evening", label: "Evening", emoji: "🌆" },
  { id: "before_bed", label: "Before bed", emoji: "🌙" },
];

const PRESETS = [
  { name: "Creatine Monohydrate", emoji: "💊" },
  { name: "Whey Protein", emoji: "🥤" },
  { name: "Vitamin D3", emoji: "☀️" },
  { name: "Omega-3", emoji: "🐟" },
  { name: "Magnesium", emoji: "✨" },
  { name: "Beetroot Powder", emoji: "🥬", food: true },
  { name: "Watermelon (citrulline)", emoji: "🍉", food: true },
  { name: "Medjool Dates", emoji: "🌴", food: true },
];

export default function Supplements() {
  const k = useKore();
  const [adding, setAdding] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const isTaken = (id: string) => k.supplementLogs.some(l => l.date === today && l.supplementId === id && l.taken);
  const completion = k.todaySupplementCompletion();

  return (
    <MobileShell>
      <PageHeader title="Supplement stack"
        subtitle={completion.total ? `${completion.taken} of ${completion.total} taken today` : "Build your daily routine"} />

      <div className="px-5 mb-6">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Today</span>
            <span className="font-display text-3xl font-semibold tabular-nums">
              {completion.taken}<span className="text-base text-muted-foreground">/{completion.total || 0}</span>
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full transition-all duration-700"
              style={{ width: `${completion.total ? (completion.taken / completion.total) * 100 : 0}%`, background: "var(--gradient-gold)" }} />
          </div>
        </div>
      </div>

      <div className="px-5 space-y-5">
        {TIMINGS.map(t => {
          const list = k.supplements.filter(s => s.timing === t.id);
          if (list.length === 0) return null;
          return (
            <div key={t.id}>
              <div className="flex items-center gap-2 mb-2 px-1">
                <span>{t.emoji}</span>
                <h2 className="font-display text-lg font-semibold">{t.label}</h2>
              </div>
              <div className="space-y-2">
                {list.map(s => {
                  const taken = isTaken(s.id);
                  return (
                    <div key={s.id} className="glass-card rounded-2xl px-4 py-3 flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-xl bg-secondary/60 flex items-center justify-center text-xl">{s.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{s.name}</div>
                        {s.isFoodBased && <div className="text-[10px] text-accent uppercase tracking-widest">Food-based</div>}
                      </div>
                      <button onClick={() => k.removeSupplement(s.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition p-1">
                        <Trash2 size={14} />
                      </button>
                      <button onClick={() => k.toggleSupplement(s.id)}
                        className={cn("w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all",
                          taken ? "bg-accent border-accent text-accent-foreground" : "border-border bg-secondary/40")}>
                        {taken && <Check size={16} strokeWidth={3} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {k.supplements.length === 0 && (
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">💊</div>
            <p className="text-sm text-muted-foreground">No supplements yet. Build your stack — pills, powders, or food-based.</p>
          </div>
        )}

        <Button onClick={() => setAdding(true)}
          className="w-full h-14 rounded-2xl text-base font-semibold gap-2"
          style={{ background: "var(--gradient-gold)", color: "hsl(var(--primary-foreground))", boxShadow: "var(--shadow-gold)" }}>
          <Plus size={18} /> Add to stack
        </Button>
      </div>

      <AnimatePresence>
        {adding && <AddSupplement onClose={() => setAdding(false)} onAdd={(s) => { k.addSupplement(s); toast.success(`Added ${s.name}`); setAdding(false); }} />}
      </AnimatePresence>
    </MobileShell>
  );
}

function AddSupplement({ onClose, onAdd }: { onClose: () => void; onAdd: (s: { name: string; timing: SupplementTiming; emoji: string; isFoodBased?: boolean }) => void }) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("💊");
  const [timing, setTiming] = useState<SupplementTiming>("morning");
  const [isFood, setIsFood] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end">
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="w-full max-w-md mx-auto bg-card border-t border-border rounded-t-3xl flex flex-col max-h-[88vh]">
        <div className="flex items-center justify-between p-4 border-b border-border/60">
          <div className="font-display text-lg font-semibold">New supplement</div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"><X size={16} /></button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Quick add</div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map(p => (
                <button key={p.name} onClick={() => { setName(p.name); setEmoji(p.emoji); setIsFood(!!p.food); }}
                  className="text-xs px-3 py-2 rounded-full bg-secondary/60 hover:bg-secondary border border-border/60 transition">
                  {p.emoji} {p.name}
                </button>
              ))}
            </div>
          </div>

          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Supplement name"
            className="h-12 rounded-xl bg-secondary/60 border-border/60" />

          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">When</div>
            <div className="grid grid-cols-2 gap-2">
              {TIMINGS.map(t => (
                <button key={t.id} onClick={() => setTiming(t.id)}
                  className={cn("py-2.5 px-3 rounded-xl text-sm font-medium border transition text-left",
                    timing === t.id ? "border-accent bg-accent/10" : "border-border/60 bg-secondary/40 text-muted-foreground")}>
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center justify-between p-3 rounded-xl bg-secondary/60 border border-border/60 cursor-pointer">
            <div>
              <div className="text-sm font-medium">Food-based supplement</div>
              <div className="text-xs text-muted-foreground">Watermelon, beetroot, dates, etc.</div>
            </div>
            <div className={cn("w-10 h-6 rounded-full transition relative",
              isFood ? "bg-accent" : "bg-muted")}
              onClick={() => setIsFood(v => !v)}>
              <div className={cn("w-5 h-5 rounded-full bg-background absolute top-0.5 transition-all",
                isFood ? "left-[18px]" : "left-0.5")} />
            </div>
            <input type="checkbox" checked={isFood} onChange={() => setIsFood(v => !v)} className="sr-only" />
          </label>

          <Button disabled={!name.trim()} onClick={() => onAdd({ name: name.trim(), timing, emoji, isFoodBased: isFood })}
            className="w-full h-12 rounded-xl font-semibold"
            style={{ background: "var(--gradient-gold)", color: "hsl(var(--primary-foreground))" }}>
            Add to stack
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
