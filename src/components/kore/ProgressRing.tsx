interface Props {
  value: number; max: number; size?: number; stroke?: number;
  color?: string; label?: string; sublabel?: string;
}
export function ProgressRing({ value, max, size = 160, stroke = 12, color = "hsl(var(--accent))", label, sublabel }: Props) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.min(1, value / max);
  const offset = circ * (1 - pct);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} stroke="hsl(var(--muted))" strokeWidth={stroke} fill="none" opacity={0.3} />
        <circle
          cx={size/2} cy={size/2} r={radius}
          stroke={color} strokeWidth={stroke} strokeLinecap="round" fill="none"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display text-3xl font-semibold tabular-nums">{Math.round(value)}</div>
        {label && <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-0.5">{label}</div>}
        {sublabel && <div className="text-xs text-muted-foreground mt-1">{sublabel}</div>}
      </div>
    </div>
  );
}
