"use client";

import { useActionState } from "react";
import { GENDER_OPTIONS } from "@/lib/arbor-profile-fields";
import { updateProfile, type ProfileState } from "./actions";

const initialState: ProfileState = {};

type Props = {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD or ""
  gender: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};

const fieldClass =
  "rounded-2xl border border-neutral-800 bg-black px-5 py-3.5 outline-none transition focus:border-neutral-600";
const labelClass = "text-xs uppercase tracking-[0.2em] text-neutral-500";

export function ProfileForm({
  firstName,
  lastName,
  dateOfBirth,
  gender,
  addressLine1,
  addressLine2,
  city,
  region,
  postalCode,
  country,
}: Props) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState
  );
  const genderOptions =
    gender && !GENDER_OPTIONS.includes(gender as (typeof GENDER_OPTIONS)[number])
      ? [gender, ...GENDER_OPTIONS]
      : GENDER_OPTIONS;

  // Latest birthdate allowed = today (no future dates).
  const today = new Date().toISOString().split("T")[0];

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={labelClass}>First name</span>
          <input
            name="first_name"
            type="text"
            required
            maxLength={80}
            defaultValue={firstName}
            autoComplete="given-name"
            placeholder="First name"
            className={fieldClass}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Last name</span>
          <input
            name="last_name"
            type="text"
            required
            maxLength={80}
            defaultValue={lastName}
            autoComplete="family-name"
            placeholder="Last name"
            className={fieldClass}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Date of birth</span>
        <input
          name="date_of_birth"
          type="date"
          required
          max={today}
          defaultValue={dateOfBirth}
          autoComplete="bday"
          className={`${fieldClass} [color-scheme:dark]`}
        />
        <span className="px-1 text-xs text-neutral-600">
          Shared across Arbor apps to personalise your experience. Your age is
          calculated from this.
        </span>
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Gender</span>
        <select
          name="gender"
          required
          defaultValue={gender}
          autoComplete="sex"
          className={fieldClass}
        >
          <option value="" disabled>
            Select gender
          </option>
          {genderOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Address line 1</span>
        <input
          name="address_line1"
          type="text"
          required
          maxLength={160}
          defaultValue={addressLine1}
          autoComplete="address-line1"
          placeholder="Street address"
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Address line 2</span>
        <input
          name="address_line2"
          type="text"
          maxLength={160}
          defaultValue={addressLine2}
          autoComplete="address-line2"
          placeholder="Apartment, suite, unit"
          className={fieldClass}
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={labelClass}>City</span>
          <input
            name="city"
            type="text"
            required
            maxLength={100}
            defaultValue={city}
            autoComplete="address-level2"
            placeholder="City"
            className={fieldClass}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Region / county</span>
          <input
            name="region"
            type="text"
            required
            maxLength={100}
            defaultValue={region}
            autoComplete="address-level1"
            placeholder="Region or county"
            className={fieldClass}
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Postcode</span>
          <input
            name="postal_code"
            type="text"
            required
            maxLength={32}
            defaultValue={postalCode}
            autoComplete="postal-code"
            placeholder="Postcode"
            className={fieldClass}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>Country</span>
          <input
            name="country"
            type="text"
            required
            maxLength={80}
            defaultValue={country}
            autoComplete="country-name"
            placeholder="Country"
            className={fieldClass}
          />
        </label>
      </div>

      {state.error && (
        <p className="px-1 text-sm text-red-400">{state.error}</p>
      )}
      {state.message && (
        <p className="px-1 text-sm text-emerald-400">{state.message}</p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
