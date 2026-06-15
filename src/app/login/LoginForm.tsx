"use client";

import { useActionState, useState } from "react";
import { login, signup, type AuthState } from "./actions";

const initialState: AuthState = {};

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

  function toggleMode() {
    setMode(mode === "login" ? "signup" : "login");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="w-full max-w-md">
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
            <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Email
            </span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="rounded-2xl border border-neutral-800 bg-black px-5 py-3.5 outline-none transition focus:border-neutral-600"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Password
            </span>
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
              className="rounded-2xl border border-neutral-800 bg-black px-5 py-3.5 outline-none transition focus:border-neutral-600"
            />
          </label>

          {mode === "signup" && (
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                Confirm password
              </span>
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
