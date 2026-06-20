import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GoogleAnalyticsComponent } from "@/components/GoogleAnalytics";
import { getOrganizationSchema, getWebsiteSchema } from "@/lib/schema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://arborapps.co"),
  verification: {
    google: "Glp10hFviQoJXfudbRS3Q5ajAmIKUQ_cnbusiGoei-k",
  },
  title: "Arbor Apps — Ecosystem for Intentional Living",
  description:
    "Discover Arbor apps for performance training, mental wellbeing, organization, finance, travel, social connection, careers, and learning. Join the ecosystem for intentional living.",
  keywords: "arbor apps, arbor app, productivity apps, wellness app, training app, intentional living",
  alternates: {
    canonical: "https://arborapps.co",
  },
  openGraph: {
    title: "Arbor Apps — Ecosystem for Intentional Living",
    description:
      "Performance, wellbeing, organization, finance, travel, social connection, careers, and learning apps designed for people who want more from life.",
    url: "https://arborapps.co",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-image.png",
        width: 1200,
        height: 630,
        alt: "Arbor Apps ecosystem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arbor Apps — Ecosystem for Intentional Living",
    description:
      "Performance, wellbeing, organization, finance, travel, social connection, careers, and learning apps designed for people who want more from life.",
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
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-K74WZKGYCY"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-K74WZKGYCY');`,
          }}
        />
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
      </body>
    </html>
  );
}
