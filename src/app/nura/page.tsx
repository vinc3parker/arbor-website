import type { Metadata } from "next";
import { AppLanding } from "@/components/AppLanding";
import { apps } from "@/content/apps";
import { getProductSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Nura: your money manager | Arbor",
  description:
    "See how your money is doing and make it work for the life you want. Built on Arbor, so it understands the whole of you, not just your spending.",
  keywords:
    "personal finance app, budgeting app, financial planning, money management, expense tracker, savings app",
  alternates: {
    canonical: "https://arborapps.co/nura",
  },
  openGraph: {
    title: "Nura: your money manager | Arbor",
    description:
      "See how your money is doing and make it work for the life you want. Built on Arbor, so it understands the whole of you, not just your spending.",
    url: "https://arborapps.co/nura",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-nura.png",
        width: 1200,
        height: 630,
        alt: "Nura, your money manager, by Arbor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nura: your money manager | Arbor",
    description:
      "See how your money is doing and make it work for the life you want. Built on Arbor, so it understands the whole of you, not just your spending.",
    images: ["https://arborapps.co/og-nura.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Nura",
    "See how your money is doing and make it work for the life you want. Built on Arbor, so it understands the whole of you, not just your spending.",
    "https://arborapps.co/nura",
    "FinanceApplication"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />
      <AppLanding app={apps.nura} />
    </>
  );
}