// How paying for Arbor works:
//
// - An Arbor account holds your details with Arbor (Arbor Core). It isn't a
//   plan and doesn't unlock the apps — it keeps your information safe for when
//   you subscribe, or after a subscription ends.
// - Using the apps needs a live subscription: one subscription, every app.
// - The first 100 subscribers are founding members and pay only what it costs
//   to run their account. After that, the standard price applies. Arbor Core
//   decides which price someone gets (GET /api/billing/offer, and at checkout).
// - An access code can stand in for paying.

/** Legacy column on arbor_users; entitlement now comes from Arbor Core. */
export type SubscriptionTier = "free" | "beta_tester";

export type PaidPlan = "founder" | "standard";

export const PLANS: Record<
  PaidPlan,
  { name: string; price: string; cadence: string; summary: string }
> = {
  founder: {
    name: "Founding member",
    price: "£4",
    cadence: "per month",
    summary:
      "For Arbor’s first 100 members, Arbor costs only what it takes to run your account.",
  },
  standard: {
    name: "Arbor",
    price: "£9.99",
    cadence: "per month",
    summary: "One subscription for every Arbor app.",
  },
};

/** What a subscription includes, whichever price applies. */
export const SUBSCRIPTION_INCLUDES = [
  "Every Arbor app, each with its own guide",
  "Guides that learn from each other across your apps",
  "Every new Arbor app as it opens",
];

/** The state of having an account but no subscription. */
export const ACCOUNT_ONLY = {
  name: "Arbor account",
  summary:
    "Your details are kept safe with Arbor, ready for whenever you subscribe. To use the apps, you need a subscription.",
};

/** Subscription statuses (from Arbor Core) that give access to the apps. */
export function hasAccess(status: string): boolean {
  return status === "active" || status === "trialing" || status === "past_due";
}

/** Friendly name for the plan Core reports. */
export function planName(plan: string | null): string {
  if (plan === "founder") return PLANS.founder.name;
  if (plan === "standard") return PLANS.standard.name;
  return "Arbor subscription";
}
