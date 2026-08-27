import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { PRIVACY_POLICY } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — Arbor",
  description:
    "How Arbor collects, uses, and protects your information across your Arbor account and the Arbor family of apps, including Thrive.",
  alternates: {
    canonical: "https://arborapps.co/privacy",
  },
  openGraph: {
    title: "Privacy Policy — Arbor",
    description:
      "How Arbor collects, uses, and protects your information across the Arbor family of apps.",
    url: "https://arborapps.co/privacy",
    type: "website",
  },
};

export default function PrivacyPage() {
  return <LegalDocument doc={PRIVACY_POLICY} />;
}
