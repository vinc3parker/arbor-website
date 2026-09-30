import Link from "next/link";
import {
  ACCOUNT_ONLY,
  PLANS,
  SUBSCRIPTION_INCLUDES,
  type PaidPlan,
} from "@/lib/subscription";

function Check() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="mt-1 h-4 w-4 shrink-0 text-fg-2"
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

/**
 * One subscription for every app. `plan` is the price a new subscriber gets
 * right now (from Arbor Core); null when Core couldn't be reached, in which
 * case both prices are explained.
 */
export function SubscriptionSection({ plan }: { plan: PaidPlan | null }) {
  const offer = PLANS[plan ?? "founder"];
  const founding = plan !== "standard";

  return (
    <section id="subscription" className="site-container py-24">
      <p className="ui-kicker">Subscription</p>

      <h2 className="type-h1 mb-4 max-w-3xl">
        One subscription, every Arbor app.
      </h2>

      <p className="mb-10 max-w-2xl type-body text-fg-2">
        Every guide, and every new app as it opens, for one monthly price.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col rounded-3xl border border-fg bg-surface p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-semibold">{offer.name}</h3>
            {founding && <span className="ui-status">First 100 members</span>}
          </div>

          <p className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-semibold tracking-tight">{offer.price}</span>
            <span className="type-caption text-fg-2">{offer.cadence}</span>
          </p>

          <p className="mt-4 max-w-md text-fg-2">
            {offer.summary}
            {founding && plan && ` After that, Arbor is ${PLANS.standard.price} a month.`}
            {!plan && ` After the first 100 members, Arbor is ${PLANS.standard.price} a month.`}
          </p>

          <ul className="mt-8 flex flex-1 flex-col gap-3 text-base text-fg">
            {SUBSCRIPTION_INCLUDES.map((f) => (
              <li key={f} className="flex gap-3">
                <Check />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/subscription/checkout" className="ui-primary">
              Subscribe — {offer.price}/mo
            </Link>
            <Link
              href="/subscription/checkout?method=code"
              className="inline-flex min-h-12 items-center justify-center rounded-xl px-4 type-label text-fg-2 transition hover:bg-raised hover:text-fg"
            >
              Have a code? Use it instead
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-3xl border border-line p-6 sm:p-8">
          <div>
            <h3 className="text-xl font-semibold">Not ready to subscribe?</h3>
            <p className="mt-3 text-fg-2">{ACCOUNT_ONLY.summary}</p>
          </div>
          <Link href="/login" className="ui-secondary mt-8 self-start">
            Create an Arbor account
          </Link>
        </div>
      </div>
    </section>
  );
}
