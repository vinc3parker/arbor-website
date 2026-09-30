import Image from "next/image";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WaitlistSection } from "@/components/WaitlistSection";
import { AppContentSection } from "@/components/AppContentSection";
import { AppWorld } from "@/components/AppWorld";
import { GuideSparkles } from "@/components/GuideSparkles";
import { Halo } from "@/components/Halo";
import { appBrand, builtOnArbor } from "@/lib/brand";
import { getAppStates } from "@/lib/app-states";

type AppLandingProps = {
  app: {
    name: string;
    tag: string;
    hero: string;
    guide?: {
      role: string;
      blurb: string;
    };
    intro?: string;
    overviewTitle?: string;
    detailedDescription?: string;
    targetAudience?: string;
    features?: {
      title: string;
      description: string;
      screenshot?: string;
    }[];
    status?: string;
    download?: {
      type: "beta" | "appstore";
      url: string;
    };
  };
};

export async function AppLanding({ app }: AppLandingProps) {
  // Live state (development / beta / live + download link) comes from the admin-
  // managed `app_states` table; static content is the fallback if the DB is down.
  const state = (await getAppStates())[app.name.toLowerCase()];
  const download =
    state !== undefined
      ? state.status !== "development" && state.downloadUrl
        ? {
            type: (state.status === "live" ? "appstore" : "beta") as
              | "appstore"
              | "beta",
            url: state.downloadUrl,
          }
        : undefined
      : app.download;
  const statusNote = state?.statusNote ?? app.status;

  const downloadLabel =
    download?.type === "beta" ? "Join the beta" : "Download on the App Store";

  // App pages sit on Ink (brand guide 5.11). The app's colour points — the
  // button, the guide, the halo — and never fills a background (5.10).
  const brand = appBrand(app.name)!;
  const colour = brand.onInk;
  const labelColour = brand.textOnInk;
  const guideLabel = `${brand.name}, your ${brand.title}`;

  const primaryBtn = { background: colour, color: brand.inkOnFill };

  return (
    <AppWorld accent={colour}>
      <main className="theme-dark relative min-h-screen overflow-hidden bg-bg text-fg">
        <Navbar tone="dark" />

        {/* ------------------------------ Hero ------------------------------ */}
        <section className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-32 pb-24">
          <Halo
            colour={colour}
            size={720}
            className="right-[-10rem] top-1/2 -translate-y-1/2 max-lg:right-1/2 max-lg:translate-x-1/2 max-lg:opacity-60"
          />

          <div className="site-container relative">
            {/* Back to the observatory (also Esc / pinch-in). */}
            <Link
              href="/?entered=1"
              className="mb-12 inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 type-caption text-fg-2 transition hover:border-fg-3 hover:text-fg"
            >
              <span aria-hidden>←</span>
              Back to the observatory
            </Link>

            <div className="flex items-center gap-4">
              <Image
                src={brand.icon}
                alt=""
                width={512}
                height={512}
                priority
                className="h-16 w-16 rounded-2xl"
              />
              <p className="type-label text-fg-2">
                {brand.domain} · {brand.name}, by Arbor
              </p>
            </div>

            <h1 className="type-display mt-8 max-w-5xl">{app.name}</h1>

            <p className="mt-6 max-w-2xl type-body">{app.hero}</p>
            <p className="mt-3 max-w-2xl type-body text-fg-2">
              {builtOnArbor(brand)}
            </p>

            {app.guide && (
              <div className="mt-10 max-w-2xl rounded-3xl border border-line bg-surface p-6">
                <div className="flex items-center gap-3">
                  <GuideSparkles colour={colour} label={guideLabel} />
                  <p className="type-label" style={{ color: labelColour }}>
                    Meet {brand.name}, your {brand.title}
                  </p>
                </div>
                <p className="mt-3 text-fg-2">{app.guide.blurb}</p>
              </div>
            )}

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href={download ? download.url : "#early-access"}
                target={download ? "_blank" : undefined}
                rel={download ? "noopener noreferrer" : undefined}
                className="ui-primary px-8"
                style={primaryBtn}
              >
                {download ? downloadLabel : "Join early access"}
              </a>
            </div>
          </div>
        </section>

        {/* ---------------------------- Overview ---------------------------- */}
        <section id="overview" className="site-container py-24">
          <p className="ui-kicker">Overview</p>

          <h2 className="type-h1 max-w-4xl">
            {app.overviewTitle ?? "Designed around real people, not engagement."}
          </h2>

          <p className="mt-8 max-w-3xl type-body text-fg-2">
            {app.intro ?? builtOnArbor(brand)}
          </p>

          {app.features && app.features.length > 0 && (
            <div className="mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {app.features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="min-w-[86vw] snap-center md:min-w-[900px]"
                >
                  <div className="overflow-hidden rounded-3xl border border-line bg-surface md:grid md:grid-cols-[1.1fr_0.9fr]">
                    <div className="order-2 p-6 md:order-1">
                      {feature.screenshot ? (
                        <Image
                          src={feature.screenshot}
                          alt={`${app.name}: ${feature.title}`}
                          width={1200}
                          height={2400}
                          className="mx-auto max-h-[720px] w-auto rounded-2xl object-contain"
                        />
                      ) : (
                        <div className="flex h-[520px] items-center justify-center text-fg-2">
                          Preview coming soon
                        </div>
                      )}
                    </div>

                    <div className="order-1 flex flex-col justify-center p-8 md:order-2 md:p-14">
                      <p className="type-label" style={{ color: labelColour }}>
                        {String(index + 1).padStart(2, "0")}
                      </p>

                      <h3 className="type-h2 mt-4">{feature.title}</h3>

                      <p className="mt-6 type-body text-fg-2">
                        {feature.description}
                      </p>

                      <p className="mt-8 type-caption text-fg-2">
                        Swipe for more →
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

        {statusNote && (
          <section className="site-container py-24">
            <div className="rounded-3xl border border-line bg-surface p-8 sm:p-10">
              <p className="ui-kicker">Status</p>

              <p className="type-h2">{statusNote}</p>

              {download && (
                <a
                  href={download.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ui-primary mt-8 px-8"
                  style={primaryBtn}
                >
                  {downloadLabel}
                </a>
              )}
            </div>
          </section>
        )}

        <WaitlistSection />

        <Footer />
      </main>
    </AppWorld>
  );
}
