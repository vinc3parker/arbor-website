import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageIntro } from "@/components/PageIntro";
import { AboutSection } from "@/components/AboutSection";
import { WaitlistSection } from "@/components/WaitlistSection";

export const metadata: Metadata = {
  title: "How Arbor works — Arbor",
  description: "See how Arbor's eight specialist apps and their AI guides are being built to connect around your life and form a fuller picture.",
  alternates: { canonical: "https://arborapps.co/how-it-works" },
};

export default function HowItWorksPage() {
  return <main className="min-h-screen bg-bg text-fg"><Navbar tone="dark" /><PageIntro eyebrow="How Arbor works" title="Eight specialist apps, built to work together." image="/images/arbor-woodland.webp"><p>Each app focuses on one part of life and has its own AI guide. Arbor is being built to connect them, so support in one area can take account of the others.</p></PageIntro><AboutSection /><WaitlistSection /><Footer /></main>;
}
