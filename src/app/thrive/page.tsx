import type { Metadata } from "next";
import { AppLanding } from "@/components/AppLanding";
import { apps } from "@/content/apps";
import { getProductSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Thrive — Organization & Productivity App | Arbor",
  description:
    "Build routines, manage your time intentionally, and stay ahead of life. Create structure that works with your real life, not against it.",
  keywords:
    "productivity app, organization app, routine planner, task management, time management, scheduling app",
  alternates: {
    canonical: "https://arborapps.co/thrive",
  },
  openGraph: {
    title: "Thrive — Organization & Productivity App | Arbor",
    description:
      "Organization and productivity app for building routines, managing your time, and staying on top of life intentionally.",
    url: "https://arborapps.co/thrive",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-thrive.png",
        width: 1200,
        height: 630,
        alt: "Thrive organization and productivity app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thrive — Organization & Productivity App | Arbor",
    description:
      "Organization and productivity app for building routines, managing your time, and staying on top of life intentionally.",
    images: ["https://arborapps.co/og-thrive.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Thrive",
    "Organization and productivity app for building routines, planning intentionally, and understanding where your time and energy actually go.",
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