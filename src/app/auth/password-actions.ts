"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase-server";
import { isRegisteredApp, sanitizeState } from "@/lib/app-auth";

export type PasswordActionState = { error?: string; message?: string };

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function requestPasswordReset(
  _prevState: PasswordActionState,
  formData: FormData
): Promise<PasswordActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const app = String(formData.get("app") ?? "");
  const state = sanitizeState(String(formData.get("state") ?? ""));

  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const recoveryPath = new URLSearchParams();
  recoveryPath.set("mode", "update");
  if (isRegisteredApp(app)) recoveryPath.set("app", app);
  if (state) recoveryPath.set("state", state);
  const next = `/reset-password${recoveryPath.size ? `?${recoveryPath}` : ""}`;
  const requestHeaders = await headers();
  const origin =
    requestHeaders.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";
  if (!origin) {
    return { error: "We couldn't send a reset email. Please try again." };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(next)}`,
  });

  if (error) {
    return { error: "We couldn't send a reset email. Please try again." };
  }

  // Keep the response the same whether or not the email belongs to an account.
  return { message: "If an account uses that email, a password reset link is on its way." };
}

export async function updatePassword(
  _prevState: PasswordActionState,
  formData: FormData
): Promise<PasswordActionState> {
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirm_password") ?? "");
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirmation) {
    return { error: "Passwords don't match." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: "This reset link is invalid or has expired. Request a new one." };
  }
  return { message: "Your password has been updated. You can now sign in." };
}
