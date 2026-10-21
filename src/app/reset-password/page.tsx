import Link from "next/link";
import { ForgotPasswordForm, ResetPasswordForm } from "@/app/auth/PasswordRecoveryForm";
import { appDisplayName, isRegisteredApp, sanitizeState } from "@/lib/app-auth";

export const metadata = { title: "Reset your password — Arbor", robots: { index: false, follow: false } };

function signInPath(app?: string, state?: string) {
  if (!app) return "/login";
  const query = new URLSearchParams({ app });
  if (state) query.set("state", state);
  return `/app-auth?${query}`;
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ app?: string; state?: string; mode?: string; error?: string }>;
}) {
  const params = await searchParams;
  const app = isRegisteredApp(params.app) ? params.app : undefined;
  const state = sanitizeState(params.state) ?? undefined;
  const returnTo = signInPath(app, state);
  const isReset = params.mode === "update";

  return (
    <main className="min-h-screen bg-bg text-fg">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-8 py-24">
        <div className="w-full max-w-md ui-surface p-8 md:p-10">
          <p className="ui-kicker">{app ? appDisplayName(app) : "Arbor account"}</p>
          <h1 className="ui-title">{isReset ? "Choose a new password" : "Forgot your password?"}</h1>
          <p className="mt-3 text-sm leading-7 text-fg-2">
            {isReset
              ? "Choose a password with at least 8 characters."
              : "Enter your email and we’ll send you a link to reset your password."}
          </p>
          {params.error === "invalid" && (
            <p className="mt-4 text-sm text-danger" role="alert">
              This reset link is invalid or expired. Request a new link below.
            </p>
          )}
          {isReset ? (
            <ResetPasswordForm returnTo={returnTo} />
          ) : (
            <ForgotPasswordForm app={app} state={state} returnTo={returnTo} />
          )}
        </div>
        <p className="mt-8 text-center text-sm text-fg-3">
          <Link href="/" className="transition hover:text-fg">← Back to home</Link>
        </p>
      </section>
    </main>
  );
}
