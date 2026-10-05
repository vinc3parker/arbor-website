"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  BusinessApiError,
  checkExisting,
  geocodeAddress,
  getBusinessSession,
  inviteMember,
  removeMember,
  replaceSessions,
  searchMap,
  submitClaim,
  updateOrganisation,
  updatePlace,
  withdrawClaim,
  type ExistingListing,
  type MapPlace,
  type MemberRole,
  type TimetableSessionInput,
} from "@/lib/arbor-business";

export type FormState = { error?: string; message?: string };

const SIGNED_OUT = "Your session has ended. Sign in again to continue.";

function field(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

function failure(error: unknown, fallback: string): FormState {
  return { error: error instanceof BusinessApiError ? error.message : fallback };
}

/** Claim a listing that is already on the Arbor map. */
export async function claimListing(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await getBusinessSession();
  if (!session) return { error: SIGNED_OUT };
  const placeId = field(formData, "placeId");
  if (!placeId) return { error: "Choose the listing you run." };
  let approved = false;
  try {
    const claim = await submitClaim(session.token, {
      placeId,
      role: field(formData, "role") || undefined,
      contactPhone: field(formData, "contactPhone") || undefined,
      evidence: field(formData, "evidence") || undefined,
    });
    approved = claim.status === "approved";
  } catch (error) {
    return failure(error, "We couldn't send your claim. Please try again.");
  }
  revalidatePath("/business");
  return {
    message: approved
      ? "Your email matches this venue's website, so it's yours to manage now."
      : "Thanks. We'll check your claim; you'll see the decision on your business page.",
  };
}

export type LocationCheck = {
  error?: string;
  pin: { latitude: number; longitude: number } | null;
  matches: ExistingListing[];
  nearby: ExistingListing[];
};

/**
 * Step one of adding a business: find the address on the map and show what's
 * already there, so nobody adds a listing that exists.
 */
export async function checkLocation(input: {
  name: string;
  address: string;
  postcode: string;
  pin?: { latitude: number; longitude: number } | null;
}): Promise<LocationCheck> {
  const session = await getBusinessSession();
  if (!session) return { error: SIGNED_OUT, pin: null, matches: [], nearby: [] };
  const name = input.name.trim();
  const location = [input.address.trim(), input.postcode.trim()].filter(Boolean).join(", ");
  if (!name || !location) return { error: "Enter your business name and address.", pin: null, matches: [], nearby: [] };
  const pin = input.pin ?? await geocodeAddress(location);
  try {
    const found = await checkExisting(session.token, {
      name, location, latitude: pin?.latitude ?? null, longitude: pin?.longitude ?? null,
    });
    return { pin, ...found };
  } catch (error) {
    return { ...failure(error, "We couldn't check the map just now. Please try again."), pin, matches: [], nearby: [] };
  }
}

/** Ask to add a business that isn't on the map yet. */
export async function addBusiness(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await getBusinessSession();
  if (!session) return { error: SIGNED_OUT };
  const name = field(formData, "name");
  const address = field(formData, "address");
  const postcode = field(formData, "postcode");
  if (!name) return { error: "Enter your business name." };
  if (!address) return { error: "Enter the address where people find you." };
  const location = [address, postcode].filter(Boolean).join(", ");
  // Use the pin they placed on the map; fall back to looking the address up.
  const latitude = Number.parseFloat(field(formData, "latitude"));
  const longitude = Number.parseFloat(field(formData, "longitude"));
  const pin = Number.isFinite(latitude) && Number.isFinite(longitude)
    ? { latitude, longitude }
    : await geocodeAddress(location);
  try {
    await submitClaim(session.token, {
      business: {
        name,
        kind: field(formData, "kind") || "gym",
        location,
        latitude: pin?.latitude,
        longitude: pin?.longitude,
        website: field(formData, "website") || undefined,
        phone: field(formData, "phone") || undefined,
        description: field(formData, "description") || undefined,
        activities: formData.getAll("activities").map(String),
      },
      role: field(formData, "role") || undefined,
      evidence: field(formData, "evidence") || undefined,
    });
  } catch (error) {
    return failure(error, "We couldn't send your request. Please try again.");
  }
  revalidatePath("/business");
  redirect("/business?added=1");
}

export async function cancelClaim(claimId: string): Promise<FormState> {
  const session = await getBusinessSession();
  if (!session) return { error: SIGNED_OUT };
  try {
    await withdrawClaim(session.token, claimId);
  } catch (error) {
    return failure(error, "We couldn't withdraw that claim.");
  }
  revalidatePath("/business");
  return { message: "Claim withdrawn." };
}

export async function saveBusinessDetails(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await getBusinessSession();
  if (!session) return { error: SIGNED_OUT };
  const id = field(formData, "organisationId");
  try {
    await updateOrganisation(session.token, id, {
      name: field(formData, "name"),
      kind: field(formData, "kind"),
      website: field(formData, "website") || null,
      phone: field(formData, "phone") || null,
      description: field(formData, "description") || null,
    });
  } catch (error) {
    return failure(error, "We couldn't save your details.");
  }
  revalidatePath(`/business/${id}`);
  return { message: "Saved." };
}

export async function saveLocation(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await getBusinessSession();
  if (!session) return { error: SIGNED_OUT };
  const placeId = field(formData, "placeId");
  const organisationId = field(formData, "organisationId");
  const location = field(formData, "location");
  const previousLocation = field(formData, "previousLocation");
  const patch: Record<string, unknown> = {
    name: field(formData, "name"),
    location: location || null,
    website: field(formData, "website") || null,
    phone: field(formData, "phone") || null,
    activities: formData.getAll("activities").map(String),
  };
  // Move the map pin when the address changes.
  if (location && location !== previousLocation) {
    const pin = await geocodeAddress(location);
    if (pin) Object.assign(patch, pin);
  }
  try {
    await updatePlace(session.token, placeId, patch);
  } catch (error) {
    return failure(error, "We couldn't save this location.");
  }
  revalidatePath(`/business/${organisationId}`);
  return { message: "Saved." };
}

export async function saveTimetable(organisationId: string, sessions: TimetableSessionInput[]): Promise<FormState> {
  const session = await getBusinessSession();
  if (!session) return { error: SIGNED_OUT };
  try {
    const result = await replaceSessions(session.token, organisationId, sessions);
    revalidatePath(`/business/${organisationId}`);
    return {
      message: `Timetable published: ${result.published} weekly session${result.published === 1 ? "" : "s"}` +
        (result.retired ? `, ${result.retired} removed` : "") + ".",
    };
  } catch (error) {
    return failure(error, "We couldn't publish your timetable.");
  }
}

/** Find a venue on the map for a session held somewhere you don't run. */
export async function findVenues(query: string): Promise<MapPlace[]> {
  if (query.trim().length < 2) return [];
  try {
    return await searchMap(query.trim(), 8);
  } catch {
    return [];
  }
}

export async function addTeamMember(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await getBusinessSession();
  if (!session) return { error: SIGNED_OUT };
  const organisationId = field(formData, "organisationId");
  const email = field(formData, "email");
  const role = (field(formData, "role") || "editor") as MemberRole;
  try {
    await inviteMember(session.token, organisationId, { email, role });
  } catch (error) {
    return failure(error, "We couldn't add that person.");
  }
  revalidatePath(`/business/${organisationId}`);
  return { message: `Invited ${email}. They'll get access when they sign in to Arbor with that email.` };
}

export async function removeTeamMember(organisationId: string, memberId: string): Promise<FormState> {
  const session = await getBusinessSession();
  if (!session) return { error: SIGNED_OUT };
  try {
    await removeMember(session.token, organisationId, memberId);
  } catch (error) {
    return failure(error, "We couldn't remove that person.");
  }
  revalidatePath(`/business/${organisationId}`);
  return { message: "Removed." };
}
