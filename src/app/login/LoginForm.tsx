"use client";

import { useActionState, useState } from "react";
import { GENDER_OPTIONS } from "@/lib/arbor-profile-fields";
import { login, signup, type AuthState } from "./actions";

const initialState: AuthState = {};
const inputClass =
  "ui-field";
const labelClass = "ui-label";

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
      <div className="ui-surface p-6 sm:p-8">
        <p className="ui-kicker">
          {mode === "login" ? "Welcome back" : "Create account"}
        </p>

        <h1 className="ui-title">
          {mode === "login" ? "Sign in" : "Join Arbor"}
        </h1>

        <p className="mt-2 text-sm leading-6 text-fg-2">
          {mode === "login"
            ? "Your account and subscription."
            : "One account for every Arbor app."}
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
                    className={inputClass}
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
                className={`ui-field ${
                  mismatch ? "border-danger" : "border-line"
                }`}
              />
              {mismatch && (
                <span className="px-1 text-sm text-danger">
                  Passwords don&apos;t match.
                </span>
              )}
            </label>
          )}

          {state.error && (
            <p className="px-1 text-sm text-danger">{state.error}</p>
          )}
          {state.message && (
            <p className="px-1 text-sm text-success">{state.message}</p>
          )}

          <button
            type="submit"
            disabled={pending || mismatch}
            className="ui-primary mt-2 w-full"
          >
            {pending
              ? "Please wait…"
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-fg-3">
          {mode === "login" ? "New to Arbor? " : "Already have an account? "}
          <button
            type="button"
            onClick={toggleMode}
            className="text-fg underline underline-offset-4 transition hover:text-fg"
          >
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
