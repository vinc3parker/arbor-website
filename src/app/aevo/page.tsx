import type { Metadata } from "next";
import { AppLanding } from "@/components/AppLanding";
import { apps } from "@/content/apps";
import { getProductSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Aevo: your coach | Arbor",
  description:
    "Your coach for training, recovery and a body ready for anything. Built on Arbor, so it understands the whole of you, not just your workouts.",
  keywords: [
    "personalised training app",
    "adaptive training app",
    "training plan app",
    "hybrid athlete app",
    "running and strength training",
    "workout planner",
  ],
  alternates: { canonical: "https://arborapps.co/aevo" },
  openGraph: {
    title: "Aevo: your coach | Arbor",
    description:
      "Your coach for training, recovery and a body ready for anything. Built on Arbor, so it understands the whole of you, not just your workouts.",
    url: "https://arborapps.co/aevo",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-aevo.png",
        width: 1200,
        height: 630,
        alt: "Aevo, your coach, by Arbor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aevo: your coach | Arbor",
    description:
      "Your coach for training, recovery and a body ready for anything. Built on Arbor, so it understands the whole of you, not just your workouts.",
    images: ["https://arborapps.co/og-aevo.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Aevo",
    "Your coach for training, recovery and a body ready for anything. Built on Arbor, so it understands the whole of you, not just your workouts.",
    "https://arborapps.co/aevo",
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
      <AppLanding app={apps.aevo} />
    </>
  );
}
