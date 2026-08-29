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
        className="inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
      >
        {appName ? `Return to ${appName}` : "Return to the app"}
      </a>
      <Link
        href="/subscription"
        className="text-sm text-neutral-500 transition hover:text-neutral-300"
      >
        Stay on the web
      </Link>
    </div>
  );
}
