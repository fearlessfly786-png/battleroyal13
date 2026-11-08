import { useEffect, useRef, useState } from "react";
import {
  X,
  Check,
  Timer,
  Shirt,
  Backpack,
  Coins,
  Sword,
  Wind,
  Zap,
  Sparkles,
  Lock,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { CoinIcon, DiamondIcon } from "./icons";
import {
  ROYALE_PRIZES,
  MISSIONS,
  EVENTS,
  VAULT_ITEMS,
  type CurrencyKind,
  type PanelId,
  type ToastKind,
} from "@/data/gameData";

const luckCrateImg = "/dashboard/luck-crate.jpg";

const TITLES: Record<PanelId, { title: string; sub: string }> = {
  store: { title: "STORE", sub: "Fresh drops rotate daily" },
  luck: { title: "LUCK ROYALE", sub: "Spin for legendary voxel loot" },
  vault: { title: "VAULT", sub: "Your collected gear" },
  missions: { title: "MISSIONS", sub: "Complete tasks, earn gold" },
  events: { title: "EVENTS", sub: "Limited-time activities" },
  pet: { title: "PETS", sub: "Your loyal battle companions" },
};

const RARITY_CLS: Record<string, string> = {
  Legendary: "bg-amber-400/15 text-amber-300 ring-amber-300/50",
  Epic: "bg-violet-400/15 text-violet-300 ring-violet-300/50",
  Rare: "bg-sky-400/15 text-sky-300 ring-sky-300/50",
};

interface PanelsProps {
  panel: PanelId | null;
  onClose: () => void;
  coins: number;
  diamonds: number;
  onSpend: (kind: CurrencyKind, amount: number) => boolean;
  onEarn: (kind: CurrencyKind, amount: number) => void;
  onToast: (msg: string, kind?: ToastKind) => void;
}

export default function Panels({ panel, onClose, coins, diamonds, onSpend, onEarn, onToast }: PanelsProps) {
  const [claimedMissions, setClaimedMissions] = useState<Set<string>>(new Set());
  const [joinedEvents, setJoinedEvents] = useState<Set<string>>(new Set());

  // luck royale state
  const [spinning, setSpinning] = useState(false);
  const [freeSpin, setFreeSpin] = useState(true);
  const [displayIdx, setDisplayIdx] = useState(0);
  const [prize, setPrize] = useState<(typeof ROYALE_PRIZES)[number] | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  if (!panel) return null;
  const meta = TITLES[panel];

  const spin = () => {
    if (spinning) return;
    if (!freeSpin && !onSpend("diamonds", 60)) {
      onToast("Not enough diamonds — grab a top-up!", "error");
      return;
    }
    setFreeSpin(false);
    setSpinning(true);
    setPrize(null);
    const cycle = setInterval(() => setDisplayIdx((i) => i + 1), 85);
    timers.current.push(
      setTimeout(() => {
        clearInterval(cycle);
        const won = ROYALE_PRIZES[Math.floor(Math.random() * ROYALE_PRIZES.length)];
        setPrize(won);
        setSpinning(false);
        if (won.amount > 0) onEarn(won.kind, won.amount);
        onToast(`Luck Royale: you won ${won.name}!`, "success");
      }, 1900),
    );
  };

  const goldBtn =
    "clip-notch-sm bg-gradient-to-b from-[#ffd83d] to-gold px-3 py-1.5 font-cond text-[14.5px] font-bold tracking-[0.1em] text-[#241a00] transition hover:brightness-110 active:scale-95 disabled:cursor-default";
  const ghostBtn =
    "clip-notch-sm bg-white/8 px-3 py-1.5 font-cond text-[14.5px] font-bold tracking-[0.1em] text-white/85 ring-1 ring-white/12 transition hover:bg-white/15 active:scale-95";

  return (
    <section
      key={panel}
      className="anim-panel-in absolute top-[84px] right-3 bottom-3 z-30 flex w-[402px] max-w-[94vw] flex-col [filter:drop-shadow(0_24px_44px_rgba(0,0,0,0.55))] max-lg:top-[150px]"
      aria-label={meta.title}
    >
      <div className="clip-notch flex min-h-0 flex-1 flex-col bg-[#0a111f]/[0.97] ring-1 ring-white/10">
        {/* header */}
        <div className="flex items-start justify-between px-4 pt-3.5 pb-3">
          <div>
            <h2 className="font-display text-[23px] leading-none tracking-[0.05em] text-white">
              {meta.title} <span className="text-gold">/</span>
            </h2>
            <p className="mt-1 text-[12.5px] text-mist">{meta.sub}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="clip-notch-sm grid h-8 w-8 place-items-center bg-white/8 text-white/80 transition hover:rotate-90 hover:bg-red-500/80 hover:text-white active:scale-95"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
        <div className="flex items-center gap-4 border-y border-white/8 bg-black/30 px-4 py-2">
          <span className="flex items-center gap-1.5 text-[14px] font-bold tabular-nums">
            <CoinIcon className="h-[19px] w-[19px]" /> {coins.toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5 text-[14px] font-bold tabular-nums">
            <DiamondIcon className="h-[18px] w-[18px]" /> {diamonds.toLocaleString()}
          </span>
          <span className="ml-auto font-cond text-[12px] font-semibold tracking-[0.2em] text-white/35">
            SEASON 24
          </span>
        </div>

        {/* body */}
        <div className="nice-scroll min-h-0 flex-1 overflow-y-auto p-3.5">
          {panel === "luck" && (
            <div className="flex flex-col items-center pt-2 text-center">
              <div className="relative">
                <span className="absolute inset-0 -z-0 scale-110 rounded-full bg-gold/15 blur-2xl" />
                <img
                  src={luckCrateImg}
                  alt="Luck Royale crate"
                  className={cn("clip-notch relative h-44 w-44 object-cover ring-2 ring-gold/50", spinning && "anim-crate")}
                />
              </div>
              <div className="mt-4 flex h-8 items-center font-cond text-[19px] font-bold tracking-[0.08em]">
                {spinning ? (
                  <span className="text-white/85">{ROYALE_PRIZES[displayIdx % ROYALE_PRIZES.length].name}…</span>
                ) : prize ? (
                  <span className="anim-pop-in flex items-center gap-1.5 text-gold">
                    <Sparkles className="h-5 w-5" /> {prize.name}
                  </span>
                ) : (
                  <span className="text-white/60">Legends say a bundle hides inside…</span>
                )}
              </div>
              <button type="button" onClick={spin} disabled={spinning} className={cn(goldBtn, "btn-shine clip-notch mt-2 px-8 py-2.5 text-[17px]", spinning && "opacity-70")}>
                {spinning ? "SPINNING…" : freeSpin ? "FREE SPIN" : "SPIN — 60 DIAMONDS"}
              </button>
              <div className="mt-5 grid w-full grid-cols-2 gap-1.5 text-left">
                {ROYALE_PRIZES.map((p, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-white/[0.045] px-2 py-1.5 text-[12.5px] text-white/70 ring-1 ring-white/6">
                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-gold/70" /> {p.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {panel === "vault" && (
            <div className="grid grid-cols-3 gap-2">
              {VAULT_ITEMS.map((v) => {
                const VaultIcon = { Outfit: Shirt, Backpack: Backpack, Token: Coins, Melee: Sword, Glider: Wind, Boost: Zap }[v.type] ?? Shirt;
                return (
                  <article key={v.id} className={cn("clip-notch-sm relative flex flex-col items-center gap-1.5 bg-white/[0.045] px-1.5 py-3 text-center ring-1", RARITY_CLS[v.rarity].split(" ").pop())}>
                    <VaultIcon className="h-7 w-7 text-white/85" />
                    <span className="text-[11.5px] leading-tight font-semibold text-white/85">{v.name}</span>
                    <span className={cn("px-1 font-cond text-[10.5px] font-bold tracking-widest ring-1", RARITY_CLS[v.rarity])}>{v.rarity.toUpperCase()}</span>
                    {v.count > 1 && (
                      <span className="clip-notch-sm absolute top-1 right-1 bg-gold px-1 font-cond text-[11px] font-bold text-black">×{v.count}</span>
                    )}
                  </article>
                );
              })}
              <p className="col-span-3 mt-1 flex items-center gap-1.5 text-[12px] text-white/40">
                <Lock className="h-3.5 w-3.5" /> Store purchases land here automatically.
              </p>
            </div>
          )}

          {panel === "missions" && (
            <div className="flex flex-col gap-2">
              {MISSIONS.map((m) => {
                const done = m.progress >= m.goal;
                const claimed = claimedMissions.has(m.id);
                return (
                  <article key={m.id} className="clip-notch-sm bg-white/[0.045] p-3 ring-1 ring-white/8">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[13.5px] leading-snug font-bold">{m.title}</h3>
                      <span className="flex shrink-0 items-center gap-1 text-[13px] font-bold text-gold tabular-nums">
                        <CoinIcon className="h-4 w-4" /> {m.reward}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="h-[7px] flex-1 bg-white/10">
                        <span className="bar-grow block h-full bg-gradient-to-r from-emerald-400 to-emerald-300" style={{ width: `${Math.min(100, (m.progress / m.goal) * 100)}%` }} />
                      </span>
                      <span className="text-[12px] text-mist tabular-nums">
                        {m.progress.toLocaleString()}/{m.goal.toLocaleString()}
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={!done || claimed}
                      onClick={() => {
                        setClaimedMissions((s) => new Set(s).add(m.id));
                        onEarn("coins", m.reward);
                        onToast(`Mission complete: +${m.reward} gold`, "success");
                      }}
                      className={cn("mt-2.5 w-full", done && !claimed ? goldBtn : ghostBtn, claimed && "text-emerald-300 ring-emerald-300/40")}
                    >
                      {claimed ? "CLAIMED" : done ? "CLAIM REWARD" : "IN PROGRESS"}
                    </button>
                  </article>
                );
              })}
            </div>
          )}

          {panel === "events" && (
            <div className="flex flex-col gap-2">
              {EVENTS.map((e) => {
                const joined = joinedEvents.has(e.id);
                return (
                  <article key={e.id} className="clip-notch-sm bg-white/[0.045] p-3 ring-1 ring-white/8">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-cond text-[17px] font-bold tracking-[0.06em] text-white">{e.title}</h3>
                      <span className="flex shrink-0 items-center gap-1 bg-red-500/15 px-1.5 py-0.5 font-cond text-[12px] font-bold tracking-wider text-red-300 ring-1 ring-red-400/40">
                        <Timer className="h-3 w-3" /> {e.ends}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] leading-snug text-mist">{e.desc}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setJoinedEvents((s) => {
                          const next = new Set(s);
                          if (next.has(e.id)) next.delete(e.id);
                          else next.add(e.id);
                          return next;
                        });
                        onToast(joined ? `Left ${e.title}` : `Joined ${e.title} — see you in-game!`, joined ? "info" : "success");
                      }}
                      className={cn("mt-2.5 w-full", joined ? ghostBtn : goldBtn, joined && "text-emerald-300 ring-emerald-300/40")}
                    >
                      {joined ? "JOINED" : "JOIN EVENT"}
                    </button>
                  </article>
                );
              })}
            </div>
          )}

        </div>

        {/* footer hint */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 text-[11.5px] text-white/35">
          <Check className="h-3.5 w-3.5 text-emerald-400/70" />
          Progress auto-saves to your FearlessFly account.
        </div>
      </div>
    </section>
  );
}
