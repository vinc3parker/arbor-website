import { Navbar } from "@/components/Navbar";
import { AboutSection } from "@/components/AboutSection";
import { AppsSection } from "@/components/AppsSection";
import { FoundingAccessSection } from "@/components/FoundingAccessSection";
import { WaitlistSection } from "@/components/WaitlistSection";
import { Footer } from "@/components/Footer";
import { homeCopy } from "@/content/home";
import { ArborRoom } from "@/components/ArborRoom/ArborRoom";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* The observatory — the eight apps around the eight dimensions. */}
      <ArborRoom />

      {/* Scroll down for the explanation: the problem, the ecosystem, the apps. */}
      <AboutSection />

      <AppsSection apps={homeCopy.apps} />

      {/* The pricing story: a free account, and Founding Access to unlock the apps. */}
      <FoundingAccessSection />

      <WaitlistSection />

      <Footer />
    </main>
  );
}
