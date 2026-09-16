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
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-8 py-32">
        <div className="w-full max-w-lg rounded-3xl border border-red-900/60 bg-neutral-950 p-8 md:p-10">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-red-400">
            DELETE ACCOUNT
          </p>
          <h1 className="text-3xl font-semibold">Delete your Arbor account?</h1>
          <p className="mt-4 text-sm leading-7 text-neutral-400">
            This permanently deletes your Arbor account and server-held Arbor
            data. It cannot be undone. Device-only data inside an installed app
            may remain on that device until the app is removed or reset.
          </p>
          {appName ? (
            <p className="mt-3 text-sm leading-7 text-neutral-500">
              You opened this from {appName}. Deleting the account will sign you
              out across Arbor apps.
            </p>
          ) : null}

          {error ? (
            <p className="mt-5 rounded-2xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">
              We could not delete the account. Please try again.
            </p>
          ) : null}

          <form action={deleteAccountAction} className="mt-8 flex flex-col gap-3">
            {app ? <input type="hidden" name="app" value={app} /> : null}
            <button
              type="submit"
              className="rounded-full bg-red-500 px-8 py-4 font-medium text-white transition hover:bg-red-400"
            >
              Permanently delete account
            </button>
            <Link
              href="/profile"
              className="rounded-full border border-neutral-800 px-8 py-4 text-center text-sm font-medium text-neutral-300 transition hover:border-neutral-600 hover:text-white"
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
