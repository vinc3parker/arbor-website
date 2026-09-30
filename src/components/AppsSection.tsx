import Image from "next/image";

type App = {
  name: string;
  guide?: string;
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
    // A full-width band sets the guides apart from the statements above.
    <section id="apps" className="border-y border-line bg-surface">
      <div className="site-container py-24">
        <p className="ui-kicker">
          The guides
        </p>

        <h2 className="type-h1 mb-4 max-w-4xl">
          A team of guides, one understanding of you.
        </h2>

        <p className="mb-10 max-w-2xl type-body text-fg-2">
          Each app is an expert in its own part of life. Arbor learns from each
          app, so every guide knows the whole of you.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {apps.map((app) => (
            <a
              key={app.name}
              href={app.href}
              className="group flex items-center gap-5 rounded-2xl border border-line bg-bg p-5 transition duration-300 hover:border-fg-3"
            >
              <Image
                src={app.icon}
                alt=""
                width={512}
                height={512}
                className="h-16 w-16 shrink-0 rounded-2xl"
              />

              <div className="flex-1">
                {app.guide && (
                  <p className="mb-1 type-caption text-fg-2">
                    {app.guide}
                  </p>
                )}

                <h3 className="flex items-center gap-3 text-[1.375rem] font-semibold leading-tight">
                  {app.name}
                  {app.badge && (
                    <span className="ui-status">
                      {app.badge}
                    </span>
                  )}
                </h3>

                <p className="mt-2 text-base leading-6 text-fg-2">
                  {app.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
