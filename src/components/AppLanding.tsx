import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WaitlistSection } from "@/components/WaitlistSection";

type AppLandingProps = {
  app: {
    name: string;
    tag: string;
    hero: string;
    intro?: string;
    overviewTitle?: string;
    features?: {
      title: string;
      description: string;
    }[];
    status?: string;
  };
};

export function AppLanding({ app }: AppLandingProps) {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-8 pt-40 sm:pt-32">
        <p className="mb-6 text-sm uppercase tracking-[0.4em] text-neutral-500">
          {app.tag}
        </p>

        <h1 className="max-w-5xl text-6xl font-semibold leading-tight md:text-8xl">
          {app.name}
        </h1>

        <p className="mt-10 max-w-2xl text-xl leading-8 text-neutral-400">
          {app.hero}
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <a
            href="#early-access"
            className="rounded-full bg-white px-8 py-4 text-center text-black transition hover:scale-[1.03]"
          >
            Join Early Access
          </a>

          <a
            href="#overview"
            className="rounded-full border border-neutral-700 px-8 py-4 text-center transition hover:border-neutral-400"
          >
            Learn More
          </a>
        </div>
      </section>

      <section id="overview" className="mx-auto max-w-6xl px-8 py-32">
        <p className="mb-6 text-sm uppercase tracking-[0.3em] text-neutral-500">
          OVERVIEW
        </p>

        <h2 className="max-w-4xl text-5xl font-semibold">
          {app.overviewTitle ?? "Designed around real people, not engagement."}
        </h2>

        <p className="mt-10 max-w-3xl text-xl leading-8 text-neutral-400">
          {app.intro ??
            "This app is part of the wider Arbor ecosystem — built to help people live with more direction, awareness, and intention."}
        </p>

        {app.features && app.features.length > 0 && (
          <div className="mt-16 grid gap-4 md:grid-cols-2">
            {app.features.map((feature, index) => (
              <div
                key={feature.title}
                className="
                  group
                  relative
                  overflow-hidden
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
                <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-800 text-sm text-neutral-500">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h3 className="text-2xl font-medium transition group-hover:text-neutral-200">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-neutral-400">
                  {feature.description}
                </p>

                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-3xl transition duration-300 group-hover:bg-white/10" />
              </div>
            ))}
          </div>
        )}
      </section>

      {app.status && (
        <section className="mx-auto max-w-6xl px-8 py-24">
          <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-10">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              STATUS
            </p>

            <p className="mt-6 text-2xl font-medium">{app.status}</p>
          </div>
        </section>
      )}

      <WaitlistSection />

      <Footer />
    </main>
  );
}