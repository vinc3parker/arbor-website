import "server-only";
import { cookies } from "next/headers";
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";
import type { ArborProfileFields } from "@/lib/arbor-profile-fields";

const COOKIE_NAME = "arbor_pending_signup_profile";
const MAX_AGE_SECONDS = 60 * 60 * 24;

export interface PendingSignupProfile {
  email: string;
  profile: ArborProfileFields;
}

function key(): Buffer {
  const secret = process.env.APP_AUTH_COOKIE_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "APP_AUTH_COOKIE_SECRET is not set - required to secure pending signup profiles."
      );
    }
    return scryptSync("dev-insecure-secret", "arbor-pending-signup-profile", 32);
  }
  return scryptSync(secret, "arbor-pending-signup-profile", 32);
}

function encrypt(value: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
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
    return null;
  }
}

export async function savePendingSignupProfile(
  pending: PendingSignupProfile
): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, encrypt(JSON.stringify(pending)), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function readPendingSignupProfile(): Promise<PendingSignupProfile | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  const json = decrypt(raw);
  if (!json) return null;
  try {
    return JSON.parse(json) as PendingSignupProfile;
  } catch {
    return null;
  }
}

export async function clearPendingSignupProfile(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
