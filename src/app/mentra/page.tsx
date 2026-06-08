import type { Metadata } from "next";
import { AppLanding } from "@/components/AppLanding";
import { apps } from "@/content/apps";
import { getProductSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Mentra — Learning & Knowledge Management App | Arbor",
  description:
    "Build knowledge intentionally. Learn with more direction and less overwhelm. Connect ideas together and make progress toward genuine understanding.",
  keywords:
    "learning app, knowledge management, study app, educational app, skill development, learning platform",
  alternates: {
    canonical: "https://arborapps.co/mentra",
  },
  openGraph: {
    title: "Mentra — Learning & Knowledge Management App | Arbor",
    description:
      "Learning and knowledge app for building knowledge intentionally. Connect ideas, track learning, and grow in what you care about.",
    url: "https://arborapps.co/mentra",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-mentra.png",
        width: 1200,
        height: 630,
        alt: "Mentra learning and knowledge management app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mentra — Learning & Knowledge Management App | Arbor",
    description:
      "Learning and knowledge app for building knowledge intentionally. Connect ideas, track learning, and grow in what you care about.",
    images: ["https://arborapps.co/og-mentra.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Mentra",
    "Learning and knowledge management app that helps people learn with more direction and less overwhelm.",
    "https://arborapps.co/mentra",
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
      <AppLanding app={apps.mentra} />
    </>
  );
}