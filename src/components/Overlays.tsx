import { useEffect, useState } from "react";
import { X, Check, Sparkles, Info, PersonStanding, Search } from "lucide-react";
import { cn } from "@/utils/cn";
import { CoinIcon, DiamondIcon } from "./icons";
import type { CurrencyKind, ModeOption, ToastKind } from "@/data/gameData";

/* ------------------------------ Toasts ------------------------------ */

export interface Toast {
  id: number;
  msg: string;
  kind: ToastKind;
}

export function Toasts({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="pointer-events-none absolute bottom-[150px] left-1/2 z-[80] flex w-full max-w-md -translate-x-1/2 flex-col items-center gap-1.5 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="clip-notch-sm anim-toast-in flex items-center gap-2 bg-[#0a111f]/95 px-4 py-2 text-[13.5px] font-semibold shadow-[0_14px_30px_rgba(0,0,0,0.5)] ring-1 ring-white/12"
          role="status"
        >
          {t.kind === "success" ? (
            <Check className="h-4 w-4 shrink-0 text-emerald-400" strokeWidth={3} />
          ) : t.kind === "error" ? (
            <X className="h-4 w-4 shrink-0 text-red-400" strokeWidth={3} />
          ) : (
            <Info className="h-4 w-4 shrink-0 text-cyan-gem" />
          )}
          <span className="text-white/90">{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

/* --------------------------- Matchmaking ---------------------------- */

const TIPS = [
  "Tip: Spark can sniff out hidden loot crates.",
  "Tip: The pink beam marks a legendary airdrop.",
  "Tip: Evolve guns in the Lab for extra damage.",
  "Tip: Land near the BOOYAH billboard for early loot.",
];

export function Matchmaking({
  mode,
  onClose,
  onToast,
  onAccept,
}: {
  mode: ModeOption;
  onClose: () => void;
  onToast: (msg: string, kind?: ToastKind) => void;
  /** Fired when the player ACCEPTs the found match (deploy into the game). */
  onAccept?: () => void;
}) {
  const [players, setPlayers] = useState(11);
  const [elapsed, setElapsed] = useState(0);
  const found = players >= 48;

  useEffect(() => {
    if (found) return;
    const id = setInterval(() => {
      setPlayers((p) => Math.min(48, p + 1 + Math.floor(Math.random() * 3)));
    }, 430);
    return () => clearInterval(id);
  }, [found]);

  useEffect(() => {
    if (found) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [found]);

  const mmss = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;

  return (
    <div className="absolute inset-0 z-[70] grid place-items-center bg-[#03060c]/70 p-4 backdrop-blur-[3px]">
      <div className="clip-notch anim-pop-in w-[440px] max-w-[94vw] bg-[#0a111f]/[0.98] p-6 text-center ring-1 ring-white/12">
        {!found ? (
          <>
            <div className="relative mx-auto h-36 w-36">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-gold/60"
                  style={{ animation: `radar-ring 2.4s ease-out ${i * 0.8}s infinite` }}
                />
              ))}
              <span className="clip-notch-sm absolute top-1/2 left-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center bg-gold/15 ring-1 ring-gold/50">
                <Search className="h-7 w-7 text-gold" />
              </span>
            </div>
            <h2 className="mt-4 font-display text-[26px] tracking-[0.06em]">
              SEARCHING FOR MATCH<span className="animate-pulse">…</span>
            </h2>
            <p className="mt-1 font-cond text-[15px] font-semibold tracking-[0.18em] text-mist">
              {mode.name} · {mode.map.toUpperCase()}
            </p>
            <div className="mx-auto mt-4 max-w-[300px]">
              <div className="flex justify-between text-[12.5px] font-semibold text-white/70 tabular-nums">
                <span>
                  {players} / 48 PLAYERS
                </span>
                <span>{mmss}</span>
              </div>
              <div className="mt-1.5 h-[9px] bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-gold shadow-[0_0_10px_rgba(255,198,26,0.7)] transition-all duration-500"
                  style={{ width: `${(players / 48) * 100}%` }}
                />
              </div>
            </div>
            <p className="anim-msg mx-auto mt-4 min-h-[20px] max-w-[320px] text-[13px] text-white/55" key={elapsed % TIPS.length}>
              {TIPS[elapsed % TIPS.length]}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="clip-notch-sm mt-4 bg-white/8 px-8 py-2.5 font-cond text-[16px] font-bold tracking-[0.16em] text-white/85 ring-1 ring-white/15 transition hover:bg-red-500/70 hover:text-white active:scale-95"
            >
              CANCEL
            </button>
          </>
        ) : (
          <>
            <p className="display-shadow anim-pop-in font-display text-[68px] leading-none text-gold italic">
              BOOYAH!
            </p>
            <p className="mt-2 flex items-center justify-center gap-2 font-cond text-[17px] font-bold tracking-[0.3em] text-white">
              <PersonStanding className="h-5 w-5 text-emerald-400" /> MATCH FOUND
            </p>
            <p className="mt-1 text-[13.5px] text-mist">
              48 survivors dropping into {mode.map}. Spark is ready.
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onToast(`Deploying to ${mode.map} — good luck, survivor!`, "success");
                  onAccept?.();
                  onClose();
                }}
                className="clip-notch-sm bg-gradient-to-b from-[#ffd83d] to-gold px-8 py-2.5 font-cond text-[17px] font-bold tracking-[0.14em] text-[#241a00] transition hover:brightness-110 active:scale-95"
              >
                ACCEPT
              </button>
              <button
                type="button"
                onClick={onClose}
                className="clip-notch-sm bg-white/8 px-6 py-2.5 font-cond text-[17px] font-bold tracking-[0.14em] text-white/80 ring-1 ring-white/15 transition hover:bg-white/15 active:scale-95"
              >
                DECLINE
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- Top-up ------------------------------- */

const DIAMOND_PACKS = [
  { amount: 100, price: "$0.99", bonus: "" },
  { amount: 310, price: "$2.99", bonus: "+10%" },
  { amount: 520, price: "$4.99", bonus: "POPULAR" },
  { amount: 1060, price: "$9.99", bonus: "+12%" },
  { amount: 2180, price: "$19.99", bonus: "+15%" },
  { amount: 5600, price: "$49.99", bonus: "BEST VALUE" },
];

const COIN_PACKS = [
  { amount: 5000, price: "250 ◆" },
  { amount: 15000, price: "700 ◆" },
  { amount: 40000, price: "1,700 ◆" },
];

export function TopUpModal({
  diamonds,
  onClose,
  onBuy,
}: {
  diamonds: number;
  onClose: () => void;
  onBuy: (kind: CurrencyKind, amount: number, label: string) => void;
}) {
  return (
    <div className="absolute inset-0 z-[70] grid place-items-center bg-[#03060c]/70 p-4 backdrop-blur-[3px]" onClick={onClose}>
      <div
        className="clip-notch anim-pop-in w-[540px] max-w-[94vw] bg-[#0a111f]/[0.98] p-5 ring-1 ring-white/12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-[24px] leading-none tracking-[0.05em]">
              TOP-UP <span className="text-gold">CENTER</span>
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-mist">
              Current balance <DiamondIcon className="h-4 w-4" />
              <span className="font-bold text-white tabular-nums">{diamonds.toLocaleString()}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close top-up"
            className="clip-notch-sm grid h-8 w-8 place-items-center bg-white/8 text-white/80 transition hover:rotate-90 hover:bg-red-500/80 hover:text-white active:scale-95"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <p className="mt-4 mb-2 flex items-center gap-1.5 font-cond text-[14px] font-bold tracking-[0.2em] text-cyan-gem">
          <Sparkles className="h-4 w-4" /> DIAMOND PACKS
        </p>
        <div className="grid grid-cols-3 gap-2 max-sm:grid-cols-2">
          {DIAMOND_PACKS.map((p) => (
            <button
              key={p.amount}
              type="button"
              onClick={() => onBuy("diamonds", p.amount, `${p.amount} diamonds`)}
              className={cn(
                "clip-notch-sm group relative bg-white/[0.045] px-2 py-3 text-center ring-1 transition hover:bg-cyan-400/10 active:scale-[0.97]",
                p.bonus === "POPULAR" ? "ring-gold/70" : "ring-white/10 hover:ring-cyan-300/50",
              )}
            >
              {p.bonus && (
                <span className="clip-notch-sm absolute top-0 right-0 bg-gold px-1.5 py-px font-cond text-[10.5px] font-bold tracking-wider text-black">
                  {p.bonus}
                </span>
              )}
              <DiamondIcon className="mx-auto h-8 w-8 transition-transform group-hover:scale-115" />
              <span className="mt-1 block text-[16px] font-extrabold tabular-nums">{p.amount.toLocaleString()}</span>
              <span className="block text-[12px] font-semibold text-gold">{p.price}</span>
            </button>
          ))}
        </div>

        <p className="mt-4 mb-2 font-cond text-[14px] font-bold tracking-[0.2em] text-gold">GOLD FOR DIAMONDS</p>
        <div className="grid grid-cols-3 gap-2">
          {COIN_PACKS.map((p) => (
            <button
              key={p.amount}
              type="button"
              onClick={() => onBuy("coins", p.amount, `${p.amount.toLocaleString()} gold`)}
              className="clip-notch-sm group bg-white/[0.045] px-2 py-2.5 text-center ring-1 ring-white/10 transition hover:bg-gold/10 hover:ring-gold/50 active:scale-[0.97]"
            >
              <CoinIcon className="mx-auto h-7 w-7 transition-transform group-hover:scale-115" />
              <span className="mt-0.5 block text-[15px] font-extrabold tabular-nums">{p.amount.toLocaleString()}</span>
              <span className="block text-[11.5px] font-semibold text-white/55">{p.price}</span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-center text-[11.5px] text-white/35">Demo store — currency is credited instantly, no real payment.</p>
      </div>
    </div>
  );
}
