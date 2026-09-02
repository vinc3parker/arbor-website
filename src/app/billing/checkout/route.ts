import { NextRequest, NextResponse } from "next/server";
import { SITE_URL } from "@/lib/app-auth";

export const dynamic = "force-dynamic";

// Kept for back-compat (and app deep links): the checkout form is now the
// on-page embedded flow at /subscription/checkout. Preserve any app/state query.
export async function GET(req: NextRequest) {
  const { search } = new URL(req.url);
  return NextResponse.redirect(new URL(`/subscription/checkout${search}`, SITE_URL));
}
