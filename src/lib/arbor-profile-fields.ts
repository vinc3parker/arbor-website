export type ArborProfileFields = {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  region: string;
  postal_code: string;
  country: string;
};

export const GENDER_OPTIONS = [
  "Female",
  "Male",
  "Non-binary",
  "Prefer not to say",
] as const;

type ParseResult =
  | { profile: ArborProfileFields; error: null }
  | { profile: null; error: string };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function text(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

function validateText(
  value: string,
  label: string,
  maxLength: number
): string | null {
  if (!value) return `${label} is required.`;
  if (value.length > maxLength) return `${label} is too long.`;
  return null;
}

export function validateDateOfBirth(value: string): string | null {
  if (!value) return "Date of birth is required.";
  if (!DATE_RE.test(value)) {
    return "Date of birth must use YYYY-MM-DD format.";
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return "Please enter a valid date of birth.";
  }

  const today = new Date().toISOString().split("T")[0];
  if (value > today) return "Date of birth can't be in the future.";

  const age = new Date().getUTCFullYear() - year;
  if (age > 130) return "Please enter a valid date of birth.";

  return null;
}

export function parseArborProfileForm(formData: FormData): ParseResult {
  const profile: ArborProfileFields = {
    first_name: text(formData, "first_name"),
    last_name: text(formData, "last_name"),
    date_of_birth: text(formData, "date_of_birth"),
    gender: text(formData, "gender"),
    address_line1: text(formData, "address_line1"),
    address_line2: text(formData, "address_line2") || null,
    city: text(formData, "city"),
    region: text(formData, "region"),
    postal_code: text(formData, "postal_code"),
    country: text(formData, "country"),
  };

  const error =
    validateText(profile.first_name, "First name", 80) ??
    validateText(profile.last_name, "Last name", 80) ??
    validateDateOfBirth(profile.date_of_birth) ??
    validateText(profile.gender, "Gender", 80) ??
    validateText(profile.address_line1, "Address line 1", 160) ??
    (profile.address_line2 && profile.address_line2.length > 160
      ? "Address line 2 is too long."
      : null) ??
    validateText(profile.city, "City", 100) ??
    validateText(profile.region, "Region / county", 100) ??
    validateText(profile.postal_code, "Postcode", 32) ??
    validateText(profile.country, "Country", 80);

  if (error) return { profile: null, error };
  return { profile, error: null };
}
