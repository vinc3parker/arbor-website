import { GoogleAnalytics } from "@next/third-parties/google";

export function GoogleAnalyticsComponent() {
  const measurementId = process.env.NEXT_PUBLIC_GA_ID;

  if (!measurementId) {
    console.warn(
      "Google Analytics measurement ID not found. Set NEXT_PUBLIC_GA_ID in .env.local"
    );
    return null;
  }

  return <GoogleAnalytics gaId={measurementId} />;
}
