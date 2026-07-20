"use client";

import { useEffect } from "react";

/**
 * Bounces the browser to the app's custom-scheme deep link so the hosted
 * sign-in's warm path can complete. Inside the app's auth session
 * (ASWebAuthenticationSession on iOS / a Custom Tab on Android) this navigation
 * is captured and control returns to the app carrying `code`+`state`. In an
 * ordinary browser it either opens the app via the scheme or no-ops — the
 * visible "Open" button on the fallback page is the manual backup.
 */
export function ReturnToApp({ returnUrl }: { returnUrl: string }) {
  useEffect(() => {
    // A tiny delay lets the page paint "Returning to…" before we navigate away.
    const t = setTimeout(() => {
      window.location.replace(returnUrl);
    }, 50);
    return () => clearTimeout(t);
  }, [returnUrl]);

  return null;
}
