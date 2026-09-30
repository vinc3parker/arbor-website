import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GoogleAnalytics } from "@next/third-parties/google";
import { getOrganizationSchema, getWebsiteSchema } from "@/lib/schema";

// Poppins is the only brand typeface (brand guide 5.14).
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://arborapps.co"),
  verification: {
    google: "Glp10hFviQoJXfudbRS3Q5ajAmIKUQ_cnbusiGoei-k",
  },
  title: "Arbor — A guide for your whole life",
  description:
    "Arbor is eight apps, each with its own guide: a coach, a mentor, a money manager and more. They share one understanding of you, so every suggestion fits your whole life.",
  keywords: "arbor, arbor apps, personal life guidance, life guide app, aevo, salus, thrive, nura, wend, kith, telos, sage",
  alternates: {
    canonical: "https://arborapps.co",
  },
  openGraph: {
    title: "Arbor — A guide for your whole life",
    description:
      "Live more of the life you choose. Eight guides, one for every part of your life, that learn from each other.",
    url: "https://arborapps.co",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-image.png",
        width: 1200,
        height: 630,
        alt: "Arbor: live more of the life you choose",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arbor — A guide for your whole life",
    description:
      "Live more of the life you choose. Eight guides, one for every part of your life, that learn from each other.",
    images: ["https://arborapps.co/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${poppins.variable} theme-light h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getOrganizationSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getWebsiteSchema()),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId="G-K74WZKGYCY" />
      </body>
    </html>
  );
}
