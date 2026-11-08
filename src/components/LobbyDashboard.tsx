'use client';

/**
 * LOBBY DASHBOARD — pixel-perfect design recreation, adapted from the
 * exported Vite build (pixel-perfect-design-recreation.zip).
 *
 * Self-contained lobby chrome: wallet, panels, matchmaking, top-up,
 * toasts, parallax background + floating voxel particles. The 3D game
 * stays untouched — `onDeploy` fires when the player ACCEPTS a found
 * match, and `ghSlot` renders the (unmodified) GitHub export button
 * inside the top-left status bar.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PawPrint } from "lucide-react";
import TopBar from "@/components/TopBar";
import LeftRail from "@/components/LeftRail";
import RightRail from "@/components/RightRail";
import BottomBar from "@/components/BottomBar";
import Panels from "@/components/Panels";
import PetPanel from "@/components/PetPanel";
import StorePanel from "@/components/StorePanel";
import { Matchmaking, TopUpModal, Toasts, type Toast } from "@/components/Overlays";
import {
  MODES,
  type CurrencyKind,
  type ModeOption,
  type PanelId,
  type SettingsState,
  type ToastKind,
} from "@/data/gameData";

const bgScene = "/dashboard/bg-scene.jpg";

const PARTICLE_COLORS = ["#ffc61a", "#3fd9ff", "#ffffff", "#b45cff", "#7CFC9A"];

interface LobbyDashboardProps {
  /** Deploy into the 3D game (match ACCEPT). */
  onDeploy: () => void;
  /** Rendered as the 5th icon in the top-right system bar (GitHub export button). */
  ghSlot?: React.ReactNode;
}

export default function LobbyDashboard({ onDeploy, ghSlot }: LobbyDashboardProps) {
  const [coins, setCoins] = useState(25670);
  const [diamonds, setDiamonds] = useState(540);
  const [selected, setSelected] = useState<PanelId>("store");
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [petOpen, setPetOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);
  const [mode, setMode] = useState<ModeOption>(MODES[0]);
  const [matchOpen, setMatchOpen] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [settings, setSettings] = useState<SettingsState>({
    music: true,
    sfx: true,
    particles: true,
    quality: "Ultra",
  });

  const bgRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  /* ------------------------------ toasts ------------------------------ */
  const pushToast = useCallback((msg: string, kind: ToastKind = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  /* ------------------------------ wallet ------------------------------ */
  const earn = useCallback((kind: CurrencyKind, amount: number) => {
    if (kind === "coins") setCoins((c) => c + amount);
    else setDiamonds((d) => d + amount);
  }, []);

  const spend = useCallback(
    (kind: CurrencyKind, amount: number) => {
      if (kind === "coins") {
        if (coins < amount) return false;
        setCoins((c) => c - amount);
      } else {
        if (diamonds < amount) return false;
        setDiamonds((d) => d - amount);
      }
      return true;
    },
    [coins, diamonds],
  );

  /* ----------------------------- navigation ---------------------------- */
  const selectPanel = useCallback((id: PanelId) => {
    setSelected(id);
    if (id === "store") {
      // STORE opens the full-screen Free Fire-style store instead of the
      // old side drawer.
      setPanel(null);
      setStoreOpen((o) => !o);
      return;
    }
    if (id === "pet") {
      // PET opens the full-screen kennel instead of the side panel.
      setPanel(null);
      setPetOpen((o) => !o);
      return;
    }
    setPanel((p) => (p === id ? null : id));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPanel(null);
        setPetOpen(false);
        setStoreOpen(false);
        setMatchOpen(false);
        setTopUpOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ------------------------------ parallax ----------------------------- */
  const onMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (bgRef.current) {
        bgRef.current.style.transform = `scale(1.07) translate(${x * -11}px, ${y * -7}px)`;
      }
      if (tagRef.current) {
        tagRef.current.style.transform = `translate(${x * -18}px, ${y * -10}px)`;
      }
    });
  };

  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: `${(i * 61) % 100}%`,
        size: 4 + ((i * 7) % 5),
        delay: `${(i * 1.7) % 12}s`,
        duration: `${10 + ((i * 3.3) % 8)}s`,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
      })),
    [],
  );

  return (
    <div
      className="relative z-10 h-[100dvh] w-full overflow-hidden bg-[#04070d] font-sans text-white select-none"
      onMouseMove={onMouseMove}
    >
      {/* ------------------------- voxel world ------------------------- */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.07)" }}>
        <img
          src={bgScene}
          alt="Voxel battle royale island lobby"
          className="h-full w-full object-cover object-[38%_center] lg:object-center"
          draggable={false}
        />
      </div>
      {/* readability gradients */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/15" />

      {/* floating voxel particles */}
      {settings.particles && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute bottom-[-12px] block"
              style={{
                left: p.left,
                width: p.size,
                height: p.size,
                background: p.color,
                boxShadow: `0 0 8px ${p.color}`,
                animation: `float-up ${p.duration} linear ${p.delay} infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* hero character hover intel */}
      <div className="group absolute top-[19%] left-[26%] z-[5] hidden h-[72%] w-[20%] lg:block">
        <div className="clip-notch-sm pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 translate-y-1.5 bg-black/70 px-3 py-1.5 text-center ring-1 ring-white/20 backdrop-blur-[2px] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:opacity-0">
          <p className="text-[13px] font-bold whitespace-nowrap">
            FearlessFly <span className="text-gold">· Lv. 18</span>
          </p>
          <p className="text-[11.5px] whitespace-nowrap text-mist">AK47 — Voxel Draco · Crimson Web</p>
        </div>
      </div>

      {/* Spark the husky — name tag tracks the pet in the scene */}
      <div ref={tagRef} className="absolute top-[44.5%] left-[54.6%] z-10 hidden will-change-transform md:block">
        <button
          type="button"
          onClick={() => {
            setSelected("pet");
            setPetOpen(true);
          }}
          className="anim-bob clip-notch-sm flex items-center gap-1.5 bg-black/70 px-2.5 py-1.5 ring-1 ring-white/25 backdrop-blur-[2px] transition hover:bg-black/85 hover:ring-gold/70 active:scale-95"
          aria-label="Spark, your pet husky — open the pets panel"
        >
          <PawPrint className="h-4 w-4 text-gold" />
          <span className="text-[13.5px] font-bold tracking-wide">Spark</span>
        </button>
      </div>

      {/* ----------------------------- chrome ----------------------------- */}
      <TopBar
        coins={coins}
        diamonds={diamonds}
        settings={settings}
        onSettingsChange={setSettings}
        onTopUp={() => setTopUpOpen(true)}
        onEarn={earn}
        onToast={pushToast}
        rightSlot={ghSlot}
      />
      <LeftRail active={panel ?? selected} onSelect={selectPanel} />
      <RightRail
        mode={mode}
        onModeChange={setMode}
        onStart={() => setMatchOpen(true)}
        onEarn={earn}
        onToast={pushToast}
      />
      <BottomBar />

      {/* ---------------------------- overlays ---------------------------- */}
      <Panels
        panel={panel}
        onClose={() => setPanel(null)}
        coins={coins}
        diamonds={diamonds}
        onSpend={spend}
        onEarn={earn}
        onToast={pushToast}
      />
      {petOpen && (
        <PetPanel
          coins={coins}
          diamonds={diamonds}
          onToast={pushToast}
          onTopUp={() => setTopUpOpen(true)}
          onClose={() => setPetOpen(false)}
        />
      )}
      {storeOpen && (
        <StorePanel
          coins={coins}
          diamonds={diamonds}
          onSpend={spend}
          onToast={pushToast}
          onTopUp={() => setTopUpOpen(true)}
          onClose={() => setStoreOpen(false)}
        />
      )}
      {matchOpen && (
        <Matchmaking
          mode={mode}
          onClose={() => setMatchOpen(false)}
          onToast={pushToast}
          onAccept={onDeploy}
        />
      )}
      {topUpOpen && (
        <TopUpModal
          diamonds={diamonds}
          onClose={() => setTopUpOpen(false)}
          onBuy={(kind, amount, label) => {
            earn(kind, amount);
            pushToast(`Top-up complete: +${label}`, "success");
            setTopUpOpen(false);
          }}
        />
      )}
      <Toasts toasts={toasts} />
    </div>
  );
}
