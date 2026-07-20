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
  searchParams: Promise<{ app?: string; state?: string }>;
}) {
  const { app, state: rawState } = await searchParams;
  const state = sanitizeState(rawState);

  const shell = (children: React.ReactNode) => (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-8 py-32">
        {children}
        <p className="mt-8 text-center text-sm text-neutral-600">
          <Link href="/" className="transition hover:text-neutral-400">
            ← Back to home
          </Link>
        </p>
      </section>
      <Footer />
    </main>
  );

  if (!isRegisteredApp(app)) {
    return shell(
      <div className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-950 p-8 text-center md:p-10">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-500">
          SOMETHING&apos;S OFF
        </p>
        <h1 className="text-2xl font-semibold">Open this from an Arbor app.</h1>
        <p className="mt-3 text-sm leading-7 text-neutral-400">
          This sign-in page is launched by the Arbor apps. Open the app you want
          to sign in to and start from there — that way we know where to send you
          back.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
        >
          Sign in to the website instead
        </Link>
      </div>
    );
  }

  return shell(
    <AppAuthForm app={app} appName={appDisplayName(app)} state={state} />
  );
}
