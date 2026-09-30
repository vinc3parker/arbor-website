import type { Metadata } from "next";
import { AppLanding } from "@/components/AppLanding";
import { apps } from "@/content/apps";
import { getProductSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Thrive: your assistant | Arbor",
  description:
    "Your time, habits and routines, shaped around who you want to be. Built on Arbor, so it understands the whole of you, not just your calendar.",
  keywords:
    "productivity app, organisation app, routine planner, task management, time management, scheduling app",
  alternates: {
    canonical: "https://arborapps.co/thrive",
  },
  openGraph: {
    title: "Thrive: your assistant | Arbor",
    description:
      "Your time, habits and routines, shaped around who you want to be. Built on Arbor, so it understands the whole of you, not just your calendar.",
    url: "https://arborapps.co/thrive",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-thrive.png",
        width: 1200,
        height: 630,
        alt: "Thrive, your assistant, by Arbor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thrive: your assistant | Arbor",
    description:
      "Your time, habits and routines, shaped around who you want to be. Built on Arbor, so it understands the whole of you, not just your calendar.",
    images: ["https://arborapps.co/og-thrive.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Thrive",
    "Your time, habits and routines, shaped around who you want to be. Built on Arbor, so it understands the whole of you, not just your calendar.",
    "https://arborapps.co/thrive",
    "ProductivityApplication"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />
      <AppLanding app={apps.thrive} />
    </>
  );
}