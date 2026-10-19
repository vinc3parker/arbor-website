import type { Metadata } from "next";
import { AppLanding } from "@/components/AppLanding";
import { apps } from "@/content/apps";
import { getProductSchema } from "@/lib/schema";
import { getAppDescription } from "@/lib/app-metadata";

const description = getAppDescription("kith");

export const metadata: Metadata = {
  title: "Kith: your connector | Arbor",
  description,
  keywords:
    "social app, social network, messaging app, relationship app, social connection, communication app",
  alternates: {
    canonical: "https://arborapps.co/kith",
  },
  openGraph: {
    title: "Kith: your connector | Arbor",
    description,
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
    description,
    images: ["https://arborapps.co/og-kith.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Kith",
    description,
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