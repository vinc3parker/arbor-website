"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { rememberEntered } from "@/lib/intro";

type NavItem = {
  label: string;
  href: string;
};

const items: NavItem[] = [
  {
    label: "Blog",
    href: "/blog",
  },
];

/**
 * `tone` sets the bar's surface: Paper with the full-colour logo, or Ink with
 * the Reverse logo (brand guide 5.4). Dark on the observatory and app pages.
 */
export function Navbar({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Anyone on another page is already inside the site, so the logo takes
  // them home without the observatory's click to enter.
  useEffect(() => {
    if (pathname !== "/") rememberEntered();
  }, [pathname]);

  return (
    <nav className={`site-navbar fixed left-0 right-0 top-0 z-50 border-b border-line bg-bg/90 text-fg backdrop-blur-xl ${
        tone === "dark" ? "theme-dark" : "theme-light"
      }`}>
      <div className="site-container">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center py-2 transition hover:opacity-80"
            onClick={() => setOpen(false)}
          >
            <Image
              src={
                tone === "dark"
                  ? "/brand/arbor_logo_reverse.png"
                  : "/brand/arbor_logo_full.png"
              }
              alt="Arbor"
              width={942}
              height={227}
              priority
              className="h-auto w-[120px]"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 type-label text-fg-2 md:flex">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition hover:text-fg"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/login"
              className="transition hover:text-fg"
            >
              Account
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-line text-fg transition hover:border-fg-3 md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="h-5 w-5"
              aria-hidden
            >
              {open ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu panel */}
        {open && (
          <div className="flex flex-col gap-1 border-t border-line bg-bg py-4 type-label md:hidden">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-fg-2 transition hover:bg-surface hover:text-fg"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-fg-2 transition hover:bg-surface hover:text-fg"
            >
              Account
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
