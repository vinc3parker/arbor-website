import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase-server";
import { TIERS } from "@/lib/subscription";
import { getProfile } from "@/lib/profile";

export const metadata = {
  title: "Subscription — Arbor",
  robots: { index: false, follow: false },
};

function Check() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400"
      aria-hidden
    >
      <path
        d="M4 10.5 8 14.5 16 5.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function SubscriptionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/subscription");
  }

  const profile = await getProfile(supabase, user.id);
  const tier = profile.subscription_tier;
  const free = TIERS.free;
  const beta = TIERS.beta_tester;
  const isFree = tier === "free";

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto max-w-5xl px-8 pb-24 pt-40">
        <p className="mb-6 text-sm uppercase tracking-[0.3em] text-neutral-500">
          SUBSCRIPTION
        </p>
        <h1 className="text-4xl font-semibold md:text-5xl">
          Choose your plan.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-400">
          Arbor is free to use. A paid Beta Tester plan is coming soon for the
          apps that connect to Arbor Core.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Free tier */}
          <div className="flex flex-col rounded-3xl border border-neutral-700 bg-neutral-950 p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{free.name}</h2>
              {isFree && (
                <span className="rounded-full border border-emerald-800 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-400">
                  Current plan
                </span>
              )}
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-semibold">{free.price}</span>
              <span className="text-sm text-neutral-500">{free.cadence}</span>
            </div>

            <p className="mt-4 text-sm leading-7 text-neutral-400">
              {free.tagline}
            </p>

            <ul className="mt-6 flex flex-col gap-3 text-sm text-neutral-300">
              {free.features.map((f) => (
                <li key={f} className="flex gap-3">
                  <Check />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <button
                type="button"
                disabled
                className="w-full cursor-default rounded-full border border-neutral-700 px-6 py-3.5 text-sm font-medium text-neutral-400"
              >
                {isFree ? "Your current plan" : "Free plan"}
              </button>
            </div>
          </div>

          {/* Beta Tester tier — greyed out / coming soon */}
          <div className="relative flex flex-col rounded-3xl border border-neutral-900 bg-neutral-950/40 p-8 opacity-60">
            <span className="absolute right-6 top-6 rounded-full border border-neutral-800 bg-black px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
              Coming soon
            </span>

            <h2 className="text-2xl font-semibold text-neutral-300">
              {beta.name}
            </h2>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-semibold text-neutral-400">
                {beta.price}
              </span>
              <span className="text-sm text-neutral-600">{beta.cadence}</span>
            </div>

            <p className="mt-4 text-sm leading-7 text-neutral-500">
              {beta.tagline}
            </p>

            <ul className="mt-6 flex flex-col gap-3 text-sm text-neutral-500">
              {beta.features.map((f) => (
                <li key={f} className="flex gap-3">
                  <Check />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <button
                type="button"
                disabled
                aria-disabled
                className="w-full cursor-not-allowed rounded-full bg-neutral-800 px-6 py-3.5 text-sm font-medium text-neutral-500"
              >
                Not available yet
              </button>
            </div>
          </div>
        </div>

        <p className="mt-10 text-sm text-neutral-600">
          <Link
            href="/profile"
            className="transition hover:text-neutral-400"
          >
            ← Back to profile
          </Link>
        </p>
      </section>

      <Footer />
    </main>
  );
}
