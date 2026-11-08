export type PanelId =
  | "store"
  | "luck"
  | "vault"
  | "missions"
  | "events"
  | "pet";

export type CurrencyKind = "coins" | "diamonds";

export type ToastKind = "info" | "success" | "error";

export interface SettingsState {
  music: boolean;
  sfx: boolean;
  particles: boolean;
  quality: string;
}

export interface ModeOption {
  id: string;
  name: string;
  map: string;
}

export const MODES: ModeOption[] = [
  { id: "br-bermuda", name: "BR-RANKED", map: "Bermuda" },
  { id: "br-purgatory", name: "BR-RANKED", map: "Purgatory" },
  { id: "cs-craftland", name: "CLASH SQUAD", map: "Craftland" },
  { id: "lw-clock", name: "LONE WOLF", map: "Clock Tower" },
];

export type StoreImg = "bundle" | "crate" | "gem" | "avatar" | "hero" | "gun";

export interface StoreProduct {
  id: string;
  name: string;
  tab: StoreTab;
  rarity: "Legendary" | "Epic" | "Rare";
  price: number;
  kind: CurrencyKind;
  img: StoreImg;
  hue: number;
  tag?: "NEW" | "HOT" | "LIMITED";
  /** Discount percentage, e.g. 40 renders a "-40%" badge. */
  discount?: number;
}

export type StoreTab =
  | "recommended"
  | "featured"
  | "bundles"
  | "guns"
  | "characters"
  | "pets"
  | "emotes"
  | "crates";

export const STORE_TABS: { id: StoreTab; label: string }[] = [
  { id: "recommended", label: "RECOMMENDED" },
  { id: "featured", label: "FEATURED" },
  { id: "bundles", label: "BUNDLES" },
  { id: "guns", label: "GUN SKINS" },
  { id: "characters", label: "CHARACTERS" },
  { id: "pets", label: "PETS" },
  { id: "emotes", label: "EMOTES" },
  { id: "crates", label: "CRATES" },
];

/** Hero deal on the store home (live countdown in the component). */
export const STORE_FEATURED = {
  id: "hero-crimson-royale",
  name: "CRIMSON ROYALE",
  sub: "Legendary red-gold armor set + matching loot crate",
  img: "hero" as StoreImg,
  price: 539,
  oldPrice: 899,
  kind: "diamonds" as CurrencyKind,
  discount: 40,
  /** Countdown length from mount: 8h 14m 00s. */
  durationMs: (8 * 3600 + 14 * 60) * 1000,
};

export const STORE_PRODUCTS: StoreProduct[] = [
  /* -------- recommended (best sellers mix) -------- */
  { id: "p1", name: "Draco AK47 — Crimson Web", tab: "recommended", rarity: "Legendary", price: 999, kind: "diamonds", img: "gun", hue: 0, tag: "NEW" },
  { id: "p2", name: "Pixel Storm Bundle", tab: "recommended", rarity: "Epic", price: 649, kind: "diamonds", img: "bundle", hue: 190, tag: "HOT", discount: 20 },
  { id: "p3", name: "Golden Royale Crate", tab: "recommended", rarity: "Epic", price: 120, kind: "diamonds", img: "crate", hue: 0 },
  { id: "p4", name: "Nebula Crystal Pack", tab: "recommended", rarity: "Epic", price: 4500, kind: "coins", img: "gem", hue: 0, tag: "HOT" },
  { id: "p5", name: "Onyx Fearless Skin", tab: "recommended", rarity: "Legendary", price: 1199, kind: "diamonds", img: "avatar", hue: 140 },
  { id: "p6", name: "Supply Crate ×5", tab: "recommended", rarity: "Rare", price: 2600, kind: "coins", img: "crate", hue: 60, discount: 15 },

  /* -------- featured -------- */
  { id: "f1", name: "Royal Emperor Set", tab: "featured", rarity: "Legendary", price: 539, kind: "diamonds", img: "hero", hue: 0, tag: "LIMITED", discount: 40 },
  { id: "f2", name: "Voxel Draco — Violet", tab: "featured", rarity: "Legendary", price: 1080, kind: "diamonds", img: "gun", hue: 260, tag: "NEW" },
  { id: "f3", name: "Frostbite Bundle", tab: "featured", rarity: "Epic", price: 749, kind: "diamonds", img: "bundle", hue: 200, discount: 25 },
  { id: "f4", name: "Golden Dragon Crate", tab: "featured", rarity: "Legendary", price: 199, kind: "diamonds", img: "crate", hue: 40, tag: "HOT" },

  /* -------- bundles -------- */
  { id: "b1", name: "Crimson Voxel Bundle", tab: "bundles", rarity: "Legendary", price: 899, kind: "diamonds", img: "bundle", hue: 0, tag: "HOT" },
  { id: "b2", name: "Pixel Storm Bundle", tab: "bundles", rarity: "Epic", price: 649, kind: "diamonds", img: "bundle", hue: 190 },
  { id: "b3", name: "Royal Violet Bundle", tab: "bundles", rarity: "Epic", price: 599, kind: "diamonds", img: "bundle", hue: 280, discount: 30 },
  { id: "b4", name: "Desert Fox Bundle", tab: "bundles", rarity: "Rare", price: 449, kind: "diamonds", img: "bundle", hue: 60, tag: "NEW" },

  /* -------- gun skins -------- */
  { id: "g1", name: "Draco AK47 — Crimson Web", tab: "guns", rarity: "Legendary", price: 999, kind: "diamonds", img: "gun", hue: 0, tag: "NEW" },
  { id: "g2", name: "Venom AK47 — Toxic", tab: "guns", rarity: "Epic", price: 749, kind: "diamonds", img: "gun", hue: 120 },
  { id: "g3", name: "Galaxy AK47 — Nebula", tab: "guns", rarity: "Legendary", price: 1080, kind: "diamonds", img: "gun", hue: 260, tag: "HOT" },
  { id: "g4", name: "Amber AK47 — Desert Fade", tab: "guns", rarity: "Rare", price: 399, kind: "diamonds", img: "gun", hue: 45 },

  /* -------- characters -------- */
  { id: "c1", name: "Fearless Skin — Onyx", tab: "characters", rarity: "Legendary", price: 1199, kind: "diamonds", img: "avatar", hue: 140, tag: "HOT" },
  { id: "c2", name: "Fearless Skin — Ember", tab: "characters", rarity: "Epic", price: 899, kind: "diamonds", img: "avatar", hue: 330 },
  { id: "c3", name: "Fearless Skin — Arctic", tab: "characters", rarity: "Rare", price: 599, kind: "diamonds", img: "avatar", hue: 200, discount: 20 },

  /* -------- pets -------- */
  { id: "pe1", name: "Blaze — Dragon Whelp", tab: "pets", rarity: "Legendary", price: 1199, kind: "diamonds", img: "crate", hue: 0, tag: "LIMITED" },
  { id: "pe2", name: "Shadow — Panther Cub", tab: "pets", rarity: "Epic", price: 899, kind: "diamonds", img: "bundle", hue: 220 },
  { id: "pe3", name: "Pixel — Robo Pup", tab: "pets", rarity: "Rare", price: 3200, kind: "coins", img: "gem", hue: 90 },

  /* -------- emotes -------- */
  { id: "e1", name: "Booyah Dance", tab: "emotes", rarity: "Legendary", price: 599, kind: "diamonds", img: "gem", hue: 300, tag: "NEW" },
  { id: "e2", name: "Voxel Flex", tab: "emotes", rarity: "Epic", price: 399, kind: "diamonds", img: "avatar", hue: 90 },
  { id: "e3", name: "Tea Time", tab: "emotes", rarity: "Rare", price: 199, kind: "diamonds", img: "gem", hue: 60 },

  /* -------- crates -------- */
  { id: "cr1", name: "Golden Royale Crate", tab: "crates", rarity: "Epic", price: 120, kind: "diamonds", img: "crate", hue: 0, tag: "HOT" },
  { id: "cr2", name: "Supply Crate ×5", tab: "crates", rarity: "Rare", price: 2600, kind: "coins", img: "crate", hue: 60, discount: 15 },
  { id: "cr3", name: "Frost Royale Crate", tab: "crates", rarity: "Epic", price: 150, kind: "diamonds", img: "crate", hue: 200, tag: "NEW" },
  { id: "cr4", name: "Shadow Crate ×3", tab: "crates", rarity: "Rare", price: 99, kind: "diamonds", img: "crate", hue: 290 },
];

export const ROYALE_PRIZES = [
  { name: "250 Diamonds", kind: "diamonds" as CurrencyKind, amount: 250 },
  { name: "5,000 Gold", kind: "coins" as CurrencyKind, amount: 5000 },
  { name: "Crimson Voxel Bundle", kind: "diamonds" as CurrencyKind, amount: 0 },
  { name: "80 Diamonds", kind: "diamonds" as CurrencyKind, amount: 80 },
  { name: "2,400 Gold", kind: "coins" as CurrencyKind, amount: 2400 },
  { name: "Nebula Crystal Pack", kind: "coins" as CurrencyKind, amount: 0 },
];

export const MISSIONS = [
  { id: "m1", title: "Deal 2,000 damage in BR-Ranked", progress: 1450, goal: 2000, reward: 800 },
  { id: "m2", title: "Get 3 BOOYAHs with Spark equipped", progress: 3, goal: 3, reward: 1500 },
  { id: "m3", title: "Open 5 supply crates", progress: 2, goal: 5, reward: 600 },
  { id: "m4", title: "Travel 10,000m across Bermuda", progress: 7300, goal: 10000, reward: 950 },
];

export const EVENTS = [
  { id: "e1", title: "Voxel Rampage", desc: "Double XP on all ranked modes this weekend.", ends: "2d 14h" },
  { id: "e2", title: "Crate Rain Festival", desc: "Supply crates drop 2× loot on Craftland.", ends: "5d 03h" },
  { id: "e3", title: "Husky Derby", desc: "Race pets through the obstacle course for gems.", ends: "6d 19h" },
];

export const VAULT_ITEMS = [
  { id: "v1", name: "Crimson Hoodie", type: "Outfit", rarity: "Legendary", count: 1 },
  { id: "v2", name: "Pixel Backpack Lv.3", type: "Backpack", rarity: "Epic", count: 1 },
  { id: "v3", name: "Loot Crate Token", type: "Token", rarity: "Rare", count: 14 },
  { id: "v4", name: "Gold Rush Pan", type: "Melee", rarity: "Epic", count: 1 },
  { id: "v5", name: "Nebula Parachute", type: "Glider", rarity: "Legendary", count: 1 },
  { id: "v6", name: "XP Card 24h", type: "Boost", rarity: "Rare", count: 6 },
];

export interface PetInfo {
  id: string;
  name: string;
  breed: string;
  rarity: "Legendary" | "Epic" | "Rare";
  img: "bundle" | "crate" | "gem" | "avatar";
  hue: number;
  ability: string;
  desc: string;
  price: number;
  kind: CurrencyKind;
  /** Starts locked behind its price. */
  locked?: boolean;
}

export const PETS: PetInfo[] = [
  { id: "spark", name: "Spark", breed: "Voxel Husky", rarity: "Legendary", img: "avatar", hue: 0, ability: "Morale Boost", desc: "Wags his tail so hard the whole squad gains +10 morale.", price: 0, kind: "coins" },
  { id: "rex", name: "Rex", breed: "Block Shepherd", rarity: "Rare", img: "avatar", hue: 210, ability: "Loot Radar", desc: "Sniffs out supply crates within 40 metres.", price: 0, kind: "coins" },
  { id: "mochi", name: "Mochi", breed: "Pixel Corgi", rarity: "Epic", img: "avatar", hue: 300, ability: "Swift Paws", desc: "Squad movement speed +4% while equipped.", price: 0, kind: "coins" },
  { id: "blaze", name: "Blaze", breed: "Dragon Whelp", rarity: "Legendary", img: "crate", hue: 0, ability: "Napalm Guard", desc: "Roasts loot thieves that wander too close.", price: 1199, kind: "diamonds", locked: true },
  { id: "shadow", name: "Shadow", breed: "Panther Cub", rarity: "Epic", img: "bundle", hue: 220, ability: "Silent Stalk", desc: "Footsteps are 30% quieter while crouched.", price: 899, kind: "diamonds", locked: true },
  { id: "pixel", name: "Pixel", breed: "Robo Pup", rarity: "Rare", img: "gem", hue: 90, ability: "Scan Pulse", desc: "Pings nearby enemies on the minimap every 20s.", price: 3200, kind: "coins", locked: true },
];

export const FRIENDS = [
  { id: "f1", name: "PixelQueen", status: "In match", online: true },
  { id: "f2", name: "BlockSniper99", status: "Lobby", online: true },
  { id: "f3", name: "CraftyFox", status: "Lobby", online: true },
  { id: "f4", name: "NoScopeNina", status: "Offline", online: false },
];

export const MAILS = [
  { id: "ml1", title: "Daily login bonus", reward: 500, kind: "coins" as CurrencyKind },
  { id: "ml2", title: "Ranked season reward", reward: 120, kind: "diamonds" as CurrencyKind },
  { id: "ml3", title: "Guild activity chest", reward: 1500, kind: "coins" as CurrencyKind },
];

export const CHAT_FEED = [
  { user: "[World]", text: "٩(•̀ᴗ•́)و Team Invite — need 1 more for BR!" },
  { user: "[World]", text: "PixelQueen: that Crimson bundle is insane" },
  { user: "[Guild]", text: "BlockSniper99: Luck Royale in 5, join up" },
  { user: "[World]", text: "CraftyFox: selling Nebula parachute, DM me" },
  { user: "[World]", text: "NoScopeNina: BOOYAH streak x4, who's next?" },
];
