import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import type { DataOverview } from "@/lib/arbor-core";
import { displayNameFor, type ArborUser } from "@/lib/profile";
import { ACCOUNT_ONLY, planName } from "@/lib/subscription";
import { DetailsCard } from "./DetailsCard";
import { WhatArborKnows } from "./WhatArborKnows";
import { formatDay } from "./labels";

const SECTIONS = [
  { id: "details", label: "Your details" },
  { id: "subscription", label: "Subscription" },
  { id: "what-arbor-knows", label: "What Arbor knows" },
  { id: "your-data", label: "Your data" },
];

/** The account page itself; data is fetched by app/profile/page.tsx. */
export function AccountView({
  profile,
  email,
  createdAt,
  overview,
  subscription,
}: {
  /** From Arbor Core; null when it couldn't be reached. */
  subscription: { active: boolean; plan: string | null; comp: boolean } | null;
  profile: ArborUser;
  email: string | null;
  createdAt: string | null;
  overview: DataOverview | null;
}) {
  const name = displayNameFor(profile, email);
  const memberSince = formatDay(createdAt);

  return (
    <main className="min-h-screen bg-bg text-fg">
      <Navbar />

      <div className="site-container pt-32 pb-24 sm:pt-36">
        <header>
          <p className="ui-kicker">Your account</p>
          <h1 className="type-h1">Hi, {name}</h1>
          <p className="mt-3 type-caption text-fg-2">
            {email}
            {memberSince ? ` · Member since ${memberSince}` : ""}
          </p>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[13rem_1fr]">
          {/* Section links (desktop) */}
          <nav aria-label="Account sections" className="hidden lg:block">
            <ul className="sticky top-28 space-y-1">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block rounded-xl px-3 py-2 type-label text-fg-2 transition hover:bg-surface hover:text-fg"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 max-w-3xl space-y-16">
            <section id="details" className="scroll-mt-28" aria-labelledby="details-title">
              <h2 id="details-title" className="type-h2 mb-2">Your details</h2>
              <p className="mb-6 text-fg-2">Shared across every Arbor app.</p>
              <DetailsCard
                email={email ?? ""}
                details={{
                  firstName: profile.first_name ?? "",
                  lastName: profile.last_name ?? "",
                  dateOfBirth: profile.date_of_birth ?? "",
                  gender: profile.gender ?? "",
                  addressLine1: profile.address_line1 ?? "",
                  addressLine2: profile.address_line2 ?? "",
                  city: profile.city ?? "",
                  region: profile.region ?? "",
                  postalCode: profile.postal_code ?? "",
                  country: profile.country ?? "",
                }}
              />
            </section>

            <section id="subscription" className="scroll-mt-28" aria-labelledby="subscription-title">
              <h2 id="subscription-title" className="type-h2 mb-6">Subscription</h2>
              <div className="ui-surface flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div>
                  {subscription?.active ? (
                    <>
                      <p className="flex items-center gap-3 text-[1.375rem] font-semibold">
                        {subscription.comp ? "Access code" : planName(subscription.plan)}
                        <span className="ui-status">Active</span>
                      </p>
                      <p className="mt-2 text-fg-2">You have access to every Arbor app.</p>
                    </>
                  ) : subscription ? (
                    <>
                      <p className="flex items-center gap-3 text-[1.375rem] font-semibold">
                        {ACCOUNT_ONLY.name}
                        <span className="ui-status">Not subscribed</span>
                      </p>
                      <p className="mt-2 text-fg-2">{ACCOUNT_ONLY.summary}</p>
                    </>
                  ) : (
                    <p className="text-fg-2">
                      We couldn&apos;t load your subscription just now. Try again in a moment.
                    </p>
                  )}
                </div>
                <Link
                  href="/subscription"
                  className={`${subscription && !subscription.active ? "ui-primary" : "ui-secondary"} shrink-0`}
                >
                  {subscription && !subscription.active ? "Subscribe" : "Manage subscription"}
                </Link>
              </div>
            </section>

            <section id="what-arbor-knows" className="scroll-mt-28" aria-labelledby="knows-title">
              <h2 id="knows-title" className="type-h2 mb-6">What Arbor knows</h2>
              <WhatArborKnows overview={overview} />
            </section>

            <section id="your-data" className="scroll-mt-28" aria-labelledby="data-title">
              <h2 id="data-title" className="type-h2 mb-6">Your data</h2>
              <div className="ui-surface divide-y divide-line">
                <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="type-label text-fg">Download a copy</p>
                    <p className="mt-1 type-caption text-fg-2">
                      Everything Arbor holds about you, in one file you can keep.
                    </p>
                  </div>
                  <a href="/account/export" className="ui-secondary shrink-0 gap-2">
                    <Icon name="download" size={18} />
                    Download
                  </a>
                </div>
                <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="type-label text-fg">Sign out</p>
                    <p className="mt-1 type-caption text-fg-2">
                      Signs you out of the website. Your apps stay signed in.
                    </p>
                  </div>
                  <form action="/auth/signout" method="post">
                    <button type="submit" className="ui-secondary w-full sm:w-auto">
                      Sign out
                    </button>
                  </form>
                </div>
                <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="type-label text-fg">Delete your account</p>
                    <p className="mt-1 type-caption text-fg-2">
                      Removes your account and everything Arbor holds, from every app.
                    </p>
                  </div>
                  <Link
                    href="/account/delete"
                    className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl px-4 type-label text-danger transition hover:bg-danger/10"
                  >
                    Delete account
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
