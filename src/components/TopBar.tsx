import { useEffect, useRef, useState } from "react";
import {
  Users,
  Mail,
  Settings as SettingsIcon,
  Wifi,
  Plus,
  Flame,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { CoinIcon, DiamondIcon, PixelFace } from "./icons";
import {
  FRIENDS,
  MAILS,
  type CurrencyKind,
  type SettingsState,
  type ToastKind,
} from "@/data/gameData";
const avatarImg = "/dashboard/avatar.jpg";

interface TopBarProps {
  coins: number;
  diamonds: number;
  settings: SettingsState;
  onSettingsChange: (s: SettingsState) => void;
  onTopUp: () => void;
  onEarn: (kind: CurrencyKind, amount: number) => void;
  onToast: (msg: string, kind?: ToastKind) => void;
  /** Optional extra control rendered as the 5th icon in the top-right system bar. */
  rightSlot?: React.ReactNode;
}

type DropId = "friends" | "mail" | "settings" | null;

function Toggle({
  on,
  onClick,
  label,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between py-1.5 text-left"
      aria-pressed={on}
    >
      <span className="text-sm font-medium text-white/85">{label}</span>
      <span
        className={cn(
          "relative h-5 w-10 shrink-0 transition-colors duration-200",
          on ? "bg-gold" : "bg-white/15",
        )}
        style={{ clipPath: "polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)" }}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 bg-white transition-all duration-200",
            on ? "left-[22px]" : "left-0.5 bg-white/60",
          )}
        />
      </span>
    </button>
  );
}

export default function TopBar({
  coins,
  diamonds,
  settings,
  onSettingsChange,
  onTopUp,
  onEarn,
  onToast,
  rightSlot,
}: TopBarProps) {
  const [drop, setDrop] = useState<DropId>(null);
  const [mailClaimed, setMailClaimed] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) setDrop(null);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const toggleDrop = (id: DropId) => setDrop((d) => (d === id ? null : id));

  const claimMail = () => {
    if (mailClaimed) return;
    MAILS.forEach((m) => onEarn(m.kind, m.reward));
    setMailClaimed(true);
    onToast("Mail rewards claimed — check your balance!", "success");
  };

  const iconBtn =
    "relative grid h-9 w-9 place-items-center text-white/90 transition-all duration-150 hover:scale-110 hover:text-gold active:scale-95";

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-start justify-between gap-3 px-3 pt-2.5">
      {/* ------- left cluster : profile + currency ------- */}
      <div className="pointer-events-auto flex items-start gap-2">
        <div
          className="anim-lobby-in bg-gradient-to-r from-fuchsia-500 via-violet-500 to-sky-500 p-[2px] shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
          style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)", animationDelay: "0.05s" }}
        >
          <div className="clip-notch flex h-[62px] w-[292px] items-center gap-3 bg-[#0a111f]/95 pr-4 pl-1.5 max-md:w-[210px]">
            <img
              src={avatarImg}
              alt="FearlessFly avatar"
              className="pixelated clip-notch-sm h-[50px] w-[50px] shrink-0 object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="truncate text-[19px] leading-tight font-bold tracking-wide">
                  FearlessFly
                </span>
                <span className="shrink-0 text-[12px] font-semibold text-mist">Lv. 18</span>
              </div>
              <div className="mt-1.5 h-[7px] w-full bg-white/12">
                <div
                  className="bar-grow h-full bg-gradient-to-r from-amber-300 to-gold shadow-[0_0_8px_rgba(255,198,26,0.8)]"
                  style={{ width: "62%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* currency */}
        <div
          className="anim-lobby-in mt-[5px] flex items-stretch max-sm:hidden"
          style={{ animationDelay: "0.12s" }}
        >
          <div className="clip-para flex h-[50px] items-center gap-5 bg-black/75 pr-7 pl-5 backdrop-blur-sm">
            <span className="flex items-center gap-2">
              <CoinIcon className="h-[26px] w-[26px]" />
              <span className="text-[19px] font-bold tracking-wide tabular-nums">{coins}</span>
            </span>
            <span className="h-6 w-px bg-white/15" />
            <span className="flex items-center gap-2">
              <DiamondIcon className="h-[24px] w-[24px]" />
              <span className="text-[19px] font-bold tracking-wide tabular-nums">{diamonds}</span>
            </span>
          </div>
          <button
            type="button"
            onClick={onTopUp}
            aria-label="Top up currency"
            className="clip-para -ml-2 grid h-[50px] w-[46px] place-items-center bg-[#131e33] text-white transition-all duration-150 hover:bg-gold hover:text-black active:scale-95"
          >
            <Plus className="h-6 w-6" strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* ------- right cluster : system icons + logo ------- */}
      <div className="pointer-events-auto flex flex-col items-end">
        <div ref={barRef} className="anim-lobby-in relative" style={{ animationDelay: "0.1s" }}>
          <div className="clip-slant-r flex h-[44px] items-center gap-1.5 bg-black/70 pr-6 pl-4 backdrop-blur-sm">
            <button type="button" aria-label="Friends" className={iconBtn} onClick={() => toggleDrop("friends")}>
              <Users className="h-[22px] w-[22px]" />
              <span className="absolute top-1 right-1 h-2 w-2 animate-[blink-dot_1.6s_infinite] rounded-full bg-emerald-400" />
            </button>
            <button type="button" aria-label="Mail" className={iconBtn} onClick={() => toggleDrop("mail")}>
              <Mail className="h-[22px] w-[22px]" />
              {!mailClaimed && (
                <span className="absolute -top-0.5 -right-0.5 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-red-500 px-0.5 text-[10px] font-bold">
                  3
                </span>
              )}
            </button>
            <button type="button" aria-label="Settings" className={iconBtn} onClick={() => toggleDrop("settings")}>
              <SettingsIcon className="h-[22px] w-[22px]" />
            </button>
            <span className="grid h-9 w-9 place-items-center" title="Connection: excellent">
              <Wifi className="h-[22px] w-[22px] text-emerald-400" />
            </span>
            {/* 5th icon — GitHub export (styled like the other system icons) */}
            {rightSlot}
          </div>

          {/* dropdowns */}
          {drop && (
            <div className="anim-panel-in absolute top-[calc(100%+8px)] right-0 z-50 w-[292px] [filter:drop-shadow(0_20px_36px_rgba(0,0,0,0.6))]">
              <div className="clip-notch bg-[#0a111f]/[0.98] p-4 ring-1 ring-white/10">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-cond text-[17px] font-bold tracking-[0.14em] text-gold">
                    {drop === "friends" ? "FRIENDS" : drop === "mail" ? "MAILBOX" : "SETTINGS"}
                  </h3>
                  <button
                    type="button"
                    aria-label="Close panel"
                    onClick={() => setDrop(null)}
                    className="text-white/60 transition hover:rotate-90 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {drop === "friends" && (
                  <ul className="divide-y divide-white/6">
                    {FRIENDS.map((f) => (
                      <li key={f.id} className="flex items-center gap-2.5 py-2">
                        <span className="relative shrink-0">
                          <PixelFace className="h-8 w-8" />
                          <span
                            className={cn(
                              "absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-[#0a111f]",
                              f.online ? "bg-emerald-400" : "bg-zinc-500",
                            )}
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{f.name}</span>
                          <span className={cn("block text-xs", f.online ? "text-emerald-300/80" : "text-white/40")}>
                            {f.status}
                          </span>
                        </span>
                        <button
                          type="button"
                          disabled={!f.online}
                          onClick={() => onToast(`Team invite sent to ${f.name}`, "success")}
                          className="clip-notch-sm bg-gold px-2.5 py-1 font-cond text-[13px] font-bold tracking-wider text-black transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
                        >
                          INVITE
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {drop === "mail" && (
                  <div>
                    <ul className="divide-y divide-white/6">
                      {MAILS.map((m) => (
                        <li key={m.id} className="flex items-center gap-2 py-2">
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold">{m.title}</span>
                            <span className="flex items-center gap-1 text-xs text-mist">
                              {m.kind === "coins" ? (
                                <CoinIcon className="h-3.5 w-3.5" />
                              ) : (
                                <DiamondIcon className="h-3.5 w-3.5" />
                              )}
                              +{m.reward.toLocaleString()}
                            </span>
                          </span>
                          {mailClaimed && <Check className="h-4 w-4 shrink-0 text-emerald-400" />}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={claimMail}
                      disabled={mailClaimed}
                      className="clip-notch-sm mt-2 w-full bg-gold py-2 font-cond text-[15px] font-bold tracking-[0.14em] text-black transition hover:brightness-110 active:scale-[0.98] disabled:bg-white/10 disabled:text-white/40"
                    >
                      {mailClaimed ? "ALL CLAIMED" : "CLAIM ALL"}
                    </button>
                  </div>
                )}

                {drop === "settings" && (
                  <div>
                    <Toggle
                      label="Background music"
                      on={settings.music}
                      onClick={() => onSettingsChange({ ...settings, music: !settings.music })}
                    />
                    <Toggle
                      label="Sound effects"
                      on={settings.sfx}
                      onClick={() => onSettingsChange({ ...settings, sfx: !settings.sfx })}
                    />
                    <Toggle
                      label="Voxel particles"
                      on={settings.particles}
                      onClick={() => onSettingsChange({ ...settings, particles: !settings.particles })}
                    />
                    <p className="mt-3 mb-1.5 text-sm font-medium text-white/85">Graphics quality</p>
                    <div className="flex gap-1.5">
                      {["Smooth", "HD", "Ultra"].map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => onSettingsChange({ ...settings, quality: q })}
                          className={cn(
                            "clip-notch-sm flex-1 py-1.5 font-cond text-[14px] font-bold tracking-wider transition active:scale-95",
                            settings.quality === q
                              ? "bg-gold text-black"
                              : "bg-white/8 text-white/60 hover:bg-white/15 hover:text-white",
                          )}
                        >
                          {q.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* logo */}
        <div className="anim-lobby-in mt-1.5 pr-1 text-right select-none max-md:hidden" style={{ animationDelay: "0.18s" }}>
          <div className="logo-stroke inline-block -skew-x-6 font-display text-[42px] leading-[0.95] tracking-[0.04em] text-white">
            FREE&nbsp;F
            <span className="relative inline-block">
              I
              <Flame className="absolute -top-[9px] left-1/2 h-[19px] w-[19px] -translate-x-1/2 fill-amber-400 text-orange-500 drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)]" />
            </span>
            RE
          </div>
          <div className="mt-[3px]">
            <span className="inline-block -skew-x-6 bg-black/70 px-2.5 py-[3px]">
              <span className="font-cond text-[11px] font-semibold tracking-[0.42em] text-white/90">
                IN&nbsp;MINECRAFT&nbsp;STYLE
              </span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
