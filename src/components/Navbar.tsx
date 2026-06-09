import Image from "next/image";

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
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 backdrop-blur-md px-4">
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-full border border-neutral-800 bg-black/50 px-8 py-5 sm:px-8 sm:py-5">
        <a
          href="/"
          className="flex items-center gap-3 transition hover:opacity-90"
        >
          <Image
            src="/icon.png"
            alt="Arbor"
            width={36}
            height={36}
            priority
          />

          <span className="text-sm font-medium tracking-[0.3em]">
            ARBOR
          </span>
        </a>

        <div className="flex gap-8 text-sm text-neutral-400">

          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="transition hover:text-white"
            >
              {item.label}
            </a>
          ))}

        </div>

      </div>

    </nav>
  );
}