import { NavLink } from "react-router-dom";
import { Home, Utensils, Dumbbell, Sparkles, TrendingUp } from "lucide-react";

const items = [
  { to: "/app", icon: Home, label: "Home" },
  { to: "/app/meals", icon: Utensils, label: "Meals" },
  { to: "/app/coach", icon: Sparkles, label: "Coach" },
  { to: "/app/gym", icon: Dumbbell, label: "Gym" },
  { to: "/app/history", icon: TrendingUp, label: "History" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-30 safe-bottom">
      <div className="mx-3 mb-3 glass-card rounded-2xl px-2 py-2 flex justify-between items-center">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/app"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all ${
                isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
                <span className="text-[10px] font-medium tracking-wide">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
