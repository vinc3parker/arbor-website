"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { ArborCoreError, redeemCode } from "@/lib/arbor-core";

// The signed-in user's Core access token, from the website's Supabase session.
async function accessToken(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
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
