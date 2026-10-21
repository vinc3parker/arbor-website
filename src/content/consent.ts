// Human-facing consent copy for the hosted sign-in gate.
//
// Arbor Core owns the *catalogue* (keys, required flags, versions); this file
// owns the *wording the person reads* on the website, keyed by the same consent
// key. Keep the sentiment in step with the actual ToS / Privacy / AI-processing
// text those versions point at. Any key not listed here falls back to the plain
// description Core returns, so a newly-added consent still renders — it just
// won't have the nicer copy until you add it below.

export interface ConsentLink {
  label: string;
  href: string;
}

export interface ConsentCopy {
  /** Short label shown as the checkbox heading. */
  title: string;
  /** One or two sentences of plain-language explanation. */
  body: string;
  /** Optional policy links (e.g. Terms, Privacy). */
  links?: ConsentLink[];
}

// TODO(vince): point these at the real published policy pages. They're
// env-overridable so staging/prod can differ; defaults assume /terms and
// /privacy routes on this site (create them, or change these).
const TERMS_URL = process.env.NEXT_PUBLIC_TERMS_URL ?? "/terms";
const PRIVACY_URL = process.env.NEXT_PUBLIC_PRIVACY_URL ?? "/privacy";

export const CONSENT_COPY: Record<string, ConsentCopy> = {
  // ── Account-level (collected once, shared across every Arbor app) ──────────
  arbor_core: {
    title: "Terms of Service & Privacy Policy",
    body: "Agree to the Arbor account Terms of Service and Privacy Policy. This covers your Arbor account across every Arbor app.",
    links: [
      { label: "Terms of Service", href: TERMS_URL },
      { label: "Privacy Policy", href: PRIVACY_URL },
    ],
  },
  age_18plus: {
    title: "I'm 18 or older",
    body: "Confirm you're at least 18. Arbor accounts are for adults only.",
  },
  arbor_connected: {
    title: "Connect my life to Arbor",
    body: "Let every Arbor app share what it learns with Arbor, so each guide can help with your whole life, including how you've been feeling and your health. You can see, remove or lock anything, any time, in \"What Arbor knows\".",
  },
  // Account-level so one yes covers every app, but asked in an app when the
  // person turns on sleep sharing (alongside the Apple Health permission), not
  // on this gate — see IN_APP_ONLY_CONSENTS in lib/app-consent.ts.
  arbor_rhythm_data: {
    title: "Share my sleep across Arbor",
    body: "Optional. Let Arbor use when you fell asleep and woke up, from Apple Health or Garmin, so your apps can plan around how you actually slept. This is health data. You can turn it off any time in the app, and remove it in \"What Arbor knows\".",
  },
  marketing: {
    title: "Product & occasional updates",
    body: "Optional. Get occasional emails about new features and Arbor apps. You can turn this off any time in your account.",
  },

  // ── Salus ──────────────────────────────────────────────────────────────────
  salus_sensitive_data: {
    title: "Processing your wellbeing data",
    body: "Salus works with sensitive wellbeing data — your journals, moods, and reflections — to give you a private space to reflect. Required to use Salus.",
  },
  salus_ai_processing: {
    title: "AI reflections & insights",
    body: "Let Salus use AI to generate reflections and insights from your entries. Required for Salus's AI features.",
  },
  salus_neurodivergence_data: {
    title: "Personalise from your neurodivergence reflections",
    body: "Optional. Let Salus learn from the neurodivergence quiz to personalise support. This signal is also added to your shared Arbor model.",
  },

  // ── Other apps' AI processing (interaction layer) ──────────────────────────
  thrive_ai_processing: {
    title: "Your assistant uses AI",
    body: "Thrive uses AI to turn what you tell it into tasks, plan your day and suggest routines. Only what's needed for each request leaves your device, and it's never used to train AI. Required for Thrive's assistant.",
  },
  aevo_ai_processing: {
    title: "AI coaching for Aevo",
    body: "Let Aevo use AI to interpret your training and shape your plan. Required for Aevo's AI features.",
  },
  aevo_health_metrics: {
    title: "Processing your health metrics",
    body: "Optional. Let Aevo process your health and training metrics to tailor your plan.",
  },
  nura_ai_processing: {
    title: "AI coaching for Nura",
    body: "Let Nura use AI to interpret your finances and offer guidance. Required for Nura's AI features.",
  },
  nura_finance_processing: {
    title: "Processing your financial data",
    body: "Optional. Let Nura process your financial data to give you a clearer picture of your money.",
  },
  kith_ai_processing: {
    title: "AI for Kith",
    body: "Let Kith use AI to interpret and support your connections. Required for Kith's AI features.",
  },
  purpose_ai_processing: {
    title: "AI coaching for Telos",
    body: "Let Telos use AI to interpret your goals and coach your direction. Required for Telos's AI features.",
  },
  adventure_ai_processing: {
    title: "AI for Wend",
    body: "Let Wend use AI to shape and personalise your exploration. Required for Wend's AI features.",
  },
  growth_ai_processing: {
    title: "AI for Sage",
    body: "Let Sage use AI to interpret and support your learning. Required for Sage's AI features.",
  },
};

/** Key of the consent that gets its own "Connect your life to Arbor" screen. */
export const CONNECT_CONSENT_KEY = "arbor_connected";

// Screen 2 of the account consent flow (brand guide 8.2 / 8.3). The explanation
// is the 8.2 wording word for word — don't paraphrase it.
export const CONNECT_SCREEN = {
  heading: "Arbor works best when it understands the whole of you.",
  explanation: [
    "Each Arbor app learns from what you share with it.",
    "Arbor brings that together, so every guide understands the whole of you.",
    "You can see and remove anything Arbor has learned, any time.",
  ],
  whatThisMeans: [
    "What one app learns can help the others. A packed week in Thrive can mean a lighter session in Aevo.",
    "This can include how you've been feeling and your health, so we ask for your clear yes.",
    "Some things stay in the app where you shared them. You'll see a lock on those in \"What Arbor knows\".",
    "Guides never act in another app without your yes.",
    "Arbor never sells what it learns and never uses it for adverts.",
  ],
  button: "Connect my life to Arbor",
  // Shown first to people who joined before arbor_connected existed.
  reask: {
    heading: "One thing before you carry on",
    body: "Arbor now asks for a separate yes to connecting your apps, so it's clear what's shared between your guides.",
  },
};

/** Copy for a consent key, falling back to Core's plain description. */
export function consentCopy(key: string, fallbackDescription: string): ConsentCopy {
  return CONSENT_COPY[key] ?? { title: prettyKey(key), body: fallbackDescription };
}

/** Last-resort title for an unmapped key: 'salus_ai_processing' → 'Salus ai processing'. */
function prettyKey(key: string): string {
  const s = key.replace(/_/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}
