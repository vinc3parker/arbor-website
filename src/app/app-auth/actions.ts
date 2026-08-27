"use server";

import { redirect } from "next/navigation";
import {
  ArborCoreError,
  authorize,
  checkEmail,
  consentStatusForApp,
  signin,
  signup,
} from "@/lib/arbor-core";
import { blockingConsents } from "@/lib/app-consent";
import { savePendingAuth } from "@/lib/pending-auth";
import { buildCallbackUrl, isRegisteredApp, sanitizeState } from "@/lib/app-auth";
import { parseArborProfileForm } from "@/lib/arbor-profile-fields";
import { upsertProfileWithAccessToken } from "@/lib/profile";

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
 * Step 2: authenticate (sign in or create), then run the consent gate before
 * handing the session back to the app.
 *
 * Flow after authentication:
 *   • Read the consent status for this app (account-level + the app's own).
 *   • If any REQUIRED consent still needs collecting, stash the session in a
 *     short-lived encrypted cookie and send the person to /app-auth/consent —
 *     the code is only minted once they've agreed.
 *   • Otherwise mint the one-time code and redirect straight back to the app,
 *     exactly as before.
 *
 * Only ever redirects to a registered app id — the redirect target is derived
 * from that id server-side, never from anything the caller supplied.
 */
export async function authenticate(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const app = String(formData.get("app") ?? "");
  if (!isRegisteredApp(app)) {
    return { error: "Unknown app. Please reopen this from your Arbor app." };
  }
  const state = sanitizeState(String(formData.get("state") ?? "")) ?? null;

  const mode = formData.get("mode") === "signup" ? "signup" : "signin";
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (mode === "signup") {
    const confirm = String(formData.get("confirm_password") ?? "");
    const parsed = parseArborProfileForm(formData);
    if (parsed.error !== null) {
      return { error: parsed.error };
    }
    if (password.length < 8) {
      return { error: "Password must be at least 8 characters." };
    }
    if (password !== confirm) {
      return { error: "Passwords don't match." };
    }
  } else if (!password) {
    return { error: "Please enter your password." };
  }

  // Where we end up: either the consent step, or straight back to the app.
  let destination: string;
  try {
    const session =
      mode === "signup"
        ? await signup(email, password)
        : await signin(email, password);

    if (mode === "signup") {
      const parsed = parseArborProfileForm(formData);
      if (parsed.error !== null) return { error: parsed.error };
      const { error: profileError } = await upsertProfileWithAccessToken(
        session.accessToken,
        session.user.id,
        session.user.email,
        parsed.profile
      );
      if (profileError) {
        return {
          error:
            "Your account was created, but we couldn't save your profile. Please sign in and try again from your profile page.",
        };
      }
    }

    // Fail closed: if we can't read consent status we do NOT proceed to mint a
    // code — better to ask the person to retry than to hand back a session that
    // skipped a required consent.
    const status = await consentStatusForApp(session.accessToken, app);
    const blocking = blockingConsents(status);

    if (blocking.length > 0) {
      await savePendingAuth({ session, app, state });
      destination = "/app-auth/consent";
    } else {
      const { code } = await authorize(session);
      destination = buildCallbackUrl(app, { code, state });
    }
  } catch (err) {
    return {
      error:
        err instanceof ArborCoreError
          ? err.message
          : "Something went wrong signing you in. Please try again.",
    };
  }

  // Outside the try/catch: redirect() works by throwing, which we must not
  // swallow. Hand control to the consent step or back to the app.
  redirect(destination);
}
