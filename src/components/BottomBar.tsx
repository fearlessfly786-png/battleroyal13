import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { MessageSquare, Send } from "lucide-react";
import { cn } from "@/utils/cn";
import { CHAT_FEED } from "@/data/gameData";

interface ChatMsg {
  user: string;
  text: string;
  mine?: boolean;
}

export default function BottomBar() {
  const [expanded, setExpanded] = useState(false);
  const [feed, setFeed] = useState<ChatMsg[]>(CHAT_FEED);
  const [draft, setDraft] = useState("");
  const [ticker, setTicker] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expanded) return;
    const id = setInterval(() => setTicker((t) => t + 1), 5000);
    return () => clearInterval(id);
  }, [expanded]);

  useEffect(() => {
    if (expanded && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [expanded, feed]);

  const current = feed[ticker % feed.length];

  const send = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setFeed((f) => [...f, { user: "You", text, mine: true }]);
    setDraft("");
  };

  return (
    <div className="absolute right-3 bottom-3 left-3 z-20 flex items-end gap-2.5 xl:right-[524px]">
      {/* ------- chat ------- */}
      <div className="anim-lobby-in relative w-[404px] shrink-0 max-md:min-w-0 max-md:flex-1" style={{ animationDelay: "0.6s" }}>
        {expanded && (
          <div className="anim-panel-in absolute bottom-[calc(100%+8px)] left-0 z-50 w-full [filter:drop-shadow(0_20px_36px_rgba(0,0,0,0.6))]">
            <div className="clip-notch bg-[#0a111f]/[0.98] p-3 ring-1 ring-white/10">
              <div ref={listRef} className="nice-scroll max-h-[188px] overflow-y-auto pr-1">
                {feed.map((m, i) => (
                  <p key={i} className="py-[3px] text-[13.5px] leading-snug">
                    <span className={cn("font-bold", m.mine ? "text-cyan-gem" : m.user === "[Guild]" ? "text-emerald-300" : "text-gold")}>
                      {m.user}
                    </span>{" "}
                    <span className="text-white/85">{m.text}</span>
                  </p>
                ))}
              </div>
              <form onSubmit={send} className="mt-2 flex gap-1.5">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Message to world…"
                  maxLength={90}
                  className="clip-notch-sm min-w-0 flex-1 bg-white/8 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:ring-2 focus:ring-gold/70 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  className="clip-notch-sm grid w-10 place-items-center bg-gold text-black transition hover:brightness-110 active:scale-95"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setExpanded((x) => !x)}
          className="clip-notch flex h-[52px] w-full items-center gap-3 bg-[#060c17]/85 pr-4 pl-3.5 text-left backdrop-blur-[3px] transition-colors hover:bg-[#0b1524]/92"
          aria-expanded={expanded}
          aria-label="Toggle world chat"
        >
          <MessageSquare className="h-[21px] w-[21px] shrink-0 text-white" />
          <span className="h-6 w-px shrink-0 bg-gold/70" />
          <span key={ticker} className="anim-msg min-w-0 flex-1 truncate text-[14.5px]">
            <span className="font-bold text-white">{current.user}</span>{" "}
            <span className="text-white/80">{current.text}</span>
          </span>
        </button>
      </div>
    </div>
  );
}
