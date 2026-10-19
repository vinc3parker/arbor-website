"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { homeCopy } from "@/content/home";
import { apps } from "@/content/apps";
import type { AppId } from "@/lib/brand";

const cardImages: Record<AppId, string> = {
  aevo: "/images/guides/aevo-card.png",
  salus: "/images/guides/salus-card.png",
  thrive: "/images/guides/thrive-card.png",
  nura: "/images/guides/nura-card.png",
  wend: "/images/guides/wend-card.png",
  kith: "/images/guides/kith-card.png",
  telos: "/images/guides/telos-card.png",
  sage: "/images/guides/sage-card.png",
};

export function HomeHero() {
  const railRef = useRef<HTMLUListElement>(null);
  const railApps = [...homeCopy.apps, ...homeCopy.apps, ...homeCopy.apps];

  const updateCardFocus = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;

    const railCenter = rail.getBoundingClientRect().left + rail.clientWidth / 2;
    const fadeDistance = rail.clientWidth * 0.65;

    rail.querySelectorAll<HTMLElement>("[data-rail-card]").forEach((card) => {
      const cardBounds = card.getBoundingClientRect();
      const cardCenter = cardBounds.left + cardBounds.width / 2;
      const opacity = Math.max(0.18, 1 - Math.abs(cardCenter - railCenter) / fadeDistance);
      card.style.opacity = String(opacity);
    });
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const frame = requestAnimationFrame(() => {
      rail.scrollLeft = rail.scrollWidth / 3;
      updateCardFocus();
    });

    return () => cancelAnimationFrame(frame);
  }, [updateCardFocus]);

  const loopRail = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;

    const segmentWidth = rail.scrollWidth / 3;
    if (rail.scrollLeft < segmentWidth * 0.4) rail.scrollLeft += segmentWidth;
    if (rail.scrollLeft > segmentWidth * 1.6) rail.scrollLeft -= segmentWidth;
    updateCardFocus();
  }, [updateCardFocus]);

  return (
    <section className="site-container pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32" aria-labelledby="home-heading">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div>
          <h1 id="home-heading" className="home-headline max-w-2xl" style={{ fontSize: "clamp(2.4rem, 4.3vw, 4.5rem)" }}>Eight specialist apps.<br /><span className="text-fg-3">One connected life.</span></h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-fg-2 sm:mt-7 sm:text-xl">For health, mind, money, time and more, each app has its own AI guide. They&apos;re being built to work together as one connected system, so every guide can understand more of your life.</p>
          <div className="mt-7 flex flex-wrap items-center gap-4 sm:mt-9"><Link href="/guides" className="ui-primary gap-6 px-6">Explore the eight apps <span aria-hidden>↗</span></Link><Link href="/how-it-works" className="inline-flex min-h-12 items-center px-2 type-label text-fg-2 underline decoration-line underline-offset-8 transition hover:text-fg">How they connect</Link></div>
        </div>
        <figure className="theme-dark relative isolate min-h-[27rem] overflow-hidden rounded-t-[12rem] rounded-b-3xl bg-bg text-fg sm:min-h-[32rem] lg:h-[clamp(26rem,calc(100svh-10rem),35rem)] lg:min-h-0">
          <Image src="/images/arbor-woodland.webp" alt="Sunlight finding its way through a quiet woodland path" fill sizes="(max-width: 1023px) 90vw, 550px" className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-ink/90 via-transparent to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 p-8 sm:p-10"><p className="text-xs text-paper/80">{homeCopy.hero.title}</p><p className="mt-3 max-w-xs text-3xl font-medium leading-tight text-paper">Your own path.<br />A guide beside you.</p></figcaption>
        </figure>
      </div>
      <section className="mt-14 border-y border-line py-7 lg:mt-20 lg:py-8" aria-label="Explore the Arbor apps">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <div>
            <p className="type-caption text-fg-2">Meet the apps</p>
            <p className="mt-1 text-sm text-fg-2">Eight guides, each made for a different part of your life.</p>
          </div>
          <p className="text-xs text-fg-3">Swipe to explore</p>
        </div>
        <div className="relative mt-5">
          <ul ref={railRef} onScroll={loopRail} className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-10 pb-2 [scrollbar-width:thin] sm:mx-0 sm:px-[max(3rem,calc((100%-46rem)/2))]">
            {railApps.map((app, index) => {
            const download = apps[app.id].download;
            const isClone = index < homeCopy.apps.length || index >= homeCopy.apps.length * 2;

            return <li key={`${app.id}-${index}`} data-rail-card aria-hidden={isClone || undefined} className="w-[calc(100vw-5rem)] shrink-0 snap-center transition-opacity duration-150 sm:w-[42rem] lg:w-[46rem]">
              <article className="theme-dark relative isolate flex min-h-[23rem] overflow-hidden rounded-3xl border border-line bg-ink text-paper sm:min-h-[21rem]">
                <Image src={cardImages[app.id]} alt="" fill sizes="(max-width: 639px) calc(100vw - 3rem), (max-width: 1023px) 38rem, 43rem" className="-z-20 object-cover" />
                <div className="absolute inset-0 -z-10 bg-linear-to-r from-ink via-ink/85 to-ink/25" />
                <div className="flex w-full flex-col p-6 sm:max-w-[72%] sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <Image src={app.icon} alt="" width={48} height={48} className="h-12 w-12 rounded-2xl" />
                    <span className="rounded-full border border-paper/25 bg-ink/25 px-3 py-1 text-[0.65rem] leading-tight text-paper/85 backdrop-blur-sm">{app.badge}</span>
                  </div>
                  <p className="mt-7 text-sm font-medium text-paper/70">{app.domain}</p>
                  <h2 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{app.name}</h2>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-paper/85">{app.description}</p>
                  <p className="mt-3 text-sm text-paper/70">{app.role}</p>
                  <p className="mt-auto pt-7">
                  {download ? (
                    <a href={download.url} target="_blank" rel="noopener noreferrer" tabIndex={isClone ? -1 : undefined} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-paper px-5 text-sm font-medium text-ink transition hover:bg-paper/85">
                      Get on TestFlight <span aria-hidden className="ml-2">↗</span>
                    </a>
                  ) : (
                    <Link href={app.href} tabIndex={isClone ? -1 : undefined} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-paper/35 bg-ink/20 px-5 text-sm font-medium text-paper backdrop-blur-sm transition hover:bg-paper/15">
                      Meet {app.name} <span aria-hidden className="ml-2">→</span>
                    </Link>
                  )}
                </p>
                </div>
              </article>
            </li>;
            })}
          </ul>
        </div>
      </section>
    </section>
  );
}
