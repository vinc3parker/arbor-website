import Link from "next/link";
import {
  appDisplayName,
  appScheme,
  isRegisteredApp,
  sanitizeState,
} from "@/lib/app-auth";
import { BillingReturnRedirect } from "./ReturnClient";

export const metadata = {
  title: "Billing — Arbor",
  robots: { index: false, follow: false },
};

type SearchParams = { [k: string]: string | string[] | undefined };

export default async function BillingReturnPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const appRaw = typeof sp.app === "string" ? sp.app : undefined;
  const state = sanitizeState(typeof sp.state === "string" ? sp.state : undefined);
  const status = typeof sp.status === "string" ? sp.status : "success";

  const app = appRaw && isRegisteredApp(appRaw) ? appRaw : null;
  const scheme = app ? appScheme(app) : null;
  const appName = app ? appDisplayName(app) : null;

  // Custom-scheme deep link the app watches for after billing. Only the outcome
  // + state travel here — never tokens.
  const deepLink = scheme
    ? `${scheme}://billing-return?status=${encodeURIComponent(status)}${
        state ? `&state=${encodeURIComponent(state)}` : ""
      }`
    : null;

  const heading = status === "managed" ? "Billing updated" : "You're all set";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
      <div className="max-w-md">
        <h1 className="text-3xl font-semibold">{heading}</h1>
        <p className="mt-4 leading-7 text-neutral-400">
          {appName
            ? `Your subscription is up to date. Head back to ${appName} — it will pick up the change automatically.`
            : "Your subscription is up to date."}
        </p>

        {deepLink ? (
          <BillingReturnRedirect deepLink={deepLink} appName={appName} />
        ) : (
          <div className="mt-8">
            <Link
              href="/subscription"
              className="inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
            >
              Back to subscription
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
