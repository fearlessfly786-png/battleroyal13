import type { ComponentType } from "react";
import {
  ShoppingCart,
  Crown,
  Package,
  CalendarDays,
  ChevronRight,
  PawPrint,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { GunIcon, PixelFace } from "./icons";
import type { PanelId } from "@/data/gameData";

const skinBundleImg = "/dashboard/skin-bundle.jpg";
const luckCrateImg = "/dashboard/luck-crate.jpg";

interface LeftRailProps {
  active: PanelId | null;
  onSelect: (id: PanelId) => void;
}

interface MenuItem {
  /** Panel to open on click. Omit for decorative buttons (no panel). */
  id?: PanelId;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  /** Decorative buttons render like menu items but never open a panel. */
  decorative?: boolean;
}

const MENU: MenuItem[] = [
  { id: "store", label: "STORE", Icon: ShoppingCart },
  { id: "luck", label: "LUCK ROYALE", Icon: Crown },
  { id: "vault", label: "VAULT", Icon: Package },
  { id: "events", label: "EVENTS", Icon: CalendarDays },
  { label: "CHARACTER", Icon: PixelFace, decorative: true },
  { label: "WEAPON", Icon: GunIcon, decorative: true },
  { id: "pet", label: "PET", Icon: PawPrint },
];

export default function LeftRail({ active, onSelect }: LeftRailProps) {
  return (
    <aside className="absolute top-[86px] left-3 z-20 flex flex-col max-lg:top-[128px] max-md:left-2">
      {/* ------- promo banners ------- */}
      <div className="anim-lobby-in flex gap-2.5 max-lg:hidden" style={{ animationDelay: "0.22s" }}>
        <button
          type="button"
          onClick={() => onSelect("store")}
          className="clip-notch group relative block h-[128px] w-[330px] overflow-hidden text-left shadow-[0_14px_34px_rgba(0,0,0,0.45)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
          aria-label="Open store — new skin bundle"
        >
          <img
            src={skinBundleImg}
            alt="New skin bundle artwork"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <span className="absolute inset-0 bg-gradient-to-r from-violet-950/70 via-fuchsia-900/10 to-transparent" />
          <span className="absolute bottom-3 left-3.5 leading-none">
            <span className="display-shadow block font-display text-[30px] tracking-wide text-gold italic">
              NEW
            </span>
            <span className="display-shadow block font-display text-[27px] tracking-wide text-white">
              SKIN <span className="text-[19px]">BUNDLE</span>
            </span>
          </span>
          <span className="absolute right-2.5 bottom-2.5 grid h-6 w-6 translate-y-1 place-items-center bg-gold text-black opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <ChevronRight className="h-4 w-4" strokeWidth={3.5} />
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelect("luck")}
          className="clip-notch group relative block h-[128px] w-[128px] overflow-hidden shadow-[0_14px_34px_rgba(0,0,0,0.45)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
          aria-label="Open luck royale"
        >
          <img
            src={luckCrateImg}
            alt="Golden luck royale crate"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
          />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pt-6 pb-2 text-center">
            <span className="display-shadow font-display text-[15px] tracking-[0.08em] text-gold">
              LUCK ROYALE
            </span>
          </span>
        </button>
      </div>

      {/* ------- main menu ------- */}
      <nav
        aria-label="Lobby menu"
        className="mt-3 flex flex-col items-start gap-[7px] max-lg:mt-0 max-lg:flex-row max-lg:flex-wrap max-lg:gap-1.5"
      >
        {MENU.map(({ id, label, Icon, decorative }, i) => {
          const isActive = !decorative && id !== undefined && active === id;
          return (
            <button
              key={label}
              type="button"
              onClick={() => {
                if (!decorative && id !== undefined) onSelect(id);
              }}
              aria-current={isActive ? "page" : undefined}
              aria-label={decorative ? `${label} (coming soon)` : label}
              className={cn(
                "clip-tag anim-lobby-in group flex h-[50px] items-center gap-3 pr-10 pl-4 text-left backdrop-blur-[3px] transition-all duration-200 max-lg:h-10 max-lg:pr-7 max-lg:pl-3",
                isActive
                  ? "translate-x-1 bg-gradient-to-r from-[#ffd83d] to-gold text-[#1a1300] shadow-[0_10px_26px_rgba(255,170,0,0.35)]"
                  : "bg-[#060c17]/80 text-white hover:translate-x-1.5 hover:bg-[#0d1830]/90 active:scale-[0.98]",
              )}
              style={{ animationDelay: `${0.28 + i * 0.055}s` }}
            >
              <Icon
                className={cn(
                  "h-[23px] w-[23px] shrink-0 transition-transform duration-200 group-hover:scale-110 max-lg:h-[18px] max-lg:w-[18px]",
                  isActive ? "text-[#1a1300]" : id === "luck" ? "text-gold" : "text-white",
                )}
              />
              <span className="font-cond text-[19px] font-bold tracking-[0.1em] whitespace-nowrap max-lg:text-[15px]">
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
