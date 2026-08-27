"use server";

import { redirect } from "next/navigation";
import {
  ArborCoreError,
  authorize,
  consentStatusForApp,
  recordConsentBatch,
  type ConsentDecision,
} from "@/lib/arbor-core";
import { blockingConsents, optionalOffers } from "@/lib/app-consent";
import { buildCallbackUrl, isRegisteredApp } from "@/lib/app-auth";
import {
  clearPendingAuth,
  readPendingAuth,
} from "@/lib/pending-auth";

export type ConsentActionState = { error?: string };

/**
 * Record the person's consent decisions, then mint the one-time code and hand
 * the session back to the app.
 *
 * The client sends the set of accepted keys (checkbox values). We re-derive the
 * REQUIRED set from fresh status server-side — never trusting the client to have
 * gated correctly — and refuse to continue if any required consent is missing.
 */
export async function submitConsent(
  _prev: ConsentActionState,
  formData: FormData
): Promise<ConsentActionState> {
  const pending = await readPendingAuth();
  if (!pending || !isRegisteredApp(pending.app)) {
    // Nothing to consent to (expired/lost cookie) — start over.
    redirect("/app-auth");
  }

  let callbackUrl: string;
  try {
    const status = await consentStatusForApp(
      pending.session.accessToken,
      pending.app
    );
    const blocking = blockingConsents(status);
    const optional = optionalOffers(status);

    const accepted = new Set(
      formData.getAll("accepted").map((v) => String(v))
    );

    // Enforce every required consent, server-side.
    const missing = blocking.filter((c) => !accepted.has(c.key));
    if (missing.length > 0) {
      return { error: "Please accept the required items to continue." };
    }

    const decisions: ConsentDecision[] = [
      ...blocking.map((c) => ({
        key: c.key,
        accepted: true,
        version: c.version,
      })),
      ...optional.map((c) => ({
        key: c.key,
        accepted: accepted.has(c.key),
        version: c.version,
      })),
    ];

    if (decisions.length > 0) {
      await recordConsentBatch(pending.session.accessToken, decisions);
    }

    const { code } = await authorize(pending.session);
    callbackUrl = buildCallbackUrl(pending.app, {
      code,
      state: pending.state,
    });
  } catch (err) {
    return {
      error:
        err instanceof ArborCoreError
          ? err.message
          : "Something went wrong saving your choices. Please try again.",
    };
  }

  // Success: drop the pending-auth cookie and hand control back to the app.
  await clearPendingAuth();
  redirect(callbackUrl);
}

/**
 * The person declined to accept the required consents. We can't hand back a
 * session (Salus's data routes would reject it anyway), so we bounce back to the
 * app's callback with an error the app can act on, and clear the pending session.
 *
 * Takes FormData (unused) so it can be wired straight to a submit button's
 * formAction alongside submitConsent.
 */
export async function declineConsent(_formData: FormData): Promise<void> {
  const pending = await readPendingAuth();
  await clearPendingAuth();

  if (!pending || !isRegisteredApp(pending.app)) {
    redirect("/app-auth");
  }

  redirect(
    buildCallbackUrl(pending.app, {
      error: "consent_required",
      state: pending.state,
    })
  );
}
