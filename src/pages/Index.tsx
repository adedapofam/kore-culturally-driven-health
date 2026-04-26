import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Logo } from "@/components/kore/Logo";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-foods.jpg";
import { useEffect } from "react";

const cuisines = ["Jollof rice", "Dal", "Jerk chicken", "Dim sum", "Hummus", "Plantain", "Biryani", "Injera"];

const Index = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.title = "Kōre — Intelligent health for everyone";
    const desc = document.querySelector('meta[name="description"]');
    const content = "Kōre is an AI-powered daily health companion with culturally intelligent nutrition tracking — jollof, dal, jerk chicken and more.";
    if (desc) desc.setAttribute("content", content);
    else { const m = document.createElement("meta"); m.name = "description"; m.content = content; document.head.appendChild(m); }
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 glow-bg pointer-events-none" />
      <div className="mx-auto max-w-md px-6 pt-10 pb-16 relative z-10">
        <div className="flex justify-between items-center mb-12">
          <Logo />
          <Link to="/onboarding" className="text-xs font-medium text-muted-foreground hover:text-foreground transition">Sign in</Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[11px] font-medium tracking-wide uppercase mb-6">
            <Sparkles size={12} /> Phase 1 · Open beta
          </div>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight">
            Health that finally <span className="gradient-text italic">understands</span> what you eat.
          </h1>
          <p className="mt-5 text-muted-foreground text-[15px] leading-relaxed">
            Most apps assume you eat pizza and pasta. Kōre tracks jollof rice, dal, jerk chicken and dim sum with the same care — because culture isn't a feature, it's the foundation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-8 relative rounded-3xl overflow-hidden border border-border/60"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <img src={heroImg} alt="Diverse global cuisines on a slate background" width={1024} height={1024} className="w-full h-72 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
            {cuisines.map((c, i) => (
              <motion.span
                key={c}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="text-[11px] px-2.5 py-1 rounded-full bg-background/80 backdrop-blur border border-border/60 font-medium"
              >{c}</motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 space-y-3">
          <Link to="/onboarding">
            <Button className="w-full h-14 rounded-2xl text-base font-semibold gap-2"
              style={{ background: "var(--gradient-gold)", color: "hsl(var(--primary-foreground))", boxShadow: "var(--shadow-gold)" }}>
              Begin your check-in <ArrowRight size={18} />
            </Button>
          </Link>
          <p className="text-center text-xs text-muted-foreground">Free during beta · No card required</p>
        </motion.div>

        <div className="mt-14 grid grid-cols-3 gap-4 text-center">
          {[
            { n: "200+", l: "Global foods" },
            { n: "8", l: "Cuisines" },
            { n: "0", l: "Western bias" },
          ].map(s => (
            <div key={s.l}>
              <div className="font-display text-2xl font-semibold gradient-text">{s.n}</div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
