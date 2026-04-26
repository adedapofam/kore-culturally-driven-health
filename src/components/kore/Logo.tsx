export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="rounded-xl flex items-center justify-center font-display font-bold text-primary-foreground"
        style={{
          width: size, height: size,
          background: "var(--gradient-gold)",
          boxShadow: "var(--shadow-gold)",
          fontSize: size * 0.5,
        }}
      >K</div>
      <span className="font-display text-xl font-semibold tracking-tight">Kōre</span>
    </div>
  );
}
