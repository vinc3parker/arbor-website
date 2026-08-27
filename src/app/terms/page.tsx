import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { TERMS_OF_SERVICE } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms of Service — Arbor",
  description:
    "The Terms of Service for your Arbor account and the Arbor family of apps, including Thrive.",
  alternates: {
    canonical: "https://arborapps.co/terms",
  },
  openGraph: {
    title: "Terms of Service — Arbor",
    description:
      "The Terms of Service for your Arbor account and the Arbor family of apps.",
    url: "https://arborapps.co/terms",
    type: "website",
  },
};

export default function TermsPage() {
  return <LegalDocument doc={TERMS_OF_SERVICE} />;
}
