import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { LegalDoc } from "@/content/legal";

// Renders a legal document (Privacy Policy or Terms of Service) as calm,
// readable long-form text inside the site's standard shell. Pure presentation —
// the wording comes from src/content/legal.ts, which mirrors Thrive's canonical
// source. Styled to match the rest of the (dark) site.
export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 pt-40 pb-24 sm:px-8 sm:pt-44">
        <p className="mb-4 text-sm uppercase tracking-[0.4em] text-neutral-500">
          ARBOR
        </p>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
          {doc.title}
        </h1>
        <p className="mt-4 text-sm text-neutral-500">
          Effective {doc.effectiveDate}
        </p>

        <div className="mt-10 flex flex-col gap-5">
          {doc.intro.map((p, i) => (
            <p key={`intro-${i}`} className="text-lg leading-8 text-neutral-300">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-10">
          {doc.sections.map((section) => (
            <div key={section.heading} className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-white md:text-2xl">
                {section.heading}
              </h2>

              {section.body?.map((p, i) => (
                <p
                  key={`p-${i}`}
                  className="text-base leading-8 text-neutral-400"
                >
                  {p}
                </p>
              ))}

              {section.bullets && section.bullets.length > 0 && (
                <ul className="mt-1 flex list-disc flex-col gap-2 pl-6 text-base leading-7 text-neutral-400 marker:text-neutral-600">
                  {section.bullets.map((b, i) => (
                    <li key={`b-${i}`}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-neutral-900 pt-8 text-sm text-neutral-500">
          <Link href="/terms" className="transition hover:text-neutral-300">
            Terms of Service
          </Link>
          <Link href="/privacy" className="transition hover:text-neutral-300">
            Privacy Policy
          </Link>
          <Link href="/" className="transition hover:text-neutral-300">
            ← Back to home
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
