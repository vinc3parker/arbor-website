import { apps } from "@/content/apps";

// Registry of Arbor apps that are allowed to use the hosted (browser) sign-in
// flow at /app-auth. This is the security allowlist: /app-auth will only ever
// redirect a signed-in user back to an app id that appears here, so the route
// can never be turned into an open redirector that leaks auth codes.
//
// Ids are the canonical app slugs — the same keys used throughout the site
// (see src/content/apps.ts), so there is a single source of truth.
export const APP_IDS = Object.keys(apps) as (keyof typeof apps)[];

export type AppId = (typeof APP_IDS)[number];

export function isRegisteredApp(id: string | undefined | null): id is AppId {
  return typeof id === "string" && (APP_IDS as string[]).includes(id);
}

export function appDisplayName(id: AppId): string {
  return apps[id].name;
}

export function appCallbackPath(app: AppId): string {
  return `/app/${app}/callback`;
}

// Canonical public origin of the website. The Universal Link callback must live
// on this exact origin for iOS/Android to hand the URL to the installed app.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://arborapps.co"
).replace(/\/$/, "");

/**
 * The Universal Link the browser is redirected to after a successful hosted
 * sign-in. On a device with the app installed the OS intercepts this URL and
 * opens the app directly; otherwise the /app/[app]/callback page loads as a
 * normal web page (the fallback). Only callback handoff values travel here
 * (`code`, `state`, or `error`) — never real tokens.
 */
export function buildCallbackUrl(
  app: AppId,
  params: { code?: string | null; state?: string | null; error?: string | null }
): string {
  const url = new URL(`${SITE_URL}${appCallbackPath(app)}`);
  if (params.code) url.searchParams.set("code", params.code);
  if (params.state) url.searchParams.set("state", params.state);
  if (params.error) url.searchParams.set("error", params.error);
  return url.toString();
}

// Custom URL scheme each app registers with the OS. The hosted flow's warm path
// relies on this: the callback page bounces the in-app auth session to
// `<scheme>://auth-callback?code=…&state=…`, which iOS ASWebAuthenticationSession
// / Android Custom Tabs capture to hand control back to the app. (Universal
// Links don't fire from inside that in-app browser, so we can't use the https
// callback for the return.) Derived server-side from the registered app id —
// never from caller input — so it can't be turned into an open redirector.
const APP_SCHEMES: Partial<Record<AppId, string>> = {
  aevo: "aevo",
  thrive: "thrive",
  salus: "salus",
  nura: "nura",
  wend: "wend",
  sage: "sage",
  telos: "telos",
  kith: "kith",
};

export function appScheme(app: AppId): string | null {
  return APP_SCHEMES[app] ?? null;
}

/**
 * The custom-scheme deep link the app's auth session watches for. Only handoff
 * values travel here (`code`, `state`, `error`) — never real tokens. Returns
 * null for apps without a registered scheme; those fall back to the https
 * callback page.
 */
export function buildAppReturnUrl(
  app: AppId,
  params: { code?: string | null; state?: string | null; error?: string | null }
): string | null {
  const scheme = appScheme(app);
  if (!scheme) return null;
  const qs = new URLSearchParams();
  if (params.code) qs.set("code", params.code);
  if (params.state) qs.set("state", params.state);
  if (params.error) qs.set("error", params.error);
  const query = qs.toString();
  return `${scheme}://auth-callback${query ? `?${query}` : ""}`;
}

// `state` is opaque and echoed back untouched; we only guard against abuse
// (absurd lengths / control chars) rather than imposing a format.
export function sanitizeState(raw: string | undefined | null): string | null {
  if (typeof raw !== "string") return null;
  const s = raw.trim();
  if (!s || s.length > 512) return null;
  return /^[A-Za-z0-9._~-]+$/.test(s) ? s : null;
}
