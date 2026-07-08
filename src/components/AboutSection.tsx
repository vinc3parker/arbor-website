export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-4xl px-8 py-32">
      {/* The problem */}
      <p className="mb-5 text-sm uppercase tracking-[0.3em] text-neutral-500">
        The problem
      </p>
      <h2 className="text-4xl font-semibold leading-tight md:text-5xl">
        Life is fragmented across a dozen apps.
      </h2>
      <div className="mt-8 space-y-6 text-lg leading-8 text-neutral-400">
        <p>
          One app for training, another for money, another for reflection,
          plans, learning, connection. Each one sees only its own slice of you,
          and none of them see the whole picture.
        </p>
        <p>
          So the work of holding your life together falls on you — copying
          context between tools that don&apos;t talk to each other, and making
          sense of yourself across a dozen accounts that each think they are the
          only thing you care about.
        </p>
      </div>

      {/* The ecosystem */}
      <div className="mt-28">
        <p className="mb-5 text-sm uppercase tracking-[0.3em] text-neutral-500">
          The ecosystem
        </p>
        <h2 className="text-4xl font-semibold leading-tight md:text-5xl">
          One ecosystem that understands the whole you.
        </h2>
        <div className="mt-8 space-y-6 text-lg leading-8 text-neutral-400">
          <p>
            Arbor is built the other way around. A life has eight dimensions —
            your finances, body, mind, growth, purpose, relationships,
            experiences, and how you live day to day — and Arbor gives you a
            specialist app for each one.
          </p>
          <p>
            Underneath them is a single ecosystem that shares one understanding
            of you, so the parts work together instead of pulling in different
            directions. Each app is an expert in its domain; together they know
            you as a whole person. Not eight apps to juggle — one that
            understands the complete picture.
          </p>
        </div>
      </div>
    </section>
  );
}
