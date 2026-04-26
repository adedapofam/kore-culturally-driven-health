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
import Dashboard from "./pages/app/Dashboard";
import Meals from "./pages/app/Meals";
import Gym from "./pages/app/Gym";
import Supplements from "./pages/app/Supplements";
import Hydration from "./pages/app/Hydration";
import CheckIn from "./pages/app/CheckIn";
import Coach from "./pages/app/Coach";
import History from "./pages/app/History";
import { KoreProvider, useKore } from "@/store/koreStore";

const queryClient = new QueryClient();

function RequireProfile({ children }: { children: JSX.Element }) {
  const { profile } = useKore();
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
      <KoreProvider>
        <BrowserRouter>
          <ThemeBoot />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />
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
      </KoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
