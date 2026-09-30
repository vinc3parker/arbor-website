import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { appDisplayName, isRegisteredApp, sanitizeState } from "@/lib/app-auth";
import { AppAuthForm } from "./AppAuthForm";

export const metadata = {
  title: "Sign in to your app — Arbor",
  robots: { index: false, follow: false },
};

// Hosted (browser) sign-in for the Arbor apps. Unlike /login this route only
// works when it was opened *by an app* — it needs a registered `app` id to know
// where to send the person back. With no valid app it refuses rather than
// behaving like a normal login, because there would be nowhere to redirect to.
export default async function AppAuthPage({
  searchParams,
}: {
  searchParams: Promise<{ app?: string; state?: string; intent?: string }>;
}) {
  const { app, state: rawState, intent: rawIntent } = await searchParams;
  const state = sanitizeState(rawState);
  // Frames the copy only; the real sign-in-vs-create branch is decided by the
  // email check, so an existing email can never be turned into a duplicate.
  const intent = rawIntent === "signup" ? "signup" : undefined;

  const shell = (children: React.ReactNode) => (
    <main className="min-h-screen bg-bg text-fg">
      <Navbar />
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-8 py-32">
        {children}
        <p className="mt-8 text-center text-sm text-fg-3">
          <Link href="/" className="transition hover:text-fg">
            ← Back to home
          </Link>
        </p>
      </section>
      <Footer />
    </main>
  );

  if (!isRegisteredApp(app)) {
    return shell(
      <div className="w-full max-w-md ui-surface p-8 text-center md:p-10">
        <p className="ui-kicker">
          SOMETHING&apos;S OFF
        </p>
        <h1 className="text-2xl font-semibold">Open this from an Arbor app.</h1>
        <p className="mt-3 text-sm leading-7 text-fg-2">
          This sign-in page is launched by the Arbor apps. Open the app you want
          to sign in to and start from there — that way we know where to send you
          back.
        </p>
        <Link
          href="/login"
          className="mt-6 ui-primary"
        >
          Sign in to the website instead
        </Link>
      </div>
    );
  }

  return shell(
    <AppAuthForm
      app={app}
      appName={appDisplayName(app)}
      state={state}
      intent={intent}
    />
  );
}
