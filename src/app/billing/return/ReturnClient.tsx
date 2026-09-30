"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * After billing, try to hand control back to the native app via its custom URL
 * scheme. If the app isn't installed (or the OS blocks the jump), the visible
 * button + "stay on the web" link keep the user unstuck — and entitlement
 * re-syncs in the app on its next token refresh regardless.
 */
export function BillingReturnRedirect({
  deepLink,
  appName,
}: {
  deepLink: string;
  appName: string | null;
}) {
  useEffect(() => {
    const t = setTimeout(() => {
      window.location.href = deepLink;
    }, 400);
    return () => clearTimeout(t);
  }, [deepLink]);

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <a
        href={deepLink}
        className="ui-primary"
      >
        {appName ? `Return to ${appName}` : "Return to the app"}
      </a>
      <Link
        href="/subscription"
        className="text-sm text-fg-3 transition hover:text-fg"
      >
        Stay on the web
      </Link>
    </div>
  );
}
