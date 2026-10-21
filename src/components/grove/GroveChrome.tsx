import Image from "next/image";
import Link from "next/link";

function GroveIdentity() {
  return (
    <Link href="/grove" aria-label="Arbor Grove home" className="inline-flex items-center gap-3">
      <Image src="/brand/arbor_mark_full.png" alt="" width={48} height={36} className="h-9 w-12 object-contain" />
      <span className="border-l border-line pl-3 leading-none">
        <span className="block text-[0.65rem] font-medium uppercase tracking-[0.18em] text-fg-2">Arbor</span>
        <span className="mt-1 block text-xl font-semibold tracking-[-0.04em]">Grove</span>
      </span>
    </Link>
  );
}

export function GroveHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/95 backdrop-blur-xl">
      <div className="site-container flex min-h-20 items-center justify-between gap-4">
        <GroveIdentity />
        <div className="flex items-center gap-4 sm:gap-7">
          <nav aria-label="Grove navigation" className="flex items-center gap-4 text-sm font-medium">
            <Link href="/guides" className="hidden text-fg-2 transition hover:text-fg sm:inline">The Arbor guides</Link>
            <Link href="/" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3 transition hover:border-fg-3 sm:px-4">
              Arbor home <span aria-hidden>↗</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export function GroveFooter() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="site-container flex flex-col justify-between gap-8 py-10 sm:flex-row sm:items-end">
        <div>
          <GroveIdentity />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-fg-2">A future Arbor workspace. Grove is a concept; development has not started.</p>
        </div>
        <nav aria-label="Grove footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-fg-2">
          <Link href="/" className="transition hover:text-fg">Arbor home</Link>
          <Link href="/guides" className="transition hover:text-fg">The guides</Link>
          <Link href="/progress" className="transition hover:text-fg">Arbor progress</Link>
        </nav>
      </div>
    </footer>
  );
}
