import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  const nav = useNavigate();
  return (
    <div className="px-5 pt-2 pb-5 flex items-start justify-between gap-3">
      <button onClick={() => nav(-1)} className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center bg-secondary/60 hover:bg-secondary transition shrink-0 mt-1">
        <ArrowLeft size={18} />
      </button>
      <div className="flex-1 min-w-0">
        <h1 className="font-display text-2xl font-semibold leading-tight truncate">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
