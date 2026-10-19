"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset, updatePassword, type PasswordActionState } from "./password-actions";

const initialState: PasswordActionState = {};
const inputClass = "ui-field";
const labelClass = "ui-label";

export function ForgotPasswordForm({
  email = "",
  app,
  state,
  returnTo,
}: {
  email?: string;
  app?: string;
  state?: string;
  returnTo: string;
}) {
  const [result, formAction, pending] = useActionState(requestPasswordReset, initialState);
  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      {app && <input type="hidden" name="app" value={app} />}
      {state && <input type="hidden" name="state" value={state} />}
      <label className="flex flex-col gap-2">
        <span className={labelClass}>Email</span>
        <input name="email" type="email" required autoComplete="email" defaultValue={email} placeholder="you@example.com" className={inputClass} />
      </label>
      {result.error && <p className="px-1 text-sm text-danger" role="alert">{result.error}</p>}
      {result.message && <p className="px-1 text-sm text-success" role="status">{result.message}</p>}
      <button type="submit" disabled={pending} className="ui-primary w-full">
        {pending ? "Please wait…" : "Send reset link"}
      </button>
      <Link href={returnTo} className="text-center text-sm text-fg-3 underline underline-offset-4 hover:text-fg">Back to sign in</Link>
    </form>
  );
}

export function ResetPasswordForm({ returnTo }: { returnTo: string }) {
  const [result, formAction, pending] = useActionState(updatePassword, initialState);
  return (
    <form action={formAction} className="mt-8 flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className={labelClass}>New password</span>
        <input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
      </label>
      <label className="flex flex-col gap-2">
        <span className={labelClass}>Confirm new password</span>
        <input name="confirm_password" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
      </label>
      {result.error && <p className="px-1 text-sm text-danger" role="alert">{result.error}</p>}
      {result.message && <p className="px-1 text-sm text-success" role="status">{result.message}</p>}
      {result.message ? (
        <Link href={returnTo} className="ui-primary w-full">Back to sign in</Link>
      ) : (
        <button type="submit" disabled={pending} className="ui-primary w-full">
          {pending ? "Please wait…" : "Update password"}
        </button>
      )}
    </form>
  );
}
