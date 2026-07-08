import Image from "next/image";
import type { CSSProperties } from "react";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WaitlistSection } from "@/components/WaitlistSection";
import { AppContentSection } from "@/components/AppContentSection";
import { AppWorld } from "@/components/AppWorld";
import { AppAtmosphere } from "@/components/AppAtmosphere";
import { arborApps } from "@/components/ArborRoom/data/apps";

/** Each app's portal colour, so the page arrives in the same hue. */
function accentFor(name: string): string {
  const match = arborApps.find(
    (a) => a.name.toLowerCase() === name.toLowerCase()
  );
  return match?.colour ?? "#8a8f98";
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** "r, g, b" for use inside rgba(). */
function rgbStr(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  return `${r}, ${g}, ${b}`;
}

/** A legible ink colour to sit on top of a solid accent fill. */
function readableOn(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  return lum > 150 ? "#0a0c10" : "#f5f3ee";
}

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
    download?: {
      type: "beta" | "appstore";
      url: string;
    };
  };
};

export function AppLanding({ app }: AppLandingProps) {
  const downloadLabel =
    app.download?.type === "beta"
      ? "Join the Beta"
      : "Download on the App Store";

  const accent = accentFor(app.name);
  const rgb = rgbStr(accent);
  const ink = readableOn(accent);

  // Hero accent fill, fading into the living atmosphere below.
  const heroBackground = `linear-gradient(180deg, ${accent} 0%, rgba(${rgb},0.7) 20%, rgba(${rgb},0.28) 46%, rgba(${rgb},0.07) 68%, transparent 88%)`;

  // Shared "world glass" — translucent accent panels with a soft outer glow.
  const glass: CSSProperties = {
    background: `linear-gradient(160deg, rgba(${rgb},0.09), rgba(${rgb},0.02))`,
    border: `1px solid rgba(${rgb},0.18)`,
    boxShadow: `0 24px 70px -28px rgba(0,0,0,0.7), 0 0 70px -30px rgba(${rgb},0.6), inset 0 1px 0 rgba(255,255,255,0.05)`,
    backdropFilter: "blur(12px)",
  };

  const primaryBtn: CSSProperties = {
    background: accent,
    color: ink,
    boxShadow: `0 0 40px rgba(${rgb},0.45)`,
  };

  const eyebrow: CSSProperties = { color: accent };
  const divider: CSSProperties = {
    background: `linear-gradient(90deg, ${accent}, transparent)`,
  };

  return (
    <AppWorld accent={accent}>
      <main className="relative min-h-screen overflow-hidden bg-[#05060a] text-white">
        <AppAtmosphere rgb={rgb} />

        <div className="relative z-10">
          <Navbar />

          {/* ---------- Immersive hero: arrival into the app's world ---------- */}
          <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-8 pt-40 sm:pt-32">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-screen -translate-x-1/2"
              style={{ background: heroBackground }}
            />
            {/* Light bloom behind the title. */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[42%] -z-10 h-[62vh] w-[62vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
              style={{
                background: `radial-gradient(circle, rgba(${rgb},0.55), transparent 70%)`,
              }}
            />

            {app.backgroundScreenshots && app.backgroundScreenshots.length > 0 && (
              <div className="pointer-events-none absolute inset-0 hidden opacity-40 lg:block">
                {app.backgroundScreenshots.slice(0, 3).map((src, i) => {
                  const place = [
                    "right-20 top-24 w-40 rotate-[-8deg]",
                    "right-0 top-56 w-40 rotate-[8deg]",
                    "right-52 top-[20rem] w-36 rotate-[-2deg]",
                  ][i];
                  return (
                    <div
                      key={src}
                      className={`absolute ${place} overflow-hidden rounded-[2rem] p-2`}
                      style={{
                        border: `1px solid rgba(${rgb},0.35)`,
                        background: "rgba(6,8,12,0.6)",
                        boxShadow: `0 0 50px -12px rgba(${rgb},0.6)`,
                      }}
                    >
                      <Image
                        src={src}
                        alt={`${app.name} preview`}
                        width={600}
                        height={1200}
                        loading="lazy"
                        className="rounded-[1.5rem]"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mx-auto w-full max-w-6xl">
              {/* Back to the observatory — part of the page, at the top of the
                  hero, below the nav bar (also Esc / pinch-in). */}
              <a
                href="/?entered=1"
                className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[0.7rem] uppercase tracking-[0.25em] text-white/75 backdrop-blur transition hover:border-white/50 hover:text-white"
                aria-label="Back to the observatory"
              >
                <span aria-hidden className="text-sm leading-none">
                  ⎋
                </span>
                Back to the observatory
              </a>

              <p
                className="mb-6 flex items-center gap-3 text-sm uppercase tracking-[0.4em]"
                style={eyebrow}
              >
                <span
                  className="inline-block h-px w-10"
                  style={divider}
                  aria-hidden
                />
                {app.tag}
              </p>

              <h1
                className="max-w-5xl text-6xl font-semibold leading-[1.05] md:text-8xl"
                style={{
                  textShadow: `0 0 60px rgba(${rgb},0.55), 0 2px 30px rgba(0,0,0,0.5)`,
                }}
              >
                {app.name}
              </h1>

              <p className="mt-10 max-w-2xl text-xl leading-8 text-white/85 [text-shadow:0_1px_18px_rgba(0,0,0,0.5)]">
                {app.hero}
              </p>

              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <a
                  href={app.download ? app.download.url : "#early-access"}
                  target={app.download ? "_blank" : undefined}
                  rel={app.download ? "noopener noreferrer" : undefined}
                  className="rounded-full px-8 py-4 text-center font-medium transition hover:scale-[1.03]"
                  style={primaryBtn}
                >
                  {app.download ? downloadLabel : "Join Early Access"}
                </a>
              </div>
            </div>

            {/* Descent cue — desktop only (on mobile it sat under the buttons). */}
            <div className="pointer-events-none absolute bottom-10 left-1/2 hidden -translate-x-1/2 text-[0.7rem] uppercase tracking-[0.3em] text-white/50 sm:block">
              Scroll to explore
            </div>
          </section>

          {/* ---------------------------- Overview ---------------------------- */}
          <section id="overview" className="relative mx-auto max-w-6xl px-8 py-32">
            <div
              aria-hidden
              className="mb-10 h-px w-24"
              style={divider}
            />
            <p
              className="mb-6 text-sm uppercase tracking-[0.3em]"
              style={eyebrow}
            >
              Overview
            </p>

            <h2 className="max-w-4xl text-5xl font-semibold leading-tight">
              {app.overviewTitle ??
                "Designed around real people, not engagement."}
            </h2>

            <p className="mt-10 max-w-3xl text-xl leading-8 text-white/70">
              {app.intro ??
                "This app is part of the wider Arbor ecosystem — built to help people live with more direction, awareness, and intention."}
            </p>

            {app.features && app.features.length > 0 && (
              <div className="mt-16 flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {app.features.map((feature, index) => (
                  <div
                    key={feature.title}
                    className="min-w-[88vw] snap-center md:min-w-[900px]"
                  >
                    <div
                      className="overflow-hidden rounded-[2rem] md:grid md:grid-cols-[1.1fr_0.9fr]"
                      style={glass}
                    >
                      <div className="order-2 relative overflow-hidden p-6 md:order-1">
                        {feature.screenshot ? (
                          <Image
                            src={feature.screenshot}
                            alt={feature.title}
                            width={1200}
                            height={2400}
                            className="mx-auto max-h-[720px] w-auto rounded-[1.5rem] object-contain"
                          />
                        ) : (
                          <div className="flex h-[520px] items-center justify-center text-white/40">
                            Preview coming soon
                          </div>
                        )}
                      </div>

                      <div className="order-1 flex flex-col justify-center p-8 md:order-2 md:p-14">
                        <div
                          className="mb-8 flex h-12 w-12 items-center justify-center rounded-full text-sm font-medium"
                          style={{
                            border: `1px solid rgba(${rgb},0.5)`,
                            color: accent,
                            boxShadow: `0 0 24px -6px rgba(${rgb},0.7)`,
                          }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <h3 className="text-4xl font-semibold leading-tight">
                          {feature.title}
                        </h3>

                        <p className="mt-6 text-lg leading-8 text-white/70">
                          {feature.description}
                        </p>

                        <p
                          className="order-3 mt-6 text-sm uppercase tracking-[0.3em] md:mt-10"
                          style={{ color: `rgba(${rgb},0.85)` }}
                        >
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
            accent={accent}
            rgb={rgb}
          />

          {app.status && (
            <section className="mx-auto max-w-6xl px-8 py-24">
              <div className="rounded-3xl p-10" style={glass}>
                <p
                  className="text-sm uppercase tracking-[0.3em]"
                  style={eyebrow}
                >
                  Status
                </p>

                <p className="mt-6 text-2xl font-medium">{app.status}</p>

                {app.download && (
                  <a
                    href={app.download.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-block rounded-full px-8 py-4 text-center font-medium transition hover:scale-[1.03]"
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
        </div>
      </main>
    </AppWorld>
  );
}
