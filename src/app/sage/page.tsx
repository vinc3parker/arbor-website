import type { Metadata } from "next";
import { AppLanding } from "@/components/AppLanding";
import { apps } from "@/content/apps";
import { getProductSchema } from "@/lib/schema";
import { getAppDescription } from "@/lib/app-metadata";

const description = getAppDescription("sage");

export const metadata: Metadata = {
  title: "Sage: your tutor | Arbor",
  description,
  keywords:
    "learning app, knowledge management, study app, educational app, skill development, learning platform",
  alternates: {
    canonical: "https://arborapps.co/sage",
  },
  openGraph: {
    title: "Sage: your tutor | Arbor",
    description,
    url: "https://arborapps.co/sage",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-sage.png",
        width: 1200,
        height: 630,
        alt: "Sage, your tutor, by Arbor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sage: your tutor | Arbor",
    description,
    images: ["https://arborapps.co/og-sage.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Sage",
    description,
    "https://arborapps.co/sage",
    "EducationalApplication"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />
      <AppLanding app={apps.sage} />
    </>
  );
}