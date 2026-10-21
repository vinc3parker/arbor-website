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

function MembershipCard({
  name,
  price,
  cadence,
  description,
  active = false,
  status,
  children,
}: {
  name: string;
  price: string;
  cadence: string;
  description: string;
  active?: boolean;
  status?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <article
      className={`flex min-h-[29rem] flex-col rounded-3xl border p-6 sm:p-7 ${
        active
          ? "border-fg bg-surface shadow-[0_16px_40px_rgb(0_0_0_/_0.08)]"
          : "border-line bg-surface"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-[1.375rem] font-semibold">{name}</h2>
        {status}
      </div>
      <p className="mt-8 text-4xl font-semibold tracking-tight">
        {price}
        <span className="ml-2 text-base font-normal tracking-normal text-fg-2">
          {cadence}
        </span>
      </p>
      <p className="mt-5 min-h-14 text-fg-2">{description}</p>
      <ul className="mt-8 flex flex-col gap-3 text-sm text-fg">
        {SUBSCRIPTION_INCLUDES.map((feature) => (
          <li key={feature} className="flex gap-3">
            <Check />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {children && <div className="mt-auto pt-8">{children}</div>}
    </article>
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
  const offeredPlan = offer?.plan ?? "founder";
  const price = PLANS[offeredPlan];

  // "canceled" is not access: only these statuses unlock the apps.
  const entitled = hasAccess(entStatus);
  const isStripeEntitled = entitled && source === "stripe";
  const isTrial = entitled && source === "trial";
  const isComp = entitled && source === "comp";
  // Core deliberately retains the source after a timed tester grant ends so
  // this page can direct the person to add payment rather than treating them
  // as a brand-new account.
  const testerPaymentDue = source === "comp" && entStatus === "past_due";

  const sp = (await searchParams) ?? {};
  const rawApp = first(sp.app);
  const app = rawApp && isRegisteredApp(rawApp) ? rawApp : null;
  const state = sanitizeState(first(sp.state));
  const returnSuffix = appSuffix(app, state);
  const codeHref = returnSuffix
    ? `/subscription/checkout${returnSuffix}&method=code`
    : "/subscription/checkout?method=code";

  // Temporary/tester access always grants the Founding membership; it is not
  // a membership tier in its own right.
  const founderIsActive =
    testerPaymentDue || isTrial || isComp || (entitled && entPlan === "founder");
  const standardIsActive = entitled && entPlan === "standard" && !isTrial && !isComp;

  // ── Current membership presentation ────────────────────────────────────────
  let chipLabel = "Not subscribed";
  let chipClass = "border-line bg-bg text-fg-2";
  let detail: string = ACCOUNT_ONLY.summary;

  if (testerPaymentDue) {
    chipLabel = "Payment due";
    chipClass = "border-warning/40 bg-warning/10 text-warning";
    detail =
      "Your two-week tester access has ended. Add payment details to continue as a Founding member.";
  } else if (isStripeEntitled) {
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
    chipLabel = "Temporary access";
    chipClass = "border-info/40 bg-info/10 text-info";
    detail = periodEnd
      ? `Your Founding membership is included until ${formatDate(periodEnd)}. Add payment any time to keep it.`
      : "Your Founding membership is temporarily included.";
  } else if (isComp) {
    chipLabel = "Active";
    chipClass = "border-success/40 bg-success/10 text-success";
    detail =
      periodEnd && periodEnd < FAR_FUTURE
        ? `Your Founding membership was granted with an access code and ends on ${formatDate(periodEnd)}.`
        : "Your Founding membership was granted with an access code and has no end date.";
  }

  const manageBilling = isStripeEntitled ? (
      <Link href={`/billing/portal${returnSuffix}`} className="ui-secondary">
        Manage billing
      </Link>
  ) : null;

  const subscribeButton = (
    <Link href={`/subscription/checkout${returnSuffix}`} className="ui-primary w-full">
      {testerPaymentDue ? "Add payment details" : isTrial ? "Subscribe to keep access" : `Subscribe — ${price.price}/mo`}
    </Link>
  );

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
        <h1 className="ui-title">Choose your membership</h1>
        <p className="mt-3 max-w-2xl text-lg text-fg-2">
          One Arbor membership gives you access across every Arbor app. Your current
          membership is highlighted below.
        </p>

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

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <MembershipCard
            name={PLANS.founder.name}
            price={PLANS.founder.price}
            cadence={PLANS.founder.cadence}
            description={PLANS.founder.summary}
            active={founderIsActive}
            status={
              founderIsActive ? (
                <span className={`shrink-0 rounded-full border px-3 py-1 text-sm ${chipClass}`}>
                  {chipLabel}
                </span>
              ) : undefined
            }
          >
            {founderIsActive ? (
              <>
                <p className="mb-4 text-sm text-fg-2">{detail}</p>
                {manageBilling ?? (isTrial || testerPaymentDue ? subscribeButton : null)}
              </>
            ) : !entitled && offeredPlan === "founder" ? (
              subscribeButton
            ) : (
              <p className="text-sm text-fg-2">Available while founding places remain.</p>
            )}
          </MembershipCard>

          <MembershipCard
            name={PLANS.standard.name}
            price={PLANS.standard.price}
            cadence={PLANS.standard.cadence}
            description={PLANS.standard.summary}
            active={standardIsActive}
            status={
              standardIsActive ? (
                <span className={`shrink-0 rounded-full border px-3 py-1 text-sm ${chipClass}`}>
                  {chipLabel}
                </span>
              ) : undefined
            }
          >
            {standardIsActive ? (
              <>
                <p className="mb-4 text-sm text-fg-2">{detail}</p>
                {manageBilling}
              </>
            ) : !entitled && offeredPlan === "standard" ? (
              subscribeButton
            ) : (
              <p className="text-sm text-fg-2">Available once founding places are filled.</p>
            )}
          </MembershipCard>
        </div>

        {!entitled && (
          <p className="mt-6 text-center type-caption text-fg-2">
            Have an access code?{" "}
            <Link href={codeHref} className="font-medium text-fg underline underline-offset-4">
              Use it instead
            </Link>
          </p>
        )}

        <p className="mt-6 type-caption text-fg-2">
          <a href="/account" className="transition hover:text-fg">
            ← Back to your account
          </a>
        </p>
      </section>

      <Footer />
    </main>
  );
}
