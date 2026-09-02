import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase-server";
import { fetchEntitlement } from "@/lib/arbor-core";
import { isRegisteredApp, sanitizeState } from "@/lib/app-auth";
import { EmbeddedCheckoutForm } from "./EmbeddedCheckoutForm";

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

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) redirect("/subscription?billing=unavailable");

  // Already entitled? No need to pay. (redirect() must run outside the try.)
  let entitled = false;
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      const view = await fetchEntitlement(session.access_token);
      entitled = view.entitlement.status !== "none";
    }
  } catch {
    // Core unreachable — let them proceed to checkout.
  }
  if (entitled) redirect("/subscription");

  const sp = await searchParams;
  const appRaw = typeof sp.app === "string" ? sp.app : undefined;
  const app = appRaw && isRegisteredApp(appRaw) ? appRaw : undefined;
  const state = sanitizeState(typeof sp.state === "string" ? sp.state : undefined) ?? undefined;

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="mx-auto max-w-3xl px-8 pb-24 pt-40">
        <p className="mb-6 text-sm uppercase tracking-[0.3em] text-neutral-500">
          FOUNDING ACCESS
        </p>
        <h1 className="text-4xl font-semibold md:text-5xl">
          Complete your subscription
        </h1>
        <p className="mt-4 text-neutral-400">
          Payment is handled securely by Stripe.
        </p>

        <EmbeddedCheckoutForm publishableKey={publishableKey} app={app} state={state} />

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
