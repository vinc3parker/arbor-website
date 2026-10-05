import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FindResults } from "@/components/business/FindResults";
import {
  geocodeAddress,
  nearbyPlaces,
  requireBusinessSession,
  searchMap,
  type MapPlace,
} from "@/lib/arbor-business";

export const metadata = {
  title: "Find your business — Arbor",
  robots: { index: false, follow: false },
};

const AREA_RADIUS_METERS = 1500;

export default async function FindBusinessPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; near?: string }>;
}) {
  const { q = "", near = "" } = await searchParams;
  const query = q.trim();
  const area = near.trim();
  const params = new URLSearchParams({ ...(query ? { q: query } : {}), ...(area ? { near: area } : {}) }).toString();
  await requireBusinessSession(`/business/find${params ? `?${params}` : ""}`);

  const searched = query.length >= 2 || area.length >= 2;
  let failed = false;
  const [nameMatches, centre] = await Promise.all([
    query.length >= 2 ? searchMap(query, 30).catch((): MapPlace[] => { failed = true; return []; }) : Promise.resolve([]),
    area.length >= 2 ? geocodeAddress(area) : Promise.resolve(null),
  ]);
  const inArea = centre
    ? await nearbyPlaces(centre.latitude, centre.longitude, AREA_RADIUS_METERS).catch((): MapPlace[] => { failed = true; return []; })
    : [];

  return (
    <main className="min-h-screen bg-bg text-fg">
      <Navbar />
      <div className="site-container pt-32 pb-24 sm:pt-36">
        <p className="ui-kicker"><Link href="/business" className="hover:text-fg">Arbor for businesses</Link></p>
        <h1 className="type-h1">Find your business</h1>
        <p className="ui-copy mt-3 max-w-2xl">
          Search by name, by town or postcode, or both, and see what&apos;s already on the Arbor map there. Found yours?
          Claim it to manage it.
        </p>

        <form className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-[1fr_1fr_auto]" action="/business/find">
          <label className="grid gap-1">
            <span className="ui-label">Business name</span>
            <input name="q" defaultValue={query} className="ui-field" placeholder="e.g. Calm Yoga" />
          </label>
          <label className="grid gap-1">
            <span className="ui-label">Town or postcode</span>
            <input name="near" defaultValue={area} className="ui-field" placeholder="e.g. LS1 3DW" />
          </label>
          <button type="submit" className="ui-primary self-end">Search</button>
        </form>

        {area && !centre && (
          <p className="mt-6 text-warning">We couldn&apos;t find &ldquo;{area}&rdquo; on the map. Try a postcode.</p>
        )}
        {failed && <p className="mt-6 text-danger">The search isn&apos;t available right now. Please try again shortly.</p>}

        {searched && (
          <section className="mt-10" aria-live="polite">
            {nameMatches.length || inArea.length || centre ? (
              <FindResults nameMatches={nameMatches} inArea={inArea} centre={centre} />
            ) : (
              <p className="ui-copy">Nothing on the map matches that search.</p>
            )}
            <div className="ui-surface mt-8 p-6">
              <h2 className="text-lg font-semibold">Not on the map?</h2>
              <p className="ui-copy mt-1">Add your business. We&apos;ll show you the map around your address first, just to be sure.</p>
              <Link href="/business/new" className="ui-secondary mt-4">Add a new business</Link>
            </div>
          </section>
        )}
      </div>
      <Footer />
    </main>
  );
}
