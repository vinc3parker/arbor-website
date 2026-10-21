import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AppsSection } from "@/components/AppsSection";
import { ArborRoom } from "@/components/ArborRoom/ArborRoom";
import { WaitlistSection } from "@/components/WaitlistSection";
import { homeCopy } from "@/content/home";

export const metadata: Metadata = {
  title: "Meet your guides — Arbor",
  description: "Explore Arbor's eight specialist apps through the archways. Meet each app's personal AI guide and see its current development stage.",
  alternates: { canonical: "https://arborapps.co/guides" },
};

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-bg text-fg">
      <Navbar tone="dark" />
      <ArborRoom />
      <AppsSection apps={homeCopy.apps} />
      <WaitlistSection /><Footer />
    </main>
  );
}
