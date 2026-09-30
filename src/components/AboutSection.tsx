import { Reveal } from "@/components/home/Reveal";
import { ScatteredLife } from "@/components/home/ScatteredLife";
import { WholeLifeTree } from "@/components/home/WholeLifeTree";

/**
 * The problem and the answer, as a pair: eight parts of life scattered on
 * their own, then the same eight grown from one Arbor trunk. Text and picture
 * swap sides between the two so the page reads down, not across.
 */
export function AboutSection() {
  return (
    <section id="about" className="site-container py-24">
      {/* The problem (brand guide 1.2) */}
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="ui-kicker">Why Arbor</p>
          <h2 className="type-h1">You are one whole person.</h2>
          <p className="mt-6 max-w-xl type-body text-fg-2">
            Your work, health, mind and relationships all belong to the same
            person, and each one shapes how you show up in the others. There
            are apps for each part of life, but none of them connect, so
            you&apos;re left carrying the context yourself.
          </p>
        </div>
        <Reveal>
          <ScatteredLife />
        </Reveal>
      </div>

      {/* The answer (brand guide 3.6, 6.9) */}
      <div className="mt-24 grid items-center gap-12 border-t border-line pt-24 lg:grid-cols-2 lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <WholeLifeTree />
        </Reveal>
        <div className="order-1 lg:order-2">
          <p className="ui-kicker">A guide for your whole life</p>
          <h2 className="type-h1">
            Eight guides, one for every part of your life, that learn from each
            other.
          </h2>
          <p className="mt-6 max-w-xl type-body text-fg-2">
            Arbor is eight apps for your health, mind, time, money, free time,
            friends, work and learning, each with its own guide. Behind them
            sits one shared understanding of you, built from what you share and
            what you say matters. So when your week gets busy, your coach knows.
            There is no ideal life to chase, just yours.
          </p>
          <a
            href="#apps"
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl px-1 type-label text-fg underline decoration-moss decoration-2 underline-offset-8 transition hover:decoration-fg"
          >
            Meet the guides
            <span aria-hidden>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
