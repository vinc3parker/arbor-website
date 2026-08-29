import type Stripe from "stripe";
import { stripe, planForPrice } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Maps Stripe's rich status set onto the five values the apps + Core understand.
export type ContractStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "none";

export function normaliseStatus(s: string): ContractStatus {
  switch (s) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
    case "incomplete_expired":
    case "paused":
      return "canceled";
    default:
      // incomplete, or anything unexpected — not entitled.
      return "none";
  }
}

// Mirror onto the arbor_users tier the website already reads. Constrained to
// 'free' | 'beta_tester', so paid-ish states collapse to beta_tester.
function tierForStatus(status: ContractStatus): "free" | "beta_tester" {
  return status === "active" || status === "trialing" || status === "past_due"
    ? "beta_tester"
    : "free";
}

function customerIdOf(sub: Stripe.Subscription): string | null {
  return typeof sub.customer === "string"
    ? sub.customer
    : sub.customer?.id ?? null;
}

// current_period_end moved onto subscription items in the Basil API era; read
// whichever place this account's API version populates.
function periodEndUnix(sub: Stripe.Subscription): number | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anySub = sub as any;
  if (typeof anySub.current_period_end === "number")
    return anySub.current_period_end;
  const item = anySub.items?.data?.[0];
  if (item && typeof item.current_period_end === "number")
    return item.current_period_end;
  return null;
}

/** Find the Arbor user id for a Stripe customer, via our table then metadata. */
export async function userIdForCustomer(cid: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", cid)
    .maybeSingle();
  if (data?.user_id) return data.user_id as string;

  try {
    const cust = await stripe.customers.retrieve(cid);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (cust && !(cust as any).deleted) {
      const m = (cust as Stripe.Customer).metadata?.arbor_user_id;
      return m || null;
    }
  } catch {
    // fall through
  }
  return null;
}

async function resolveUserId(sub: Stripe.Subscription): Promise<string | null> {
  const metaId = sub.metadata?.arbor_user_id;
  if (metaId) return metaId;
  const cid = customerIdOf(sub);
  return cid ? userIdForCustomer(cid) : null;
}

async function mirrorTier(userId: string, status: ContractStatus): Promise<void> {
  const { error } = await supabaseAdmin
    .from("arbor_users")
    .update({ subscription_tier: tierForStatus(status) })
    .eq("id", userId);
  if (error) console.error("[billing] arbor_users tier mirror failed:", error.message);
}

/**
 * Upsert public.subscriptions (source of truth) from a Stripe subscription and
 * mirror the arbor_users tier. Idempotent — safe to call for any relevant event.
 */
export async function syncSubscription(
  sub: Stripe.Subscription,
  userIdHint?: string | null
): Promise<void> {
  const userId = userIdHint ?? (await resolveUserId(sub));
  if (!userId) {
    console.error(
      "[billing] could not resolve arbor_user_id for subscription",
      sub.id
    );
    return;
  }

  const status = normaliseStatus(sub.status);
  const priceId = sub.items?.data?.[0]?.price?.id ?? null;
  const endUnix = periodEndUnix(sub);

  const row = {
    user_id: userId,
    stripe_customer_id: customerIdOf(sub),
    stripe_subscription_id: sub.id,
    status,
    source: "stripe",
    plan: status === "none" ? null : planForPrice(priceId),
    current_period_end: endUnix ? new Date(endUnix * 1000).toISOString() : null,
    cancel_at_period_end: Boolean(sub.cancel_at_period_end),
  };

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .upsert(row, { onConflict: "user_id" });
  if (error) {
    console.error("[billing] subscriptions upsert failed:", error.message);
    return;
  }
  await mirrorTier(userId, status);
}

/** Invoice events carry no subscription object — re-sync the customer's latest. */
export async function syncByCustomer(cid: string): Promise<void> {
  const uid = await userIdForCustomer(cid);
  const list = await stripe.subscriptions.list({
    customer: cid,
    status: "all",
    limit: 1,
  });
  const sub = list.data[0];
  if (!sub) {
    console.warn("[billing] no subscription found for customer", cid);
    return;
  }
  await syncSubscription(sub, uid);
}
