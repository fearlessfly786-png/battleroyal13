"use client";

/**
 * STORE PANEL — full-screen Free Fire-inspired store.
 *
 * Replaces the old right-side drawer: clicking STORE in the left rail (or
 * the "NEW SKIN BUNDLE" promo banner) now opens this screen over the whole
 * dashboard, exactly like the pet screen does.
 *
 * Layout:
 *   - backdrop — the lobby scene, blurred & dimmed (click closes)
 *   - top chrome — the dashboard's own player card + currency bar (same
 *     cluster, spacing and styling as the lobby TopBar / pet panel)
 *   - body — left category rail (RECOMMENDED / FEATURED / BUNDLES / GUNS /
 *     CHARACTERS / PETS / EMOTES / CRATES) and a scrollable main column:
 *     featured hero deal with a live countdown on the home tab, then the
 *     product grid with rarity colors, NEW/HOT/LIMITED flags, discount
 *     badges and BUY actions wired to the shared wallet.
 */

import {
  useEffect,
  useMemo,
  useState,
  type ComponentType,
} from "react";
import {
  ChevronRight,
  Clock3,
  Crosshair,
  Flame,
  Laugh,
  Package,
  PawPrint,
  Plus,
  Shirt,
  Sparkles,
  Star,
  User,
  X,
} from "lucide-react";
import { CoinIcon, DiamondIcon } from "./icons";
import { cn } from "@/utils/cn";
import "./storePanel.css";
import {
  STORE_FEATURED,
  STORE_PRODUCTS,
  STORE_TABS,
  type CurrencyKind,
  type StoreTab,
  type ToastKind,
} from "@/data/gameData";

const avatarImg = "/dashboard/avatar.jpg";
const bgScene = "/dashboard/bg-scene.jpg";

const IMG_MAP: Record<string, string> = {
  bundle: "/dashboard/skin-bundle.jpg",
  crate: "/dashboard/luck-crate.jpg",
  gem: "/dashboard/gem.jpg",
  avatar: "/dashboard/avatar.jpg",
  hero: "/dashboard/store-hero.jpg",
  gun: "/dashboard/store-gun.jpg",
};

const TAB_ICONS: Record<StoreTab, ComponentType<{ className?: string }>> = {
  recommended: Flame,
  featured: Star,
  bundles: Shirt,
  guns: Crosshair,
  characters: User,
  pets: PawPrint,
  emotes: Laugh,
  crates: Package,
};

interface StorePanelProps {
  coins: number;
  diamonds: number;
  onSpend: (kind: CurrencyKind, amount: number) => boolean;
  onToast: (msg: string, kind?: ToastKind) => void;
  onTopUp: () => void;
  onClose: () => void;
}

export default function StorePanel({
  coins,
  diamonds,
  onSpend,
  onToast,
  onTopUp,
  onClose,
}: StorePanelProps) {
  const [tab, setTab] = useState<StoreTab>("recommended");
  const [owned, setOwned] = useState<Set<string>>(new Set());
  const [remaining, setRemaining] = useState(STORE_FEATURED.durationMs);

  /* featured-deal countdown, ticks once per second */
  useEffect(() => {
    const t = setInterval(
      () => setRemaining((ms) => Math.max(0, ms - 1000)),
      1000,
    );
    return () => clearInterval(t);
  }, []);

  const countdown = useMemo(() => {
    const s = Math.floor(remaining / 1000);
    const hh = String(Math.floor(s / 3600)).padStart(2, "0");
    const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }, [remaining]);

  const items = useMemo(
    () => STORE_PRODUCTS.filter((p) => p.tab === tab),
    [tab],
  );
  const tabMeta = STORE_TABS.find((t) => t.id === tab);

  const buy = (
    id: string,
    name: string,
    price: number,
    kind: CurrencyKind,
  ) => {
    if (owned.has(id)) return;
    if (!onSpend(kind, price)) {
      onToast(`Not enough ${kind} for ${name}`, "error");
      return;
    }
    setOwned((s) => new Set(s).add(id));
    onToast(`${name} added to your Vault`, "success");
  };

  return (
    <section
      className="store-screen z-[70]"
      role="dialog"
      aria-modal="true"
      aria-label="Store"
    >
      {/* ---------- backdrop : dashboard scene, blurred & dimmed ---------- */}
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
      <header className="relative z-20 flex items-start justify-between gap-2 px-3 pt-2.5 max-md:flex-wrap">
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
              className="store-topup anim-lobby-in"
            >
              <Plus className="h-6 w-6" strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* close — red with the signature notch, same as the pet panel */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close store"
          className="store-close anim-lobby-in max-md:ml-auto"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      </header>

      {/* ========================= store body (NEW) ======================== */}
      <div className="store-body">
        {/* ------------------------- category rail ------------------------- */}
        <nav className="store-tabs" aria-label="Store categories">
          {STORE_TABS.map(({ id, label }, i) => {
            const Icon = TAB_ICONS[id];
            const isActive = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                aria-current={isActive ? "page" : undefined}
                className={cn("store-tab anim-lobby-in", isActive && "is-active")}
                style={{ animationDelay: `${0.08 + i * 0.045}s` }}
              >
                <Icon className="store-tab-icon" />
                <span>{label}</span>
                <ChevronRight className="store-tab-chev" />
              </button>
            );
          })}
        </nav>

        {/* --------------------------- main column -------------------------- */}
        <div className="store-main nice-scroll">
          {/* featured hero deal — store home */}
          {tab === "recommended" && (
            <section className="store-hero anim-lobby-in" aria-label="Featured deal" style={{ animationDelay: "0.15s" }}>
              <img
                src={IMG_MAP[STORE_FEATURED.img]}
                alt="Crimson Royale legendary armor bundle artwork"
                className="store-hero-img"
                draggable={false}
              />
              <div className="store-hero-shade" />
              <span className="store-hero-off">-{STORE_FEATURED.discount}%</span>
              <div className="store-hero-info">
                <span className="store-hero-flag">
                  <Sparkles /> FEATURED
                </span>
                <h2 className="store-hero-title">{STORE_FEATURED.name}</h2>
                <p className="store-hero-sub">{STORE_FEATURED.sub}</p>
                <div className="store-hero-row">
                  <span className="store-hero-timer">
                    <Clock3 /> ENDS IN {countdown}
                  </span>
                  <span className="store-hero-price">
                    <s>{STORE_FEATURED.oldPrice}</s>
                    <DiamondIcon className="inline" />
                    {STORE_FEATURED.price}
                  </span>
                  <button
                    type="button"
                    className={cn(
                      "store-buy",
                      owned.has(STORE_FEATURED.id) && "is-owned",
                    )}
                    disabled={owned.has(STORE_FEATURED.id)}
                    onClick={() =>
                      buy(
                        STORE_FEATURED.id,
                        "Crimson Royale Bundle",
                        STORE_FEATURED.price,
                        STORE_FEATURED.kind,
                      )
                    }
                  >
                    {owned.has(STORE_FEATURED.id) ? "OWNED" : "BUY NOW"}
                  </button>
                </div>
              </div>
            </section>
          )}

          <div className="store-section-head">
            <h2>{tabMeta?.label}</h2>
            <span>
              {items.length} ITEM{items.length === 1 ? "" : "S"} · UPDATES DAILY
            </span>
          </div>

          <div className="store-grid">
            {items.map((item) => {
              const isOwned = owned.has(item.id);
              const PriceIcon =
                item.kind === "coins" ? CoinIcon : DiamondIcon;
              return (
                <article
                  key={item.id}
                  className={cn("store-card", isOwned && "is-owned")}
                  data-rarity={item.rarity}
                >
                  <div className="store-card-art">
                    <img
                      src={IMG_MAP[item.img]}
                      alt={item.name}
                      className="store-card-img"
                      style={
                        item.hue
                          ? { filter: `hue-rotate(${item.hue}deg)` }
                          : undefined
                      }
                      draggable={false}
                    />
                    <span className="store-card-rarity">
                      {item.rarity.toUpperCase()}
                    </span>
                    {item.tag && (
                      <span
                        className={cn(
                          "store-card-flag",
                          `flag-${item.tag.toLowerCase()}`,
                        )}
                      >
                        {item.tag}
                      </span>
                    )}
                    {item.discount && (
                      <span className="store-card-off">
                        -{item.discount}%
                      </span>
                    )}
                  </div>
                  <div className="store-card-info">
                    <h3>{item.name}</h3>
                    <div className="store-card-row">
                      <span className="store-card-price">
                        <PriceIcon />
                        {item.price.toLocaleString()}
                        {item.discount && (
                          <s>
                            {Math.round(
                              (item.price * 100) / (100 - item.discount),
                            ).toLocaleString()}
                          </s>
                        )}
                      </span>
                      <button
                        type="button"
                        className={cn("store-buy buy-sm", isOwned && "is-owned")}
                        disabled={isOwned}
                        onClick={() =>
                          buy(item.id, item.name, item.price, item.kind)
                        }
                      >
                        {isOwned ? "OWNED" : "BUY"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
