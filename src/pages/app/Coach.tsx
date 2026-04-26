import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, Camera, Loader2, Image as ImageIcon } from "lucide-react";
import { MobileShell } from "@/components/kore/MobileShell";
import { PageHeader } from "@/components/kore/PageHeader";
import { useKore } from "@/store/koreStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "I just had jollof rice and grilled chicken",
  "What should I eat tonight to hit my protein?",
  "Build me a 3-day push/pull/legs split",
  "I'm tired today — what should I do?",
];

export default function Coach() {
  const k = useKore();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setBusy(true);

    const totals = k.todayTotals();
    const t = k.targets();
    const context = {
      profile: k.profile && { name: k.profile.name, goal: k.profile.goal, cuisines: k.profile.cuisines, weightKg: k.profile.weightKg },
      isGymDay: k.isGymDayToday(),
      targets: t,
      consumed: totals,
      remaining: { calories: t.calories - totals.calories, protein: t.protein - totals.protein },
      hydrationMl: k.todayWaterMl(),
      streak: k.streak,
    };

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg], context }),
      });
      if (resp.status === 429) { toast.error("Rate limit reached. Try again in a moment."); setBusy(false); return; }
      if (resp.status === 402) { toast.error("AI credits exhausted."); setBusy(false); return; }
      if (!resp.ok || !resp.body) throw new Error("Stream failed");

      const reader = resp.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      let acc = "";
      const toolArgs: Record<string, string> = {};
      const toolNames: Record<string, string> = {};
      let assistantStarted = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl); buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta;
            if (delta?.content) {
              acc += delta.content;
              if (!assistantStarted) {
                setMessages(prev => [...prev, { role: "assistant", content: acc }]);
                assistantStarted = true;
              } else {
                setMessages(prev => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: acc } : m));
              }
            }
            if (delta?.tool_calls) {
              for (const tc of delta.tool_calls) {
                const idx = String(tc.index ?? 0);
                if (tc.function?.name) toolNames[idx] = tc.function.name;
                if (tc.function?.arguments) toolArgs[idx] = (toolArgs[idx] ?? "") + tc.function.arguments;
              }
            }
          } catch { buf = line + "\n" + buf; break; }
        }
      }

      // Execute tool calls
      for (const [idx, args] of Object.entries(toolArgs)) {
        try {
          const parsed = JSON.parse(args);
          const name = toolNames[idx];
          if (name === "log_meal") {
            k.addMeal(parsed);
            toast.success(`Logged: ${parsed.name} (${parsed.calories} kcal)`);
          } else if (name === "log_water") {
            k.addWater(parsed.ml);
            toast.success(`Logged ${parsed.ml}ml of water`);
          }
        } catch (e) { console.error("tool parse", e); }
      }

      if (!assistantStarted && Object.keys(toolArgs).length > 0) {
        setMessages(prev => [...prev, { role: "assistant", content: "Done — logged for you. Anything else?" }]);
      }
    } catch (e) {
      console.error(e);
      toast.error("Coach is unreachable right now.");
    } finally { setBusy(false); }
  };

  const handlePhoto = async (file: File) => {
    setPhotoBusy(true);
    try {
      const reader = new FileReader();
      const dataUrl: string = await new Promise((res, rej) => {
        reader.onload = () => res(reader.result as string);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
      const slot = (() => {
        const h = new Date().getHours();
        if (h < 11) return "breakfast"; if (h < 15) return "lunch"; if (h < 21) return "dinner"; return "snacks";
      })();
      const { data, error } = await supabase.functions.invoke("analyze-meal-photo", {
        body: { imageBase64: dataUrl, slot },
      });
      if (error) throw error;
      k.addMeal({ slot: slot as any, name: data.name, calories: data.calories, protein: data.protein, carbs: data.carbs, fat: data.fat, emoji: data.emoji });
      toast.success(`Logged: ${data.name}`);
      setMessages(prev => [...prev,
        { role: "user", content: `📸 Photo of meal` },
        { role: "assistant", content: `Identified **${data.name}** (~${data.calories} kcal, ${data.protein}g protein). Logged to ${slot}. Confidence: ${data.confidence}.` },
      ]);
    } catch (e: any) {
      toast.error(e.message ?? "Couldn't analyze photo");
    } finally { setPhotoBusy(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  return (
    <MobileShell>
      <PageHeader title="Kōre Coach" subtitle="Talk like you would to a friend who knows nutrition" />
      <div ref={scrollRef} className="px-5 pb-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-30" style={{ background: "var(--gradient-glow)" }} />
              <Sparkles size={20} className="text-accent" />
              <h2 className="font-display text-xl font-semibold mt-3 leading-tight">
                {k.profile ? `Hey ${k.profile.name}.` : "Hey there."}
              </h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Tell me what you ate, what you're craving, how you're feeling. I'll log it, do the math, and meet you where you are.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Try asking</div>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="w-full text-left p-4 rounded-2xl border border-border/60 bg-secondary/40 text-sm hover:border-accent/40 transition">
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}
        <div className="space-y-3">
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-accent text-accent-foreground"
                  : "glass-card"
              )}>
                {m.role === "assistant"
                  ? <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-strong:text-accent"><ReactMarkdown>{m.content}</ReactMarkdown></div>
                  : <span>{m.content}</span>}
              </div>
            </motion.div>
          ))}
          {busy && (
            <div className="flex justify-start">
              <div className="glass-card rounded-2xl px-4 py-3 text-sm flex items-center gap-2 text-muted-foreground">
                <Loader2 size={14} className="animate-spin" /> thinking…
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md px-5 z-20">
        <div className="glass-card rounded-2xl p-2 flex items-end gap-2">
          <button onClick={() => fileRef.current?.click()} disabled={photoBusy}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-muted-foreground hover:text-accent transition shrink-0">
            {photoBusy ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
          </button>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
            onChange={e => e.target.files?.[0] && handlePhoto(e.target.files[0])} />
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Ask, log, or vent…"
            rows={1}
            className="flex-1 bg-transparent outline-none text-sm py-3 resize-none max-h-32"
          />
          <button onClick={() => send(input)} disabled={!input.trim() || busy}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-primary-foreground disabled:opacity-40 transition shrink-0"
            style={{ background: "var(--gradient-gold)" }}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </MobileShell>
  );
}