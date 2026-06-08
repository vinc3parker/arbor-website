import type { Metadata } from "next";
import { AppLanding } from "@/components/AppLanding";
import { apps } from "@/content/apps";
import { getProductSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Circa — Social Connection App | Arbor",
  description:
    "Intentional social connection without endless scrolling. Stay connected and build stronger relationships with the people who matter.",
  keywords:
    "social app, social network, messaging app, relationship app, social connection, communication app",
  alternates: {
    canonical: "https://arborapps.co/circa",
  },
  openGraph: {
    title: "Circa — Social Connection App | Arbor",
    description:
      "Social connection app that brings relationships back to what matters. Connect intentionally without endless feeds or algorithms.",
    url: "https://arborapps.co/circa",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-circa.png",
        width: 1200,
        height: 630,
        alt: "Circa social connection app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Circa — Social Connection App | Arbor",
    description:
      "Social connection app that brings relationships back to what matters. Connect intentionally without endless feeds or algorithms.",
    images: ["https://arborapps.co/og-circa.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Circa",
    "Social connection app built around relationships that deserve more than feeds and algorithms.",
    "https://arborapps.co/circa",
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
      <AppLanding app={apps.circa} />
    </>
  );
}