import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageIntro } from "@/components/PageIntro";
import { WaitlistSection } from "@/components/WaitlistSection";
import { getPageSocialMetadata } from "@/lib/seo";

const title = "Arbor app early access | Join the waitlist";
const description = "Join the Arbor waitlist for updates and invitations as personal guide apps become ready for testing and early access.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://arborapps.co/early-access" },
  ...getPageSocialMetadata(title, description, "/early-access"),
};

export default function EarlyAccessPage() {
  return <main className="min-h-screen bg-bg text-fg"><Navbar tone="dark" /><PageIntro eyebrow="Early access" title="Be part of the beginning." image="/images/arbor-coastal-path.webp"><p>Aevo, Salus and Thrive are in testing. Access opens in stages as we build and refine the apps. <Link href="/progress" className="text-fg underline underline-offset-4">See where things stand.</Link></p></PageIntro><WaitlistSection showSocialLinks /><Footer /></main>;
}
