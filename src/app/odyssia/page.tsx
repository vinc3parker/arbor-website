import type { Metadata } from "next";
import { AppLanding } from "@/components/AppLanding";
import { apps } from "@/content/apps";
import { getProductSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Odyssia — Travel & Exploration App | Arbor",
  description:
    "Discover places, experiences, and moments worth remembering. Explore the world shaped around what you enjoy and who you are becoming.",
  keywords:
    "travel app, travel planning, exploration app, travel recommendations, travel guide, travel planning app",
  alternates: {
    canonical: "https://arborapps.co/odyssia",
  },
  openGraph: {
    title: "Odyssia — Travel & Exploration App | Arbor",
    description:
      "Travel and exploration app for discovering places and experiences that feel right for you. Plan more meaningful adventures.",
    url: "https://arborapps.co/odyssia",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-odyssia.png",
        width: 1200,
        height: 630,
        alt: "Odyssia travel and exploration app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Odyssia — Travel & Exploration App | Arbor",
    description:
      "Travel and exploration app for discovering places and experiences that feel right for you. Plan more meaningful adventures.",
    images: ["https://arborapps.co/og-odyssia.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Odyssia",
    "Travel and exploration app that helps you find places, experiences, and moments shaped around what you enjoy.",
    "https://arborapps.co/odyssia",
    "TravelApplication"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />
      <AppLanding app={apps.odyssia} />
    </>
  );
}