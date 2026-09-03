import Link from "next/link";
import { TIERS } from "@/lib/subscription";

function Check() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400"
      aria-hidden
    >
      <path
        d="M4 10.5 8 14.5 16 5.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FoundingAccessSection() {
  const free = TIERS.free;
  const founding = TIERS.beta_tester;

  return (
    <section
      id="founding-access"
      className="mx-auto max-w-6xl px-8 py-32"
    >
      <p className="mb-6 text-sm uppercase tracking-[0.3em] text-neutral-500">
        Founding Access
      </p>

      <h2 className="mb-6 max-w-3xl text-5xl font-semibold">
        Unlock your guides while Arbor is being built.
      </h2>

      <p className="mb-12 max-w-2xl text-lg leading-8 text-neutral-400">
        Creating an account is free and keeps your profile and data safe on
        Arbor Core. Founding Access is what opens up the apps — and helps
        sustainably grow the ecosystem, with founding-member status while
        it&apos;s early.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Free account */}
        <div className="flex flex-col rounded-3xl border border-neutral-800 bg-neutral-950 p-8">
          <h3 className="text-2xl font-medium">{free.name}</h3>
          <p className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-semibold">{free.price}</span>
            <span className="text-sm text-neutral-500">{free.cadence}</span>
          </p>
          <p className="mt-4 leading-7 text-neutral-400">{free.tagline}</p>

          <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-neutral-300">
            {free.features.map((f) => (
              <li key={f} className="flex gap-3">
                <Check />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/login"
            className="mt-8 inline-block rounded-full border border-neutral-600 px-6 py-3 text-center text-sm font-medium text-white transition hover:border-neutral-400"
          >
            Create a free account
          </Link>
        </div>

        {/* Founding Access */}
        <div className="flex flex-col rounded-3xl border border-white/25 bg-neutral-900 p-8 shadow-xl shadow-black/30">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-medium">{founding.name}</h3>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white">
              Founding
            </span>
          </div>
          <p className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-semibold">{founding.price}</span>
            <span className="text-sm text-neutral-500">{founding.cadence}</span>
          </p>
          <p className="mt-4 leading-7 text-neutral-400">{founding.tagline}</p>

          <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-neutral-200">
            {founding.features.map((f) => (
              <li key={f} className="flex gap-3">
                <Check />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/subscription"
            className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-center text-sm font-medium text-black transition hover:bg-neutral-200"
          >
            Get Founding Access — {founding.price}/mo
          </Link>
        </div>
      </div>

      <p className="mt-8 text-sm text-neutral-500">
        Prefer to try first? You can start a one-month free trial from your{" "}
        <Link href="/subscription" className="underline transition hover:text-neutral-300">
          subscription page
        </Link>
        .
      </p>
    </section>
  );
}
