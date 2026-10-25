import type { Metadata } from "next";
import { NuraLanding } from "@/components/apps/NuraLanding";
import { getProductSchema } from "@/lib/schema";

const description =
  "Nura turns income, spending, budgets, savings goals and plans from across Arbor into clear money decisions and useful next steps.";

export const metadata: Metadata = {
  title: "Nura: your money manager | Arbor",
  description,
  keywords:
    "personal finance app, budgeting app, financial planning, money management, expense tracker, savings app",
  alternates: {
    canonical: "https://arborapps.co/nura",
  },
  openGraph: {
    title: "Nura: your money manager | Arbor",
    description,
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
    description,
    images: ["https://arborapps.co/og-nura.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Nura",
    description,
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
      <NuraLanding />
    </>
  );
}
