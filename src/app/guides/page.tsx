import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { ArborRoom } from "@/components/ArborRoom/ArborRoom";

export const metadata: Metadata = {
  title: "Meet your guides — Arbor",
  description: "Step through the archways to explore Arbor's eight specialist apps and meet their personal AI guides.",
  alternates: { canonical: "https://arborapps.co/guides" },
};

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-bg text-fg">
      <Navbar tone="dark" />
      <ArborRoom />
    </main>
  );
}
