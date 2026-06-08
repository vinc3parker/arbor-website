import type { Metadata } from "next";
import { AppLanding } from "@/components/AppLanding";
import { apps } from "@/content/apps";
import { getProductSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Aegle — Training Software for Hybrid Athletes | Arbor",
  description:
    "Plan and track gym, running, conditioning, and sport in one connected system. Training software designed for athletes balancing multiple disciplines.",
  keywords:
    "training app, athlete training software, hybrid athlete, cross-sport training, workout planner, fitness app",
  alternates: {
    canonical: "https://arborapps.co/aegle",
  },
  openGraph: {
    title: "Aegle — Training Software for Hybrid Athletes | Arbor",
    description:
      "Unified training platform for hybrid athletes. Plan, track, and optimize gym, running, conditioning, and sport.",
    url: "https://arborapps.co/aegle",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-aegle.png",
        width: 1200,
        height: 630,
        alt: "Aegle training software for hybrid athletes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aegle — Training Software for Hybrid Athletes | Arbor",
    description:
      "Unified training platform for hybrid athletes. Plan, track, and optimize gym, running, conditioning, and sport.",
    images: ["https://arborapps.co/og-aegle.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Aegle",
    "Training software for hybrid athletes that helps you plan and track gym, running, conditioning, and sport in one connected system.",
    "https://arborapps.co/aegle",
    "ProductivityApplication"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />
      <AppLanding app={apps.aegle} />
    </>
  );
}