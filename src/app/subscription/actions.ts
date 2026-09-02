"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { ArborCoreError, startTrial, redeemCode, createCheckout } from "@/lib/arbor-core";

// The signed-in user's Core access token, from the website's Supabase session.
async function accessToken(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

export async function startTrialAction(): Promise<void> {
  const token = await accessToken();
  if (!token) redirect("/login?redirect=/subscription");

  let dest = "/subscription?trial=started";
  try {
    await startTrial(token!);
  } catch (err) {
    const code = err instanceof ArborCoreError ? err.code : "ERROR";
    dest = `/subscription?trial_error=${encodeURIComponent(code)}`;
  }
  redirect(dest); // outside try: redirect() throws by design
}

export async function redeemCodeAction(formData: FormData): Promise<void> {
  const token = await accessToken();
  if (!token) redirect("/login?redirect=/subscription");

  const code = String(formData.get("code") ?? "").trim();
  if (!code) redirect("/subscription?code_error=empty");

  let dest = "/subscription?code=redeemed";
  try {
    await redeemCode(token!, code);
  } catch (err) {
    const c = err instanceof ArborCoreError ? err.code : "ERROR";
    dest = `/subscription?code_error=${encodeURIComponent(c)}`;
  }
  redirect(dest);
}


/**
 * Server action used by the embedded Checkout form. Runs on the server so the
 * user's Core access token never reaches the browser. Returns the Checkout
 * Session client secret for Stripe.js to mount.
 */
export async function createCheckoutClientSecret(
  app?: string,
  state?: string
): Promise<string> {
  const token = await accessToken();
  if (!token) throw new Error("Not signed in");
  const { clientSecret } = await createCheckout(token, { app, state });
  return clientSecret;
}
