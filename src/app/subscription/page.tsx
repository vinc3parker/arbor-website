import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase-server";
import { TIERS } from "@/lib/subscription";
import { startTrialAction } from "./actions";
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

// Comp grants with no expiry surface as this far-future sentinel from Core.
const FAR_FUTURE = 4102444800;

function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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

  const free = TIERS.free;
  const beta = TIERS.beta_tester;

  // Entitlement comes from Core (owns billing): status, tier source, trial usage.
  let entStatus = "none";
  let source: "stripe" | "trial" | "comp" | null = null;
  let trialUsed = false;
  let periodEnd: number | null = null;
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      const view = await fetchEntitlement(session.access_token);
      entStatus = view.entitlement.status;
      source = view.source;
      trialUsed = view.trialUsed;
      periodEnd = view.entitlement.currentPeriodEnd;
    }
  } catch {
    // Core unreachable — fall back to "not entitled".
  }

  const entitled = entStatus !== "none";
  const isStripeEntitled = entitled && source === "stripe";
  const isTrial = entitled && source === "trial";
  const isComp = entitled && source === "comp";
  const canTrial = !entitled && !trialUsed;

  // ── Current-plan presentation ──────────────────────────────────────────────
  let planName: string = "Arbor account";
  let chipLabel = "No subscription";
  let chipClass = "border-neutral-700 bg-neutral-900 text-neutral-300";
  let detail: string = free.tagline;

  if (isStripeEntitled) {
    planName = beta.name;
    if (entStatus === "past_due") {
      chipLabel = "Past due";
      chipClass = "border-amber-800 bg-amber-950/40 text-amber-300";
      detail = periodEnd
        ? `Your last payment failed — access continues until ${formatDate(periodEnd)}. Update your card to keep it.`
        : "Your last payment failed. Please update your card.";
    } else {
      chipLabel = "Active";
      chipClass = "border-emerald-800 bg-emerald-950/40 text-emerald-300";
      detail = periodEnd
        ? `Your subscription renews on ${formatDate(periodEnd)}.`
        : "Your subscription is active.";
    }
  } else if (isTrial) {
    planName = beta.name;
    chipLabel = "Free trial";
    chipClass = "border-sky-800 bg-sky-950/40 text-sky-300";
    detail = periodEnd
      ? `Your free trial ends on ${formatDate(periodEnd)}. Subscribe any time to keep access.`
      : "Your free trial is active.";
  } else if (isComp) {
    planName = beta.name;
    chipLabel = "Complimentary";
    chipClass = "border-violet-800 bg-violet-950/40 text-violet-300";
    detail =
      periodEnd && periodEnd < FAR_FUTURE
        ? `You have complimentary access until ${formatDate(periodEnd)}.`
        : "You have complimentary access, with no expiry.";
  }

  // ── Primary action for the current-plan card ───────────────────────────────
  let primary: ReactNode = null;
  if (isStripeEntitled) {
    primary = (
      <Link
        href="/billing/portal"
        className="inline-block rounded-full border border-neutral-600 px-6 py-3 text-sm font-medium text-white transition hover:border-neutral-400"
      >
        Manage billing
      </Link>
    );
  } else if (isComp) {
    primary = null; // complimentary — nothing to buy or manage
  } else if (beta.available) {
    primary = (
      <Link
        href="/subscription/checkout"
        className="inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
      >
        {isTrial ? "Subscribe to keep access" : `Subscribe — ${beta.price}/mo`}
      </Link>
    );
  } else {
    primary = (
      <button
        type="button"
        disabled
        aria-disabled
        className="cursor-not-allowed rounded-full bg-neutral-800 px-6 py-3 text-sm font-medium text-neutral-500"
      >
        Coming soon
      </button>
    );
  }

  const sp = (await searchParams) ?? {};
  const notice =
    sp.billing === "active"
      ? { kind: "ok", text: "You’re already subscribed — thanks!" }
      : sp.billing === "unavailable"
        ? { kind: "err", text: "Payments aren’t available right now. Please try again shortly." }
        : sp.billing
          ? { kind: "err", text: "Something went wrong starting checkout. Please try again." }
          : sp.trial === "started"
            ? { kind: "ok", text: "Your 30-day free trial is active. Enjoy!" }
            : sp.code === "redeemed"
              ? { kind: "ok", text: "Code redeemed — your access is now active." }
              : sp.trial_error === "TRIAL_ALREADY_USED"
                ? { kind: "err", text: "You have already used your free trial." }
                : sp.trial_error === "ALREADY_ENTITLED"
                  ? { kind: "err", text: "You already have an active subscription." }
                  : sp.trial_error
                    ? { kind: "err", text: "Couldn’t start your trial. Please try again." }
                    : sp.code_error === "CODE_EXHAUSTED"
                      ? { kind: "err", text: "That code has already been fully redeemed." }
                      : sp.code_error === "CODE_EXPIRED"
                        ? { kind: "err", text: "That code has expired." }
                        : sp.code_error && sp.code_error !== "empty"
                          ? { kind: "err", text: "That code isn’t valid." }
                          : null;

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto max-w-2xl px-6 pb-24 pt-40 sm:px-8">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-neutral-500">
          SUBSCRIPTION
        </p>
        <h1 className="text-3xl font-semibold md:text-4xl">Manage subscription</h1>

        {notice && (
          <p
            className={`mt-6 rounded-2xl border px-5 py-3 text-sm ${
              notice.kind === "ok"
                ? "border-emerald-800 bg-emerald-950/30 text-emerald-300"
                : "border-red-800 bg-red-950/50 text-red-200"
            }`}
          >
            {notice.text}
          </p>
        )}

        {/* Current plan */}
        <div className="mt-8 rounded-3xl border border-neutral-700 bg-neutral-950 p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                Current plan
              </p>
              <h2 className="mt-1 text-2xl font-semibold">{planName}</h2>
            </div>
            <span className={`shrink-0 rounded-full border px-3 py-1 text-xs ${chipClass}`}>
              {chipLabel}
            </span>
          </div>

          <p className="mt-4 text-sm leading-7 text-neutral-400">{detail}</p>

          {primary && <div className="mt-6">{primary}</div>}
        </div>

        {/* Free-tier action: start a trial (code redemption lives on checkout) */}
        {canTrial && (
          <form
            action={startTrialAction}
            className="mt-6 rounded-3xl border border-neutral-800 bg-neutral-950 p-6"
          >
            <h3 className="text-lg font-semibold">Try it free for 30 days</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-400">
              A month of full access to the apps — no card required. One trial per
              account.
            </p>
            <button
              type="submit"
              className="mt-5 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
            >
              Start free trial
            </button>
          </form>
        )}

        {/* What Founding Access includes */}
        <div className="mt-10 rounded-3xl border border-neutral-900 bg-neutral-950/50 p-8">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-lg font-semibold">
              {entitled ? "What’s included" : `What ${beta.name} includes`}
            </h3>
            <p className="shrink-0 text-sm text-neutral-400">
              <span className="text-base font-semibold text-neutral-200">
                {beta.price}
              </span>{" "}
              {beta.cadence}
            </p>
          </div>

          <ul className="mt-6 flex flex-col gap-3 text-sm text-neutral-300">
            {beta.features.map((f) => (
              <li key={f} className="flex gap-3">
                <Check />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {!entitled && (
            <p className="mt-6 border-t border-neutral-900 pt-5 text-sm leading-6 text-neutral-500">
              Your account keeps your profile and data safe on Arbor Core.
              Founding Access is what unlocks the apps.
            </p>
          )}
        </div>

        <p className="mt-10 text-sm text-neutral-600">
          <Link href="/profile" className="transition hover:text-neutral-400">
            ← Back to profile
          </Link>
        </p>
      </section>

      <Footer />
    </main>
  );
}
