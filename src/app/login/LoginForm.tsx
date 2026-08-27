"use client";

import { useActionState, useState } from "react";
import { GENDER_OPTIONS } from "@/lib/arbor-profile-fields";
import { login, signup, type AuthState } from "./actions";

const initialState: AuthState = {};
const inputClass =
  "rounded-2xl border border-neutral-800 bg-black px-5 py-3.5 outline-none transition focus:border-neutral-600";
const labelClass = "text-xs uppercase tracking-[0.2em] text-neutral-500";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const action = mode === "login" ? login : signup;
  const [state, formAction, pending] = useActionState(action, initialState);

  const mismatch =
    mode === "signup" &&
    confirmPassword.length > 0 &&
    password !== confirmPassword;
  const today = new Date().toISOString().split("T")[0];

  function toggleMode() {
    setMode(mode === "login" ? "signup" : "login");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div className={`w-full ${mode === "signup" ? "max-w-2xl" : "max-w-md"}`}>
      <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-8 md:p-10">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-500">
          {mode === "login" ? "WELCOME BACK" : "CREATE ACCOUNT"}
        </p>

        <h1 className="text-3xl font-semibold">
          {mode === "login" ? "Sign in to Arbor." : "Join Arbor."}
        </h1>

        <p className="mt-3 text-sm leading-7 text-neutral-400">
          {mode === "login"
            ? "Access your profile and manage your subscription."
            : "Create a free account to set up your profile and subscription."}
        </p>

        <form action={formAction} className="mt-8 flex flex-col gap-4">
          <input type="hidden" name="redirect" value={redirectTo} />

          <label className="flex flex-col gap-2">
            <span className={labelClass}>Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
            />
          </label>

          {mode === "signup" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>First name</span>
                  <input
                    name="first_name"
                    type="text"
                    required
                    maxLength={80}
                    autoComplete="given-name"
                    placeholder="First name"
                    className={inputClass}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Last name</span>
                  <input
                    name="last_name"
                    type="text"
                    required
                    maxLength={80}
                    autoComplete="family-name"
                    placeholder="Last name"
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Date of birth</span>
                  <input
                    name="date_of_birth"
                    type="date"
                    required
                    max={today}
                    autoComplete="bday"
                    className={`${inputClass} [color-scheme:dark]`}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Gender</span>
                  <select
                    name="gender"
                    required
                    defaultValue=""
                    autoComplete="sex"
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    {GENDER_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="flex flex-col gap-2">
                <span className={labelClass}>Address line 1</span>
                <input
                  name="address_line1"
                  type="text"
                  required
                  maxLength={160}
                  autoComplete="address-line1"
                  placeholder="Street address"
                  className={inputClass}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className={labelClass}>Address line 2</span>
                <input
                  name="address_line2"
                  type="text"
                  maxLength={160}
                  autoComplete="address-line2"
                  placeholder="Apartment, suite, unit"
                  className={inputClass}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>City</span>
                  <input
                    name="city"
                    type="text"
                    required
                    maxLength={100}
                    autoComplete="address-level2"
                    placeholder="City"
                    className={inputClass}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Region / county</span>
                  <input
                    name="region"
                    type="text"
                    required
                    maxLength={100}
                    autoComplete="address-level1"
                    placeholder="Region or county"
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Postcode</span>
                  <input
                    name="postal_code"
                    type="text"
                    required
                    maxLength={32}
                    autoComplete="postal-code"
                    placeholder="Postcode"
                    className={inputClass}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Country</span>
                  <input
                    name="country"
                    type="text"
                    required
                    maxLength={80}
                    autoComplete="country-name"
                    placeholder="Country"
                    className={inputClass}
                  />
                </label>
              </div>
            </>
          )}

          <label className="flex flex-col gap-2">
            <span className={labelClass}>Password</span>
            <input
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={mode === "signup" ? 8 : undefined}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              placeholder={
                mode === "signup" ? "At least 8 characters" : "Your password"
              }
              className={inputClass}
            />
          </label>

          {mode === "signup" && (
            <label className="flex flex-col gap-2">
              <span className={labelClass}>Confirm password</span>
              <input
                name="confirm_password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                aria-invalid={mismatch}
                className={`rounded-2xl border bg-black px-5 py-3.5 outline-none transition focus:border-neutral-600 ${
                  mismatch ? "border-red-500/70" : "border-neutral-800"
                }`}
              />
              {mismatch && (
                <span className="px-1 text-xs text-red-400">
                  Passwords don&apos;t match.
                </span>
              )}
            </label>
          )}

          {state.error && (
            <p className="px-1 text-sm text-red-400">{state.error}</p>
          )}
          {state.message && (
            <p className="px-1 text-sm text-emerald-400">{state.message}</p>
          )}

          <button
            type="submit"
            disabled={pending || mismatch}
            className="mt-2 rounded-full bg-white px-8 py-4 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-60"
          >
            {pending
              ? "Please wait…"
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-neutral-500">
          {mode === "login" ? "New to Arbor? " : "Already have an account? "}
          <button
            type="button"
            onClick={toggleMode}
            className="text-white underline underline-offset-4 transition hover:text-neutral-300"
          >
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
