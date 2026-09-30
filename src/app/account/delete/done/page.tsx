import Link from "next/link";
import { appDisplayName, appScheme, isRegisteredApp } from "@/lib/app-auth";

export const metadata = {
  title: "Account deleted — Arbor",
  robots: { index: false, follow: false },
};

type SearchParams = { [k: string]: string | string[] | undefined };

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DeleteDonePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const rawApp = first(sp.app);
  const app = rawApp && isRegisteredApp(rawApp) ? rawApp : null;
  const appName = app ? appDisplayName(app) : null;
  const scheme = app ? appScheme(app) : null;
  const returnUrl = scheme ? `${scheme}://account-return?status=deleted` : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center text-fg">
      <div className="max-w-md">
        <p className="ui-kicker">
          ACCOUNT DELETED
        </p>
        <h1 className="ui-title">Your Arbor account was deleted.</h1>
        <p className="mt-4 leading-7 text-fg-2">
          {appName
            ? `Head back to ${appName}. You will need to create a new Arbor account before using Arbor services again.`
            : "You will need to create a new Arbor account before using Arbor services again."}
        </p>

        <div className="mt-8">
          {returnUrl ? (
            <a
              href={returnUrl}
              className="ui-primary"
            >
              Return to {appName}
            </a>
          ) : (
            <Link
              href="/"
              className="ui-primary"
            >
              Back to Arbor
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
