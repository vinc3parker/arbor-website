"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type NavItem = {
  label: string;
  href: string;
};

const items: NavItem[] = [
  {
    label: "Apps",
    href: "/#apps",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Early Access",
    href: "/#early-access",
  },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 px-4">
      <div className="mx-auto mt-4 max-w-6xl rounded-3xl border border-neutral-800 bg-black/50 backdrop-blur-md sm:rounded-full">
        <div className="flex items-center justify-between px-6 py-4 sm:px-8 sm:py-5">
          <Link
            href="/"
            className="flex items-center gap-3 transition hover:opacity-90"
            onClick={() => setOpen(false)}
          >
            <Image src="/icon.png" alt="Arbor" width={36} height={36} priority />
            <span className="text-sm font-medium tracking-[0.3em]">ARBOR</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 text-sm text-neutral-400 md:flex">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/login"
              className="rounded-full border border-neutral-700 px-5 py-2 text-white transition hover:border-neutral-500"
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
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-800 text-neutral-300 transition hover:text-white md:hidden"
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
          <div className="flex flex-col gap-1 border-t border-neutral-800 px-4 py-4 text-sm md:hidden">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-neutral-300 transition hover:bg-neutral-900 hover:text-white"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full border border-neutral-700 px-4 py-3 text-center text-white transition hover:border-neutral-500"
            >
              Account
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
