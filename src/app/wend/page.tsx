import type { Metadata } from "next";
import { AppLanding } from "@/components/AppLanding";
import { apps } from "@/content/apps";
import { getProductSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Wend: your explorer | Arbor",
  description:
    "Make the most of your free time, from holidays to nights in. Built on Arbor, so it understands the whole of you, not just your weekends.",
  keywords:
    "travel app, travel planning, exploration app, travel recommendations, travel guide, travel planning app",
  alternates: {
    canonical: "https://arborapps.co/wend",
  },
  openGraph: {
    title: "Wend: your explorer | Arbor",
    description:
      "Make the most of your free time, from holidays to nights in. Built on Arbor, so it understands the whole of you, not just your weekends.",
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
    description:
      "Make the most of your free time, from holidays to nights in. Built on Arbor, so it understands the whole of you, not just your weekends.",
    images: ["https://arborapps.co/og-wend.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Wend",
    "Make the most of your free time, from holidays to nights in. Built on Arbor, so it understands the whole of you, not just your weekends.",
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