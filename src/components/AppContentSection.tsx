import type { CSSProperties } from "react";

type AppContentSectionProps = {
  appName: string;
  detailedDescription?: string;
  targetAudience?: string;
  /** App accent colour, so this section belongs to the same world. */
  accent?: string;
  /** "r, g, b" of the accent, for rgba() tints. */
  rgb?: string;
};

export function AppContentSection({
  appName,
  detailedDescription,
  targetAudience,
  accent = "#8a8f98",
  rgb = "138, 143, 152",
}: AppContentSectionProps) {
  if (!detailedDescription && !targetAudience) {
    return null;
  }

  const glass: CSSProperties = {
    background: `linear-gradient(160deg, rgba(${rgb},0.09), rgba(${rgb},0.02))`,
    border: `1px solid rgba(${rgb},0.18)`,
    boxShadow: `0 24px 70px -28px rgba(0,0,0,0.7), 0 0 70px -30px rgba(${rgb},0.6), inset 0 1px 0 rgba(255,255,255,0.05)`,
    backdropFilter: "blur(12px)",
  };

  const eyebrow: CSSProperties = { color: accent };
  const divider: CSSProperties = {
    background: `linear-gradient(90deg, ${accent}, transparent)`,
  };

  return (
    <section className="mx-auto max-w-6xl px-8 py-24">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {detailedDescription && (
          <div className="rounded-3xl p-10" style={glass}>
            <div aria-hidden className="mb-6 h-px w-16" style={divider} />
            <p
              className="mb-4 text-xs uppercase tracking-[0.3em]"
              style={eyebrow}
            >
              The idea
            </p>
            <h2 className="mb-6 text-3xl font-semibold">What is {appName}?</h2>
            <p className="text-lg leading-8 text-white/70">
              {detailedDescription}
            </p>
          </div>
        )}

        {targetAudience && (
          <div className="rounded-3xl p-10" style={glass}>
            <div aria-hidden className="mb-6 h-px w-16" style={divider} />
            <p
              className="mb-4 text-xs uppercase tracking-[0.3em]"
              style={eyebrow}
            >
              Who it's for
            </p>
            <h2 className="mb-6 text-3xl font-semibold">
              Who is {appName} for?
            </h2>
            <p className="text-lg leading-8 text-white/70">{targetAudience}</p>
          </div>
        )}
      </div>
    </section>
  );
}
