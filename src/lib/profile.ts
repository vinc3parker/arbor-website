import type { SupabaseClient } from "@supabase/supabase-js";
import type { SubscriptionTier } from "@/lib/subscription";

// Canonical shared user record, stored in public.arbor_users and used across
// every Arbor app.
export type ArborUser = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null; // ISO date string (YYYY-MM-DD)
  subscription_tier: SubscriptionTier;
};

const EMPTY = (userId: string): ArborUser => ({
  id: userId,
  email: null,
  first_name: null,
  last_name: null,
  date_of_birth: null,
  subscription_tier: "free",
});

// Fetches the user's arbor_users row. Returns sensible empty defaults if the
// row doesn't exist yet, so the UI never breaks.
export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<ArborUser> {
  try {
    const { data, error } = await supabase
      .from("arbor_users")
      .select(
        "id, email, first_name, last_name, date_of_birth, subscription_tier"
      )
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) {
      return EMPTY(userId);
    }

    return {
      id: data.id,
      email: data.email ?? null,
      first_name: data.first_name ?? null,
      last_name: data.last_name ?? null,
      date_of_birth: data.date_of_birth ?? null,
      subscription_tier:
        (data.subscription_tier as SubscriptionTier) ?? "free",
    };
  } catch {
    return EMPTY(userId);
  }
}

// Derives age in whole years from an ISO date-of-birth string.
export function calculateAge(dob: string | null): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;

  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age >= 0 && age < 130 ? age : null;
}

// Full name from the two name parts, if present.
export function fullNameFor(user: ArborUser): string | null {
  const name = [user.first_name, user.last_name]
    .map((p) => p?.trim())
    .filter(Boolean)
    .join(" ");
  return name || null;
}

// Best label to greet/display a user by.
export function displayNameFor(
  user: ArborUser,
  fallbackEmail?: string | null
): string {
  return (
    user.first_name?.trim() ||
    fullNameFor(user) ||
    fallbackEmail?.split("@")[0] ||
    "there"
  );
}
