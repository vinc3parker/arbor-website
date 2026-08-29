import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase-server";
import { TIERS } from "@/lib/subscription";
import { getProfile } from "@/lib/profile";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { startTrialAction, redeemCodeAction } from "./actions";
import { fetchEntitlement } from "@/lib/arbor-core";

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

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
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
  const isBeta = tier === "beta_tester";
  // Founding Access goes live the moment a Stripe price is configured.
  const billingEnabled = Boolean(process.env.STRIPE_PRICE_FOUNDING_ACCESS);

  // Authoritative entitlement from Core (it applies trial/comp expiry for us).
  let entStatus = "none";
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      const { entitlement } = await fetchEntitlement(session.access_token);
      entStatus = entitlement.status;
    }
  } catch {
    // Core unreachable — fall back to "not entitled".
  }
  const entitled = entStatus !== "none";

  // Trial usage + source come from the source-of-truth row (no time math needed).
  const { data: sub } = await supabaseAdmin
    .from("subscriptions")
    .select("source, trial_started_at")
    .eq("user_id", user.id)
    .maybeSingle();
  const source = (sub?.source ?? null) as "stripe" | "trial" | "comp" | null;
  const isStripeEntitled = entitled && (source === "stripe" || source == null);
  const trialUsed = Boolean(sub?.trial_started_at);
  const canTrial = !entitled && !trialUsed;
  const canRedeem = !entitled;

  const sp = (await searchParams) ?? {};
  const notice =
    sp.trial === "started"
      ? { kind: "ok", text: "Your 30-day free trial is active. Enjoy!" }
      : sp.code === "redeemed"
        ? { kind: "ok", text: "Code redeemed — your access is now active." }
        : sp.trial_error === "TRIAL_ALREADY_USED"
          ? { kind: "err", text: "You have already used your free trial." }
          : sp.trial_error === "ALREADY_ENTITLED"
            ? { kind: "err", text: "You already have an active subscription." }
            : sp.trial_error
              ? { kind: "err", text: "Couldn't start your trial. Please try again." }
              : sp.code_error === "CODE_EXHAUSTED"
                ? { kind: "err", text: "That code has already been fully redeemed." }
                : sp.code_error === "CODE_EXPIRED"
                  ? { kind: "err", text: "That code has expired." }
                  : sp.code_error && sp.code_error !== "empty"
                    ? { kind: "err", text: "That code isn't valid." }
                    : null;

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
          Arbor is free to use. A paid Founding Access plan is coming soon for
          the apps that connect to Arbor Core.
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

          {/* Founding Access tier — greyed out / coming soon */}
          <div
            className={`relative flex flex-col rounded-3xl border ${
              billingEnabled ? "border-neutral-700 bg-neutral-950" : "border-neutral-900 bg-neutral-950/40 opacity-60"
            } p-8`}
          >
            {billingEnabled ? (
              isBeta ? (
                <span className="absolute right-6 top-6 rounded-full border border-emerald-800 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-400">
                  Current plan
                </span>
              ) : null
            ) : (
              <span className="absolute right-6 top-6 rounded-full border border-neutral-800 bg-black px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
                Coming soon
              </span>
            )}

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
              {billingEnabled ? (
                isStripeEntitled ? (
                  <Link
                    href="/billing/portal"
                    className="block w-full rounded-full border border-neutral-600 px-6 py-3.5 text-center text-sm font-medium text-white transition hover:border-neutral-400"
                  >
                    Manage billing
                  </Link>
                ) : (
                  <Link
                    href="/billing/checkout"
                    className="block w-full rounded-full bg-white px-6 py-3.5 text-center text-sm font-medium text-black transition hover:bg-neutral-200"
                  >
                    Subscribe
                  </Link>
                )
              ) : (
                <button
                  type="button"
                  disabled
                  aria-disabled
                  className="w-full cursor-not-allowed rounded-full bg-neutral-800 px-6 py-3.5 text-sm font-medium text-neutral-500"
                >
                  Not available yet
                </button>
              )}
            </div>
          </div>
        </div>

        {(notice || canTrial || canRedeem) && (
          <div className="mt-12 border-t border-neutral-900 pt-10">
            {notice && (
              <p
                className={`mb-6 rounded-2xl border px-5 py-3 text-sm ${
                  notice.kind === "ok"
                    ? "border-emerald-800 bg-emerald-950/30 text-emerald-300"
                    : "border-red-900 bg-red-950/30 text-red-300"
                }`}
              >
                {notice.text}
              </p>
            )}

            {(canTrial || canRedeem) && (
              <div className="grid gap-6 md:grid-cols-2">
                {canTrial && (
                  <form
                    action={startTrialAction}
                    className="rounded-3xl border border-neutral-800 bg-neutral-950 p-6"
                  >
                    <h3 className="text-lg font-semibold">Try it free for 30 days</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-400">
                      One month of full access to the connected apps — no card
                      required. One trial per account.
                    </p>
                    <button
                      type="submit"
                      className="mt-5 w-full rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
                    >
                      Start free trial
                    </button>
                  </form>
                )}

                {canRedeem && (
                  <form
                    action={redeemCodeAction}
                    className="rounded-3xl border border-neutral-800 bg-neutral-950 p-6"
                  >
                    <h3 className="text-lg font-semibold">Have a code?</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-400">
                      Enter an access code to unlock the connected apps.
                    </p>
                    <div className="mt-5 flex gap-3">
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
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

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
