import type { Metadata } from "next";
import { SalusLanding } from "@/components/apps/SalusLanding";
import { getProductSchema } from "@/lib/schema";

export const revalidate = 60;

const description = "Salus is a private reflection companion for check-ins, journaling, guided reflection, conversations and source-linked personal insights.";

export const metadata: Metadata = {
  title: "Salus: your companion | Arbor",
  description,
  keywords: [
    "journaling app",
    "reflection app",
    "guided journaling",
    "mood check-in",
    "AI reflection companion",
    "personal insights",
  ],
  alternates: {
    canonical: "https://arborapps.co/salus",
  },
  openGraph: {
    title: "Salus: your companion | Arbor",
    description,
    url: "https://arborapps.co/salus",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-salus.png",
        width: 1200,
        height: 630,
        alt: "Salus, your companion, by Arbor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Salus: your companion | Arbor",
    description,
    images: ["https://arborapps.co/og-salus.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Salus",
    description,
    "https://arborapps.co/salus",
    "HealthAndFitnessApplication"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />
      <SalusLanding />
    </>
  );
}
