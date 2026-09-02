import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { ArborCoreError, createPortal } from "@/lib/arbor-core";
import { SITE_URL, sanitizeState } from "@/lib/app-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /billing/portal?app=&state=
 * Thin wrapper: asks Arbor Core for a Stripe Billing Portal URL and redirects.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const app = searchParams.get("app") ?? undefined;
  const state = sanitizeState(searchParams.get("state")) ?? undefined;

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    const back = `/billing/portal?${searchParams.toString()}`;
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(back)}`, SITE_URL)
    );
  }

  try {
    const { url } = await createPortal(session.access_token, { app, state });
    return NextResponse.redirect(url);
  } catch (err) {
    const code = err instanceof ArborCoreError ? err.code : "error";
    return NextResponse.redirect(
      new URL(`/subscription?billing=${encodeURIComponent(code)}`, SITE_URL)
    );
  }
}
