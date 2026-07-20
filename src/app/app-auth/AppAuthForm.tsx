"use client";

import { useActionState, useState } from "react";
import {
  authenticate,
  checkEmailAction,
  type AuthState,
  type CheckState,
} from "./actions";

const inputClass =
  "rounded-2xl border border-neutral-800 bg-black px-5 py-3.5 outline-none transition focus:border-neutral-600";
const labelClass = "text-xs uppercase tracking-[0.2em] text-neutral-500";

export function AppAuthForm({
  app,
  appName,
  state,
}: {
  app: string;
  appName: string;
  state: string | null;
}) {
  // Step 1 — email. The answer decides sign-in vs create-account.
  const [check, checkFormAction, checking] = useActionState<CheckState, FormData>(
    checkEmailAction,
    {}
  );

  const known = check.exists !== undefined && check.email;
  const mode = check.exists ? "signin" : "signup";

  if (!known) {
    return (
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-8 md:p-10">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-500">
            {appName.toUpperCase()}
          </p>
          <h1 className="text-3xl font-semibold">Sign in to continue.</h1>
          <p className="mt-3 text-sm leading-7 text-neutral-400">
            Use your Arbor account to sign in to {appName}. One account works
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
                placeholder="you@example.com"
                className={inputClass}
              />
            </label>

            {check.error && (
              <p className="px-1 text-sm text-red-400">{check.error}</p>
            )}

            <button
              type="submit"
              disabled={checking}
              className="mt-2 rounded-full bg-white px-8 py-4 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-60"
            >
              {checking ? "Please wait…" : "Continue"}
            </button>
          </form>
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
  const [authState, formAction, pending] = useActionState<AuthState, FormData>(
    authenticate,
    {}
  );

  const mismatch =
    mode === "signup" && confirm.length > 0 && password !== confirm;

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-8 md:p-10">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-500">
          {mode === "signin" ? "WELCOME BACK" : `JOIN ARBOR`}
        </p>
        <h1 className="text-3xl font-semibold">
          {mode === "signin"
            ? `Sign in to ${appName}.`
            : `Create your Arbor account.`}
        </h1>
        <p className="mt-3 flex items-center gap-2 text-sm text-neutral-400">
          <span className="truncate">{email}</span>
          {/* Reloading the route clears the in-memory email step. */}
          <a
            href="/app-auth"
            className="shrink-0 text-neutral-500 underline underline-offset-4 transition hover:text-neutral-300"
          >
            change
          </a>
        </p>

        <form action={formAction} className="mt-8 flex flex-col gap-4">
          <input type="hidden" name="app" value={app} />
          <input type="hidden" name="mode" value={mode} />
          <input type="hidden" name="email" value={email} />
          {state && <input type="hidden" name="state" value={state} />}

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

          {authState.error && (
            <p className="px-1 text-sm text-red-400">{authState.error}</p>
          )}

          <button
            type="submit"
            disabled={pending || mismatch}
            className="mt-2 rounded-full bg-white px-8 py-4 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-60"
          >
            {pending
              ? "Please wait…"
              : mode === "signin"
                ? `Sign in to ${appName}`
                : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
