"use server";

import { redirect } from "next/navigation";
import {
  ArborCoreError,
  authorize,
  checkEmail,
  signin,
  signup,
} from "@/lib/arbor-core";
import { buildCallbackUrl, isRegisteredApp, sanitizeState } from "@/lib/app-auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type CheckState = { exists?: boolean; email?: string; error?: string };
export type AuthState = { error?: string };

/**
 * Step 1 of the email-first flow: does this person already have an Arbor
 * account? The client uses the answer to show "sign in" vs "create account",
 * so nobody accidentally ends up with a duplicate account.
 */
export async function checkEmailAction(
  _prev: CheckState,
  formData: FormData
): Promise<CheckState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  try {
    const { exists } = await checkEmail(email);
    return { exists, email };
  } catch (err) {
    return {
      error:
        err instanceof ArborCoreError
          ? err.message
          : "Couldn't check that email. Please try again.",
    };
  }
}

/**
 * Step 2: authenticate (sign in or create), mint a one-time code via Arbor
 * Core, then redirect the browser to the app's Universal Link callback. Only
 * ever redirects to a registered app id — the redirect target is derived from
 * that id server-side, never from anything the caller supplied directly.
 */
export async function authenticate(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const app = String(formData.get("app") ?? "");
  if (!isRegisteredApp(app)) {
    return { error: "Unknown app. Please reopen this from your Arbor app." };
  }
  const state = sanitizeState(String(formData.get("state") ?? "")) ?? undefined;

  const mode = formData.get("mode") === "signup" ? "signup" : "signin";
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (mode === "signup") {
    const confirm = String(formData.get("confirm_password") ?? "");
    if (password.length < 8) {
      return { error: "Password must be at least 8 characters." };
    }
    if (password !== confirm) {
      return { error: "Passwords don't match." };
    }
  } else if (!password) {
    return { error: "Please enter your password." };
  }

  let callbackUrl: string;
  try {
    const session =
      mode === "signup"
        ? await signup(email, password)
        : await signin(email, password);
    const { code } = await authorize(session);
    callbackUrl = buildCallbackUrl(app, { code, state });
  } catch (err) {
    return {
      error:
        err instanceof ArborCoreError
          ? err.message
          : "Something went wrong signing you in. Please try again.",
    };
  }

  // Outside the try/catch: redirect() works by throwing, which we must not
  // swallow. Hand control back to the app.
  redirect(callbackUrl);
}
