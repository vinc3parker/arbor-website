export type SubscriptionTier = "free" | "beta_tester";

export const TIERS = {
  free: {
    id: "free" as const,
    name: "Account",
    price: "£0",
    cadence: "forever",
    tagline:
      "Keeps your Arbor account and data safe on Arbor Core, so nothing's lost — ready whenever you are.",
    features: [
      "Your Arbor profile and data stored safely on Arbor Core",
      "Nothing lost — pick up where you left off any time",
      "Early access announcements and updates",
    ],
    available: true,
  },
  beta_tester: {
    id: "beta_tester" as const,
    name: "Founding Access",
    price: "£2.50",
    cadence: "per month",
    tagline:
      "Unlocks the Arbor apps and helps sustainably run and grow the ecosystem — with founding-member status while Arbor is being built.",
    features: [
      "Full access to Aevo and Salus",
      "Every new Arbor app as it launches",
      "Connected AI features across the ecosystem",
      "Help shape Arbor as a founding member",
    ],
    available: true,
  },
} as const;
