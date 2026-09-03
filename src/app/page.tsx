import { Navbar } from "@/components/Navbar";
import { AboutSection } from "@/components/AboutSection";
import { AppsSection } from "@/components/AppsSection";
import { FoundingAccessSection } from "@/components/FoundingAccessSection";
import { WaitlistSection } from "@/components/WaitlistSection";
import { Footer } from "@/components/Footer";
import { homeCopy } from "@/content/home";
import { ArborRoom } from "@/components/ArborRoom/ArborRoom";
import { getAppStates, badgeForStatus } from "@/lib/app-states";

// App states (badges + observatory growth) are admin-managed; re-read hourly-ish.
export const revalidate = 60;

export default async function Home() {
  const states = await getAppStates();

  // Homepage card badges reflect live status (Beta / Live / none).
  const apps = homeCopy.apps.map((a) => {
    const st = states[a.name.toLowerCase()];
    return st ? { ...a, badge: badgeForStatus(st.status) } : a;
  });

  // Observatory portals grow according to each app's status.
  const statuses = Object.fromEntries(
    Object.values(states).map((s) => [s.appId, s.status])
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* The observatory — the eight apps around the eight dimensions. */}
      <ArborRoom statuses={statuses} />

      {/* Scroll down for the explanation: the problem, the ecosystem, the apps. */}
      <AboutSection />

      <AppsSection apps={apps} />

      {/* The pricing story: a free account, and Founding Access to unlock the apps. */}
      <FoundingAccessSection />

      <WaitlistSection />

      <Footer />
    </main>
  );
}
