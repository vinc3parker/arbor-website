import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { stripe, FOUNDING_ACCESS_PRICE_ID } from "@/lib/stripe";
import { SITE_URL, sanitizeState } from "@/lib/app-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /billing/checkout?app=<appId>&state=<state>
 *
 * Opened from the subscription page (on-site) or from an app's in-browser
 * billing hand-off. Ensures the signed-in user has a Stripe customer linked by
 * arbor_user_id, then redirects to a Stripe Checkout Session for Founding Access.
 * `app`/`state` (if present) are threaded through to /billing/return so the app
 * can be handed back control after payment.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const app = searchParams.get("app");
  const state = sanitizeState(searchParams.get("state"));

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const back = `/billing/checkout?${searchParams.toString()}`;
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(back)}`, SITE_URL)
    );
  }

  if (!FOUNDING_ACCESS_PRICE_ID) {
    return NextResponse.redirect(new URL("/subscription?billing=unavailable", SITE_URL));
  }

  // Find or create the Stripe customer, tagged with the arbor user id so the
  // webhook can always map events back to a user.
  const { data: existing } = await supabaseAdmin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  let customerId = existing?.stripe_customer_id ?? null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { arbor_user_id: user.id },
    });
    customerId = customer.id;
    await supabaseAdmin
      .from("subscriptions")
      .upsert(
        { user_id: user.id, stripe_customer_id: customerId },
        { onConflict: "user_id" }
      );
  }

  const rq = new URLSearchParams();
  if (app) rq.set("app", app);
  if (state) rq.set("state", state);
  const q = rq.toString();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: user.id,
    line_items: [{ price: FOUNDING_ACCESS_PRICE_ID, quantity: 1 }],
    subscription_data: { metadata: { arbor_user_id: user.id } },
    allow_promotion_codes: true,
    success_url: `${SITE_URL}/billing/return?status=success${q ? `&${q}` : ""}`,
    cancel_url: `${SITE_URL}/subscription${q ? `?${q}` : ""}`,
  });

  if (!session.url) {
    return NextResponse.redirect(new URL("/subscription?billing=error", SITE_URL));
  }
  return NextResponse.redirect(session.url);
}
