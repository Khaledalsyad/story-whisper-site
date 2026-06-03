import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const WELCOME = "مرحباً، أنا دليل حكاية مكان. اسألني عن أي مكان وثقه المشروع وسأساعدك.";

const SUGGESTIONS = [
  "احكيلي عن وادي الوشواش",
  "إيه الأماكن في الأقصر؟",
  "أماكن طبيعية في سيناء",
];

const GuideChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    setInput("");
    const nextMessages: Msg[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/guide-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!resp.ok || !resp.body) {
        const errText = resp.status === 429
          ? "تم تجاوز الحد المسموح، حاول لاحقاً."
          : resp.status === 402
          ? "نفدت أرصدة المساعد، تواصل مع الإدارة."
          : "حدث خطأ، حاول مرة أخرى.";
        setMessages((m) => [...m, { role: "assistant", content: errText }]);
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              assistantText += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: assistantText };
                return copy;
              });
            }
          } catch {
            // ignore parse errors
          }
        }
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "تعذّر الاتصال بالمساعد." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        onClick={() => setOpen((v) => !v)}
        aria-label="دليل حكاية مكان"
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-accent to-[hsl(35_80%_55%)] text-background shadow-[0_0_30px_hsl(30_90%_67%/0.5)] hover:shadow-[0_0_45px_hsl(30_90%_67%/0.8)] transition-all flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-[400px] h-[min(600px,calc(100vh-8rem))] rounded-2xl bg-card/95 backdrop-blur-xl border border-foreground/10 shadow-2xl flex flex-col overflow-hidden"
            dir="rtl"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-foreground/10 bg-gradient-to-r from-accent/20 to-transparent flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-[hsl(35_80%_55%)] flex items-center justify-center shadow-[0_0_20px_hsl(30_90%_67%/0.5)]">
                <Sparkles className="w-5 h-5 text-background" />
              </div>
              <div>
                <h3 className="font-bold font-cairo text-foreground text-sm">دليل حكاية مكان</h3>
                <p className="text-[11px] text-muted-foreground font-cairo">مساعد ذكي خاص بمشروع التوثيق</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm font-cairo leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-bl-sm"
                        : "bg-foreground/5 text-foreground rounded-br-sm border border-foreground/10"
                    }`}
                  >
                    {m.content || "..."}
                  </div>
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-end">
                  <div className="bg-foreground/5 border border-foreground/10 px-3.5 py-2.5 rounded-2xl rounded-br-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  </div>
                </div>
              )}

              {messages.length === 1 && (
                <div className="pt-2 space-y-1.5">
                  <p className="text-[11px] text-muted-foreground font-cairo px-1">جرّب:</p>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="block w-full text-right px-3 py-2 rounded-lg text-xs font-cairo text-foreground/80 bg-foreground/5 hover:bg-accent/20 hover:text-accent border border-foreground/10 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="px-3 py-3 border-t border-foreground/10 bg-background/40 flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اسأل عن مكان..."
                disabled={loading}
                className="flex-1 bg-foreground/5 border border-foreground/10 rounded-full px-4 py-2 text-sm font-cairo text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center disabled:opacity-40 hover:shadow-[0_0_15px_hsl(30_90%_67%/0.6)] transition-shadow"
              >
                <Send className="w-4 h-4 rotate-180" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GuideChat;
