import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Trash2, X } from "lucide-react";
import { MobileShell } from "@/components/kore/MobileShell";
import { PageHeader } from "@/components/kore/PageHeader";
import { MacroBar } from "@/components/kore/MacroBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKore, type MealSlot } from "@/store/koreStore";
import { FOOD_DB, type FoodItem } from "@/data/foods";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const SLOTS: { id: MealSlot; label: string; emoji: string }[] = [
  { id: "breakfast", label: "Breakfast", emoji: "🌅" },
  { id: "lunch", label: "Lunch", emoji: "🌞" },
  { id: "dinner", label: "Dinner", emoji: "🌙" },
  { id: "snacks", label: "Snacks", emoji: "✨" },
];

export default function Meals() {
  const k = useKore();
  const [pickerSlot, setPickerSlot] = useState<MealSlot | null>(null);
  const t = k.targets();
  const totals = k.todayTotals();
  const meals = k.todayMeals();

  return (
    <MobileShell>
      <PageHeader title="Today's meals" subtitle={`${totals.calories} of ${t.calories} kcal`} />

      <div className="px-5 space-y-3 mb-6">
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <MacroBar label="Calories" value={totals.calories} max={t.calories} color="hsl(var(--accent))" unit="" />
          <MacroBar label="Protein" value={totals.protein} max={t.protein} color="hsl(var(--protein))" />
          <MacroBar label="Carbs" value={totals.carbs} max={t.carbs} color="hsl(var(--carbs))" />
          <MacroBar label="Fat" value={totals.fat} max={t.fat} color="hsl(var(--fat))" />
        </div>
      </div>

      <div className="px-5 space-y-4">
        {SLOTS.map(slot => {
          const slotMeals = meals.filter(m => m.slot === slot.id);
          const slotCals = slotMeals.reduce((a, m) => a + m.calories, 0);
          return (
            <div key={slot.id}>
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{slot.emoji}</span>
                  <h2 className="font-display text-lg font-semibold">{slot.label}</h2>
                  {slotCals > 0 && <span className="text-xs text-muted-foreground tabular-nums">· {slotCals} kcal</span>}
                </div>
                <button onClick={() => setPickerSlot(slot.id)} className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center hover:bg-accent/25 transition">
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-2">
                {slotMeals.length === 0 && (
                  <button onClick={() => setPickerSlot(slot.id)} className="w-full glass-card rounded-2xl px-4 py-4 text-sm text-muted-foreground border-dashed hover:text-foreground hover:border-accent/40 transition">
                    + Add {slot.label.toLowerCase()}
                  </button>
                )}
                {slotMeals.map(m => (
                  <div key={m.id} className="glass-card rounded-2xl px-4 py-3 flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-secondary/60 flex items-center justify-center text-xl">{m.emoji || "🍽️"}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{m.name}</div>
                      <div className="text-[11px] text-muted-foreground">P {m.protein}g · C {m.carbs}g · F {m.fat}g</div>
                    </div>
                    <div className="text-sm font-semibold tabular-nums">{m.calories}</div>
                    <button onClick={() => k.removeMeal(m.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {pickerSlot && (
          <FoodPicker
            slot={pickerSlot}
            onClose={() => setPickerSlot(null)}
            onPick={(f) => {
              k.addMeal({ slot: pickerSlot!, name: f.name, calories: f.calories, protein: f.protein, carbs: f.carbs, fat: f.fat, emoji: f.emoji });
              toast.success(`Added ${f.name}`);
              setPickerSlot(null);
            }}
            onCustom={(c) => {
              k.addMeal({ slot: pickerSlot!, ...c, emoji: "🍽️" });
              toast.success(`Added ${c.name}`);
              setPickerSlot(null);
            }}
          />
        )}
      </AnimatePresence>
    </MobileShell>
  );
}

function FoodPicker({ slot, onClose, onPick, onCustom }: {
  slot: MealSlot; onClose: () => void;
  onPick: (f: FoodItem) => void;
  onCustom: (c: { name: string; calories: number; protein: number; carbs: number; fat: number }) => void;
}) {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"search" | "custom">("search");
  const k = useKore();
  const userCuisines = k.profile?.cuisines || [];

  const results = useMemo(() => {
    const ql = q.toLowerCase().trim();
    const sorted = [...FOOD_DB].sort((a, b) => {
      const ai = userCuisines.includes(a.cuisine) ? -1 : 0;
      const bi = userCuisines.includes(b.cuisine) ? -1 : 0;
      return ai - bi;
    });
    if (!ql) return sorted.slice(0, 30);
    return sorted.filter(f => f.name.toLowerCase().includes(ql) || f.cuisine.toLowerCase().includes(ql));
  }, [q, userCuisines]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end justify-center">
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="w-full max-w-md max-h-[88vh] bg-card border-t border-border rounded-t-3xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border/60">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Add to</div>
            <div className="font-display text-lg font-semibold capitalize">{slot}</div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"><X size={16} /></button>
        </div>

        <div className="flex gap-1 p-3 border-b border-border/60">
          {(["search", "custom"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn("flex-1 py-2 rounded-xl text-sm font-medium capitalize transition",
                tab === t ? "bg-accent text-accent-foreground" : "text-muted-foreground")}>
              {t === "search" ? "Search" : "Custom entry"}
            </button>
          ))}
        </div>

        {tab === "search" ? (
          <>
            <div className="p-4 pb-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input autoFocus value={q} onChange={e => setQ(e.target.value)}
                  placeholder="Try 'jollof', 'dal', 'biryani'..."
                  className="pl-9 h-12 rounded-xl bg-secondary/60 border-border/60" />
              </div>
            </div>
            <div className="overflow-y-auto px-4 pb-6 flex-1 space-y-1.5">
              {results.map(f => (
                <button key={f.id} onClick={() => onPick(f)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 transition text-left">
                  <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-xl">{f.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{f.name}</div>
                    <div className="text-[11px] text-muted-foreground">{f.cuisine} · {f.servingLabel}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold tabular-nums">{f.calories}</div>
                    <div className="text-[10px] text-muted-foreground">{f.protein}g P</div>
                  </div>
                </button>
              ))}
              {results.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-8">No matches. Try the custom tab.</div>
              )}
            </div>
          </>
        ) : (
          <CustomMealForm onSubmit={onCustom} />
        )}
      </motion.div>
    </motion.div>
  );
}

function CustomMealForm({ onSubmit }: { onSubmit: (c: { name: string; calories: number; protein: number; carbs: number; fat: number }) => void }) {
  const [name, setName] = useState("");
  const [cals, setCals] = useState("");
  const [p, setP] = useState("");
  const [c, setC] = useState("");
  const [f, setF] = useState("");
  return (
    <div className="p-4 space-y-3">
      <Input value={name} onChange={e => setName(e.target.value)} placeholder="What did you eat?" className="h-12 rounded-xl bg-secondary/60 border-border/60" />
      <div className="grid grid-cols-2 gap-2">
        <NumField label="Calories" value={cals} onChange={setCals} />
        <NumField label="Protein (g)" value={p} onChange={setP} />
        <NumField label="Carbs (g)" value={c} onChange={setC} />
        <NumField label="Fat (g)" value={f} onChange={setF} />
      </div>
      <Button disabled={!name.trim() || !cals}
        onClick={() => onSubmit({ name: name.trim(), calories: +cals || 0, protein: +p || 0, carbs: +c || 0, fat: +f || 0 })}
        className="w-full h-12 rounded-xl font-semibold"
        style={{ background: "var(--gradient-gold)", color: "hsl(var(--primary-foreground))" }}>
        Add to log
      </Button>
    </div>
  );
}

function NumField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="rounded-xl bg-secondary/60 border border-border/60 p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <input value={value} onChange={e => onChange(e.target.value.replace(/[^\d.]/g, ""))}
        inputMode="decimal" placeholder="0" className="w-full bg-transparent outline-none font-display text-xl font-semibold tabular-nums mt-0.5" />
    </div>
  );
}
