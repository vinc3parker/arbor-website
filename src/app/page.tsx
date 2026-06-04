import { AegleSection } from "@/components/AegleSection";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { AppsSection } from "@/components/AppsSection";
import { WaitlistSection } from "@/components/WaitlistSection";
import { Footer } from "@/components/Footer";
import { homeCopy } from "@/content/home";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <Hero
        title={homeCopy.hero.title}
        subtitle={homeCopy.hero.subtitle}
      />

      <AegleSection />

      <AppsSection
        apps={homeCopy.apps}
      />

      <WaitlistSection />

      <Footer />
    </main>
  );
}