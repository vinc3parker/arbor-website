import type { Metadata } from "next";
import { AppLanding } from "@/components/AppLanding";
import { apps } from "@/content/apps";
import { getProductSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Aevo — Personalised Training That Understands You | Arbor",
  description:
    "Aevo is training software that adapts to your goals, level, and schedule — for runners, lifters, hybrid athletes, and anyone who wants a plan built around them, not a generic template.",
  keywords: [
    "personalised training app",
    "adaptive training app",
    "training plan app",
    "hybrid athlete app",
    "running and strength training",
    "workout planner",
  ],
  alternates: { canonical: "https://arborapps.co/aevo" },
  openGraph: {
    title: "Aevo — Personalised Training That Understands You | Arbor",
    description:
      "Training software that adapts to your goals, level, and schedule. Aevo builds a plan around you — for runners, lifters, sport, or all three.",
    url: "https://arborapps.co/aevo",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-aevo.png",
        width: 1200,
        height: 630,
        alt: "Aevo — personalised training that adapts to you",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aevo — Personalised Training That Understands You | Arbor",
    description:
      "Training software that adapts to your goals, level, and schedule. Aevo builds a plan around you — for runners, lifters, sport, or all three.",
    images: ["https://arborapps.co/og-aevo.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Aevo",
    "Training software that adapts to your goals, level, and schedule, connecting gym, running, conditioning, and sport into one plan built around you.",
    "https://arborapps.co/aevo",
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
      <AppLanding app={apps.aevo} />
    </>
  );
}
