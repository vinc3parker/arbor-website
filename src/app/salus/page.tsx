import type { Metadata } from "next";
import { AppLanding } from "@/components/AppLanding";
import { apps } from "@/content/apps";
import { getProductSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Salus — Mental Wellness & Journaling App | Arbor",
  description:
    "A calm space for reflection, journaling, and personal growth. Explore guided prompts and build a clearer picture of who you are over time.",
  keywords:
    "journaling app, mental wellness app, reflection app, mental health, personal growth, mindfulness, journaling",
  alternates: {
    canonical: "https://arborapps.co/salus",
  },
  openGraph: {
    title: "Salus — Mental Wellness & Journaling App | Arbor",
    description:
      "Journaling and reflection app for mental wellbeing. Explore guided prompts, understand yourself better, and grow intentionally.",
    url: "https://arborapps.co/salus",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-salus.png",
        width: 1200,
        height: 630,
        alt: "Salus mental wellness and journaling app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Salus — Mental Wellness & Journaling App | Arbor",
    description:
      "Journaling and reflection app for mental wellbeing. Explore guided prompts, understand yourself better, and grow intentionally.",
    images: ["https://arborapps.co/og-salus.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Salus",
    "Mental wellness and journaling app for reflection, personal growth, and understanding yourself better with guided prompts and journaling.",
    "https://arborapps.co/salus",
    "HealthAndFitnessApplication"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />
      <AppLanding app={apps.salus} />
    </>
  );
}