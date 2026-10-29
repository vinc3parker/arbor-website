import Image from "next/image";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WaitlistSection } from "@/components/WaitlistSection";
import { GuideSparkles } from "@/components/GuideSparkles";
import { Halo } from "@/components/Halo";
import { APP_ROADMAP } from "@/content/roadmap";
import { APP_PHOTOGRAPHY } from "@/content/photography";
import type { AppContent } from "@/content/apps";
import { appBrand } from "@/lib/brand";
import { getAppStates } from "@/lib/app-states";

export async function AppLanding({ app }: { app: AppContent }) {
  const brand = appBrand(app.name)!;
  const roadmap = APP_ROADMAP[brand.id];
  const planned = roadmap.stage === "pre-development";
  const testing = roadmap.stage === "testing";

  // The roadmap owns public stages. Remote state only supplies a download link
  // for an app that is currently testing; it cannot promote an app to release.
  const state = testing ? (await getAppStates())[brand.id] : undefined;
  const betaUrl = testing
    ? state !== undefined
      ? state.status === "beta" || state.status === "live"
        ? state.downloadUrl
        : undefined
      : app.download?.url
    : undefined;

  const colour = brand.onInk;
  const guideLabel = `${brand.name}, your ${brand.title}`;
  // Thrive's red is a graphic accent; Paper keeps small button text legible.
  const primaryButton = brand.id === "thrive"
    ? undefined
    : { background: colour, color: brand.inkOnFill };

  return (
    <main className="theme-dark min-h-screen bg-bg text-fg">
      <Navbar tone="dark" />

      <section className="relative isolate overflow-hidden border-b border-line pt-28 pb-16 sm:pt-32 sm:pb-24">
        <Image src={APP_PHOTOGRAPHY[brand.id]} alt="" fill sizes="100vw" loading="eager" className="-z-20 object-cover object-[50%_45%]" />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-ink/95 via-ink/85 to-ink/55" />
        <div className="site-container relative">
          <Link
            href="/guides"
            className="mb-10 inline-flex min-h-11 items-center gap-3 rounded-xl type-caption text-fg-2 transition hover:text-fg"
          >
            <span aria-hidden="true">←</span>
            Back to all guides
          </Link>

          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <div className="flex items-center gap-4">
                <Image
                  src={brand.icon}
                  alt=""
                  width={64}
                  height={64}
                  loading="eager"
                  className="h-14 w-14 rounded-2xl sm:h-16 sm:w-16"
                />
                <div>
                  <p className="type-label">Your {brand.title}</p>
                  <p className="mt-1 type-caption text-fg-2">{brand.domain} · by Arbor</p>
                </div>
              </div>

              <h1 className="type-display mt-8">{app.name}</h1>
              <p className="mt-6 max-w-xl text-2xl leading-snug sm:text-3xl">
                {app.hero}
              </p>

              <div className="mt-8 max-w-xl border-l-2 pl-5" style={{ borderColor: colour }}>
                <p className="type-label">{roadmap.label}</p>
                <p className="mt-2 text-base leading-relaxed text-fg-2">{roadmap.note}</p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={betaUrl || "#early-access"}
                  target={betaUrl ? "_blank" : undefined}
                  rel={betaUrl ? "noopener noreferrer" : undefined}
                  className="ui-primary px-7"
                  style={primaryButton}
                >
                  {betaUrl ? "Join the beta" : "Keep me updated"}
                  <span className="ml-3" aria-hidden="true">{betaUrl ? "↗" : "→"}</span>
                </a>
                <a href="#overview" className="ui-secondary px-7">
                  {planned ? "Explore the idea" : "Meet your guide"}
                </a>
              </div>
              {testing && !betaUrl && (
                <p className="mt-4 type-caption text-fg-2">
                  Public beta access will be shared when it is ready.
                </p>
              )}
            </div>

            <div className="relative isolate overflow-hidden rounded-3xl border border-paper/20 bg-ink/80 p-7 backdrop-blur-sm sm:p-10">
              <Halo colour={colour} size={460} className="-right-40 -top-32 -z-10 opacity-50" />
              <GuideSparkles colour={colour} label={guideLabel} size={52} />
              <p className="mt-8 type-caption text-fg-2">{planned ? "The guide we are planning" : "A guide on your side"}</p>
              <h2 className="mt-3 text-3xl font-medium leading-tight sm:text-4xl">
                Meet {app.name},<br />your {brand.title}.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-fg-2">{app.guide.blurb}</p>
              <div className="mt-8 border-t border-line pt-6">
                <p className="type-label">
                  {planned ? "A personal AI guide, shaped around you." : "Your personal AI guide."}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-fg-2">
                  {planned
                    ? `The aim is specialist guidance for ${brand.domain.toLowerCase()}, connected to the life you choose. You set the direction.`
                    : `Specialist guidance for ${brand.domain.toLowerCase()}, grounded in what matters to you. It offers a next step. You decide what to do.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="overview" className="site-container scroll-mt-24 py-16 sm:py-24">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="ui-kicker">{planned ? "Planned direction" : "The experience"}</p>
            <h2 className="type-h1 max-w-3xl">{app.overviewTitle}</h2>
          </div>
          <p className="type-body text-fg-2 lg:pt-9">{app.intro}</p>
        </div>

        {app.features.length > 0 && (
          <div className="mt-10 grid gap-5 md:grid-cols-2 sm:mt-14">
            {app.features.map((feature, index) => (
              <article key={feature.title} className="overflow-hidden rounded-2xl border border-line bg-surface">
                <div className="p-6 sm:p-8">
                  <p className="type-caption text-fg-2">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-4 text-xl font-medium sm:text-2xl">{feature.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-fg-2">{feature.description}</p>
                </div>
                {feature.screenshot && (
                  <figure className="border-t border-line bg-bg px-6 pt-6 pb-4">
                    <Image
                      src={feature.screenshot}
                      alt={`${app.name} development preview: ${feature.title}`}
                      width={1170}
                      height={2532}
                      sizes="(max-width: 767px) 70vw, 240px"
                      className="mx-auto h-auto max-h-80 w-auto max-w-full rounded-xl object-contain"
                    />
                    <figcaption className="mt-4 text-center type-caption text-fg-2">
                      Development preview · the design continues to evolve
                    </figcaption>
                  </figure>
                )}
              </article>
            ))}
          </div>
        )}

        <div className="mt-12 grid gap-10 border-t border-line pt-10 md:grid-cols-2 md:gap-16">
          <div>
            <h3 className="text-xl font-medium">{planned ? `The idea behind ${app.name}` : `Why ${app.name}?`}</h3>
            <p className="mt-4 text-base leading-relaxed text-fg-2">{app.detailedDescription}</p>
          </div>
          <div>
            <h3 className="text-xl font-medium">Who it is for</h3>
            <p className="mt-4 text-base leading-relaxed text-fg-2">{app.targetAudience}</p>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="site-container grid gap-6 py-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16 sm:py-16">
          <div>
            <p className="ui-kicker">Part of Arbor</p>
            <h2 className="type-h2">One part of your life.<br />A view of the whole.</h2>
          </div>
          <div>
            <p className="type-body text-fg-2">
              {planned
                ? `${app.name} is planned as part of Arbor's team of guides. The wider Arbor picture will help make its guidance fit your life.`
                : `${app.name} is part of Arbor's team of guides. The wider Arbor picture helps its guidance take your life into account.`}
            </p>
            <p className="mt-4 text-base text-fg-2">
              The more your guides understand how the pieces fit together, the more useful their guidance can become.
            </p>
            <Link href="/how-it-works" className="mt-6 inline-flex min-h-11 items-center gap-3 rounded-xl type-label transition hover:opacity-75">
              How the guides work together <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="site-container py-10">
        <div className="flex flex-col justify-between gap-5 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-center">
          <div>
            <p className="type-label">Data and use</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-fg-2">
              See the information {app.name} uses or plans to use, why it needs it,
              optional connections and the controls available to you.
            </p>
          </div>
          <Link href={`/legal/${brand.id}`} className="ui-secondary shrink-0">
            Read {app.name}&apos;s notice
          </Link>
        </div>
      </section>

      <WaitlistSection />
      <Footer />
    </main>
  );
}
