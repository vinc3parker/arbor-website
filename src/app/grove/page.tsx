import type { Metadata } from "next";
import Link from "next/link";

import { GroveConceptIllustration } from "@/components/GroveSection";
import { GroveFooter, GroveHeader } from "@/components/grove/GroveChrome";

const description =
  "Explore the idea behind Arbor Grove: a future web workspace for deeper planning and reflection with your personal guides. Development has not started.";

export const metadata: Metadata = {
  title: "Arbor Grove — a future workspace",
  description,
  alternates: { canonical: "https://arborapps.co/grove" },
  openGraph: {
    title: "Arbor Grove — a future workspace",
    description,
    url: "https://arborapps.co/grove",
    siteName: "Arbor",
    images: [
      {
        url: "https://arborapps.co/og-image.png",
        width: 1200,
        height: 630,
        alt: "Arbor Grove, a future workspace concept",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arbor Grove — a future workspace",
    description,
    images: ["https://arborapps.co/og-image.png"],
  },
};

const possibilities = [
  {
    number: "01",
    title: "Space for the bigger plan.",
    body: "A place to work through longer goals and projects, with the room to connect the next step to the life you want.",
  },
  {
    number: "02",
    title: "Perspective across your life.",
    body: "Review different parts of life together, so plans for work, learning or a trip can reflect your time and energy.",
  },
  {
    number: "03",
    title: "The guides you already know.",
    body: "A wider home for your personal guides, carrying forward the understanding built across Arbor.",
  },
];

export default function GroveConceptPage() {
  return (
    <main className="theme-grove min-h-screen bg-bg text-fg">
      <GroveHeader />

      <section className="site-container pb-16 pt-8 sm:pb-24 sm:pt-6">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-5 border-b border-line pb-6">
          <p className="text-base font-medium">A future Arbor workspace</p>
          <span className="ui-status bg-transparent">Concept stage · Development not started</span>
        </div>

        <div className="grid gap-10 pb-14 lg:grid-cols-[1.3fr_0.7fr] lg:items-end lg:gap-16">
          <div>
            <p className="ui-kicker">Looking ahead</p>
            <h1 className="type-display max-w-4xl">A little more room for your life.</h1>
          </div>
          <div className="lg:pb-2">
            <p className="type-body text-fg-2">
              Grove is our vision for a web workspace: a larger surface to plan,
              reflect and bring your guides together.
            </p>
            <p className="mt-5 text-base text-fg-2">
              It is still an idea. Real development has not begun and there is no
              release date.
            </p>
            <Link href="#vision" className="mt-6 inline-flex min-h-11 items-center gap-3 text-base font-medium underline decoration-line underline-offset-8 transition hover:decoration-fg">
              The vision <span aria-hidden>↓</span>
            </Link>
          </div>
        </div>

        <GroveConceptIllustration />
      </section>

      <section id="vision" className="scroll-mt-24 border-y border-line bg-surface">
        <div className="site-container py-20 sm:py-24">
          <div className="grid gap-6 lg:grid-cols-[0.4fr_1fr] lg:gap-16">
            <p className="ui-kicker">What we imagine</p>
            <div>
              <h2 className="type-h1 max-w-3xl">Some things need space to think.</h2>
              <p className="mt-6 max-w-2xl type-body text-fg-2">
                Your phone is with you in the moment. Grove would offer a place
                to step back, see the connections and spend time with the plans
                that deserve more attention.
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {possibilities.map((item) => (
              <article key={item.number} className="border-t border-fg/20 pt-6">
                <p className="mb-8 text-sm text-fg-2">{item.number}</p>
                <h3 className="max-w-xs text-2xl font-medium leading-tight tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-fg-2">{item.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-10 text-sm text-fg-2">
            These are directions we are exploring. The design and scope are still open.
          </p>
        </div>
      </section>

      <section className="site-container grid gap-8 py-20 sm:py-24 lg:grid-cols-[0.4fr_1fr] lg:gap-16">
        <p className="ui-kicker">Where things stand</p>
        <div>
          <h2 className="type-h2 max-w-2xl">The apps come first.</h2>
          <p className="mt-6 max-w-2xl type-body text-fg-2">
            Our focus is testing and building the Arbor apps. Grove remains a
            future concept while that work continues.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/guides" className="ui-primary px-6">Meet the guides</Link>
            <Link href="/progress" className="ui-secondary px-6">See our progress</Link>
          </div>
        </div>
      </section>

      <GroveFooter />
    </main>
  );
}
