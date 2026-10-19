import Image from "next/image";
import Link from "next/link";

export function HomeStruggle() {
  return (
    <section className="theme-dark bg-bg text-fg" aria-labelledby="struggle-heading">
      <div className="site-container grid gap-10 py-20 sm:py-28 lg:grid-cols-[1fr_0.8fr] lg:gap-24">
        <div>
          <p className="ui-kicker">The struggle</p>
          <h2 id="struggle-heading" className="type-h1 max-w-2xl">
            Life doesn&apos;t come one question at a time.
          </h2>
        </div>
        <div className="lg:pt-11">
          <p className="type-body text-fg-2">
            A change in your routine can affect your energy, your plans, your money
            and the people around you. Yet the support you turn to often sees just
            one piece. You carry the rest of the story yourself.
          </p>
          <p className="mt-7 border-l-2 border-moss pl-5 text-lg leading-relaxed">
            What if your support could start with the whole person?
          </p>
        </div>
      </div>
    </section>
  );
}

export function HomeAnswer() {
  return (
    <section className="site-container py-20 sm:py-28" aria-labelledby="answer-heading">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
        <div>
          <p className="ui-kicker">The Arbor idea</p>
          <h2 id="answer-heading" className="type-h1 max-w-2xl">
            One whole person. <span className="text-fg-3">Guidance for every part.</span>
          </h2>
        </div>
        <div className="lg:pt-11">
          <p className="type-body text-fg-2">
            Each app has a guide with focused expertise. Arbor is being built
            to connect them, so support in one area can take account of the
            others. The result is guidance shaped by the fuller picture of your life.
          </p>
          <Link href="/how-it-works" className="mt-7 inline-flex min-h-11 items-center gap-4 font-medium underline decoration-line underline-offset-8">
            See how the guides could work together <span aria-hidden>↗</span>
          </Link>
        </div>
      </div>
      <div className="mt-14 grid border-t border-line pt-8 sm:grid-cols-3 sm:gap-10">
        <div className="border-b border-line py-5 sm:border-b-0 sm:py-0"><p className="type-caption text-fg-3">01 / Personal</p><p className="mt-3 text-lg font-medium">Start where you are.</p><p className="mt-2 text-sm leading-relaxed text-fg-2">Your goals and your pace set the direction.</p></div>
        <div className="border-b border-line py-5 sm:border-b-0 sm:py-0"><p className="type-caption text-fg-3">02 / Connected</p><p className="mt-3 text-lg font-medium">Bring the pieces together.</p><p className="mt-2 text-sm leading-relaxed text-fg-2">The guides are being built around a shared understanding of your life.</p></div>
        <div className="py-5 sm:py-0"><p className="type-caption text-fg-3">03 / Informed</p><p className="mt-3 text-lg font-medium">Guidance that fits.</p><p className="mt-2 text-sm leading-relaxed text-fg-2">Every guide can make better sense of the goals, rhythms and relationships that shape your life.</p></div>
      </div>
    </section>
  );
}

export function HomeGuideInvitation() {
  return (
    <section className="theme-dark relative isolate overflow-hidden bg-bg text-fg" aria-labelledby="guide-invitation-heading">
      <Image
        src="/images/arbor-coastal-path.webp"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[50%_55%]"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-ink/95 via-ink/80 to-ink/45" />
      <div className="site-container py-24 sm:py-32">
        <p className="ui-kicker">Your next step</p>
        <h2 id="guide-invitation-heading" className="type-h1 max-w-3xl">
          Start with the part of life asking for your attention.
        </h2>
        <p className="mt-6 max-w-xl type-body text-fg-2">
          Each doorway opens onto one specialist app and its personal AI guide.
          Explore what each is for, and see where it stands today.
        </p>
        <Link href="/guides" className="ui-primary mt-9 gap-6 px-6">
          Step into the archways <span aria-hidden>↗</span>
        </Link>
      </div>
    </section>
  );
}
