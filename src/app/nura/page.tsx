import type { Metadata } from "next";
import { AppLanding } from "@/components/AppLanding";
import { apps } from "@/content/apps";
import { getProductSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Nura — Personal Finance App | Arbor",
  description:
    "Personal finance app designed to help you understand your finances without stress. Plan ahead, save with purpose, and build better money habits.",
  keywords:
    "personal finance app, budgeting app, financial planning, money management, expense tracker, savings app",
  alternates: {
    canonical: "https://arborapps.co/nura",
  },
  openGraph: {
    title: "Nura — Personal Finance App | Arbor",
    description:
      "Personal finance app for understanding your money, planning ahead, and building better financial habits that support your life.",
    url: "https://arborapps.co/nura",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-nura.png",
        width: 1200,
        height: 630,
        alt: "Nura personal finance app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nura — Personal Finance App | Arbor",
    description:
      "Personal finance app for understanding your money, planning ahead, and building better financial habits that support your life.",
    images: ["https://arborapps.co/og-nura.png"],
  },
};

export default function Page() {
  const schemaData = getProductSchema(
    "Nura",
    "Personal finance app designed to help people understand their finances without turning money into stress.",
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