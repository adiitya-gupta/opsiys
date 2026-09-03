import * as React from "react";
import { Bot, Send, X } from "lucide-react";

type Message = {
  role: "assistant" | "user";
  content: string;
};

const welcomeMessage: Message = {
  role: "assistant",
  content: "Hi! I’m the OPSIYS assistant. Ask me about our services, process, or website.",
};

export const WebsiteChatbot = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([welcomeMessage]);
  const [isSending, setIsSending] = React.useState(false);
  const messageEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, isSending]);

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    const question = input.trim();
    if (!question || isSending) return;

    const nextMessages = [...messages, { role: "user" as const, content: question }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await response.json();
      const answer = response.ok
        ? data.reply
        : data.error || "I’m unable to respond right now. Please try again shortly.";

      setMessages((current) => [...current, { role: "assistant", content: answer }]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "I’m unable to connect right now. Please try again or email opsiyss@gmail.com." },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 z-[70] flex flex-col items-start gap-3 sm:bottom-5 sm:left-5">
      {isOpen && (
        <section className="w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
          <header className="flex items-center justify-between bg-zinc-950 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-accent shadow-[0_8px_20px_rgba(229,57,53,0.45)]">
                <Bot size={18} />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-wider">OPSIYS Assistant</p>
                <p className="text-[10px] text-zinc-400">Website & service support</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white">
              <X size={18} />
            </button>
          </header>

          <div className="h-72 space-y-3 overflow-y-auto bg-zinc-50 p-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <p className={message.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-br-sm bg-zinc-950 px-3.5 py-2.5 text-xs leading-relaxed text-white"
                  : "max-w-[85%] rounded-2xl rounded-bl-sm border border-zinc-200 bg-white px-3.5 py-2.5 text-xs leading-relaxed text-zinc-700 shadow-sm"}
                >
                  {message.content}
                </p>
              </div>
            ))}
            {isSending && <p className="w-fit rounded-2xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-500 shadow-sm">Thinking…</p>}
            <div ref={messageEndRef} />
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 border-t border-zinc-100 bg-white p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={1200}
              placeholder="Ask about OPSIYS..."
              className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-accent"
            />
            <button type="submit" disabled={!input.trim() || isSending} aria-label="Send message" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-40">
              <Send size={16} />
            </button>
          </form>
        </section>
      )}

      {!isOpen && (
        <div className="relative max-w-[12.5rem] rounded-2xl rounded-bl-sm border border-accent/20 bg-white px-3.5 py-2.5 text-xs leading-snug text-zinc-600 shadow-[0_10px_26px_rgba(15,23,42,0.14)]">
          <span className="font-black text-zinc-950">Need help?</span> Ask the OPSIYS AI assistant.
          <span className="absolute -bottom-1.5 left-4 h-3 w-3 rotate-45 border-b border-r border-accent/20 bg-white" />
        </div>
      )}

      <button
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close OPSIYS assistant" : "Open OPSIYS assistant"}
        aria-expanded={isOpen}
        className="flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-zinc-950 px-4 text-white shadow-[0_14px_32px_rgba(15,23,42,0.3)] transition-all hover:-translate-y-1 hover:bg-accent sm:h-14 sm:w-14 sm:px-0"
      >
        {isOpen ? <X size={21} /> : <Bot size={21} />}
        {!isOpen && <span className="text-[10px] font-black uppercase tracking-wider sm:hidden">Ask OPSIYS</span>}
      </button>
    </div>
  );
};
