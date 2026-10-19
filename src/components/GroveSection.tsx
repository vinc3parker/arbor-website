import Link from "next/link";
import Image from "next/image";

/** An illustration of the idea, deliberately without working product controls. */
export function GroveConceptIllustration({ compact = false }: { compact?: boolean }) {
  return (
    <figure className="theme-dark overflow-hidden rounded-3xl border border-line bg-bg text-fg">
      <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4 type-caption text-fg-2">
        <span>Arbor Grove</span>
        <span>Concept illustration</span>
      </div>

      <div className={`relative isolate grid place-items-center overflow-hidden px-6 ${compact ? "min-h-80 py-12" : "min-h-[26rem] py-16 sm:min-h-[32rem]"}`}>
        <Image src="/images/arbor-coastal-path.webp" alt="" fill sizes={compact ? "(max-width: 1023px) 90vw, 550px" : "90vw"} className="-z-20 object-cover object-[50%_55%]" />
        <div className="absolute inset-0 -z-10 bg-ink/75" />
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[25rem] w-[25rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-moss/35" />
          <div className="absolute left-1/2 top-1/2 h-[35rem] w-[35rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-moss/20" />
          <div className="absolute left-1/2 top-1/2 h-[45rem] w-[45rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-moss/10" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-moss/15" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-moss/15" />
        </div>

        <div className="relative max-w-sm text-center">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.22em] text-accent">A future workspace</p>
          <p className={`${compact ? "text-5xl" : "text-5xl sm:text-6xl"} font-semibold leading-[1.08] tracking-[-0.04em]`}>
            A wider view.
          </p>
          <div aria-hidden className="mx-auto my-7 h-12 w-px bg-accent" />
          <p className="mx-auto max-w-60 text-sm leading-relaxed text-fg-2">
            Your plans, your progress and your guides. Room to see how it all fits.
          </p>
        </div>
      </div>

      <figcaption className="border-t border-line px-6 py-4 text-xs leading-relaxed text-fg-2">
        An illustration of the vision. Grove has not entered development.
      </figcaption>
    </figure>
  );
}

export function GroveSection() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="site-container grid gap-12 py-24 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-20">
        <div>
          <span className="ui-status mb-7 bg-transparent">A future idea</span>
          <p className="ui-kicker">Arbor Grove</p>
          <h2 className="type-h1 max-w-lg">More room to see the whole picture.</h2>
          <p className="mt-6 max-w-lg type-body text-fg-2">
            Our vision for a web workspace, bringing your guides together for
            deeper planning and reflection on a larger screen.
          </p>
          <p className="mt-5 max-w-lg text-base text-fg-2">
            Grove is at the concept stage. Development has not started and there
            is no release date.
          </p>
          <Link href="/grove" className="ui-secondary mt-8 gap-3 border-fg/25 px-6">
            Explore the idea <span aria-hidden>↗</span>
          </Link>
        </div>

        <GroveConceptIllustration compact />
      </div>
    </section>
  );
}
