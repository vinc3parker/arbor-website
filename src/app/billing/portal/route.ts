import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { stripe } from "@/lib/stripe";
import { SITE_URL, sanitizeState } from "@/lib/app-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /billing/portal?app=<appId>&state=<state>
 *
 * Sends the signed-in user to the Stripe Billing Portal to update or cancel
 * their subscription. On return they land on /billing/return, which hands
 * control back to the app (if opened from one) so entitlement re-syncs at once.
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
    const back = `/billing/portal?${searchParams.toString()}`;
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(back)}`, SITE_URL)
    );
  }

  const { data: row } = await supabaseAdmin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!row?.stripe_customer_id) {
    // No customer yet — nothing to manage; send them to the plans page.
    return NextResponse.redirect(new URL("/subscription", SITE_URL));
  }

  const rq = new URLSearchParams();
  if (app) rq.set("app", app);
  if (state) rq.set("state", state);
  const q = rq.toString();

  const portal = await stripe.billingPortal.sessions.create({
    customer: row.stripe_customer_id,
    return_url: `${SITE_URL}/billing/return?status=managed${q ? `&${q}` : ""}`,
  });

  return NextResponse.redirect(portal.url);
}
