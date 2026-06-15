import Image from "next/image";

type App = {
  name: string;
  description: string;
  href: string;
  icon: string;
  badge?: string;
};

type AppsSectionProps = {
  apps: App[];
};

export function AppsSection({
  apps,
}: AppsSectionProps) {
  return (
    <section
      id="apps"
      className="mx-auto max-w-6xl px-8 py-32"
    >
      <p className="mb-6 text-sm uppercase tracking-[0.3em] text-neutral-500">
        ECOSYSTEM
      </p>

      <h2 className="mb-12 text-5xl font-semibold">
        The Arbor Apps
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {apps.map((app) => (
          <a
            key={app.name}
            href={app.href}
            className="
              group flex items-center gap-8
              rounded-3xl
              border
              border-neutral-800
              bg-neutral-950
              p-8
              transition
              duration-300
              hover:-translate-y-1
              hover:border-neutral-600
            "
          >
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden">
              <Image
                src={app.icon}
                alt={`${app.name} icon`}
                width={150}
                height={150}
                className="h-20 w-20 object-contain"
              />
            </div>

            <div className="flex-1">
              <h3 className="flex items-center gap-3 text-2xl font-medium transition group-hover:text-neutral-300">
                {app.name}
                {app.badge && (
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white">
                    {app.badge}
                  </span>
                )}
              </h3>

              <p className="mt-3 leading-7 text-neutral-400">
                {app.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}