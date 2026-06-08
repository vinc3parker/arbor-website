import Image from "next/image";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WaitlistSection } from "@/components/WaitlistSection";
import { AppContentSection } from "@/components/AppContentSection";

type AppLandingProps = {
  app: {
    name: string;
    tag: string;
    hero: string;
    intro?: string;
    overviewTitle?: string;
    detailedDescription?: string;
    targetAudience?: string;
    features?: {
      title: string;
      description: string;
      screenshot?: string;
    }[];
    backgroundScreenshots?: string[];
    status?: string;
  };
};

export function AppLanding({ app }: AppLandingProps) {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center overflow-hidden px-8 pt-40 sm:pt-32">
        {app.backgroundScreenshots && app.backgroundScreenshots.length > 0 && (
          <div className="pointer-events-none absolute inset-0 hidden opacity-20 lg:block">
            <div className="absolute right-20 top-24 w-40 rotate-[-8deg] overflow-hidden rounded-[2rem] border border-neutral-800 bg-neutral-950 p-2">
              <Image
                src={app.backgroundScreenshots[0]}
                alt={`${app.name} app preview`}
                width={600}
                height={1200}
                loading="lazy"
                className="rounded-[1.5rem]"
              />
            </div>

            {app.backgroundScreenshots[1] && (
              <div className="absolute right-0 top-56 w-40 rotate-[8deg] overflow-hidden rounded-[2rem] border border-neutral-800 bg-neutral-950 p-2">
                <Image
                  src={app.backgroundScreenshots[1]}
                  alt={`${app.name} app interface`}
                  width={600}
                  height={1200}
                  loading="lazy"
                  className="rounded-[1.5rem]"
                />
              </div>
            )}
            {app.backgroundScreenshots[2] && (
              <div className="absolute right-52 top-[20rem] w-36 rotate-[-2deg] overflow-hidden rounded-[2rem] border border-neutral-800 bg-neutral-950 p-2">
                <Image
                  src={app.backgroundScreenshots[2]}
                  alt={`${app.name} dashboard`}
                  width={600}
                  height={1200}
                  loading="lazy"
                  className="rounded-[1.5rem]"
                />
              </div>
            )}
          </div>
        )}

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
          <div className="mt-16 flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {app.features.map((feature, index) => (
              <div
                key={feature.title}
                className="min-w-[88vw] md:min-w-[900px] snap-center"
              >
                <div className="overflow-hidden rounded-[2rem] border border-neutral-800 bg-neutral-950 md:grid md:grid-cols-[1.1fr_0.9fr]">

                  <div className="order-2 relative overflow-hidden bg-black p-6 md:order-1">
                    {feature.screenshot ? (
                      <Image
                        src={feature.screenshot}
                        alt={feature.title}
                        width={1200}
                        height={2400}
                        className="mx-auto max-h-[720px] w-auto rounded-[1.5rem] object-contain"
                      />
                    ) : (
                      <div className="flex h-[520px] items-center justify-center text-neutral-600">
                        Preview coming soon
                      </div>
                    )}
                  </div>

                  <div className="order-1 flex flex-col justify-center p-8 md:order-2 md:p-14">
                    <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-800 text-sm text-neutral-500">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <h3 className="text-4xl font-semibold leading-tight">
                      {feature.title}
                    </h3>

                    <p className="mt-6 text-lg leading-8 text-neutral-400">
                      {feature.description}
                    </p>

                    <p className="order-3 mt-6 text-sm uppercase tracking-[0.3em] text-neutral-600 md:mt-10">
                      Swipe to explore →
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <AppContentSection
        appName={app.name}
        detailedDescription={app.detailedDescription}
        targetAudience={app.targetAudience}
      />

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