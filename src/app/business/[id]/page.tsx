import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BusinessDetailsForm } from "@/components/business/BusinessDetailsForm";
import { LocationForm } from "@/components/business/LocationForm";
import { TeamPanel } from "@/components/business/TeamPanel";
import { TimetableEditor } from "@/components/business/TimetableEditor";
import { kindLabel } from "@/components/business/options";
import {
  listBusinesses,
  listMembers,
  requireBusinessSession,
  type Membership,
} from "@/lib/arbor-business";

export const metadata = {
  title: "Manage your business — Arbor",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  { id: "details", label: "Details" },
  { id: "locations", label: "Locations" },
  { id: "timetable", label: "Timetable" },
  { id: "team", label: "Team" },
];

export default async function ManageBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireBusinessSession(`/business/${id}`);
  const business = (await listBusinesses(session.token)).find((item) => item.organisation.id === id);
  if (!business) notFound();

  const { organisation, places, sessions, membership } = business;
  const canManage = membership.role === "owner" || membership.role === "admin";
  const members = canManage
    ? await listMembers(session.token, id).catch((): Membership[] | null => null)
    : null;
  const editablePlaces = places.filter((place) => membership.placeIds == null || membership.placeIds.includes(place.id));

  return (
    <main className="min-h-screen bg-bg text-fg">
      <Navbar />
      <div className="site-container pt-32 pb-24 sm:pt-36">
        <header>
          <p className="ui-kicker"><Link href="/business" className="hover:text-fg">Your businesses</Link></p>
          <h1 className="type-h1">{organisation.name}</h1>
          <p className="mt-3 type-caption text-fg-2">
            {kindLabel(organisation.kind)} · {places.length} location{places.length === 1 ? "" : "s"} · You&apos;re{" "}
            {membership.role === "editor" ? "an editor" : `an ${membership.role}`}
          </p>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[13rem_1fr]">
          <nav aria-label="Business sections" className="hidden lg:block">
            <ul className="sticky top-28 space-y-1">
              {SECTIONS.filter((section) => section.id !== "team" || canManage).map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="block rounded-xl px-3 py-2 type-label text-fg-2 transition hover:bg-surface hover:text-fg">
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-16">
            <section id="details" aria-labelledby="details-heading" className="scroll-mt-28">
              <h2 id="details-heading" className="type-h2">Details</h2>
              <p className="ui-copy mt-1">How your business appears across Arbor.</p>
              <div className="mt-6">
                <BusinessDetailsForm organisation={organisation} canEdit={canManage} />
              </div>
            </section>

            <section id="locations" aria-labelledby="locations-heading" className="scroll-mt-28">
              <h2 id="locations-heading" className="type-h2">Locations</h2>
              <p className="ui-copy mt-1">
                Where you are on the map and everything people can do there. Someone searching for squash or yoga finds
                you if it&apos;s listed here.
              </p>
              <div className="mt-6 space-y-4">
                {editablePlaces.map((place) => (
                  <LocationForm key={place.id} place={place} organisationId={organisation.id} />
                ))}
                {!editablePlaces.length && (
                  <p className="ui-copy">
                    {organisation.kind === "class_provider"
                      ? "You don't have a venue of your own. Add the venues you teach at to each session in your timetable."
                      : "No locations yet."}
                  </p>
                )}
              </div>
            </section>

            <section id="timetable" aria-labelledby="timetable-heading" className="scroll-mt-28">
              <h2 id="timetable-heading" className="type-h2">Weekly timetable</h2>
              <p className="ui-copy mt-1">
                Classes, club training and open sessions that happen every week. Publishing replaces your current
                timetable on Arbor, including any we&apos;d found automatically.
              </p>
              <div className="mt-6">
                <TimetableEditor organisationId={organisation.id} sessions={sessions} places={places} />
              </div>
            </section>

            {canManage && (
              <section id="team" aria-labelledby="team-heading" className="scroll-mt-28">
                <h2 id="team-heading" className="type-h2">Team</h2>
                <p className="ui-copy mt-1">People who can help keep {organisation.name} up to date.</p>
                <div className="mt-6">
                  <TeamPanel
                    organisationId={organisation.id}
                    members={members}
                    currentUserId={session.userId}
                    isOwner={membership.role === "owner"}
                  />
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
