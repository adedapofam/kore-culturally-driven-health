import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Trash2, X, Pencil, Minus, ArrowLeft } from "lucide-react";
import { MobileShell } from "@/components/kore/MobileShell";
import { PageHeader } from "@/components/kore/PageHeader";
import { MacroBar } from "@/components/kore/MacroBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKore, type MealSlot, type MealEntry } from "@/store/koreStore";
import { FOOD_DB, type FoodItem } from "@/data/foods";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const SLOTS: { id: MealSlot; label: string; emoji: string }[] = [
  { id: "breakfast", label: "Breakfast", emoji: "🌅" },
  { id: "lunch", label: "Lunch", emoji: "🌞" },
  { id: "dinner", label: "Dinner", emoji: "🌙" },
  { id: "snacks", label: "Snacks", emoji: "✨" },
];

/** Reference weight (grams) of the food's standard serving, when stated. */
function servingGramsOf(f: FoodItem): number | undefined {
  const m = f.servingLabel.match(/(\d+(?:\.\d+)?)\s*g/);
  return m ? Number(m[1]) : undefined;
}

const r = (x: number) => Math.round(x);
const r1 = (x: number) => Math.round(x * 10) / 10;

type NewMeal = {
  name: string; calories: number; protein: number; carbs: number; fat: number;
  emoji?: string; grams?: number; portions: number;
};

export default function Meals() {
  const k = useKore();
  const [pickerSlot, setPickerSlot] = useState<MealSlot | null>(null);
  const [editing, setEditing] = useState<MealEntry | null>(null);
  const t = k.targets();
  const totals = k.todayTotals();
  const meals = k.todayMeals();

  return (
    <MobileShell>
      <PageHeader title="Today's meals" subtitle={`${Math.round(totals.calories)} of ${t.calories} kcal`} />

      <div className="px-5 space-y-3 mb-6">
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <MacroBar label="Calories" value={Math.round(totals.calories)} max={t.calories} color="hsl(var(--accent))" unit="" />
          <MacroBar label="Protein" value={Math.round(totals.protein)} max={t.protein} color="hsl(var(--protein))" />
          <MacroBar label="Carbs" value={Math.round(totals.carbs)} max={t.carbs} color="hsl(var(--carbs))" />
          <MacroBar label="Fat" value={Math.round(totals.fat)} max={t.fat} color="hsl(var(--fat))" />
        </div>
      </div>

      <div className="px-5 space-y-4">
        {SLOTS.map(slot => {
          const slotMeals = meals.filter(m => m.slot === slot.id);
          const slotCals = Math.round(slotMeals.reduce((a, m) => a + m.calories * (m.portions ?? 1), 0));
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
                {slotMeals.map(m => {
                  const n = m.portions ?? 1;
                  return (
                    <div key={m.id} className="glass-card rounded-2xl px-4 py-3 flex items-center gap-3 group">
                      <button onClick={() => setEditing(m)} className="w-10 h-10 rounded-xl bg-secondary/60 flex items-center justify-center text-xl shrink-0">{m.emoji || "🍽️"}</button>
                      <button onClick={() => setEditing(m)} className="flex-1 min-w-0 text-left">
                        <div className="text-sm font-medium truncate">
                          {m.name}
                          {n !== 1 && <span className="ml-1.5 text-[11px] font-semibold text-accent">×{n}</span>}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {m.grams ? `${r(m.grams * n)}g · ` : ""}P {r(m.protein * n)}g · C {r(m.carbs * n)}g · F {r(m.fat * n)}g
                        </div>
                      </button>
                      <div className="text-sm font-semibold tabular-nums">{r(m.calories * n)}</div>
                      <div className="flex items-center">
                        <button onClick={() => setEditing(m)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-accent transition p-1">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => k.removeMeal(m.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {editing && (
          <EditMealSheet
            meal={editing}
            onClose={() => setEditing(null)}
            onSave={(patch) => {
              k.updateMeal(editing.id, patch);
              toast.success("Meal updated");
              setEditing(null);
            }}
          />
        )}
        {pickerSlot && (
          <FoodPicker
            slot={pickerSlot}
            onClose={() => setPickerSlot(null)}
            onAdd={(entry) => {
              k.addMeal({ slot: pickerSlot!, ...entry });
              toast.success(`Added ${entry.name}`);
              setPickerSlot(null);
            }}
          />
        )}
      </AnimatePresence>
    </MobileShell>
  );
}

function FoodPicker({ slot, onClose, onAdd }: {
  slot: MealSlot; onClose: () => void;
  onAdd: (entry: NewMeal) => void;
}) {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"search" | "custom">("search");
  const [selected, setSelected] = useState<FoodItem | null>(null);
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
          <div className="flex items-center gap-3 min-w-0">
            {selected && (
              <button onClick={() => setSelected(null)} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <ArrowLeft size={16} />
              </button>
            )}
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{selected ? "How much?" : "Add to"}</div>
              <div className="font-display text-lg font-semibold capitalize truncate">
                {selected ? selected.name : slot}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0"><X size={16} /></button>
        </div>

        {selected ? (
          <LogDetails food={selected} onAdd={onAdd} />
        ) : (
          <>
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
                    <button key={f.id} onClick={() => setSelected(f)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 transition text-left">
                      <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-xl">{f.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{f.name}</div>
                        <div className="text-[11px] text-muted-foreground">{f.cuisine}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[11px] text-muted-foreground">per {f.servingLabel}</div>
                        <div className="text-sm font-semibold tabular-nums">{f.calories} kcal</div>
                      </div>
                    </button>
                  ))}
                  {results.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground py-8">No matches. Try the custom tab.</div>
                  )}
                </div>
              </>
            ) : (
              <CustomMealForm onSubmit={(c) => onAdd({ ...c, emoji: "🍽️", portions: 1 })} />
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/** Second step after picking a food: the USER states the weight — no assumed
 *  portion. Macros scale from the food's reference nutrition density. */
function LogDetails({ food, onAdd }: { food: FoodItem; onAdd: (entry: NewMeal) => void }) {
  const refGrams = servingGramsOf(food);
  const [grams, setGrams] = useState("");
  const [count, setCount] = useState(1);

  const g = Number(grams);
  const scale = refGrams && g > 0 ? g / refGrams : 1;
  const needsGrams = refGrams !== undefined;
  const canAdd = needsGrams ? g > 0 : true;

  const cals = r(food.calories * scale);
  const protein = r1(food.protein * scale);
  const carbs = r1(food.carbs * scale);
  const fat = r1(food.fat * scale);

  const step = (d: number) => setCount(prev => Math.min(20, Math.max(0.5, Math.round((prev + d) * 2) / 2)));

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="overflow-y-auto p-4 space-y-4">
        {needsGrams ? (
          <div className="rounded-xl bg-secondary/60 border border-border/60 p-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Weight of one portion (grams)</div>
            <input autoFocus value={grams} onChange={e => setGrams(e.target.value.replace(/[^\d.]/g, ""))}
              inputMode="decimal" placeholder="0"
              className="w-full bg-transparent outline-none font-display text-2xl font-semibold tabular-nums mt-0.5" />
            <div className="text-[11px] text-muted-foreground mt-1">
              Typical serving: {food.servingLabel} — but log what <em>you</em> actually had
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-secondary/60 border border-border/60 p-3">
            <div className="text-xs text-muted-foreground">
              Logged per {food.servingLabel}. Use the counter below for how many you had.
            </div>
          </div>
        )}

        <div className="rounded-xl bg-secondary/60 border border-border/60 p-3 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">How many?</div>
            <div className="text-xs text-muted-foreground mt-0.5">e.g. 2 wraps of moi moi → ×2</div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => step(-0.5)} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition"><Minus size={14} /></button>
            <div className="font-display text-xl font-semibold tabular-nums w-12 text-center">×{count}</div>
            <button onClick={() => step(0.5)} className="w-9 h-9 rounded-full bg-accent/15 text-accent flex items-center justify-center hover:bg-accent/25 transition"><Plus size={14} /></button>
          </div>
        </div>

        {canAdd && (
          <div className="rounded-xl border border-accent/25 bg-accent/5 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total ({count !== 1 ? `×${count}` : "1 portion"})</span>
              <span className="font-display text-lg font-semibold tabular-nums">{r(cals * count)} kcal</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              P {r(protein * count)}g · C {r(carbs * count)}g · F {r(fat * count)}g
            </div>
          </div>
        )}
      </div>

      <div className="p-4 pt-2 border-t border-border/60">
        <Button disabled={!canAdd}
          onClick={() => onAdd({
            name: food.name, emoji: food.emoji,
            calories: cals, protein, carbs, fat,
            grams: needsGrams ? g : undefined,
            portions: count,
          })}
          className="w-full h-12 rounded-xl font-semibold"
          style={{ background: "var(--gradient-gold)", color: "hsl(var(--primary-foreground))" }}>
          Add to log
        </Button>
      </div>
    </div>
  );
}

/** Editing a logged meal: weight and count only. Macros are derived by the
 *  AI / food database and rescale with weight — they are not directly editable. */
function EditMealSheet({ meal, onClose, onSave }: {
  meal: MealEntry;
  onClose: () => void;
  onSave: (patch: { grams?: number; portions: number; calories: number; protein: number; carbs: number; fat: number }) => void;
}) {
  const [portions, setPortions] = useState(meal.portions ?? 1);
  const [grams, setGrams] = useState(meal.grams ? String(meal.grams) : "");

  const g = Number(grams);
  const scale = meal.grams && g > 0 ? g / meal.grams : 1;
  const cals = r(meal.calories * scale);
  const protein = r1(meal.protein * scale);
  const carbs = r1(meal.carbs * scale);
  const fat = r1(meal.fat * scale);
  const valid = meal.grams ? g > 0 : true;

  const step = (d: number) => setPortions(prev => Math.min(20, Math.max(0.5, Math.round((prev + d) * 2) / 2)));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end justify-center">
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="w-full max-w-md max-h-[88vh] bg-card border-t border-border rounded-t-3xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border/60 shrink-0">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Edit meal</div>
            <div className="font-display text-lg font-semibold truncate">{meal.emoji || "🍽️"} {meal.name}</div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0"><X size={16} /></button>
        </div>

        <div className="overflow-y-auto p-4 space-y-4">
          <div className="rounded-xl bg-secondary/60 border border-border/60 p-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">How many?</div>
              <div className="text-xs text-muted-foreground mt-0.5">e.g. had 2? Set ×2</div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => step(-0.5)} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition"><Minus size={14} /></button>
              <div className="font-display text-xl font-semibold tabular-nums w-12 text-center">×{portions}</div>
              <button onClick={() => step(0.5)} className="w-9 h-9 rounded-full bg-accent/15 text-accent flex items-center justify-center hover:bg-accent/25 transition"><Plus size={14} /></button>
            </div>
          </div>

          {meal.grams != null && (
            <div className="rounded-xl bg-secondary/60 border border-border/60 p-3">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Weight of one portion (grams)</div>
              <input value={grams} onChange={e => setGrams(e.target.value.replace(/[^\d.]/g, ""))}
                inputMode="decimal" placeholder="0"
                className="w-full bg-transparent outline-none font-display text-2xl font-semibold tabular-nums mt-0.5" />
            </div>
          )}

          <div className="rounded-xl border border-accent/25 bg-accent/5 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total ({portions !== 1 ? `×${portions}` : "1 portion"})</span>
              <span className="font-display text-lg font-semibold tabular-nums">{valid ? r(cals * portions) : "—"} kcal</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              {valid ? <>P {r(protein * portions)}g · C {r(carbs * portions)}g · F {r(fat * portions)}g</> : "Enter a weight"}
            </div>
            <div className="text-[10px] text-muted-foreground mt-2">
              Nutrition is estimated by Kōre and rescales with weight — it can't be edited directly.
            </div>
          </div>
        </div>

        <div className="p-4 pt-2 border-t border-border/60 shrink-0">
          <Button disabled={!valid}
            onClick={() => onSave({
              grams: meal.grams ? g : undefined,
              portions,
              calories: cals, protein, carbs, fat,
            })}
            className="w-full h-12 rounded-xl font-semibold"
            style={{ background: "var(--gradient-gold)", color: "hsl(var(--primary-foreground))" }}>
            Save changes
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CustomMealForm({ onSubmit }: { onSubmit: (c: { name: string; calories: number; protein: number; carbs: number; fat: number; grams?: number }) => void }) {
  const [name, setName] = useState("");
  const [grams, setGrams] = useState("");
  const [cals, setCals] = useState("");
  const [p, setP] = useState("");
  const [c, setC] = useState("");
  const [f, setF] = useState("");
  return (
    <div className="p-4 space-y-3 overflow-y-auto">
      <Input value={name} onChange={e => setName(e.target.value)} placeholder="What did you eat?" className="h-12 rounded-xl bg-secondary/60 border-border/60" />
      <div className="grid grid-cols-2 gap-2">
        <NumField label="Weight (g, optional)" value={grams} onChange={setGrams} />
        <NumField label="Calories" value={cals} onChange={setCals} />
        <NumField label="Protein (g)" value={p} onChange={setP} />
        <NumField label="Carbs (g)" value={c} onChange={setC} />
        <NumField label="Fat (g)" value={f} onChange={setF} />
      </div>
      <Button disabled={!name.trim() || !cals}
        onClick={() => onSubmit({ name: name.trim(), calories: +cals || 0, protein: +p || 0, carbs: +c || 0, fat: +f || 0, grams: +grams || undefined })}
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
