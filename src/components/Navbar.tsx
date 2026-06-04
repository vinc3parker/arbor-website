type NavItem = {
  label: string;
  href: string;
};

const items: NavItem[] = [
  {
    label: "Apps",
    href: "#aegle",
  },
  {
    label: "About",
    href: "#apps",
  },
  {
    label: "Early Access",
    href: "#early-access",
  },
];

export function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 backdrop-blur-md">

      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-full border border-neutral-800 bg-black/50 px-8 py-5">

        <div className="text-sm font-medium tracking-[0.3em]">
          ARBOR
        </div>

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