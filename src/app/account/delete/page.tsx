import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { appDisplayName, isRegisteredApp } from "@/lib/app-auth";
import { deleteAccountAction } from "./actions";

export const metadata = {
  title: "Delete account — Arbor",
  robots: { index: false, follow: false },
};

type SearchParams = { [k: string]: string | string[] | undefined };

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DeleteAccountPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const rawApp = first(sp.app);
  const app = rawApp && isRegisteredApp(rawApp) ? rawApp : null;
  const appName = app ? appDisplayName(app) : null;
  const error = first(sp.error);

  return (
    <main className="min-h-screen bg-bg text-fg">
      <Navbar />

      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-28 sm:px-8">
        <div className="ui-surface w-full max-w-lg border-danger/40 p-6 sm:p-8">
          <p className="mb-3 text-sm font-semibold text-danger">
            Delete account
          </p>
          <h1 className="ui-title">Delete your Arbor account?</h1>
          <p className="mt-3 text-sm leading-6 text-fg-2">
            This permanently removes your Arbor account and everything stored with it, from every Arbor app. It can&apos;t be undone.
          </p>
          {appName ? (
            <p className="mt-3 text-sm leading-7 text-fg-3">
              You opened this from {appName}. Deleting the account will sign you
              out across Arbor apps.
            </p>
          ) : null}

          {error ? (
            <p className="mt-5 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
              We couldn&apos;t delete your account just now. Nothing has changed. Try again in a moment.
            </p>
          ) : null}

          <form action={deleteAccountAction} className="mt-8 flex flex-col gap-3">
            {app ? <input type="hidden" name="app" value={app} /> : null}
            <button
              type="submit"
              className="ui-danger"
            >
              Permanently delete account
            </button>
            <Link
              href="/profile"
              className="ui-secondary"
            >
              Keep account
            </Link>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
