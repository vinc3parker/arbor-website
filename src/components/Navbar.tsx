"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = {
  label: string;
  href: string;
};

const items: NavItem[] = [
  { label: "The guides", href: "/guides" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Our progress", href: "/progress" },
  {
    label: "Grove",
    href: "/grove",
  },
  {
    label: "Blog",
    href: "/blog",
  },
];

/**
 * `tone` sets the bar's surface: Paper with the full-colour logo, or Ink with
 * the Reverse logo (brand guide 5.4). Dark on the app pages.
 */
export function Navbar({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  return (
    <nav aria-label="Main navigation" className={`site-navbar fixed left-0 right-0 top-0 z-50 border-b border-line/70 bg-bg/95 text-fg backdrop-blur-xl ${
        tone === "dark" ? "theme-dark" : "theme-light"
      }`}>
      <div className="site-container">
        <div className="flex h-20 items-center justify-between gap-6">
          <Link
            href="/"
            className="flex items-center py-2 transition hover:opacity-80"
            onClick={() => {
              setOpen(false);
              if (pathname === "/") window.scrollTo({ top: 0 });
            }}
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
              loading="eager"
              className="h-auto w-[120px]"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-6 text-sm text-fg-2 lg:flex">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`transition hover:text-fg ${pathname === item.href ? "text-fg" : "text-fg-2"}`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/login"
              className="ui-primary min-h-10 px-4 py-2 text-sm"
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
            aria-controls="mobile-navigation"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-line text-fg transition hover:border-fg-3 lg:hidden"
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
          <div id="mobile-navigation" className="flex max-h-[calc(100dvh-5rem)] flex-col gap-1 overflow-y-auto border-t border-line bg-bg py-4 type-label lg:hidden">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`rounded-xl px-4 py-3 transition hover:bg-surface hover:text-fg ${pathname === item.href ? "bg-surface text-fg" : "text-fg-2"}`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="ui-primary mt-2"
            >
              Account
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
