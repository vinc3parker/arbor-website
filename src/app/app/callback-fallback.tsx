import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import type { AppId } from "@/lib/app-auth";
import { appCallbackPath } from "@/lib/app-auth";

export type CallbackSearchParams = {
  code?: string | string[];
  state?: string | string[];
  error?: string | string[];
};

const PASSTHROUGH_PARAMS = ["code", "state", "error"] as const;

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function buildFallbackHref(app: AppId, searchParams: CallbackSearchParams) {
  const params = new URLSearchParams();

  for (const key of PASSTHROUGH_PARAMS) {
    const value = firstParam(searchParams[key]);
    if (value !== undefined) {
      params.set(key, value);
    }
  }

  const query = params.toString();
  return `${appCallbackPath(app)}${query ? `?${query}` : ""}`;
}

export function AppCallbackFallback({
  app,
  name,
  searchParams,
}: {
  app: AppId;
  name: string;
  searchParams: CallbackSearchParams;
}) {
  const callbackHref = buildFallbackHref(app, searchParams);
  const error = firstParam(searchParams.error);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-8 py-32">
        <div className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-950 p-8 text-center md:p-10">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-neutral-500">
            {name.toUpperCase()}
          </p>
          <h1 className="text-2xl font-semibold">
            {error ? `Couldn't return to ${name}.` : `Returning to ${name}...`}
          </h1>
          <p className="mt-3 text-sm leading-7 text-neutral-400">
            {error
              ? `The sign-in flow returned an error. Reopen ${name} and try again.`
              : `You're signed in. If ${name} is installed, this link should open the app automatically. If nothing happened, use the button below to try the callback again.`}
          </p>
          <a
            href={callbackHref}
            className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
          >
            Open {name}
          </a>
        </div>
        <p className="mt-8 text-center text-sm text-neutral-600">
          <Link href={`/${app}`} className="transition hover:text-neutral-400">
            Get {name}
          </Link>
          <span className="px-3">/</span>
          <Link href="/" className="transition hover:text-neutral-400">
            Back to home
          </Link>
        </p>
      </section>
      <Footer />
    </main>
  );
}
