import { motion } from "framer-motion";
import { Droplets, Plus } from "lucide-react";
import { MobileShell } from "@/components/kore/MobileShell";
import { PageHeader } from "@/components/kore/PageHeader";
import { Button } from "@/components/ui/button";
import { useKore } from "@/store/koreStore";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Hydration() {
  const k = useKore();
  const t = k.targets();
  const ml = k.todayWaterMl();
  const pct = Math.min(1, ml / t.waterMl);
  const [custom, setCustom] = useState("");

  const add = (n: number) => { k.addWater(n); toast.success(`+${n}ml`); };

  return (
    <MobileShell>
      <PageHeader title="Hydration" subtitle={`${(ml/1000).toFixed(2)}L of ${(t.waterMl/1000).toFixed(2)}L target`} />

      <div className="px-5">
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
          <motion.div
            initial={{ height: 0 }} animate={{ height: `${pct * 100}%` }} transition={{ duration: 1, ease: "easeOut" }}
            className="absolute bottom-0 left-0 right-0 opacity-20"
            style={{ background: "linear-gradient(180deg, transparent, hsl(var(--water)))" }}
          />
          <div className="relative text-center py-10">
            <Droplets size={32} className="mx-auto text-water mb-3" />
            <div className="font-display text-6xl font-semibold tabular-nums">{(ml/1000).toFixed(2)}<span className="text-2xl text-muted-foreground">L</span></div>
            <div className="text-xs text-muted-foreground mt-2 uppercase tracking-widest">{Math.round(pct * 100)}% of goal</div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[250, 500, 750].map(n => (
            <button key={n} onClick={() => add(n)}
              className="glass-card rounded-2xl py-4 hover:border-water/40 transition flex flex-col items-center gap-1 group">
              <Droplets size={18} className="text-water" />
              <span className="font-display text-lg font-semibold tabular-nums">{n}<span className="text-xs text-muted-foreground">ml</span></span>
            </button>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <Input value={custom} onChange={e => setCustom(e.target.value.replace(/[^\d]/g,""))}
            inputMode="numeric" placeholder="Custom (ml)"
            className="h-12 rounded-2xl bg-secondary/60 border-border/60" />
          <Button onClick={() => { if (+custom > 0) { add(+custom); setCustom(""); } }}
            disabled={!custom} className="h-12 px-5 rounded-2xl"
            style={{ background: "var(--gradient-gold)", color: "hsl(var(--primary-foreground))" }}>
            <Plus size={16} />
          </Button>
        </div>

        <div className="mt-6 glass-card rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🥥</div>
            <div className="flex-1">
              <div className="font-medium text-sm">Coconut water, juices, herbal tea</div>
              <p className="text-xs text-muted-foreground mt-1">Count as ~70% credit toward your daily hydration target. Log them here too — your body absorbs the fluids.</p>
            </div>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
