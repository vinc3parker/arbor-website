import type { ReactNode } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase-server";
import {
  ACCOUNT_ONLY,
  PLANS,
  SUBSCRIPTION_INCLUDES,
  hasAccess,
} from "@/lib/subscription";
import { fetchEntitlement, fetchOffer } from "@/lib/arbor-core";
import { isRegisteredApp, sanitizeState } from "@/lib/app-auth";
import { APP_ORDER } from "@/lib/brand";
import { apps } from "@/content/apps";
import { getPageSocialMetadata } from "@/lib/seo";

const title = "Arbor membership | One subscription, every Arbor app";
const description =
  "Explore Arbor membership options and the personal guide services included across training, wellbeing, planning, money, relationships, work, learning and adventure.";

export const metadata = {
  title,
  description,
  alternates: { canonical: "https://arborapps.co/subscription" },
  ...getPageSocialMetadata(title, description, "/subscription"),
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

  // Entitlement comes from Core (owns billing); so does the current price.
  let entStatus = "none";
  let entPlan: string | null = null;
  let source: "stripe" | "trial" | "comp" | null = null;
  let periodEnd: number | null = null;
  let cancelAtPeriodEnd = false;
  const session = user
    ? (await supabase.auth.getSession()).data.session
    : null;
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
    cancelAtPeriodEnd = view.cancelAtPeriodEnd;
  }
  const offeredPlan = offer?.plan ?? "founder";
  const price = PLANS[offeredPlan];

  // "canceled" is not access: only these statuses unlock the apps.
  const entitled = hasAccess(entStatus, periodEnd);
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
  const checkoutHref = `/subscription/checkout${returnSuffix}`;
  const subscribeHref = user
    ? checkoutHref
    : `/login?redirect=${encodeURIComponent(checkoutHref)}`;
  const codeHref = returnSuffix
    ? `/subscription/checkout${returnSuffix}&method=code`
    : "/subscription/checkout?method=code";
  const publicCodeHref = user
    ? codeHref
    : `/login?redirect=${encodeURIComponent(codeHref)}`;
  const betaParams = new URLSearchParams();
  if (app) betaParams.set("app", app);
  if (state) betaParams.set("state", state);
  betaParams.set("method", "code");
  betaParams.set("promo", "BETA");
  const betaCheckoutHref = `/subscription/checkout?${betaParams.toString()}`;
  const betaHref = user
    ? betaCheckoutHref
    : `/login?redirect=${encodeURIComponent(betaCheckoutHref)}`;

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
    if (cancelAtPeriodEnd && periodEnd) {
      chipLabel = "Ending";
      chipClass = "border-warning/40 bg-warning/10 text-warning";
      detail = `Your membership ends on ${formatDate(periodEnd)}. You can use every Arbor app until then.`;
    } else if (entStatus === "past_due") {
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
    <Link href={subscribeHref} className="ui-primary w-full">
      {!user
        ? `Create an account — ${price.price}/mo`
        : testerPaymentDue
        ? "Add payment details"
        : isTrial
          ? "Subscribe to keep access"
          : isComp
            ? "Set up payment early"
            : `Subscribe — ${price.price}/mo`}
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
          One Arbor membership gives you access across every Arbor app.
          {user
            ? " Your current membership is highlighted below."
            : " Explore the options and services below—an account is only needed when you’re ready to join."}
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

        {!entitled && source !== "comp" && (
          <aside className="mt-8 overflow-hidden rounded-3xl border border-fg bg-fg text-bg">
            <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-bg/65">
                    Beta tester access
                  </p>
                  <span className="rounded-full border border-bg/25 px-3 py-1 text-xs font-medium">
                    14 days free
                  </span>
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Try the whole of Arbor. Help shape what comes next.
                </h2>
                <p className="mt-3 max-w-2xl leading-7 text-bg/75">
                  Get every Arbor guide currently in testing for 14 days. No card,
                  no automatic renewal—just explore the experience and tell us what
                  feels genuinely useful.
                </p>
                <p className="mt-4 text-sm text-bg/70">
                  Use code <code className="rounded-md bg-bg/10 px-2 py-1 font-mono font-semibold text-bg">BETA</code>
                </p>
              </div>
              <Link
                href={betaHref}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-bg px-5 py-3 font-semibold text-fg transition hover:opacity-90"
              >
                Start 14 days free
              </Link>
            </div>
          </aside>
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
                {manageBilling ??
                  (isTrial || testerPaymentDue || (isComp && periodEnd && periodEnd < FAR_FUTURE)
                    ? subscribeButton
                    : null)}
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
            <Link href={publicCodeHref} className="font-medium text-fg underline underline-offset-4">
              Use it instead
            </Link>
          </p>
        )}

        <section className="mt-20 border-t border-line pt-16" aria-labelledby="included-services">
          <p className="ui-kicker">What membership includes</p>
          <h2 id="included-services" className="type-h1 mt-2 max-w-3xl">
            Eight guides for the different parts of life.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-fg-2">
            Your membership covers every Arbor guide as it becomes available. Each has
            its own focus, while Arbor helps them work from one shared understanding of you.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {APP_ORDER.map((id) => {
              const service = apps[id];
              return (
                <Link
                  key={id}
                  href={`/${id}`}
                  className="group rounded-2xl border border-line bg-surface p-5 transition hover:border-fg-3 hover:bg-raised"
                >
                  <p className="text-lg font-semibold">{service.name}</p>
                  <p className="mt-1 text-sm font-medium text-fg-2">{service.guide.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-fg-2">
                    {service.overviewTitle}
                  </p>
                  <span className="mt-4 inline-block text-sm font-medium text-fg transition group-hover:translate-x-0.5">
                    Explore {service.name} →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <p className="mt-6 type-caption text-fg-2">
          <Link href={user ? "/account" : "/"} className="transition hover:text-fg">
            ← {user ? "Back to your account" : "Back to Arbor"}
          </Link>
        </p>
      </section>

      <Footer />
    </main>
  );
}
