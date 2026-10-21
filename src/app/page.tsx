import { Navbar } from "@/components/Navbar";
import { GroveSection } from "@/components/GroveSection";
import { WaitlistSection } from "@/components/WaitlistSection";
import { Footer } from "@/components/Footer";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeNarrative } from "@/components/home/HomeNarrative";
import { HomeGuideInvitation } from "@/components/home/HomeStory";

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen bg-bg text-fg">
      <Navbar />
      <HomeHero />
      <HomeNarrative />
      <HomeGuideInvitation />
      <GroveSection />
      <WaitlistSection />
      <Footer />
    </main>
  );
}
