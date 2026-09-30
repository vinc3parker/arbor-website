import type { Metadata } from "next";
import { AppLanding } from "@/components/AppLanding";
import { apps } from "@/content/apps";
import { getProductSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Sage: your tutor | Arbor",
  description:
    "Learn what you need to grow, from courses to new curiosities. Built on Arbor, so it understands the whole of you, not just your studies.",
  keywords:
    "learning app, knowledge management, study app, educational app, skill development, learning platform",
  alternates: {
    canonical: "https://arborapps.co/sage",
  },
  openGraph: {
    title: "Sage: your tutor | Arbor",
    description:
      "Learn what you need to grow, from courses to new curiosities. Built on Arbor, so it understands the whole of you, not just your studies.",
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
    description:
      "Learn what you need to grow, from courses to new curiosities. Built on Arbor, so it understands the whole of you, not just your studies.",
    images: ["https://arborapps.co/og-sage.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Sage",
    "Learn what you need to grow, from courses to new curiosities. Built on Arbor, so it understands the whole of you, not just your studies.",
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