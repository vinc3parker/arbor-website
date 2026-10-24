import type { Metadata } from "next";
import { ThriveLanding } from "@/components/apps/ThriveLanding";
import { getProductSchema } from "@/lib/schema";

export const revalidate = 60;

const description = "Thrive brings tasks, projects, routines and scheduled commitments into one realistic plan, with AI-assisted capture, focus and daily review.";

export const metadata: Metadata = {
  title: "Thrive: your assistant | Arbor",
  description,
  keywords:
    "productivity app, organisation app, routine planner, task management, time management, scheduling app",
  alternates: {
    canonical: "https://arborapps.co/thrive",
  },
  openGraph: {
    title: "Thrive: your assistant | Arbor",
    description,
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
    description,
    images: ["https://arborapps.co/og-thrive.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Thrive",
    description,
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
      <ThriveLanding />
    </>
  );
}
