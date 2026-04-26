import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function MobileShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="mx-auto max-w-md min-h-screen relative overflow-hidden">
        <div className="relative z-10 safe-top pb-32">{children}</div>
        {!hideNav && <BottomNav />}
      </div>
    </div>
  );
}
