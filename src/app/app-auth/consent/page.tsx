import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { appDisplayName, isRegisteredApp } from "@/lib/app-auth";
import { consentStatusForApp } from "@/lib/arbor-core";
import { blockingConsents, optionalOffers } from "@/lib/app-consent";
import { readPendingAuth } from "@/lib/pending-auth";
import { ConsentForm } from "./ConsentForm";

export const metadata = {
  title: "A few permissions — Arbor",
  robots: { index: false, follow: false },
};

// Reading the pending-auth cookie opts this route into dynamic rendering.
export const dynamic = "force-dynamic";

// Second step of the hosted sign-in flow. Reached only after authentication,
// and only when the app the person is signing in to still needs one or more
// required consents. The just-authenticated session is held in the encrypted
// pending-auth cookie; here we read the live consent status for that app and
// render the outstanding items.
export default async function ConsentPage() {
  const pending = await readPendingAuth();

  // No pending session (expired, cleared, or navigated here directly) — there's
  // nothing to consent to, so start the flow over.
  if (!pending || !isRegisteredApp(pending.app)) {
    redirect("/app-auth");
  }

  const appName = appDisplayName(pending.app);
  const status = await consentStatusForApp(
    pending.session.accessToken,
    pending.app
  );
  const blocking = blockingConsents(status);
  const optional = optionalOffers(status);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-8 py-32">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-8 md:p-10">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-500">
              {appName.toUpperCase()}
            </p>
            <h1 className="text-3xl font-semibold">
              Before you continue.
            </h1>
            <p className="mt-3 text-sm leading-7 text-neutral-400">
              A few permissions so {appName} can work the way it should. You can
              change these later in your Arbor profile.
            </p>

            <ConsentForm
              appName={appName}
              blocking={blocking}
              optional={optional}
            />
          </div>

          <p className="mt-8 text-center text-sm text-neutral-600">
            <Link href="/" className="transition hover:text-neutral-400">
              ← Back to home
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
