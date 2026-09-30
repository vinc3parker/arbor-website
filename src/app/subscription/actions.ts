"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { ArborCoreError, redeemCode } from "@/lib/arbor-core";
import { isRegisteredApp, sanitizeState } from "@/lib/app-auth";

// The signed-in user's Core access token, from the website's Supabase session.
async function accessToken(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

function query(params: Record<string, string | undefined | null>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) p.set(k, v);
  return p.toString();
}

/**
 * Redeem an access code instead of paying. Success goes to the subscription
 * page; a problem goes back to the code form with the reason.
 */
export async function redeemCodeAction(formData: FormData): Promise<void> {
  const rawApp = formData.get("app");
  const app = typeof rawApp === "string" && isRegisteredApp(rawApp) ? rawApp : null;
  const rawState = formData.get("state");
  const state = sanitizeState(typeof rawState === "string" ? rawState : undefined);
  const codeForm = (error: string) =>
    `/subscription/checkout?${query({ app, state, method: "code", code_error: error })}`;

  const token = await accessToken();
  if (!token) redirect(`/login?redirect=${encodeURIComponent(`/subscription/checkout?${query({ app, state, method: "code" })}`)}`);

  const code = String(formData.get("code") ?? "").trim();
  if (!code) redirect(codeForm("empty"));

  let dest = `/subscription?${query({ code: "redeemed", app, state })}`;
  try {
    await redeemCode(token!, code);
  } catch (err) {
    dest = codeForm(err instanceof ArborCoreError ? err.code : "ERROR");
  }
  redirect(dest);
}
