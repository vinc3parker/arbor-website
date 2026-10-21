import type { Metadata } from "next";
import { AppLanding } from "@/components/AppLanding";
import { apps } from "@/content/apps";
import { getProductSchema } from "@/lib/schema";
import { getAppDescription } from "@/lib/app-metadata";

const description = getAppDescription("wend");

export const metadata: Metadata = {
  title: "Wend: your explorer | Arbor",
  description,
  keywords:
    "travel app, travel planning, exploration app, travel recommendations, travel guide, travel planning app",
  alternates: {
    canonical: "https://arborapps.co/wend",
  },
  openGraph: {
    title: "Wend: your explorer | Arbor",
    description,
    url: "https://arborapps.co/wend",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-wend.png",
        width: 1200,
        height: 630,
        alt: "Wend, your explorer, by Arbor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wend: your explorer | Arbor",
    description,
    images: ["https://arborapps.co/og-wend.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Wend",
    description,
    "https://arborapps.co/wend",
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
      <AppLanding app={apps.wend} />
    </>
  );
}