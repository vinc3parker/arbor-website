import Link from "next/link";
import { GuideStories } from "@/components/home/GuideStories";

export function AboutSection() {
  return (
    <section id="how-it-works" className="site-container py-16 sm:py-24">
      <div className="grid gap-7 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <p className="ui-kicker">Why Arbor</p>
          <h2 className="type-h1 max-w-xl">You are one whole person.<br /><span className="text-fg-3">Your guides should see that.</span></h2>
        </div>
        <div className="lg:pt-9">
          <p className="max-w-xl type-body text-fg-2">
            Your health, work, money and relationships shape each other.
            Arbor is being built around that connection, with a specialist app
            and personal guide for each part of life.
          </p>
          <p className="mt-5 max-w-xl leading-relaxed text-fg-2">
            Each guide is a distinct AI agent with its own expertise and way of
            helping. The aim is for the apps to build on a shared understanding
            of your life, helping you think things through and take practical next steps
            without starting from scratch in every part of life.
          </p>
        </div>
      </div>

      <GuideStories />

      <div className="mt-10 grid gap-8 border-b border-line pb-12 md:grid-cols-3 md:gap-10">
        <div><p className="mb-3 type-caption text-fg-3">01 / Personal</p><h3 className="text-lg font-semibold">Your life sets the direction.</h3><p className="mt-3 text-sm leading-relaxed text-fg-2">Your goals, your pace, your version of a good life. There is no ideal person to become.</p></div>
        <div><p className="mb-3 type-caption text-fg-3">02 / Connected</p><h3 className="text-lg font-semibold">One understanding of you.</h3><p className="mt-3 text-sm leading-relaxed text-fg-2">The apps are being built to connect the parts of life that already shape each other, so each guide can see the fuller picture.</p></div>
        <div><p className="mb-3 type-caption text-fg-3">03 / Useful</p><h3 className="text-lg font-semibold">Guidance with context.</h3><p className="mt-3 text-sm leading-relaxed text-fg-2">A guide for one part of life can understand what is happening in the others, making its next step more useful.</p><Link href="/privacy" className="mt-4 inline-flex min-h-8 items-center text-sm underline decoration-line underline-offset-4">How we handle your data <span aria-hidden className="ml-2">↗</span></Link></div>
      </div>
    </section>
  );
}
