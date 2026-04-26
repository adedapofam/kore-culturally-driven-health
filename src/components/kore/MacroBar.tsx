interface Props { label: string; value: number; max: number; color: string; unit?: string; }
export function MacroBar({ label, value, max, color, unit = "g" }: Props) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="tabular-nums font-medium">{Math.round(value)}<span className="text-muted-foreground">/{max}{unit}</span></span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
