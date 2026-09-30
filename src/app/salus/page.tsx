import type { Metadata } from "next";
import { AppLanding } from "@/components/AppLanding";
import { apps } from "@/content/apps";
import { getProductSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Salus: your companion | Arbor",
  description:
    "Understand your thoughts and handle the life you are living. Built on Arbor, so it understands the whole of you, not just your mood.",
  keywords:
    "journaling app, mental wellness app, reflection app, mental health, personal growth, mindfulness, journaling",
  alternates: {
    canonical: "https://arborapps.co/salus",
  },
  openGraph: {
    title: "Salus: your companion | Arbor",
    description:
      "Understand your thoughts and handle the life you are living. Built on Arbor, so it understands the whole of you, not just your mood.",
    url: "https://arborapps.co/salus",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-salus.png",
        width: 1200,
        height: 630,
        alt: "Salus, your companion, by Arbor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Salus: your companion | Arbor",
    description:
      "Understand your thoughts and handle the life you are living. Built on Arbor, so it understands the whole of you, not just your mood.",
    images: ["https://arborapps.co/og-salus.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Salus",
    "Understand your thoughts and handle the life you are living. Built on Arbor, so it understands the whole of you, not just your mood.",
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