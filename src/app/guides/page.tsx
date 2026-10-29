import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ArborRoom } from "@/components/ArborRoom/ArborRoom";
import { getPageSocialMetadata } from "@/lib/seo";

const title = "Eight personal guide apps | Find your Arbor guide";
const description = "Explore Arbor’s eight personal self-help apps for training, wellbeing, money, work, relationships, learning, goals and adventure. Each guide is designed around your needs.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://arborapps.co/guides" },
  ...getPageSocialMetadata(title, description, "/guides"),
};

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-bg text-fg">
      <Navbar tone="dark" />
      <ArborRoom />
      <Footer />
    </main>
  );
}
