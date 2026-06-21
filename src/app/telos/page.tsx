import type { Metadata } from "next";
import { AppLanding } from "@/components/AppLanding";
import { apps } from "@/content/apps";
import { getProductSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Telos — Career & Work Purpose App | Arbor",
  description:
    "Find work that fits who you are. Explore opportunities, understand your strengths, and build a career that supports the life you want.",
  keywords:
    "career app, job search app, career planning, professional development, career guidance, job finding",
  alternates: {
    canonical: "https://arborapps.co/telos",
  },
  openGraph: {
    title: "Telos — Career & Work Purpose App | Arbor",
    description:
      "Career and purpose app for finding work that aligns with who you are. Build a career that supports your life, not the other way around.",
    url: "https://arborapps.co/telos",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-telos.png",
        width: 1200,
        height: 630,
        alt: "Telos career and work purpose app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Telos — Career & Work Purpose App | Arbor",
    description:
      "Career and purpose app for finding work that aligns with who you are. Build a career that supports your life, not the other way around.",
    images: ["https://arborapps.co/og-telos.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Telos",
    "Career and work purpose app that helps people think more intentionally about work, growth, and purpose.",
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