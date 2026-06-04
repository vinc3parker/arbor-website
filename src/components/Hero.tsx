type HeroProps = {
  title: string;
  subtitle: string;
};

export function Hero({
  title,
  subtitle,
}: HeroProps) {
  return (
    <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-8">

        <p className="mb-6 text-sm uppercase tracking-[0.4em] text-neutral-500">
        BUILDING ARBOR
        </p>

        <h1 className="max-w-5xl text-6xl font-semibold leading-tight md:text-8xl">
        {title}
        </h1>

        <p className="mt-10 max-w-2xl text-xl leading-8 text-neutral-400">
        {subtitle}
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <a
                href="#early-access"
                className="rounded-full bg-white px-8 py-4 text-black transition hover:scale-[1.03]"
                >
                Join Early Access
            </a>

            <a
            href="#about"
            className="rounded-full border border-neutral-700 px-8 py-4 transition hover:border-neutral-400"
            >
            Arbor's Direction
            </a>

        </div>

    </section>
  );
}