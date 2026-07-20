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
