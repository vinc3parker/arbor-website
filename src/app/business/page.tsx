import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClaimList } from "@/components/business/ClaimList";
import { kindLabel, offeringLabel } from "@/components/business/options";
import {
  getBusinessSession,
  listBusinesses,
  listClaims,
  type Business,
  type Claim,
} from "@/lib/arbor-business";

export const metadata = {
  title: "Arbor for businesses",
  description: "Put your business, club or team on the Arbor map, and keep your details, opening hours and timetable up to date.",
};

const STEPS = [
  ["Find or add your business", "Search the Arbor map for your pub, café, gym, studio, workshop, club or team, or add it if it isn't there yet."],
  ["Confirm it's yours", "Sign up with an email on your business website's domain and it's yours straight away. Otherwise we check with you first."],
  ["Keep it up to date", "Edit your details, opening hours, everything people can find there and your weekly timetable, and bring in your team."],
];

export default async function BusinessPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string }>;
}) {
  const { added } = await searchParams;
  const session = await getBusinessSession();

  if (!session) {
    return (
      <main className="min-h-screen bg-bg text-fg">
        <Navbar />
        <div className="site-container pt-32 pb-24 sm:pt-36">
          <p className="ui-kicker">Arbor for businesses</p>
          <h1 className="type-h1 max-w-3xl">Put your business, club or team on the Arbor map</h1>
          <p className="ui-copy mt-4 max-w-2xl text-lg">
            People use Arbor&apos;s apps to find places to train, things to do, places to eat and drink, classes to join
            and clubs to be part of. Claim your listing to keep it accurate and show everything you offer. It&apos;s free, and you don&apos;t need an Arbor
            subscription: it&apos;s the same Arbor account you&apos;d use for the apps.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login?redirect=/business" className="ui-primary">Sign in or create an account</Link>
          </div>
          <ol className="mt-16 grid gap-4 md:grid-cols-3">
            {STEPS.map(([title, copy], index) => (
              <li key={title} className="ui-surface p-6">
                <p className="type-caption text-fg-2">Step {index + 1}</p>
                <h2 className="mt-2 text-lg font-semibold">{title}</h2>
                <p className="ui-copy mt-2">{copy}</p>
              </li>
            ))}
          </ol>
        </div>
        <Footer />
      </main>
    );
  }

  const [businesses, claims] = await Promise.all([
    listBusinesses(session.token).catch((): Business[] | null => null),
    listClaims(session.token).catch((): Claim[] | null => null),
  ]);
  const openClaims = (claims ?? []).filter((claim) => claim.status === "pending" || claim.status === "rejected");

  return (
    <main className="min-h-screen bg-bg text-fg">
      <Navbar />
      <div className="site-container pt-32 pb-24 sm:pt-36">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="ui-kicker">Arbor for businesses</p>
            <h1 className="type-h1">Your businesses</h1>
            <p className="mt-3 type-caption text-fg-2">Signed in as {session.email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/business/find" className="ui-primary">Find your business</Link>
            <Link href="/business/new" className="ui-secondary">Add a new business</Link>
          </div>
        </header>

        {added && (
          <p className="ui-status mt-8" role="status">
            Thanks, we&apos;ve got your request. We&apos;ll check it and it&apos;ll appear here once approved.
          </p>
        )}
        {businesses === null && (
          <p className="mt-8 text-danger">We couldn&apos;t load your businesses just now. Please refresh to try again.</p>
        )}

        <section className="mt-12" aria-labelledby="managed-heading">
          <h2 id="managed-heading" className="sr-only">Businesses you manage</h2>
          {businesses && businesses.length > 0 ? (
            <ul className="grid gap-4 md:grid-cols-2">
              {businesses.map(({ organisation, places, sessions, membership }) => {
                const offerings = [...new Set(places.flatMap((place) => place.activities))];
                return (
                  <li key={organisation.id} className="ui-surface flex flex-col p-6">
                    <p className="type-caption text-fg-2">
                      {kindLabel(organisation.kind)} · You&apos;re {membership.role === "editor" ? "an editor" : `an ${membership.role}`}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold">{organisation.name}</h3>
                    <p className="ui-copy mt-1">
                      {places.length === 1 ? places[0].location ?? "No address yet" : `${places.length} locations`}
                      {` · ${sessions.length} weekly session${sessions.length === 1 ? "" : "s"}`}
                    </p>
                    {offerings.length > 0 && (
                      <p className="mt-3 flex flex-wrap gap-2">
                        {offerings.slice(0, 8).map((slug) => (
                          <span key={slug} className="ui-status">{offeringLabel(slug)}</span>
                        ))}
                      </p>
                    )}
                    {places.some((place) => !place.website) && (
                      <p className="mt-3 type-caption text-warning">Add your website so people can find out more.</p>
                    )}
                    <div className="mt-auto pt-6">
                      <Link href={`/business/${organisation.id}`} className="ui-secondary">Manage</Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : businesses ? (
            <div className="ui-surface p-8">
              <h3 className="text-lg font-semibold">You don&apos;t manage any businesses yet</h3>
              <p className="ui-copy mt-2 max-w-xl">
                Your gym, studio or club may already be on the Arbor map. Find it and claim it, or add it if it isn&apos;t there.
              </p>
            </div>
          ) : null}
        </section>

        {openClaims.length > 0 && (
          <section className="mt-12" aria-labelledby="claims-heading">
            <h2 id="claims-heading" className="type-h2">Your requests</h2>
            <ClaimList claims={openClaims} />
          </section>
        )}
      </div>
      <Footer />
    </main>
  );
}
