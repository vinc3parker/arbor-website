import type { Metadata } from "next";
import { AppLanding } from "@/components/AppLanding";
import { apps } from "@/content/apps";
import { getProductSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Kith: your connector | Arbor",
  description:
    "Stay close to your people and meet new ones you will click with. Built on Arbor, so it understands the whole of you, not just your contacts.",
  keywords:
    "social app, social network, messaging app, relationship app, social connection, communication app",
  alternates: {
    canonical: "https://arborapps.co/kith",
  },
  openGraph: {
    title: "Kith: your connector | Arbor",
    description:
      "Stay close to your people and meet new ones you will click with. Built on Arbor, so it understands the whole of you, not just your contacts.",
    url: "https://arborapps.co/kith",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-kith.png",
        width: 1200,
        height: 630,
        alt: "Kith, your connector, by Arbor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kith: your connector | Arbor",
    description:
      "Stay close to your people and meet new ones you will click with. Built on Arbor, so it understands the whole of you, not just your contacts.",
    images: ["https://arborapps.co/og-kith.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Kith",
    "Stay close to your people and meet new ones you will click with. Built on Arbor, so it understands the whole of you, not just your contacts.",
    "https://arborapps.co/kith",
    "SocialApplication"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />
      <AppLanding app={apps.kith} />
    </>
  );
}