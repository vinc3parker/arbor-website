import Stripe from "stripe";

// Server-only Stripe client. The secret key never reaches the browser.
const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.warn(
    "[stripe] STRIPE_SECRET_KEY not set — billing routes will fail until it is configured."
  );
}

// No pinned apiVersion: use the SDK's default so we don't fight the TS literal
// type across upgrades.
export const stripe = new Stripe(key ?? "sk_test_placeholder");

// The website's single paid tier — "Founding Access" — maps to the arbor_users
// tier name `beta_tester`. Set STRIPE_PRICE_FOUNDING_ACCESS to the recurring
// Price id from the Stripe dashboard.
export const FOUNDING_ACCESS_PRICE_ID =
  process.env.STRIPE_PRICE_FOUNDING_ACCESS ?? "";

/** Resolve a Stripe price id to the entitlement `plan` value Core returns. */
export function planForPrice(priceId: string | null | undefined): string | null {
  if (!priceId) return null;
  if (FOUNDING_ACCESS_PRICE_ID && priceId === FOUNDING_ACCESS_PRICE_ID)
    return "beta_tester";
  // Unknown price: store the raw id so nothing is silently lost.
  return priceId;
}
