import { useEffect, useState } from "react";
import { Timer, Check, ChevronUp, PersonStanding } from "lucide-react";
import { cn } from "@/utils/cn";
import { CubeIcon, RankEmblem } from "./icons";
import { MODES, type CurrencyKind, type ModeOption, type ToastKind } from "@/data/gameData";

const gemImg = "/dashboard/gem.jpg";
const crateImg = "/dashboard/luck-crate.jpg";
const mapImg = "/dashboard/map-thumb.jpg";

function useCountdown(initial: number) {
  const [secs, setSecs] = useState(initial);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s <= 0 ? 86399 : s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

interface RightRailProps {
  mode: ModeOption;
  onModeChange: (m: ModeOption) => void;
  onStart: () => void;
  onEarn: (kind: CurrencyKind, amount: number) => void;
  onToast: (msg: string, kind?: ToastKind) => void;
}

function RewardCard({
  img,
  title,
  time,
  claimed,
  onClaim,
  delay,
}: {
  img: string;
  title: string;
  time: string;
  claimed: boolean;
  onClaim: () => void;
  delay: string;
}) {
  return (
    <button
      type="button"
      onClick={onClaim}
      disabled={claimed}
      className="clip-notch anim-lobby-in group flex w-[216px] items-center gap-3 bg-[#060c17]/85 py-1.5 pr-4 pl-2 text-left backdrop-blur-[3px] transition-all duration-200 hover:translate-x-[-4px] hover:bg-[#0c1626]/92 active:scale-[0.98] disabled:hover:translate-x-0"
      style={{ animationDelay: delay }}
      aria-label={claimed ? `${title} claimed` : `Claim ${title}`}
    >
      <img
        src={img}
        alt=""
        className="clip-notch-sm h-[42px] w-[42px] shrink-0 object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 font-cond text-[17px] leading-tight font-bold tracking-[0.08em] whitespace-nowrap text-gold">
          {title}
          {!claimed && (
            <span className="h-[7px] w-[7px] animate-[blink-dot_1.4s_infinite] rounded-full bg-red-500" />
          )}
        </span>
        {claimed ? (
          <span className="mt-0.5 flex items-center gap-1 text-[13px] font-semibold text-emerald-400">
            <Check className="h-3.5 w-3.5" strokeWidth={3} /> CLAIMED
          </span>
        ) : (
          <span className="mt-0.5 flex items-center gap-1.5 text-[13.5px] text-white/85 tabular-nums">
            <Timer className="h-3.5 w-3.5 text-white/60" /> {time}
          </span>
        )}
      </span>
    </button>
  );
}

export default function RightRail({ mode, onModeChange, onStart, onEarn, onToast }: RightRailProps) {
  const daily = useCountdown(23 * 3600 + 45 * 60 + 12);
  const login = useCountdown(12 * 3600 + 34 * 60 + 56);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [loginClaimed, setLoginClaimed] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);
  const [party, setParty] = useState(1);

  const cycleParty = () => {
    const sizes = [1, 2, 4];
    const next = sizes[(sizes.indexOf(party) + 1) % sizes.length];
    setParty(next);
    onToast(next === 1 ? "Solo queue selected" : `Party size set to ${next}`, "info");
  };

  return (
    <div className="absolute top-[168px] right-3 bottom-4 z-20 flex flex-col items-end justify-between max-lg:top-auto max-lg:right-2 max-lg:bottom-[74px] max-lg:justify-end">
      {/* ------- reward cards ------- */}
      <div className="flex flex-col items-end gap-2 max-lg:hidden">
        <RewardCard
          img={gemImg}
          title="DAILY REWARD"
          time={daily}
          claimed={dailyClaimed}
          delay="0.3s"
          onClaim={() => {
            setDailyClaimed(true);
            onEarn("diamonds", 50);
            onToast("Daily reward claimed: +50 diamonds", "success");
          }}
        />
        <RewardCard
          img={crateImg}
          title="LOGIN BONUS"
          time={login}
          claimed={loginClaimed}
          delay="0.38s"
          onClaim={() => {
            setLoginClaimed(true);
            onEarn("coins", 1000);
            onToast("Login bonus claimed: +1,000 gold", "success");
          }}
        />
      </div>

      {/* ------- mode + start ------- */}
      <div className="flex flex-col items-end">
        <div
          className="anim-lobby-in relative w-[424px] max-lg:w-[min(424px,94vw)]"
          style={{ animationDelay: "0.46s" }}
        >
          <button
            type="button"
            onClick={() => setModeOpen((o) => !o)}
            className="group block w-full text-left"
            aria-haspopup="listbox"
            aria-expanded={modeOpen}
          >
            <span className="clip-notch relative block h-[74px] overflow-hidden max-lg:h-[52px]">
              <img
                src={mapImg}
                alt={`${mode.map} map preview`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <span className="clip-notch-sm absolute bottom-2 left-2.5 flex items-center gap-1 bg-black/65 px-2 py-0.5 font-cond text-[12.5px] font-bold tracking-[0.14em] text-white/90">
                GAME MODE
                <ChevronUp
                  className={cn("h-3.5 w-3.5 text-gold transition-transform duration-200", modeOpen && "rotate-180")}
                />
              </span>
            </span>
            <span className="clip-notch mt-[3px] flex h-[64px] items-center gap-3 bg-[#060c17]/92 px-3.5 backdrop-blur-[3px] transition-colors group-hover:bg-[#0b1524]/95">
              <RankEmblem className="h-[38px] w-[46px] shrink-0" />
              <span className="h-9 w-px shrink-0 bg-white/15" />
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-[19px] font-extrabold tracking-[0.04em]">
                  {mode.name}
                </span>
                <span className="block text-[13.5px] font-medium text-mist">{mode.map}</span>
              </span>
              <PersonStanding className="h-7 w-7 shrink-0 text-white/85 transition-transform duration-200 group-hover:-translate-y-0.5" />
            </span>
          </button>

          {modeOpen && (
            <div className="anim-panel-in absolute right-0 bottom-[calc(100%+8px)] z-50 w-full [filter:drop-shadow(0_20px_36px_rgba(0,0,0,0.6))]">
              <div className="clip-notch bg-[#0a111f]/[0.98] p-1.5 ring-1 ring-white/10" role="listbox">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    role="option"
                    aria-selected={m.id === mode.id}
                    onClick={() => {
                      onModeChange(m);
                      setModeOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2 text-left transition-colors",
                      m.id === mode.id ? "bg-gold/15 text-gold" : "text-white/85 hover:bg-white/6 hover:text-white",
                    )}
                  >
                    <span className="font-cond text-[16px] font-bold tracking-[0.1em]">{m.name}</span>
                    <span className="text-[13px] text-mist">{m.map}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="anim-lobby-in mt-2 flex w-[424px] gap-2 max-lg:w-[min(424px,94vw)]" style={{ animationDelay: "0.54s" }}>
          <button
            type="button"
            onClick={cycleParty}
            aria-label={`Party size ${party}. Activate to change.`}
            className="clip-notch group grid h-[88px] w-[74px] shrink-0 place-items-center bg-[#060c17]/92 backdrop-blur-[3px] transition-all duration-150 hover:bg-[#0d1830]/95 active:scale-95 max-lg:h-[68px]"
          >
            <span className="relative grid place-items-center">
              <CubeIcon className="h-[52px] w-[52px] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:rotate-3 max-lg:h-[42px] max-lg:w-[42px]" />
              <span className="display-shadow absolute font-display text-[19px] text-[#ffe98a]">{party}</span>
            </span>
          </button>

          <button
            type="button"
            onClick={onStart}
            className="clip-start btn-shine anim-start-glow h-[88px] flex-1 bg-gradient-to-b from-[#ffe14d] via-gold to-gold-deep font-display text-[42px] tracking-[0.08em] text-[#241a00] transition-all duration-150 hover:scale-[1.015] hover:brightness-105 active:scale-[0.98] max-lg:h-[68px] max-lg:text-[32px]"
          >
            START
          </button>
        </div>
      </div>
    </div>
  );
}
