import type { Metadata } from "next";
import { AppLanding } from "@/components/AppLanding";
import { apps } from "@/content/apps";
import { getProductSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Telos: your mentor | Arbor",
  description:
    "Find purpose in your work and build a career that feels like yours. Built on Arbor, so it understands the whole of you, not just your job.",
  keywords:
    "career app, job search app, career planning, professional development, career guidance, job finding",
  alternates: {
    canonical: "https://arborapps.co/telos",
  },
  openGraph: {
    title: "Telos: your mentor | Arbor",
    description:
      "Find purpose in your work and build a career that feels like yours. Built on Arbor, so it understands the whole of you, not just your job.",
    url: "https://arborapps.co/telos",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-telos.png",
        width: 1200,
        height: 630,
        alt: "Telos, your mentor, by Arbor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Telos: your mentor | Arbor",
    description:
      "Find purpose in your work and build a career that feels like yours. Built on Arbor, so it understands the whole of you, not just your job.",
    images: ["https://arborapps.co/og-telos.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Telos",
    "Find purpose in your work and build a career that feels like yours. Built on Arbor, so it understands the whole of you, not just your job.",
    "https://arborapps.co/telos",
    "BusinessApplication"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />
      <AppLanding app={apps.telos} />
    </>
  );
}