import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="site-container py-12">
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
          <div className="flex gap-6"><Link href="/privacy" className="transition hover:text-fg">Privacy</Link><Link href="/terms" className="transition hover:text-fg">Terms</Link></div>
        </div>
      </div>
    </footer>
  );
}
