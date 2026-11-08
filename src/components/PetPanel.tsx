"use client";

/**
 * PET PANEL — full-screen companion screen (uploaded pet-screen design).
 *
 * The body is the uploaded "pixel-perfect pet screen": pet stage with
 * nameplate + rename, animated pet character, gold particles, vertical
 * pet rail, SKILL/ACTIONS tabbed details panel and the big yellow EQUIP
 * button, plus the "hide pet in match" switch.
 *
 * Two things intentionally stay EXACTLY as they were:
 *   1. The background — the lobby dashboard's blurred scene (the upload's
 *      blue voxel-world backdrop is NOT used).
 *   2. The top chrome — the dashboard's own player name/level bar and
 *      currency bar (same cluster, spacing and styling as the lobby
 *      TopBar). The upload's player/currency chrome is NOT used.
 *
 * Opened from the PET entry in the left rail (or Spark's name tag in the
 * scene). Escape closes it, like every other lobby panel.
 */

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import {
  ArrowUp,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Hand,
  PartyPopper,
  PencilLine,
  Plus,
  X,
} from "lucide-react";
import { CoinIcon, DiamondIcon } from "./icons";
import { cn } from "@/utils/cn";
import "./petPanel.css";
import type { ToastKind } from "@/data/gameData";

const avatarImg = "/dashboard/avatar.jpg";
const bgScene = "/dashboard/bg-scene.jpg";

/* ============================== pet roster ============================== */

type PetId = "rockie" | "panda" | "draco" | "ottero" | "neon";
type PetAction = "idle" | "greet" | "jump" | "celebrate";

interface PetFriend {
  id: PetId;
  name: string;
  skill: string;
  description: string;
  benefit: string;
  descriptionEnd?: string;
  story: string;
  color: string;
}

const PETS: PetFriend[] = [
  {
    id: "rockie",
    name: "Rockie",
    skill: "Sprinting Paws",
    description: "Increases the player's movement speed by ",
    benefit: "6%",
    story: "A loyal friend who never leaves your side.",
    color: "#b933ff",
  },
  {
    id: "panda",
    name: "Detective Panda",
    skill: "Panda's Blessings",
    description: "Restores ",
    benefit: "4 HP",
    descriptionEnd: " after every elimination",
    story: "A little luck. A lot of heart. Always on your team.",
    color: "#ffc933",
  },
  {
    id: "draco",
    name: "Dreki",
    skill: "Dragon Glare",
    description: "Spots opponents using medkits within ",
    benefit: "10 m",
    story: "Small wings. A fearless heart. A fiery friendship.",
    color: "#ff583c",
  },
  {
    id: "ottero",
    name: "Mr. Waggor",
    skill: "Smooth Gloo",
    description: "Produces a Gloo Wall grenade every ",
    benefit: "120 s",
    story: "Ready for the cold. Built for the adventure.",
    color: "#35c5ff",
  },
  {
    id: "neon",
    name: "Neon",
    skill: "Neon Dash",
    description: "Boosts sprint speed after using an ability by ",
    benefit: "8%",
    story: "A spark of mischief in a world of possibilities.",
    color: "#f44fff",
  },
];

/** localStorage-backed state (same keys as the uploaded pet screen). */
function useSavedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(`pet-arena:${key}`);
      if (stored === null) return initial;
      const parsed: unknown = JSON.parse(stored);
      if (initial !== null && (parsed === null || typeof parsed !== typeof initial))
        return initial;
      if (Array.isArray(initial) && !Array.isArray(parsed)) return initial;
      return parsed as T;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(`pet-arena:${key}`, JSON.stringify(value));
    } catch {
      /* Storage can be unavailable in private browsing. */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

/* ============================== tiny art bits ============================ */

/** Filled pixel paw from the uploaded design (pet nameplate). */
function PawIcon() {
  return (
    <svg
      className="name-paw"
      viewBox="0 0 48 48"
      fill="currentColor"
      aria-hidden="true"
    >
      <ellipse cx="8" cy="19" rx="5" ry="7" transform="rotate(-23 8 19)" />
      <ellipse cx="19" cy="10" rx="5" ry="8" transform="rotate(-8 19 10)" />
      <ellipse cx="31" cy="10" rx="5" ry="8" transform="rotate(8 31 10)" />
      <ellipse cx="41" cy="20" rx="5" ry="7" transform="rotate(23 41 20)" />
      <path d="M10 35c0-5 4-7 6-11 4-7 13-7 17 0 2 4 6 6 6 11 0 9-9 8-15 5-6 3-14 4-14-5Z" />
    </svg>
  );
}

/** Angled skill emblem, tinted per pet via --skill-color. */
function SkillEmblem({ color }: { color: string }) {
  return (
    <div
      className="skill-emblem"
      style={{ "--skill-color": color } as CSSProperties}
    >
      <svg viewBox="0 0 144 148" fill="none" aria-hidden="true">
        <defs>
          <radialGradient id="skill-core">
            <stop stopColor="#8a13d8" />
            <stop offset=".65" stopColor="#30085e" />
            <stop offset="1" stopColor="#0d0826" />
          </radialGradient>
          <filter id="skill-glow">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        <path
          className="emblem-outline"
          d="m72 5 23 10 28 5 4 29 12 25-13 24-5 29-27 7-22 9-26-12-25-5-6-27L5 74l12-25 5-28 27-6Z"
          fill="url(#skill-core)"
          strokeWidth="2.5"
        />
        <path
          d="m70 15 22 9 22 3 5 25 10 21-12 23-4 22-23 7-19 8-22-10-21-4-5-23-9-23 10-21 5-23 22-6Z"
          stroke="#7419a9"
          strokeWidth="2"
        />
        <g stroke="#c75dff" strokeWidth="10" filter="url(#skill-glow)">
          <path d="m45 50 23 10 11 20-22 11-15 24m35-32 20 15 14-9M37 72l22-14m29-8 14 18" />
        </g>
        <g fill="#fbf4ff">
          <path d="m74 46 9-8 10 2 4 9-7 10-10-2ZM63 59l13-3 12 20-12 12-19 9-12 20-10-5 14-26 17-9-7-9-12 7-13-1 1-8 12-1Z" />
          <path d="m75 84 14-6 10 15 14-9 6 8-21 15-10-5ZM80 62l8-6 10 12 15 2-1 8-20-1Z" />
          <path d="m85 27 3 9 8 2 4-9 6 5-2 11-9 5-13-5-2-10ZM116 61l3 7 7 2 4-7 5 7-5 10-11 1-7-7Z" />
        </g>
        <path
          d="m27 45 20-9m-25 19 13-6m-8 40 12-4m9 36 10-9"
          stroke="#db7cff"
          strokeWidth="3"
        />
        <path d="m30 30 9 1-6 8ZM110 116l-10 1 5-9Z" fill="#b12bff" />
      </svg>
    </div>
  );
}

/* ================================ panel ================================== */

interface PetPanelProps {
  coins: number;
  diamonds: number;
  onToast: (msg: string, kind?: ToastKind) => void;
  onTopUp: () => void;
  onClose: () => void;
}

export default function PetPanel({
  coins,
  diamonds,
  onToast,
  onTopUp,
  onClose,
}: PetPanelProps) {
  const [selectedId, setSelectedId] = useSavedState<PetId>("selected", "rockie");
  const [equippedId, setEquippedId] = useSavedState<PetId | null>(
    "equipped",
    null,
  );
  const [customNames, setCustomNames] = useSavedState<
    Partial<Record<PetId, string>>
  >("names", {});
  const [hideInMatch, setHideInMatch] = useSavedState("hide-in-match", false);
  const [tab, setTab] = useState<"skill" | "actions">("skill");
  const [modal, setModal] = useState<"rename" | null>(null);
  const [draftName, setDraftName] = useState("");
  const [nameError, setNameError] = useState("");
  const [petAction, setPetAction] = useState<PetAction>("idle");
  const [actionTick, setActionTick] = useState(0);

  const actionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const railRef = useRef<HTMLElement>(null);

  const pet = PETS.find((item) => item.id === selectedId) ?? PETS[0];
  const petName = customNames[pet.id] || pet.name;
  const isEquipped = equippedId === pet.id;

  /* Escape: close the rename dialog first, then the panel itself. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (modal) setModal(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal, onClose]);

  /* Clear the pending action timer on unmount. */
  useEffect(() => () => clearTimeout(actionTimer.current), []);

  /* ---------------------------- interactions ---------------------------- */

  function selectPet(id: PetId) {
    if (id === pet.id) return;
    setSelectedId(id);
    setTab("skill");
    setPetAction("idle");
    clearTimeout(actionTimer.current);
    const rail = railRef.current;
    const button = rail?.querySelector<HTMLElement>(`[data-pet="${id}"]`);
    if (rail && button && rail.scrollWidth > rail.clientWidth) {
      rail.scrollTo({
        left: button.offsetLeft - (rail.clientWidth - button.clientWidth) / 2,
        behavior: "smooth",
      });
    }
  }

  function nextPet(direction = 1) {
    const index = PETS.findIndex((item) => item.id === pet.id);
    selectPet(PETS[(index + direction + PETS.length) % PETS.length].id);
  }

  function triggerAction(action: Exclude<PetAction, "idle">) {
    clearTimeout(actionTimer.current);
    setPetAction(action);
    setActionTick((t) => t + 1);
    onToast(
      `${petName} ${
        action === "greet"
          ? "says hello!"
          : action === "jump"
            ? "is ready to play!"
            : "celebrates with you!"
      }`,
    );
    actionTimer.current = setTimeout(() => setPetAction("idle"), 1150);
  }

  function equipPet() {
    if (isEquipped) return;
    setEquippedId(pet.id);
    triggerAction("celebrate");
    onToast(`${petName} is equipped. Adventure awaits!`);
  }

  function openRename() {
    setDraftName(petName);
    setNameError("");
    setModal("rename");
  }

  function renamePet(event: FormEvent) {
    event.preventDefault();
    const name = draftName.trim();
    if (!name) {
      setNameError("Give your companion a name first.");
      return;
    }
    if (name.length > 16) {
      setNameError("Keep it to 16 characters or fewer.");
      return;
    }
    setCustomNames((current) => ({ ...current, [pet.id]: name }));
    setModal(null);
    onToast(`Say hello to ${name}!`);
  }

  /* Action animation: -a/-b keyframe variants alternate so repeating the
     same action restarts the animation. */
  const actionAnimation =
    petAction === "idle"
      ? undefined
      : `${petAction === "jump" ? "pf-jump" : petAction === "greet" ? "pf-greet" : "pf-celebrate"}-${
          actionTick % 2 === 0 ? "a" : "b"
        } 1.1s ease-in-out`;

  return (
    <div
      className="pet-screen z-[70]"
      role="dialog"
      aria-modal="true"
      aria-label="Pets"
    >
      {/* ---------- backdrop : dashboard scene, blurred & dimmed (KEPT) ---------- */}
      <div
        className="absolute inset-0 bg-[#03060c]"
        onClick={onClose}
        aria-hidden="true"
      >
        <img
          src={bgScene}
          alt=""
          className="h-full w-full scale-105 object-cover opacity-30 blur-[10px]"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-[#04070d]/80 to-[#04070d]" />
      </div>

      {/* ------------- top chrome : dashboard header (KEPT 1:1) ------------- */}
      <div className="relative z-20 flex items-start justify-between gap-2 px-3 pt-2.5 max-md:flex-wrap">
        {/* left cluster — mirrors the lobby TopBar left cluster (same
            gap-2 distance between the player card and the currency bar) */}
        <div className="flex items-start gap-2">
          {/* player name + level bar — identical to the lobby header */}
          <div
            className="anim-lobby-in bg-gradient-to-r from-fuchsia-500 via-violet-500 to-sky-500 p-[2px] shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
            style={{
              clipPath:
                "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              animationDelay: "0.05s",
            }}
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
                  <span className="shrink-0 text-[12px] font-semibold text-mist">
                    Lv. 18
                  </span>
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

          {/* currency bar — identical to the lobby wallet */}
          <div
            className="anim-lobby-in mt-[5px] flex items-stretch max-sm:hidden"
            style={{ animationDelay: "0.12s" }}
          >
            <div className="clip-para flex h-[50px] items-center gap-5 bg-black/75 pr-7 pl-5 backdrop-blur-sm">
              <span className="flex items-center gap-2">
                <CoinIcon className="h-[26px] w-[26px]" />
                <span className="text-[19px] font-bold tracking-wide tabular-nums">
                  {coins}
                </span>
              </span>
              <span className="h-6 w-px bg-white/15" />
              <span className="flex items-center gap-2">
                <DiamondIcon className="h-[24px] w-[24px]" />
                <span className="text-[19px] font-bold tracking-wide tabular-nums">
                  {diamonds}
                </span>
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

        {/* close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close pets panel"
          className="panel-close anim-lobby-in grid h-8 w-8 shrink-0 place-items-center transition hover:rotate-90 active:scale-95 max-md:ml-auto"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* ======================== pet screen body (NEW) ======================== */}
      <div className="pet-body">
        {/* ------------------------------ stage ------------------------------ */}
        <section className="pet-stage" aria-label={`${petName} preview`}>
          <div className="pet-nameplate">
            <PawIcon />
            <h1 className={petName.length > 12 ? "long-name" : ""}>{petName}</h1>
            <button
              type="button"
              className="rename-button icon-button"
              aria-label={`Rename ${petName}`}
              title="Rename your pet"
              onClick={openRename}
            >
              <PencilLine strokeWidth={2.2} />
            </button>
          </div>
          <div className="pedestal-aura" aria-hidden="true" />
          <div className="pet-shadow" aria-hidden="true" />
          <div
            className={cn(
              "gold-particles",
              petAction === "celebrate" && "celebrating",
            )}
            aria-hidden="true"
          >
            {Array.from({ length: 12 }, (_, index) => (
              <i
                key={index}
                style={
                  {
                    "--particle": index,
                    "--left": `${(index * 29 + 7) % 100}%`,
                    "--delay": `${index * -0.46}s`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <div className="pet-display">
            <div
              key={pet.id}
              className={`pet-model pet-model-${pet.id}`}
            >
              <button
                type="button"
                className={cn(
                  "pet-character",
                  petAction !== "idle" && "is-active",
                )}
                style={
                  actionAnimation ? { animation: actionAnimation } : undefined
                }
                aria-label={`Play with ${petName}`}
                title={`Click to play with ${petName}`}
                onClick={() => triggerAction("jump")}
              >
                <img
                  src={`/pets/${pet.id}.webp`}
                  alt={`${petName}, your adventure companion`}
                  draggable={false}
                />
              </button>
            </div>
          </div>
        </section>

        {/* ------------------------------- rail ------------------------------- */}
        <nav
          className="pet-rail"
          ref={railRef}
          aria-label="Choose your pet"
          onKeyDown={(event) => {
            if (
              ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(
                event.key,
              )
            ) {
              event.preventDefault();
              nextPet(["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1);
            }
          }}
        >
          {PETS.map((item) => (
            <button
              key={item.id}
              type="button"
              data-pet={item.id}
              className={cn(
                "pet-option",
                pet.id === item.id && "selected",
              )}
              aria-label={`Select ${customNames[item.id] || item.name}`}
              aria-pressed={pet.id === item.id}
              title={customNames[item.id] || item.name}
              onClick={() => selectPet(item.id)}
            >
              <span className="pet-option-glow" />
              <img
                src={`/pets/${item.id}-thumb.webp`}
                alt=""
                draggable={false}
              />
              {equippedId === item.id && (
                <span className="equipped-mark" aria-label="Equipped">
                  <Check strokeWidth={3} />
                </span>
              )}
              <span className="selection-corner" />
              {pet.id === item.id && (
                <ChevronRight className="selected-arrow" strokeWidth={5} />
              )}
            </button>
          ))}
          <button
            type="button"
            className="next-pet"
            onClick={() => nextPet()}
            aria-label="Select next pet"
            title="Next pet"
          >
            <ChevronDown strokeWidth={5} />
          </button>
        </nav>

        {/* ----------------------------- details ----------------------------- */}
        <section className="details-zone" aria-label="Pet details">
          <div className="pet-panel">
            <div className="panel-interior">
              <div className="level-header">
                <div className="level-info">
                  <strong>Lv. 1</strong>
                  <span>0 / 100</span>
                </div>
                <div
                  className="level-progress"
                  role="progressbar"
                  aria-label="Pet experience"
                  aria-valuenow={0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <span />
                </div>
              </div>
              <div className="pet-tabs" role="tablist" aria-label="Pet information">
                <button
                  type="button"
                  id="skill-tab"
                  className={cn("pet-tab", tab === "skill" && "active")}
                  role="tab"
                  aria-selected={tab === "skill"}
                  aria-controls="skill-panel"
                  tabIndex={tab === "skill" ? 0 : -1}
                  onClick={() => setTab("skill")}
                  onKeyDown={(event) => {
                    if (
                      event.key === "ArrowRight" ||
                      event.key === "ArrowLeft"
                    ) {
                      setTab("actions");
                      document.getElementById("actions-tab")?.focus();
                    }
                  }}
                >
                  SKILL
                </button>
                <button
                  type="button"
                  id="actions-tab"
                  className={cn("pet-tab", tab === "actions" && "active")}
                  role="tab"
                  aria-selected={tab === "actions"}
                  aria-controls="actions-panel"
                  tabIndex={tab === "actions" ? 0 : -1}
                  onClick={() => setTab("actions")}
                  onKeyDown={(event) => {
                    if (
                      event.key === "ArrowRight" ||
                      event.key === "ArrowLeft"
                    ) {
                      setTab("skill");
                      document.getElementById("skill-tab")?.focus();
                    }
                  }}
                >
                  ACTIONS
                </button>
              </div>
              <div
                id="skill-panel"
                className="skill-content"
                role="tabpanel"
                aria-labelledby="skill-tab"
                tabIndex={0}
                hidden={tab !== "skill"}
              >
                <div className="ability-row">
                  <SkillEmblem color={pet.color} />
                  <div className="ability-copy">
                    <h2>{pet.skill}</h2>
                    <p>
                      {pet.description}
                      <strong>{pet.benefit}</strong>
                      {pet.descriptionEnd}.
                    </p>
                  </div>
                </div>
                <blockquote className="pet-story">
                  <p>{pet.story}</p>
                </blockquote>
              </div>
              <div
                id="actions-panel"
                className="actions-content"
                role="tabpanel"
                aria-labelledby="actions-tab"
                tabIndex={0}
                hidden={tab !== "actions"}
              >
                <h2>A little personality.</h2>
                <p>Every adventure starts with a little fun.</p>
                <div className="action-buttons">
                  <button
                    type="button"
                    className={petAction === "greet" ? "playing" : ""}
                    onClick={() => triggerAction("greet")}
                  >
                    <Hand />
                    <span>GREET</span>
                  </button>
                  <button
                    type="button"
                    className={petAction === "jump" ? "playing" : ""}
                    onClick={() => triggerAction("jump")}
                  >
                    <ArrowUp />
                    <span>PLAY</span>
                  </button>
                  <button
                    type="button"
                    className={petAction === "celebrate" ? "playing" : ""}
                    onClick={() => triggerAction("celebrate")}
                  >
                    <PartyPopper />
                    <span>CELEBRATE</span>
                  </button>
                </div>
                <p className="action-hint">
                  <CircleHelp /> Select an action to preview it.
                </p>
              </div>
            </div>
            <span className="panel-corner top" />
            <span className="panel-corner bottom" />
          </div>
          <button
            type="button"
            className={cn("equip-button yellow-button", isEquipped && "is-equipped")}
            onClick={equipPet}
            disabled={isEquipped}
          >
            {isEquipped && <Check strokeWidth={3} />}
            <span>{isEquipped ? "EQUIPPED" : "EQUIP"}</span>
          </button>
        </section>

        {/* --------------------------- hide in match --------------------------- */}
        <label className="hide-pet">
          <input
            type="checkbox"
            checked={hideInMatch}
            onChange={(event) => {
              setHideInMatch(event.target.checked);
              onToast(
                event.target.checked
                  ? "Your pet will be hidden during matches."
                  : "Your pet will be visible during matches.",
              );
            }}
          />
          <span className="checkbox-visual">
            {hideInMatch && <Check strokeWidth={3.5} />}
          </span>
          <span>Hide pet in match</span>
        </label>
      </div>

      {/* --------------------------- rename dialog --------------------------- */}
      {modal === "rename" && (
        <div
          className="pf-modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) setModal(null);
          }}
        >
          <div
            className="game-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rename-title"
          >
            <header className="dialog-header">
              <h2 id="rename-title">A NAME FOR YOUR SIDEKICK</h2>
              <button
                type="button"
                className="dialog-close icon-button"
                onClick={() => setModal(null)}
                aria-label="Close dialog"
              >
                <X />
              </button>
            </header>
            <div className="dialog-body">
              <form onSubmit={renamePet} className="rename-form">
                <p>Every great companion deserves a great name.</p>
                <label htmlFor="pet-name">PET NAME</label>
                <div className="name-input-wrap">
                  <input
                    id="pet-name"
                    value={draftName}
                    onChange={(event) => {
                      setDraftName(event.target.value);
                      setNameError("");
                    }}
                    autoFocus
                    maxLength={16}
                    autoComplete="off"
                    aria-describedby={
                      nameError ? "name-error" : "name-length"
                    }
                  />
                  <span id="name-length">{draftName.length}/16</span>
                </div>
                {nameError && (
                  <p id="name-error" className="form-error">
                    {nameError}
                  </p>
                )}
                <button type="submit" className="yellow-button modal-primary">
                  <span>SAVE NAME</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
