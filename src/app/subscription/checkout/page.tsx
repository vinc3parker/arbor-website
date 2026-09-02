import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase-server";
import { ArborCoreError, createCheckout, fetchEntitlement } from "@/lib/arbor-core";
import { isRegisteredApp, sanitizeState } from "@/lib/app-auth";
import { EmbeddedCheckoutForm } from "./EmbeddedCheckoutForm";
import { redeemCodeAction } from "../actions";

export const metadata = {
  title: "Checkout — Arbor",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type SearchParams = { [k: string]: string | string[] | undefined };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/subscription/checkout");

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token ?? null;
  if (!token) redirect("/login?redirect=/subscription/checkout");

  // Already on a paid subscription? Nothing to buy. (redirect outside try/catch.)
  let alreadyPaid = false;
  try {
    const view = await fetchEntitlement(token);
    const st = view.entitlement.status;
    alreadyPaid = view.source === "stripe" && (st === "active" || st === "trialing");
  } catch {
    // ignore — let them proceed to checkout
  }
  if (alreadyPaid) redirect("/subscription?billing=active");

  const sp = await searchParams;
  const appRaw = typeof sp.app === "string" ? sp.app : undefined;
  const app = appRaw && isRegisteredApp(appRaw) ? appRaw : undefined;
  const state = sanitizeState(typeof sp.state === "string" ? sp.state : undefined) ?? undefined;

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  // Create the Checkout Session server-side so failures are visible, not blank.
  let clientSecret: string | null = null;
  let errorMsg: string | null = null;
  if (!publishableKey) {
    errorMsg =
      "Payments aren’t set up on the website yet — NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing.";
  } else {
    try {
      const result = await createCheckout(token, { app, state });
      clientSecret = result.clientSecret;
    } catch (err) {
      errorMsg =
        err instanceof ArborCoreError
          ? `Couldn’t start checkout: ${err.message}`
          : "Couldn’t reach the billing service. Please try again.";
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="mx-auto max-w-2xl px-6 pb-24 pt-40 sm:px-8">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-neutral-500">
          FOUNDING ACCESS
        </p>
        <h1 className="text-3xl font-semibold md:text-4xl">
          Complete your subscription
        </h1>
        <p className="mt-4 text-neutral-400">Payment is handled securely by Stripe.</p>

        {clientSecret && publishableKey ? (
          <EmbeddedCheckoutForm publishableKey={publishableKey} clientSecret={clientSecret} />
        ) : (
          <div className="mt-8 rounded-2xl border border-red-800 bg-red-950/50 p-6">
            <p className="text-sm font-semibold text-red-200">
              We couldn’t open the payment form
            </p>
            <p className="mt-2 text-sm leading-6 text-red-200/90">{errorMsg}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/subscription/checkout"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-neutral-200"
              >
                Try again
              </Link>
              <Link
                href="/subscription"
                className="rounded-full border border-neutral-600 px-5 py-2.5 text-sm font-medium text-white transition hover:border-neutral-400"
              >
                Back to plans
              </Link>
            </div>
          </div>
        )}

        {/* Redeem an access code instead of paying */}
        <div className="mt-6 rounded-3xl border border-neutral-800 bg-neutral-950 p-6">
          <h2 className="text-lg font-semibold">Have an access code?</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-400">
            Redeem it to unlock the apps instead of paying.
          </p>
          <form action={redeemCodeAction} className="mt-5 flex gap-3">
            <input
              name="code"
              required
              placeholder="Enter code"
              className="w-full rounded-full border border-neutral-700 bg-black px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none focus:border-neutral-400"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full border border-neutral-600 px-5 py-3 text-sm font-medium text-white transition hover:border-neutral-400"
            >
              Redeem
            </button>
          </form>
        </div>

        <p className="mt-10 text-sm text-neutral-600">
          <Link href="/subscription" className="transition hover:text-neutral-400">
            ← Back to plans
          </Link>
        </p>
      </section>
      <Footer />
    </main>
  );
}
