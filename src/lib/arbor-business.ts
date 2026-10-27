// Server-side client for the business portal (/business). Talks to Arbor Core's
// world ownership endpoints (/api/world/business, docs/world-ownership.md in
// Arbor Core) with the signed-in user's access token. Any Arbor account can use
// the portal; no subscription is needed.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

const ARBOR_CORE_URL = (process.env.ARBOR_CORE_URL ?? "http://localhost:4000").replace(/\/$/, "");

export class BusinessApiError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
    this.name = "BusinessApiError";
  }
}

/** World routes return plain JSON; errors are `{ error, message }` (or `{ error: { message } }` from auth). */
async function request<T>(path: string, init: RequestInit & { token?: string } = {}): Promise<T> {
  const { token, ...rest } = init;
  const headers = new Headers(rest.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (rest.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  let res: Response;
  try {
    res = await fetch(`${ARBOR_CORE_URL}${path}`, { ...rest, headers, cache: "no-store" });
  } catch {
    throw new BusinessApiError(502, "NETWORK", "Couldn't reach Arbor. Please try again.");
  }
  const body = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  if (!res.ok) {
    const error = body?.error;
    const message = typeof body?.message === "string"
      ? body.message
      : error && typeof error === "object" && "message" in error
        ? String((error as { message: unknown }).message)
        : "Something went wrong. Please try again.";
    throw new BusinessApiError(res.status, typeof error === "string" ? error : "ERROR", message);
  }
  return body as T;
}

// ── Session ──────────────────────────────────────────────────────────────────

export interface BusinessSession {
  token: string;
  userId: string;
  email: string | null;
}

/** The signed-in user and their access token, or null when signed out. */
export async function getBusinessSession(): Promise<BusinessSession | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return null;
  return { token: session.access_token, userId: user.id, email: user.email ?? null };
}

/** Like getBusinessSession, but sends signed-out visitors to sign in and come back. */
export async function requireBusinessSession(returnTo: string): Promise<BusinessSession> {
  const session = await getBusinessSession();
  if (!session) redirect(`/login?redirect=${encodeURIComponent(returnTo)}`);
  return session;
}

// ── Types (mirroring Arbor Core rows) ────────────────────────────────────────

export type MemberRole = "owner" | "admin" | "editor";

export interface Membership {
  id: string;
  organisationId: string;
  userId: string | null;
  invitedEmail: string | null;
  role: MemberRole;
  placeIds: string[] | null;
  status: "active" | "invited" | "revoked";
  createdAt: string;
}

export interface OrganisationRow {
  id: string;
  name: string;
  kind: string;
  location: string | null;
  website: string | null;
  phone: string | null;
  description: string | null;
  tags: string[];
  claimed_at: string | null;
}

export interface PlaceRow {
  id: string;
  name: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  website: string | null;
  phone: string | null;
  tags: string[];
  activities: string[];
  managed_at: string | null;
  /** OpenStreetMap opening_hours format, e.g. "Mo-Fr 06:00-22:00; Sa,Su 08:00-20:00". */
  opening_hours: string | null;
  instagram: string | null;
  /** Feature slugs: food.meals, amenity.beer_garden, activity.darts… */
  features: string[];
}

export interface SessionRow {
  id: string;
  title: string;
  kind: "class" | "training" | "open_session";
  activity_type: string | null;
  day_of_week: number;
  start_time: string;
  duration_minutes: number;
  place_id: string | null;
  instructor: string | null;
  level: string | null;
  price_text: string | null;
  booking_url: string | null;
  created_by: string | null;
}

export interface Business {
  membership: Membership;
  organisation: OrganisationRow;
  places: PlaceRow[];
  sessions: SessionRow[];
}

export interface Claim {
  id: string;
  kind: "claim" | "create";
  placeId: string | null;
  organisationId: string | null;
  proposed: { name?: string; location?: string | null };
  status: "pending" | "approved" | "rejected" | "withdrawn";
  verificationMethod: "email_domain" | "manual" | null;
  reviewNote: string | null;
  createdAt: string;
  place?: { id: string; name: string; location: string | null } | null;
}

export interface MapPlace {
  id: string;
  name: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  website: string | null;
  tags: string[];
  activities: string[];
  managedAt: string | null;
}

export interface TimetableSessionInput {
  title: string;
  kind: "class" | "training" | "open_session";
  activityType: string | null;
  dayOfWeek: number;
  startTime: string;
  durationMinutes: number;
  placeId: string | null;
  instructor: string | null;
  level: string | null;
  priceText: string | null;
  bookingUrl: string | null;
}

/** A club, team or class provider on the map, which may have no venue of its own. */
export interface MapOrganisation {
  id: string;
  name: string;
  kind: string;
  location: string | null;
  website: string | null;
  claimedAt: string | null;
}

export interface PlaceTypeGroup {
  label: string;
  types: Array<{ slug: string; label: string }>;
}

export interface FeatureGroup {
  kind: string;
  features: Array<{ slug: string; label: string }>;
}

// ── Calls ────────────────────────────────────────────────────────────────────

export async function listBusinesses(token: string): Promise<Business[]> {
  return (await request<{ businesses: Business[] }>("/api/world/business/organisations", { token })).businesses;
}

export async function listClaims(token: string): Promise<Claim[]> {
  return (await request<{ claims: Claim[] }>("/api/world/business/claims", { token })).claims;
}

export function submitClaim(token: string, body: Record<string, unknown>): Promise<Claim> {
  return request("/api/world/business/claims", { token, method: "POST", body: JSON.stringify(body) });
}

export function withdrawClaim(token: string, id: string): Promise<Claim> {
  return request(`/api/world/business/claims/${encodeURIComponent(id)}/withdraw`, { token, method: "POST" });
}

export function updateOrganisation(token: string, id: string, patch: Record<string, unknown>) {
  return request(`/api/world/business/organisations/${encodeURIComponent(id)}`, {
    token, method: "PATCH", body: JSON.stringify(patch),
  });
}

export function updatePlace(token: string, id: string, patch: Record<string, unknown>) {
  return request(`/api/world/business/places/${encodeURIComponent(id)}`, {
    token, method: "PATCH", body: JSON.stringify(patch),
  });
}

export function replaceSessions(token: string, organisationId: string, sessions: TimetableSessionInput[]) {
  return request<{ published: number; retired: number }>(
    `/api/world/business/organisations/${encodeURIComponent(organisationId)}/sessions`,
    { token, method: "PUT", body: JSON.stringify({ sessions }) },
  );
}

export async function listMembers(token: string, organisationId: string): Promise<Membership[]> {
  return (await request<{ members: Membership[] }>(
    `/api/world/business/organisations/${encodeURIComponent(organisationId)}/members`, { token },
  )).members;
}

export function inviteMember(token: string, organisationId: string, body: { email: string; role: MemberRole }) {
  return request<Membership>(`/api/world/business/organisations/${encodeURIComponent(organisationId)}/members`, {
    token, method: "POST", body: JSON.stringify(body),
  });
}

export function removeMember(token: string, organisationId: string, memberId: string) {
  return request(`/api/world/business/organisations/${encodeURIComponent(organisationId)}/members/${encodeURIComponent(memberId)}`, {
    token, method: "DELETE",
  });
}

/** Clubs, teams and class providers matching a name, for claiming. */
export async function searchOrganisations(query: string, limit = 10): Promise<MapOrganisation[]> {
  const params = new URLSearchParams({ q: query, limit: String(limit) });
  const rows = (await request<{ organisations: Array<Record<string, unknown>> }>(`/api/world/organisations?${params.toString()}`)).organisations;
  return rows.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    kind: String(row.kind ?? "club"),
    location: (row.location as string | null) ?? null,
    website: (row.website as string | null) ?? null,
    claimedAt: ((row.claimedAt ?? row.claimed_at) as string | null) ?? null,
  }));
}

/** The place types owners choose from (pub, gym, pottery studio…), grouped. */
export async function placeTypeGroups(): Promise<PlaceTypeGroup[]> {
  return (await request<{ groups: PlaceTypeGroup[] }>("/api/world/place-types")).groups;
}

/** The features owners tick (beer garden, sauna, darts…), grouped by kind. */
export async function featureGroups(): Promise<FeatureGroup[]> {
  return (await request<{ kinds: FeatureGroup[] }>("/api/world/features")).kinds;
}

/** Public map search, so people can find and claim their listing. */
export async function searchMap(query: string, limit = 20): Promise<MapPlace[]> {
  const params = new URLSearchParams({ q: query, limit: String(limit) });
  return (await request<{ places: MapPlace[] }>(`/api/world/places?${params.toString()}`)).places;
}

/** Public listings within `radiusMeters` of a point. */
export async function nearbyPlaces(latitude: number, longitude: number, radiusMeters = 1000, limit = 60): Promise<MapPlace[]> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    radiusMeters: String(radiusMeters),
    limit: String(limit),
  });
  return (await request<{ places: MapPlace[] }>(`/api/world/places?${params.toString()}`)).places;
}

export interface ExistingListing {
  id: string;
  name: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  website: string | null;
  activities: string[];
  managed: boolean;
  distanceMeters: number | null;
  /** Why it may be the same business; empty when it's just nearby. */
  reasons: string[];
}

/** Before adding a business: listings that may be it, and everything close by. */
export function checkExisting(
  token: string,
  input: { name: string; location: string; latitude: number | null; longitude: number | null },
): Promise<{ matches: ExistingListing[]; nearby: ExistingListing[] }> {
  const params = new URLSearchParams({ name: input.name, location: input.location });
  if (input.latitude != null && input.longitude != null) {
    params.set("lat", String(input.latitude));
    params.set("lng", String(input.longitude));
  }
  return request(`/api/world/business/check?${params.toString()}`, { token });
}

/** Address to map pin via OpenStreetMap Nominatim (best effort). */
export async function geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", address);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "Arbor-Business-Portal/0.1 (arborapps.co)" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as Array<{ lat?: string; lon?: string }>;
    const latitude = Number(rows[0]?.lat);
    const longitude = Number(rows[0]?.lon);
    return Number.isFinite(latitude) && Number.isFinite(longitude) ? { latitude, longitude } : null;
  } catch {
    return null;
  }
}
