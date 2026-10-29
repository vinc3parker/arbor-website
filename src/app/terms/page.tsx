import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { TERMS_OF_SERVICE } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms of Service — Arbor",
  description:
    "The Arbor-wide Terms of Service for your account, membership and shared services, supplemented by notices for each guide.",
  alternates: {
    canonical: "https://arborapps.co/terms",
  },
  openGraph: {
    title: "Terms of Service — Arbor",
    description:
      "The Arbor-wide agreement for your account, membership and shared services.",
    url: "https://arborapps.co/terms",
    type: "website",
  },
};

export default function TermsPage() {
  return <LegalDocument doc={TERMS_OF_SERVICE} />;
}
