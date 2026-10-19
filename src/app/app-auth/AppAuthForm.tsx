"use client";

import { useActionState, useState } from "react";
import {
  authenticate,
  checkEmailAction,
  resendConfirmationAction,
  type AuthState,
  type CheckState,
} from "./actions";
import { GENDER_OPTIONS } from "@/lib/arbor-profile-fields";
import { ForgotPasswordForm } from "@/app/auth/PasswordRecoveryForm";

const inputClass =
  "ui-field";
const labelClass = "ui-label";

export function AppAuthForm({
  app,
  appName,
  state,
  intent,
}: {
  app: string;
  appName: string;
  state: string | null;
  intent?: "signup";
}) {
  // Step 1 — email. The answer decides sign-in vs create-account.
  const [emailInput, setEmailInput] = useState("");
  const [forgot, setForgot] = useState(false);
  const [check, checkFormAction, checking] = useActionState<CheckState, FormData>(
    checkEmailAction,
    {}
  );

  const known = check.exists !== undefined && check.email;
  const mode = check.exists ? "signin" : "signup";
  const returnParams = new URLSearchParams({ app });
  if (state) returnParams.set("state", state);
  const returnTo = `/app-auth?${returnParams}`;

  if (!known) {
    if (forgot) {
      return (
        <div className="w-full max-w-md">
          <div className="ui-surface p-8 md:p-10">
            <p className="ui-kicker">{appName}</p>
            <h1 className="ui-title">Forgot your password?</h1>
            <p className="mt-3 text-sm leading-7 text-fg-2">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
            <ForgotPasswordForm
              email={emailInput}
              app={app}
              state={state ?? undefined}
              returnTo={returnTo}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-md">
        <div className="ui-surface p-8 md:p-10">
          <p className="ui-kicker">
            {appName}
          </p>
          <h1 className="ui-title">
            {intent === "signup"
              ? "Create your Arbor account."
              : "Sign in or create your account."}
          </h1>
          <p className="mt-3 text-sm leading-7 text-fg-2">
            Enter your email to continue to {appName}. We&apos;ll sign you in, or
            help you create an account if you&apos;re new. One Arbor account works
            across every Arbor app.
          </p>

          <form action={checkFormAction} className="mt-8 flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className={labelClass}>Email</span>
              <input
                name="email"
                type="email"
                required
                autoFocus
                autoComplete="email"
                value={emailInput}
                onChange={(event) => setEmailInput(event.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </label>

            {check.error && (
              <p className="px-1 text-sm text-danger">{check.error}</p>
            )}

            <button
              type="submit"
              disabled={checking}
              className="mt-2 ui-primary"
            >
              {checking ? "Please wait…" : "Continue"}
            </button>
          </form>
          <button
            type="button"
            onClick={() => setForgot(true)}
            className="mt-5 text-sm text-fg-3 underline underline-offset-4 transition hover:text-fg"
          >
            Forgot password?
          </button>
        </div>
      </div>
    );
  }

  return (
    <PasswordStep
      app={app}
      appName={appName}
      state={state}
      email={check.email!}
      mode={mode}
    />
  );
}

function PasswordStep({
  app,
  appName,
  state,
  email,
  mode,
}: {
  app: string;
  appName: string;
  state: string | null;
  email: string;
  mode: "signin" | "signup";
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [forgot, setForgot] = useState(false);
  const [authState, formAction, pending] = useActionState<AuthState, FormData>(
    authenticate,
    {}
  );
  const [resendState, resendAction, resending] = useActionState<AuthState, FormData>(
    resendConfirmationAction,
    {}
  );

  const mismatch =
    mode === "signup" && confirm.length > 0 && password !== confirm;
  const returnParams = new URLSearchParams({ app });
  if (state) returnParams.set("state", state);
  const returnTo = `/app-auth?${returnParams}`;
  const today = new Date().toISOString().split("T")[0];

  if (authState.confirmationRequired) {
    return (
      <div className="w-full max-w-md">
        <div className="ui-surface p-8 md:p-10" role="status">
          <p className="ui-kicker">{appName}</p>
          <h1 className="ui-title">Check your email</h1>
          <p className="mt-3 text-sm leading-7 text-fg-2">
            We sent a confirmation link to {authState.confirmationEmail}. Open it
            to confirm your email, then return here and sign in to continue to
            {` ${appName}`}.
          </p>
          <a href={returnTo} className="mt-6 inline-block text-sm underline underline-offset-4">
            Return to sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${mode === "signup" ? "max-w-2xl" : "max-w-md"}`}>
      <div className="ui-surface p-8 md:p-10">
        <p className="ui-kicker">
          {mode === "signin" ? "Welcome back" : "Join Arbor"}
        </p>
        <h1 className="ui-title">
          {mode === "signin"
            ? `Sign in to ${appName}.`
            : `Create your Arbor account.`}
        </h1>
        <p className="mt-3 flex items-center gap-2 text-sm text-fg-2">
          <span className="truncate">{email}</span>
          {/* Reloading the route clears the in-memory email step. */}
          <a
            href="/app-auth"
            className="shrink-0 text-fg-3 underline underline-offset-4 transition hover:text-fg"
          >
            change
          </a>
        </p>

        {forgot ? (
          <ForgotPasswordForm
            email={email}
            app={app}
            state={state ?? undefined}
            returnTo={returnTo}
          />
        ) : (
          <form action={formAction} className="mt-8 flex flex-col gap-4">
          <input type="hidden" name="app" value={app} />
          <input type="hidden" name="mode" value={mode} />
          <input type="hidden" name="email" value={email} />
          {state && <input type="hidden" name="state" value={state} />}

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
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={mode === "signup" ? 8 : undefined}
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              placeholder={
                mode === "signup" ? "At least 8 characters" : "Your password"
              }
              className={inputClass}
            />
          </label>

          {mode === "signin" && (
            <button
              type="button"
              onClick={() => setForgot(true)}
              className="self-start text-sm text-fg underline underline-offset-4 transition hover:text-fg-2"
            >
              Forgot password?
            </button>
          )}

          {mode === "signup" && (
            <label className="flex flex-col gap-2">
              <span className={labelClass}>Confirm password</span>
              <input
                name="confirm_password"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                aria-invalid={mismatch}
                className={`rounded-2xl border bg-bg px-5 py-3.5 outline-none transition focus:border-fg-3 ${
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

          <button
            type="submit"
            disabled={pending || mismatch}
            className="mt-2 ui-primary"
          >
            {pending
              ? "Please wait…"
              : mode === "signin"
                ? `Sign in to ${appName}`
                : "Create account"}
          </button>
          </form>
        )}
        {authState.error && (
          <p className="mt-4 px-1 text-sm text-danger">{authState.error}</p>
        )}
        {authState.resendAvailable && mode === "signin" && (
          <div className="mt-4 flex flex-col gap-3">
            <form action={resendAction}>
              <input type="hidden" name="app" value={app} />
              <input type="hidden" name="email" value={email} />
              {state && <input type="hidden" name="state" value={state} />}
              <button type="submit" disabled={resending} className="text-sm underline underline-offset-4">
                {resending ? "Sending…" : "Resend confirmation email"}
              </button>
            </form>
            {resendState.confirmationSent && (
              <p className="text-sm text-fg-2" role="status">
                If this account needs confirmation, a new email is on its way.
              </p>
            )}
            {resendState.error && <p className="text-sm text-danger">{resendState.error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
