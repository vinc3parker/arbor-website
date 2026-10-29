import Image from "next/image";
import Link from "next/link";
import { APP_BRANDS, APP_ORDER } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="site-container py-12">
        <div className="mb-10 grid gap-8 border-b border-line pb-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="type-caption uppercase tracking-[0.16em] text-fg-3">The Arbor system</p>
            <p className="mt-3 max-w-lg text-2xl font-semibold leading-tight tracking-[-0.035em] sm:text-3xl">
              Eight guides. One connected life.
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg-2">
              Specialist support for different parts of life, built around one shared understanding of you.
            </p>
          </div>

          <nav aria-label="Explore the Arbor guides" className="grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-4">
            {APP_ORDER.map((id) => {
              const app = APP_BRANDS[id];
              return (
                <Link key={id} href={`/${id}`} className="group flex min-h-10 items-center gap-2 text-sm text-fg-2 transition hover:text-fg">
                  <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-fg/15" style={{ backgroundColor: app.onInk }} />
                  <span>{app.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col justify-between gap-8 sm:flex-row">
          <div>
            <Link href="/" aria-label="Arbor home" className="inline-block">
              <Image src="/brand/arbor_wordmark_full.png" alt="Arbor" width={931} height={227} className="h-auto w-24 [.theme-dark_&]:hidden" />
              <Image src="/brand/arbor_wordmark_reverse.png" alt="Arbor" width={931} height={227} className="hidden h-auto w-24 [.theme-dark_&]:block" />
            </Link>
          </div>
          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm text-fg-2 sm:grid-cols-3">
            <Link href="/guides" className="transition hover:text-fg">The guides</Link>
            <Link href="/grove" className="transition hover:text-fg">The Grove idea</Link>
            <Link href="/blog" className="transition hover:text-fg">From Arbor</Link>
            <Link href="/subscription" className="transition hover:text-fg">Membership</Link>
            <Link href="/business" className="transition hover:text-fg">For businesses</Link>
            <Link href="/login" className="transition hover:text-fg">Your account</Link>
          </nav>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-line pt-6 text-xs text-fg-2">
          <span>© 2026 Arbor</span>
          <div className="flex flex-wrap gap-6"><Link href="/legal" className="transition hover:text-fg">Legal centre</Link><Link href="/privacy" className="transition hover:text-fg">Privacy</Link><Link href="/terms" className="transition hover:text-fg">Terms</Link></div>
        </div>
      </div>
    </footer>
  );
}
