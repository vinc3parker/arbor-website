type App = {
  name: string;
  description: string;
};

type AppsSectionProps = {
  apps: App[];
};

export function AppsSection({
  apps,
}: AppsSectionProps) {
  return (
    <section id="apps" className="mx-auto max-w-6xl px-8 py-32">

      <p className="mb-6 text-sm uppercase tracking-[0.3em] text-neutral-500">
        ECOSYSTEM
      </p>

      <h2 className="mb-12 text-5xl font-semibold">
        The Arbor Apps
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        {apps.map((app) => (
          <div
            key={app.name}
            className="
            rounded-3xl
            border
            border-neutral-800
            bg-neutral-950
            p-8
            transition
            hover:border-neutral-600
          "
          >
            <h3 className="text-2xl font-medium">
              {app.name}
            </h3>

            <p className="mt-4 text-neutral-400">
              {app.description}
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}