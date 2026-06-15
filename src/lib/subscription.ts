export type SubscriptionTier = "free" | "beta_tester";

export const TIERS = {
  free: {
    id: "free" as const,
    name: "Free",
    price: "£0",
    cadence: "forever",
    tagline: "Everything you need to explore the Arbor ecosystem.",
    features: [
      "Personal Arbor profile",
      "Access to all standalone Arbor apps",
      "Early access announcements and updates",
    ],
    available: true,
  },
  beta_tester: {
    id: "beta_tester" as const,
    name: "Founding Access",
    price: "TBC",
    cadence: "during development",
    tagline:
      "Unlocks the apps that connect to Arbor Core. Priced to sustainably run and improve the platform while the ecosystem is being developed.",
    features: [
      "Access to apps that require Arbor Core",
      "Connected AI features across the ecosystem",
      "Help shape Arbor while the ecosystem is being built",
    ],
    available: false,
  },
} as const;
