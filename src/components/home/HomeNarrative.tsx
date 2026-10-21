"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { AppId } from "@/lib/brand";
import { homeCopy } from "@/content/home";

type Chapter = {
  eyebrow: string;
  title: string;
  body: string;
  detail: string;
  apps: AppId[];
};

const chapters: Chapter[] = [
  {
    eyebrow: "01 / Start where you are",
    title: "The last tool you have to start from scratch with.",
    body: "New plans, new routines and new advice often mean explaining your life all over again. Arbor is designed to begin with the context you choose to build.",
    detail: "A guide beside you, not another blank page.",
    apps: ["salus"],
  },
  {
    eyebrow: "02 / Personal, not generic",
    title: "Guidance shaped around the life you are actually living.",
    body: "Every part of Arbor is being built to respond to your goals, capacity, patterns and priorities—not a generic idea of what a life should look like.",
    detail: "Your pace. Your goals. Your direction.",
    apps: ["salus", "thrive", "aevo"],
  },
  {
    eyebrow: "03 / A connected life",
    title: "Because one thing can affect everything else.",
    body: "Sleep changes training. Money changes stress. Stress changes time. Arbor is being built so its specialist guides can make better sense of those connections.",
    detail: "Separate guides. A fuller picture.",
    apps: ["salus", "thrive", "aevo", "nura", "wend"],
  },
  {
    eyebrow: "04 / Your version of life",
    title: "More personal help should not mean less control.",
    body: "You decide what Arbor knows, what is shared, and what matters. The aim is not to prescribe a better life, but to help you make more of the one you choose.",
    detail: "You should not have to work out your life alone.",
    apps: ["salus", "thrive", "aevo", "nura", "wend", "kith", "telos", "sage"],
  },
];

const positions = [
  "left-[12%] top-[19%]",
  "right-[11%] top-[14%]",
  "right-[4%] top-[48%]",
  "right-[20%] bottom-[11%]",
  "left-[20%] bottom-[10%]",
  "left-[2%] top-[49%]",
  "left-[31%] top-[2%]",
  "right-[32%] top-[3%]",
];

export function HomeNarrative() {
  const [active, setActive] = useState(0);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(Number(visible.target.getAttribute("data-chapter")));
      },
      { rootMargin: "-30% 0px -35% 0px", threshold: [0.1, 0.45, 0.75] }
    );

    chapterRefs.current.forEach((chapter) => chapter && observer.observe(chapter));
    return () => observer.disconnect();
  }, []);

  const activeChapter = chapters[active];

  return (
    <section className="theme-dark relative overflow-clip bg-ink text-paper" aria-labelledby="arbor-story-title">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_40%,rgba(156,180,124,0.16),transparent_28rem),radial-gradient(circle_at_16%_82%,rgba(102,149,129,0.12),transparent_26rem)]" />
      <div className="site-container py-20 sm:py-28 lg:py-36">
        <div className="mb-12 max-w-2xl lg:mb-20">
          <p className="ui-kicker text-paper/60">Why Arbor</p>
          <h2 id="arbor-story-title" className="mt-3 text-4xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-6xl">
            Self-help should understand the whole person.
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(25rem,1fr)] lg:gap-20">
          <div className="space-y-[42vh] pb-[18vh] lg:space-y-[56vh]">
            {chapters.map((chapter, index) => (
              <article
                key={chapter.eyebrow}
                ref={(element) => {
                  chapterRefs.current[index] = element;
                }}
                data-chapter={index}
                className={`min-h-[42vh] max-w-xl transition-opacity duration-500 motion-reduce:transition-none ${
                  active === index ? "opacity-100" : "opacity-35 lg:opacity-45"
                }`}
              >
                <p className="text-xs font-medium tracking-[0.14em] text-paper/55">{chapter.eyebrow}</p>
                <h3 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">{chapter.title}</h3>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-paper/72">{chapter.body}</p>
              </article>
            ))}
          </div>

          <div className="lg:sticky lg:top-24 lg:h-[calc(100svh-8rem)] lg:self-start">
            <div className="relative mx-auto grid aspect-square w-full max-w-[34rem] place-items-center overflow-hidden rounded-[3rem] border border-paper/10 bg-paper/[0.035] p-8 backdrop-blur-sm">
              <div className="absolute inset-[12%] rounded-full border border-paper/10" />
              <div className="absolute inset-[25%] rounded-full border border-paper/10" />
              <div className="absolute h-px w-[94%] rotate-[28deg] bg-linear-to-r from-transparent via-paper/15 to-transparent" />
              <div className="absolute h-px w-[94%] -rotate-[42deg] bg-linear-to-r from-transparent via-paper/15 to-transparent" />
              <div className="absolute h-px w-[94%] rotate-90 bg-linear-to-r from-transparent via-paper/10 to-transparent" />

              {homeCopy.apps.map((app, index) => {
                const visible = activeChapter.apps.includes(app.id);
                return (
                  <div
                    key={app.id}
                    aria-hidden
                    className={`absolute ${positions[index]} transition-all duration-700 motion-reduce:transition-none ${
                      visible ? "scale-100 opacity-100" : "scale-75 opacity-15"
                    }`}
                  >
                    <Image src={app.icon} alt="" width={64} height={64} className="h-12 w-12 rounded-2xl shadow-lg sm:h-16 sm:w-16" />
                  </div>
                );
              })}

              <div className="relative z-10 grid h-32 w-32 place-items-center rounded-full border border-paper/20 bg-ink/90 text-center shadow-2xl sm:h-40 sm:w-40">
                <span className="px-5 text-sm font-medium leading-tight text-paper">You, at the centre</span>
              </div>
              <p className="absolute inset-x-8 bottom-9 text-center text-sm leading-relaxed text-paper/65 transition-opacity duration-500 motion-reduce:transition-none sm:inset-x-12">
                {activeChapter.detail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
