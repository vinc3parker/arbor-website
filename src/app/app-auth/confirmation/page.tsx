import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { appDisplayName, isRegisteredApp, sanitizeState } from "@/lib/app-auth";

export const metadata = {
  title: "Check your email — Arbor",
  robots: { index: false, follow: false },
};

export default async function AppAuthConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ app?: string; state?: string }>;
}) {
  const { app, state: rawState } = await searchParams;
  const state = sanitizeState(rawState);
  const validApp = isRegisteredApp(app);
  const returnParams = new URLSearchParams();
  if (validApp) returnParams.set("app", app);
  if (state) returnParams.set("state", state);
  const returnTo = validApp ? `/app-auth?${returnParams}` : "/";

  return (
    <main className="min-h-screen bg-bg text-fg">
      <Navbar />
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-8 py-32">
        <div className="w-full max-w-md ui-surface p-8 text-center md:p-10" role="status">
          <p className="ui-kicker">Account created</p>
          <h1 className="ui-title">Check your email</h1>
          <p className="mt-3 text-sm leading-7 text-fg-2">
            Your details have been saved. We&apos;ve sent you a confirmation link —
            open it to activate your Arbor account.
          </p>
          <p className="mt-4 text-sm leading-7 text-emerald-600 dark:text-emerald-400">
            Check your inbox and spam folder, then return here to sign in.
          </p>
          <Link href={returnTo} className="mt-7 ui-primary">
            Return to sign in
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
