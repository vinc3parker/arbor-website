// Server-side client for Arbor Core's auth API. The hosted sign-in flow at
// /app-auth authenticates through these endpoints (rather than the website's
// own Supabase server actions) for two reasons:
//   1. It reuses the exact account logic the apps already use — email
//      normalisation, duplicate-account prevention — so a person can never end
//      up with two accounts.
//   2. It never sets a website session cookie, keeping the app flow fully
//      separate from the normal on-site login.
//
// After authenticating we call /authorize to mint the one-time code that gets
// handed back to the app. The code store lives inside Arbor Core, so the app
// must redeem it there too (/exchange) — which is why minting has to happen
// against Core, not locally.
//
// Consent: after authenticating we also read/record consent against Core's
// authenticated /api/consent/* endpoints, using the freshly-minted access token
// as a Bearer credential (the consent routes are guarded by requireAuth). This
// is what lets the website capture the right consents for whichever app opened
// the flow before it hands the session back.

const ARBOR_CORE_URL = (
  process.env.ARBOR_CORE_URL ?? "http://localhost:4000"
).replace(/\/$/, "");

export interface Session {
  user: { id: string; email: string | null };
  accessToken: string;
  refreshToken: string;
  expiresAt: number | null;
}

export class ArborCoreError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ArborCoreError";
  }
}

/** Shared response envelope + error handling for every Core call. */
async function handle<T>(res: Response): Promise<T> {
  const json = (await res.json().catch(() => null)) as
    | { data?: T; error?: { code?: string; message?: string } }
    | null;

  if (!res.ok || json?.error) {
    throw new ArborCoreError(
      json?.error?.code ?? "AUTH_ERROR",
      json?.error?.message ?? "Something went wrong. Please try again.",
      res.status
    );
  }
  return json!.data as T;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${ARBOR_CORE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new ArborCoreError(
      "NETWORK",
      "Couldn't reach Arbor. Please try again.",
      502
    );
  }
  return handle<T>(res);
}

/** GET against Core with the user's access token as a Bearer credential. */
async function authedGet<T>(path: string, accessToken: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${ARBOR_CORE_URL}${path}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
  } catch {
    throw new ArborCoreError(
      "NETWORK",
      "Couldn't reach Arbor. Please try again.",
      502
    );
  }
  return handle<T>(res);
}

/** POST against Core with the user's access token as a Bearer credential. */
async function authedPost<T>(
  path: string,
  accessToken: string,
  body: unknown
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${ARBOR_CORE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new ArborCoreError(
      "NETWORK",
      "Couldn't reach Arbor. Please try again.",
      502
    );
  }
  return handle<T>(res);
}

/** Does an Arbor account already exist for this email? */
export function checkEmail(email: string): Promise<{ exists: boolean }> {
  return post("/api/auth/check-email", { email });
}

function toSession(d: {
  user: { id: string; email: string | null };
  session: { accessToken: string; refreshToken: string; expiresAt: number | null };
}): Session {
  return {
    user: d.user,
    accessToken: d.session.accessToken,
    refreshToken: d.session.refreshToken,
    expiresAt: d.session.expiresAt,
  };
}

export async function signin(email: string, password: string): Promise<Session> {
  return toSession(await post("/api/auth/signin", { email, password }));
}

export async function signup(email: string, password: string): Promise<Session> {
  return toSession(await post("/api/auth/signup", { email, password }));
}

/** Mint the one-time code the app will exchange for this session. */
export async function authorize(session: Session): Promise<{ code: string }> {
  return post("/api/auth/authorize", {
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    expiresAt: session.expiresAt,
  });
}

// ── Consent ────────────────────────────────────────────────────────────────

/**
 * Current consent stance for the signed-in user, mirrors Arbor Core's
 * ConsentStatus (src/modules/consent/consent.service.ts). `needsConsent` is the
 * flag the gate keys off: true when a required consent was never accepted, is
 * declined, or was accepted at an older version than the one now in force.
 */
export interface ConsentStatus {
  key: string;
  required: boolean;
  scope: "account" | "app";
  app: string | null;
  accepted: boolean | null;
  acceptedVersion: string | null;
  currentVersion: string | null;
  needsConsent: boolean;
  decidedAt: string | null;
}

export interface ConsentDecision {
  key: string;
  accepted: boolean;
  /** Policy version to stamp; omit to let Core default to the version in force. */
  version?: string | null;
}

/**
 * The consent stance relevant to one app: the shared account-level consents
 * plus that app's own consents (Core filters this for us via ?app=). This is
 * what makes the gate app-aware — Salus sees the Salus consents, Nura sees Nura's.
 */
export function consentStatusForApp(
  accessToken: string,
  app: string
): Promise<ConsentStatus[]> {
  return authedGet(
    `/api/consent/status?app=${encodeURIComponent(app)}`,
    accessToken
  );
}

/** Record several consent decisions at once (the sign-in consent gate). */
export function recordConsentBatch(
  accessToken: string,
  decisions: ConsentDecision[]
): Promise<{ ids: string[] }> {
  // Core rejects a decision whose key has no version in force, so drop any
  // decision we couldn't resolve a version for (e.g. an unversioned optional
  // consent) rather than failing the whole batch.
  const clean = decisions
    .filter((d) => d.version !== null)
    .map((d) => ({
      key: d.key,
      accepted: d.accepted,
      ...(d.version ? { version: d.version } : {}),
    }));
  return authedPost("/api/consent/batch", accessToken, { decisions: clean });
}
