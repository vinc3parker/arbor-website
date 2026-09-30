import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="site-container flex flex-wrap items-center justify-between gap-6 py-8">
        <Image
          src="/brand/arbor_wordmark_full.png"
          alt="Arbor"
          width={931}
          height={227}
          className="h-auto w-[96px] [.theme-dark_&]:hidden"
        />
        <Image
          src="/brand/arbor_wordmark_reverse.png"
          alt="Arbor"
          width={931}
          height={227}
          className="hidden h-auto w-[96px] [.theme-dark_&]:block"
        />
        <div className="flex flex-wrap items-center gap-6 type-caption text-fg-2">
          <Link href="/privacy" className="transition hover:text-fg">
            Privacy
          </Link>
          <Link href="/terms" className="transition hover:text-fg">
            Terms
          </Link>
          <span>© 2026 Arbor</span>
        </div>
      </div>
    </footer>
  );
}
