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
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
      <div className="max-w-md">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-500">
          ACCOUNT DELETED
        </p>
        <h1 className="text-3xl font-semibold">Your Arbor account was deleted.</h1>
        <p className="mt-4 leading-7 text-neutral-400">
          {appName
            ? `Head back to ${appName}. You will need to create a new Arbor account before using Arbor services again.`
            : "You will need to create a new Arbor account before using Arbor services again."}
        </p>

        <div className="mt-8">
          {returnUrl ? (
            <a
              href={returnUrl}
              className="inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
            >
              Return to {appName}
            </a>
          ) : (
            <Link
              href="/"
              className="inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
            >
              Back to Arbor
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
