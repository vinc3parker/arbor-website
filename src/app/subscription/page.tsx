import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase-server";
import {
  ACCOUNT_ONLY,
  PLANS,
  SUBSCRIPTION_INCLUDES,
  hasAccess,
  planName,
} from "@/lib/subscription";
import { fetchEntitlement, fetchOffer } from "@/lib/arbor-core";
import { isRegisteredApp, sanitizeState } from "@/lib/app-auth";

export const metadata = {
  title: "Subscription — Arbor",
  robots: { index: false, follow: false },
};

function Check() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="mt-0.5 h-4 w-4 shrink-0 text-fg-2"
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

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function appSuffix(app: string | null, state: string | null): string {
  const params = new URLSearchParams();
  if (app) params.set("app", app);
  if (state) params.set("state", state);
  const query = params.toString();
  return query ? `?${query}` : "";
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

  // Entitlement comes from Core (owns billing); so does the current price.
  let entStatus = "none";
  let entPlan: string | null = null;
  let source: "stripe" | "trial" | "comp" | null = null;
  let periodEnd: number | null = null;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const [view, offer] = await Promise.all([
    session?.access_token
      ? fetchEntitlement(session.access_token).catch(() => null)
      : Promise.resolve(null),
    fetchOffer().catch(() => null),
  ]);
  if (view) {
    entStatus = view.entitlement.status;
    entPlan = view.entitlement.plan;
    source = view.source;
    periodEnd = view.entitlement.currentPeriodEnd;
  }
  const price = PLANS[offer?.plan ?? "founder"];

  // "canceled" is not access: only these statuses unlock the apps.
  const entitled = hasAccess(entStatus);
  const isStripeEntitled = entitled && source === "stripe";
  const isTrial = entitled && source === "trial";
  const isComp = entitled && source === "comp";

  const sp = (await searchParams) ?? {};
  const rawApp = first(sp.app);
  const app = rawApp && isRegisteredApp(rawApp) ? rawApp : null;
  const state = sanitizeState(first(sp.state));
  const returnSuffix = appSuffix(app, state);
  const codeHref = returnSuffix
    ? `/subscription/checkout${returnSuffix}&method=code`
    : "/subscription/checkout?method=code";

  // ── Current-plan presentation ──────────────────────────────────────────────
  let heading: string = ACCOUNT_ONLY.name;
  let chipLabel = "Not subscribed";
  let chipClass = "border-line bg-bg text-fg-2";
  let detail: string = ACCOUNT_ONLY.summary;

  if (isStripeEntitled) {
    heading = planName(entPlan);
    if (entStatus === "past_due") {
      chipLabel = "Payment due";
      chipClass = "border-warning/40 bg-warning/10 text-warning";
      detail = periodEnd
        ? `Your last payment didn’t go through. Access continues until ${formatDate(periodEnd)}. Update your card to keep it.`
        : "Your last payment didn’t go through. Update your card to keep access.";
    } else {
      chipLabel = "Active";
      chipClass = "border-success/40 bg-success/10 text-success";
      detail = periodEnd
        ? `Your subscription renews on ${formatDate(periodEnd)}.`
        : "Your subscription is active.";
    }
  } else if (isTrial) {
    heading = planName(entPlan);
    chipLabel = "Temporary access";
    chipClass = "border-info/40 bg-info/10 text-info";
    detail = periodEnd
      ? `Your access ends on ${formatDate(periodEnd)}. Subscribe any time to keep it.`
      : "Your temporary access is active.";
  } else if (isComp) {
    heading = "Access code";
    chipLabel = "Active";
    chipClass = "border-success/40 bg-success/10 text-success";
    detail =
      periodEnd && periodEnd < FAR_FUTURE
        ? `Your code gives you access until ${formatDate(periodEnd)}.`
        : "Your code gives you access, with no end date.";
  }

  // ── Actions for the current-plan card ──────────────────────────────────────
  let actions: ReactNode = null;
  if (isStripeEntitled) {
    actions = (
      <Link href={`/billing/portal${returnSuffix}`} className="ui-secondary">
        Manage billing
      </Link>
    );
  } else if (!isComp) {
    actions = (
      <>
        <Link href={`/subscription/checkout${returnSuffix}`} className="ui-primary">
          {isTrial ? "Subscribe to keep access" : `Subscribe — ${price.price}/mo`}
        </Link>
        <Link
          href={codeHref}
          className="inline-flex min-h-12 items-center justify-center rounded-xl px-4 type-label text-fg-2 transition hover:bg-raised hover:text-fg"
        >
          Use a code instead
        </Link>
      </>
    );
  }

  const notice =
    sp.billing === "active"
      ? { kind: "ok", text: "You’re already subscribed. Thank you for being here." }
      : sp.billing === "unavailable"
        ? { kind: "err", text: "Payments aren’t available right now. Nothing has been charged. Try again in a little while." }
        : sp.billing
          ? { kind: "err", text: "Something went wrong on our side. Nothing has been charged. Try again in a moment." }
          : sp.code === "redeemed"
            ? { kind: "ok", text: "Code accepted. You now have access to every Arbor app." }
            : null;

  return (
    <main className="min-h-screen bg-bg text-fg">
      <Navbar />

      <section className="page-shell page-shell-narrow">
        <p className="ui-kicker">Subscription</p>
        <h1 className="ui-title">Your subscription</h1>

        {notice && (
          <p
            role="status"
            className={`mt-5 rounded-xl border px-4 py-3 text-base ${
              notice.kind === "ok"
                ? "border-success/40 bg-success/10 text-success"
                : "border-danger/40 bg-danger/10 text-danger"
            }`}
          >
            {notice.text}
          </p>
        )}

        {/* Current state */}
        <div className="ui-surface mt-8 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-[1.375rem] font-semibold">{heading}</h2>
            <span className={`shrink-0 rounded-full border px-3 py-1 text-sm ${chipClass}`}>
              {chipLabel}
            </span>
          </div>

          <p className="mt-3 text-fg-2">{detail}</p>

          {actions && <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div>}
        </div>

        {/* What a subscription includes */}
        <div className="mt-6 border-t border-line py-8">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-lg font-semibold">
              {entitled ? "What’s included" : "What a subscription includes"}
            </h3>
            {!entitled && (
              <p className="shrink-0 text-fg-2">
                <span className="text-lg font-semibold text-fg">{price.price}</span>{" "}
                {price.cadence}
              </p>
            )}
          </div>

          <ul className="mt-6 flex flex-col gap-3 text-base text-fg">
            {SUBSCRIPTION_INCLUDES.map((f) => (
              <li key={f} className="flex gap-3">
                <Check />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {!entitled && (
            <p className="mt-6 type-caption text-fg-2">
              {offer?.plan === "standard"
                ? PLANS.standard.summary
                : `${PLANS.founder.summary} After that, Arbor is ${PLANS.standard.price} a month.`}
            </p>
          )}
        </div>

        <p className="mt-6 type-caption text-fg-2">
          <Link href="/profile" className="transition hover:text-fg">
            ← Back to your account
          </Link>
        </p>
      </section>

      <Footer />
    </main>
  );
}
