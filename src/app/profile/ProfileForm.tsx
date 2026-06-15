"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileState } from "./actions";

const initialState: ProfileState = {};

type Props = {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD or ""
};

const fieldClass =
  "rounded-2xl border border-neutral-800 bg-black px-5 py-3.5 outline-none transition focus:border-neutral-600";
const labelClass = "text-xs uppercase tracking-[0.2em] text-neutral-500";

export function ProfileForm({ firstName, lastName, dateOfBirth }: Props) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState
  );

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
          max={today}
          defaultValue={dateOfBirth}
          className={`${fieldClass} [color-scheme:dark]`}
        />
        <span className="px-1 text-xs text-neutral-600">
          Shared across Arbor apps to personalise your experience. Your age is
          calculated from this.
        </span>
      </label>

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
