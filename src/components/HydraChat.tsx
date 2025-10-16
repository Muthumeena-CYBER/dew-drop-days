import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useHydrationSupabase } from "@/hooks/use-hydration-supabase";
import { useTheme } from "@/hooks/use-theme";
import { MessageCircle, X, Send, Droplet } from "lucide-react";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const DEFAULT_MODEL = (localStorage.getItem("hydra-model") || "gpt-4o-mini") as string;
const CONTEXT_ENABLED = localStorage.getItem("hydra-context-enabled") !== "false";

function getApiKey(): string | null {
  const stored = localStorage.getItem("openai_api_key");
  if (stored) return stored;
  // Optional: fall back to vite env if injected
  // @ts-expect-error vite env may not exist in all envs
  if (import.meta?.env?.VITE_OPENAI_API_KEY) {
    return import.meta.env.VITE_OPENAI_API_KEY as string;
  }
  return null;
}

export default function HydraChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  // Removed in-chat settings per request
  const [model, setModel] = useState<string>(DEFAULT_MODEL);
  const [useContextData, setUseContextData] = useState<boolean>(CONTEXT_ENABLED);
  const [apiKey, setApiKey] = useState<string | null>(getApiKey());
  const { getTodayTotal, settings, getHydrationPercent } = useHydrationSupabase();
  const { theme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      role: "system",
      content:
        "You are Hydra, a friendly hydration coach chatbot embedded in a hydration tracking app (HydraFlow). Be concise, encouraging, and practical. Use the app context where relevant: user hydration totals, daily goal, percent progress, reminders, theme. Provide short actionable answers with bullet points if helpful."
    },
    {
      role: "assistant",
      content: "Hi! I’m Hydra 💧 How can I help with your hydration today?"
    }
  ]);

  useEffect(() => {
    if (!open) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [open, messages]);

  const contextNote = useMemo(() => {
    if (!useContextData) return "";
    const total = getTodayTotal();
    const percent = getHydrationPercent();
    return `App Context: today_total_ml=${total}, daily_goal_ml=${settings.daily_goal}, progress_percent=${percent}, reminders_enabled=${settings.reminder_enabled}, theme=${theme}`;
  }, [useContextData, getTodayTotal, getHydrationPercent, settings.daily_goal, settings.reminder_enabled, theme]);

  const sendMessage = async () => {
    if (!input.trim() || busy) return;
    const key = apiKey || getApiKey();
    if (!key) {
      setShowConfig(true);
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    const convo = [
      ...messages,
      ...(contextNote ? [{ role: "system", content: contextNote } as ChatMessage] : []),
      userMessage
    ];

    setMessages(convo);
    setInput("");
    setBusy(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`
        },
        body: JSON.stringify({
          model: model,
          messages: convo.map(m => ({ role: m.role, content: m.content })),
          temperature: 0.5,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `OpenAI error (${response.status})`);
      }

      const json = await response.json();
      const content = json?.choices?.[0]?.message?.content || "Sorry, I couldn’t generate a response.";
      setMessages(prev => [...prev, { role: "assistant", content }]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `I ran into an error calling OpenAI: ${err?.message || err}` }
      ]);
    } finally {
      setBusy(false);
    }
  };

  const saveConfig = () => {
    if (apiKey) localStorage.setItem("openai_api_key", apiKey);
    localStorage.setItem("hydra-model", model);
    localStorage.setItem("hydra-context-enabled", String(useContextData));
    setShowConfig(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[60]">
      {!open && (
        <Button onClick={() => setOpen(true)} className="rounded-full h-12 w-12 p-0 hydra-glow" aria-label="Open Hydra chat">
          <MessageCircle className="h-5 w-5" />
        </Button>
      )}

      {open && (
        <Card className="w-[360px] max-w-[90vw] shadow-2xl border-accent/30">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <div className="flex items-center gap-2">
              <Droplet className="h-4 w-4 text-accent" />
              <div className="font-semibold">Hydra</div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>


          <div className="h-[320px] overflow-y-auto p-3 space-y-3">
            {messages.filter(m => m.role !== "system").map((m, idx) => (
              <div
                key={idx}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                  m.role === "user" ? "bg-primary text-primary-foreground ml-auto max-w-[80%]" : "bg-secondary/30 max-w-[85%]"
                )}
              >
                {m.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-end gap-2 p-3 border-t">
            <Textarea
              placeholder="Ask Hydra about your hydration..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="min-h-[44px] max-h-[120px]"
            />
            <Button onClick={sendMessage} disabled={busy || !input.trim()} aria-label="Send">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}


