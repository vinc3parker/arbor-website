import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { PRIVACY_POLICY } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — Arbor",
  description:
    "The Arbor-wide privacy policy for your account, membership and shared services, with supplementary data notices for each Arbor guide.",
  alternates: {
    canonical: "https://arborapps.co/privacy",
  },
  openGraph: {
    title: "Privacy Policy — Arbor",
    description:
      "How Arbor handles account and shared-service information, with supplementary data notices for each guide.",
    url: "https://arborapps.co/privacy",
    type: "website",
  },
};

export default function PrivacyPage() {
  return <LegalDocument doc={PRIVACY_POLICY} />;
}
