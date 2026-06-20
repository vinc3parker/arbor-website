import type { Metadata } from "next";
import { AppLanding } from "@/components/AppLanding";
import { apps } from "@/content/apps";
import { getProductSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Aegle — Training App for Hybrid Athletes | Arbor",
  description:
    "Plan and track gym, running, conditioning, and sport in one connected system. Aegle is training software built for hybrid athletes, around your goals, level, and events.",
  keywords: [
    "hybrid athlete app",
    "training app",
    "running and strength training",
    "workout tracker",
    "conditioning app",
    "athletic performance app",
  ],
  alternates: { canonical: "https://arborapps.co/aegle" },
  openGraph: {
    title: "Aegle — Training App for Hybrid Athletes | Arbor",
    description:
      "Training software for hybrid athletes. Plan gym, run, conditioning, and sport in one connected system built around your goals and events.",
    url: "https://arborapps.co/aegle",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-aegle.png",
        width: 1200,
        height: 630,
        alt: "Aegle training app for hybrid athletes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aegle — Training App for Hybrid Athletes | Arbor",
    description:
      "Training software for hybrid athletes. Plan gym, run, conditioning, and sport in one connected system.",
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