import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Auth from "./pages/Auth";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";
import Dashboard from "./pages/app/Dashboard";
import Meals from "./pages/app/Meals";
import Gym from "./pages/app/Gym";
import Supplements from "./pages/app/Supplements";
import Hydration from "./pages/app/Hydration";
import CheckIn from "./pages/app/CheckIn";
import Coach from "./pages/app/Coach";
import History from "./pages/app/History";
import { KoreProvider, useKore } from "@/store/koreStore";
import { Component, type ErrorInfo, type ReactNode } from "react";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("Kōre render error:", error, info); }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="max-w-sm text-center">
            <div className="text-2xl mb-2">😵</div>
            <div className="font-display text-lg font-semibold mb-1">Something broke on this screen</div>
            <div className="text-xs text-muted-foreground break-words">{String(this.state.error)}</div>
            <button onClick={() => location.reload()} className="mt-4 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-medium">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const queryClient = new QueryClient();

function RequireProfile({ children }: { children: JSX.Element }) {
  const { profile, user, authLoading, cloudSynced } = useKore();
  // Wait for auth to resolve, and for signed-in users wait for their cloud
  // data to hydrate — otherwise a returning user on a fresh device gets
  // bounced to onboarding and overwrites their cloud profile.
  if (authLoading || (user && !cloudSynced)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground tracking-wide">Loading your data…</p>
        </div>
      </div>
    );
  }
  if (!profile) return <Navigate to="/onboarding" replace />;
  return children;
}

function ThemeBoot() {
  useEffect(() => { document.documentElement.classList.add("dark"); }, []);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <KoreProvider><ErrorBoundary>
        <BrowserRouter>
          <ThemeBoot />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/app" element={<RequireProfile><Dashboard /></RequireProfile>} />
            <Route path="/app/meals" element={<RequireProfile><Meals /></RequireProfile>} />
            <Route path="/app/gym" element={<RequireProfile><Gym /></RequireProfile>} />
            <Route path="/app/supplements" element={<RequireProfile><Supplements /></RequireProfile>} />
            <Route path="/app/water" element={<RequireProfile><Hydration /></RequireProfile>} />
            <Route path="/app/checkin" element={<RequireProfile><CheckIn /></RequireProfile>} />
            <Route path="/app/coach" element={<RequireProfile><Coach /></RequireProfile>} />
            <Route path="/app/history" element={<RequireProfile><History /></RequireProfile>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary></KoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
