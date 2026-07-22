import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Camera, Dumbbell, Search } from "lucide-react";
import { Logo } from "@/components/kore/Logo";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-foods.jpg";
import { useEffect } from "react";

const cuisines = ["Jollof rice", "Moi moi", "Egusi", "Suya", "Jerk chicken", "Rice & peas", "Plantain", "Injera", "Dal", "Dim sum"];

const features = [
  {
    icon: Search,
    title: "Food search that knows your food",
    body: "Moi moi, moimoi or moin moin — spell it your way, Kōre finds it. Real serving sizes for the dishes you actually eat.",
  },
  {
    icon: Camera,
    title: "An AI coach with cultural fluency",
    body: "Describe your meal or snap a photo — eba and efo riro get estimated as accurately as a chicken salad. No Western assumptions.",
  },
  {
    icon: Dumbbell,
    title: "The full daily loop",
    body: "Meals, gym sessions, supplements, water and check-ins in one place — synced to the cloud, on every device.",
  },
];

const Index = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.title = "Kōre — Health built for the African diaspora";
    const desc = document.querySelector('meta[name="description"]');
    const content = "Kōre is the AI health companion built for the African diaspora — jollof, moi moi, egusi and jerk chicken tracked with the intelligence they deserve. Open to everyone.";
    if (desc) desc.setAttribute("content", content);
    else { const m = document.createElement("meta"); m.name = "description"; m.content = content; document.head.appendChild(m); }
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 glow-bg pointer-events-none" />
      <div className="mx-auto max-w-md px-6 pt-10 pb-10 relative z-10">
        <div className="flex justify-between items-center mb-12">
          <Logo />
          <Link to="/auth" className="text-xs font-medium text-muted-foreground hover:text-foreground transition">Sign in</Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[11px] font-medium tracking-wide uppercase mb-6">
            <Sparkles size={12} /> Built for the diaspora · Free beta
          </div>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight">
            Health that finally <span className="gradient-text italic">understands</span> your plate.
          </h1>
          <p className="mt-5 text-muted-foreground text-[15px] leading-relaxed">
            Most health apps have never heard of egusi. Kōre is built the other way round — African,
            Caribbean and global cuisines tracked with the intelligence other apps reserve for pizza,
            and an AI coach that speaks your food culture natively. Open to everyone; built for us first.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-8 relative rounded-3xl overflow-hidden border border-border/60"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <img src={heroImg} alt="African, Caribbean and global dishes on a slate background" width={1024} height={1024} className="w-full h-72 object-cover" />
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
          <Link to="/auth">
            <Button className="w-full h-14 rounded-2xl text-base font-semibold gap-2"
              style={{ background: "var(--gradient-gold)", color: "hsl(var(--primary-foreground))", boxShadow: "var(--shadow-gold)" }}>
              Get started <ArrowRight size={18} />
            </Button>
          </Link>
          <p className="text-center text-xs text-muted-foreground">Free during beta · No card required</p>
        </motion.div>

        <div className="mt-14 space-y-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl p-4 flex gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center shrink-0">
                <f.icon size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold">{f.title}</div>
                <div className="text-[13px] text-muted-foreground leading-relaxed mt-0.5">{f.body}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          {[
            { n: "8", l: "Cuisines, deeply" },
            { n: "24/7", l: "AI coach" },
            { n: "1", l: "App built for you" },
          ].map(s => (
            <div key={s.l}>
              <div className="font-display text-2xl font-semibold gradient-text">{s.n}</div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-border/40 text-center">
          <p className="font-display italic text-sm text-muted-foreground">
            Built by the diaspora. For the diaspora.
          </p>
          <div className="mt-4 flex justify-center gap-5 text-[11px] text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/disclaimer" className="hover:text-foreground">Health Disclaimer</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
