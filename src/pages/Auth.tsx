import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Logo } from "@/components/kore/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useKore } from "@/store/koreStore";
import { toast } from "sonner";

export default function Auth() {
  const nav = useNavigate();
  const { user, authLoading } = useKore();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (!authLoading && user) nav("/app", { replace: true });
  }, [user, authLoading, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && !agreed) {
      toast.error("Please agree to the Terms, Privacy Policy and Health Disclaimer first.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/onboarding` },
        });
        if (error) throw error;
        toast.success("Account created — welcome to Kōre!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e: any) {
      toast.error(e.message ?? "Something went wrong");
    } finally { setBusy(false); }
  };

  const oauth = async (provider: "google" | "apple") => {
    if (mode === "signup" && !agreed) {
      toast.error("Please agree to the Terms, Privacy Policy and Health Disclaimer first.");
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/app` },
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5 relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: "var(--gradient-glow)" }} />
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-sm">
        <div className="flex justify-center mb-8"><Logo /></div>
        <h1 className="font-display text-3xl font-semibold text-center leading-tight">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-muted-foreground text-center mt-2">
          {mode === "signin" ? "Pick up where you left off." : "Intelligent health, made for you."}
        </p>

        <form onSubmit={submit} className="mt-8 space-y-3">
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
              required className="h-13 pl-11 rounded-2xl bg-secondary/40 border-border/60" />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              required minLength={6} className="h-13 pl-11 rounded-2xl bg-secondary/40 border-border/60" />
          </div>
          {mode === "signup" && (
            <label className="flex items-start gap-2.5 px-1 py-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border/60 accent-[hsl(var(--accent))]"
              />
              <span className="text-xs text-muted-foreground leading-relaxed">
                I'm 18 or over and I agree to the{" "}
                <Link to="/terms" target="_blank" className="text-accent underline-offset-2 hover:underline">Terms</Link>,{" "}
                <Link to="/privacy" target="_blank" className="text-accent underline-offset-2 hover:underline">Privacy Policy</Link>{" "}
                and{" "}
                <Link to="/disclaimer" target="_blank" className="text-accent underline-offset-2 hover:underline">Health Disclaimer</Link>{" "}
                — and I understand Kōre is not medical advice.
              </span>
            </label>
          )}
          <Button type="submit" disabled={busy} className="w-full h-14 rounded-2xl text-base font-semibold gap-2"
            style={{ background: "var(--gradient-gold)", color: "hsl(var(--primary-foreground))" }}>
            {busy ? <Loader2 size={18} className="animate-spin" /> : <>{mode === "signin" ? "Sign in" : "Create account"} <ArrowRight size={18} /></>}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
          <div className="flex-1 h-px bg-border/60" /> or <div className="flex-1 h-px bg-border/60" />
        </div>

        <div className="space-y-2">
          <button onClick={() => oauth("google")} className="w-full h-13 rounded-2xl border border-border/60 bg-secondary/40 font-medium text-sm flex items-center justify-center gap-2 hover:border-accent/40 transition">
            <GoogleIcon /> Continue with Google
          </button>
          <button onClick={() => oauth("apple")} className="w-full h-13 rounded-2xl border border-border/60 bg-secondary/40 font-medium text-sm flex items-center justify-center gap-2 hover:border-accent/40 transition">
            <AppleIcon /> Continue with Apple
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-accent font-medium">
            {mode === "signin" ? "Create account" : "Sign in"}
          </button>
        </p>
        <p className="text-center text-xs text-muted-foreground mt-3">
          <Link to="/" className="hover:text-foreground">Back to home</Link>
        </p>
      </motion.div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 11v3h5.3c-.2 1.4-1.6 4-5.3 4-3.2 0-5.8-2.6-5.8-5.9S8.8 6.1 12 6.1c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.6 3.6 14.5 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 12s4.1 9.3 9.2 9.3c5.3 0 8.8-3.7 8.8-9 0-.6-.1-1.1-.2-1.6H12z"/></svg>
  );
}
function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.4 12.7c0-2.6 2.1-3.9 2.2-4-.1-.2-1.2-1.8-3.4-1.8-1.4 0-2.8.8-3.5.8s-1.9-.8-3.1-.8c-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.7 2.5 2.9 2.4 1.2 0 1.6-.8 3-.8s1.8.8 3 .8c1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.6-1-2.6-3.6zM14.3 5.3c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.5.6-1 1.6-.9 2.6 1 .1 2-.5 2.6-1.2z"/></svg>
  );
}