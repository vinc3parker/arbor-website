import "server-only";
import { cookies } from "next/headers";
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";
import type { Session } from "@/lib/arbor-core";

// Holds the just-authenticated session between the auth step and the consent
// step of the hosted sign-in flow.
//
// The hosted flow deliberately keeps tokens off the client (see arbor-core.ts):
// the browser only ever sees an opaque one-time code. But the consent gate needs
// to run *after* authentication and *before* we mint that code — and rendering a
// consent form means a second request. So we stash the session server-side, in a
// short-lived, httpOnly, encrypted cookie:
//   • httpOnly    — client JS can never read the tokens.
//   • encrypted   — even if the cookie leaks, it's AES-256-GCM ciphertext.
//   • 10-min TTL  — long enough to read consent copy, short enough to be low-risk.
//   • cleared     — deleted the instant we redirect back to the app.
// This is a transient handoff cookie, not a website login session — it never
// authenticates anything on this site and is gone as soon as consent completes.

const COOKIE_NAME = "arbor_pending_auth";
const MAX_AGE_SECONDS = 600; // 10 minutes

export interface PendingAuth {
  session: Session;
  app: string;
  state: string | null;
}

/**
 * 32-byte key derived from APP_AUTH_COOKIE_SECRET. In production the secret is
 * required (we refuse to run the flow without it); in development we fall back
 * to a fixed dev key so local sign-in works, and warn loudly.
 */
function key(): Buffer {
  const secret = process.env.APP_AUTH_COOKIE_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "APP_AUTH_COOKIE_SECRET is not set — required to secure the consent step."
      );
    }
    console.warn(
      "[pending-auth] APP_AUTH_COOKIE_SECRET not set; using an insecure dev key. Set it before deploying."
    );
    return scryptSync("dev-insecure-secret", "arbor-pending-auth", 32);
  }
  return scryptSync(secret, "arbor-pending-auth", 32);
}

function encrypt(value: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // iv.tag.ciphertext, base64url — compact and cookie-safe.
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${enc.toString("base64url")}`;
}

function decrypt(token: string): string | null {
  try {
    const [ivB64, tagB64, dataB64] = token.split(".");
    if (!ivB64 || !tagB64 || !dataB64) return null;
    const decipher = createDecipheriv(
      "aes-256-gcm",
      key(),
      Buffer.from(ivB64, "base64url")
    );
    decipher.setAuthTag(Buffer.from(tagB64, "base64url"));
    const dec = Buffer.concat([
      decipher.update(Buffer.from(dataB64, "base64url")),
      decipher.final(),
    ]);
    return dec.toString("utf8");
  } catch {
    return null; // tampered, wrong key, or malformed — treat as no pending auth.
  }
}

/** Stash the pending session so the consent step can pick it up. */
export async function savePendingAuth(pending: PendingAuth): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, encrypt(JSON.stringify(pending)), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/app-auth",
    maxAge: MAX_AGE_SECONDS,
  });
}

/** Read the pending session, or null if absent / expired / tampered. */
export async function readPendingAuth(): Promise<PendingAuth | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  const json = decrypt(raw);
  if (!json) return null;
  try {
    return JSON.parse(json) as PendingAuth;
  } catch {
    return null;
  }
}

/** Delete the pending-auth cookie (call once the flow completes or aborts). */
export async function clearPendingAuth(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
