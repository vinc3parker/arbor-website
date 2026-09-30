// The eight specialist apps as the brand guide defines them: guide titles (2.7),
// domains (1.6), colour pairs (5.9), dark-mode colour rules (5.11) and the
// one line per app (3.7). Change these here, not in individual pages.

export type AppId =
  | "aevo"
  | "salus"
  | "thrive"
  | "nura"
  | "wend"
  | "kith"
  | "telos"
  | "sage";

export interface AppBrand {
  id: AppId;
  name: string;
  /** Guide title, used as "Aevo, your coach". */
  title: string;
  /** The domain of life it covers. */
  domain: string;
  /** One-line description of the domain (1.6). */
  domainLine: string;
  /** Lead and partner colours. The lead leads; neither is a background. */
  lead: string;
  partner: string;
  /**
   * The colour that represents the app on Ink (dark mode). Light leads keep
   * their lead; Wend, Telos and Sage swap to their light partner (5.11).
   */
  onInk: string;
  /** Text colour for small text on Ink. Thrive red is large-only (4.0:1). */
  textOnInk: string;
  /** Legible text colour on top of an `onInk` fill. */
  inkOnFill: string;
  /** What it does (3.7). */
  line: string;
  /** "…not just your X" (3.7). */
  notJust: string;
  icon: string;
}

const PAPER = "#F6F5F2";
const INK = "#0A0A0A";

export const APP_BRANDS: Record<AppId, AppBrand> = {
  aevo: {
    id: "aevo",
    name: "Aevo",
    title: "coach",
    domain: "Health",
    domainLine: "Your body: movement, sleep, food and energy.",
    lead: "#D4FF00",
    partner: "#00D1FF",
    onInk: "#D4FF00",
    textOnInk: "#D4FF00",
    inkOnFill: INK,
    line: "Your coach for training, recovery and a body ready for anything.",
    notJust: "your workouts",
    icon: "/brand/arbor_aevo_icon_full_512.png",
  },
  salus: {
    id: "salus",
    name: "Salus",
    title: "companion",
    domain: "Mind",
    domainLine: "Your inner world: stress, mood, rest and resilience.",
    lead: "#6FD6C9",
    partner: "#68D0FB",
    onInk: "#6FD6C9",
    textOnInk: "#6FD6C9",
    inkOnFill: INK,
    line: "Understand your thoughts and handle the life you are living.",
    notJust: "your mood",
    icon: "/brand/arbor_salus_icon_full_512.png",
  },
  thrive: {
    id: "thrive",
    name: "Thrive",
    title: "assistant",
    domain: "Organisation",
    domainLine: "How you run your days: time, plans and routines.",
    lead: "#DC143C",
    partner: "#334155",
    onInk: "#DC143C",
    textOnInk: PAPER,
    inkOnFill: PAPER,
    line: "Your time, habits and routines, shaped around who you want to be.",
    notJust: "your calendar",
    icon: "/brand/arbor_thrive_icon_full_512.png",
  },
  nura: {
    id: "nura",
    name: "Nura",
    // "Manager" until Arbor is FCA-authorised; never "adviser" before then.
    title: "money manager",
    domain: "Money",
    domainLine: "Your finances: spending, saving and planning ahead.",
    lead: "#FF6B5B",
    partner: "#0D3B3E",
    onInk: "#FF6B5B",
    textOnInk: "#FF6B5B",
    inkOnFill: INK,
    line: "See how your money is doing and make it work for the life you want.",
    notJust: "your spending",
    icon: "/brand/arbor_nura_icon_full_512.png",
  },
  wend: {
    id: "wend",
    name: "Wend",
    title: "explorer",
    domain: "Experiences",
    domainLine: "Your free time: discovery, travel, hobbies and adventure.",
    lead: "#5A321E",
    partner: "#F4E7D0",
    onInk: "#F4E7D0",
    textOnInk: "#F4E7D0",
    inkOnFill: INK,
    line: "Make the most of your free time, from holidays to nights in.",
    notJust: "your weekends",
    icon: "/brand/arbor_wend_icon_full_512.png",
  },
  kith: {
    id: "kith",
    name: "Kith",
    title: "connector",
    domain: "Relationships",
    domainLine: "Your people: friends, family, partners and community.",
    lead: "#EB729A",
    partner: "#7AD7C4",
    onInk: "#EB729A",
    textOnInk: "#EB729A",
    inkOnFill: INK,
    line: "Stay close to your people and meet new ones you will click with.",
    notJust: "your contacts",
    icon: "/brand/arbor_kith_icon_full_512.png",
  },
  telos: {
    id: "telos",
    name: "Telos",
    title: "mentor",
    domain: "Purpose",
    domainLine: "What drives you: career, meaningful work and direction.",
    lead: "#0C375C",
    partner: "#F9F6EC",
    onInk: "#F9F6EC",
    textOnInk: "#F9F6EC",
    inkOnFill: INK,
    line: "Find purpose in your work and build a career that feels like yours.",
    notJust: "your job",
    icon: "/brand/arbor_telos_icon_full_512.png",
  },
  sage: {
    id: "sage",
    name: "Sage",
    title: "tutor",
    domain: "Growth",
    domainLine: "Who you're becoming: learning, skills and self-knowledge.",
    lead: "#3A2036",
    partner: "#DCE8DB",
    onInk: "#DCE8DB",
    textOnInk: "#DCE8DB",
    inkOnFill: INK,
    line: "Learn what you need to grow, from courses to new curiosities.",
    notJust: "your studies",
    icon: "/brand/arbor_sage_icon_full_512.png",
  },
};

/** Guide order used across the brand: Health → Growth. */
export const APP_ORDER: AppId[] = [
  "aevo",
  "salus",
  "thrive",
  "nura",
  "wend",
  "kith",
  "telos",
  "sage",
];

export function appBrand(name: string): AppBrand | undefined {
  return APP_BRANDS[name.toLowerCase() as AppId];
}

/** "Built on Arbor, so it understands the whole of you, not just your X." */
export function builtOnArbor(app: AppBrand): string {
  return `Built on Arbor, so it understands the whole of you, not just ${app.notJust}.`;
}
