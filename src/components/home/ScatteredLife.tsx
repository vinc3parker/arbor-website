"use client";

import { useEffect, useRef } from "react";
import { APP_BRANDS, APP_ORDER } from "@/lib/brand";

// Loose, slightly uneven positions (% of the field): eight parts of one life,
// each off on its own. Deliberately not a grid.
const SPOTS = [
  { x: 4, y: 6, r: -3 },
  { x: 52, y: 0, r: 2 },
  { x: 24, y: 28, r: 1 },
  { x: 62, y: 30, r: -2 },
  { x: 0, y: 52, r: 2 },
  { x: 40, y: 56, r: -1 },
  { x: 10, y: 80, r: -2 },
  { x: 56, y: 80, r: 3 },
];

// Phones: roughly two loose columns, so wider labels never collide.
const SPOTS_NARROW = [
  { x: 2, y: 4 },
  { x: 56, y: 0 },
  { x: 6, y: 24 },
  { x: 58, y: 28 },
  { x: 0, y: 48 },
  { x: 44, y: 54 },
  { x: 8, y: 74 },
  { x: 58, y: 80 },
];

// A chip steps aside when the pointer comes within NUDGE_RADIUS px of its
// centre, by up to NUDGE_MAX px. Each also drifts on its own slow loop,
// different per chip so they never move in step.
const NUDGE_RADIUS = 140;
const NUDGE_MAX = 16;
const DRIFT = [
  { s: 7.6, d: 0 },
  { s: 9.2, d: -2.1 },
  { s: 8.4, d: -4.3 },
  { s: 10.1, d: -1.2 },
  { s: 7.9, d: -3.4 },
  { s: 9.7, d: -5.6 },
  { s: 8.8, d: -0.7 },
  { s: 10.6, d: -2.9 },
];

/**
 * "Why Arbor": the eight parts of a life, scattered and unconnected — the
 * problem the tree in the next section answers. Each chip floats in its own
 * place; with a mouse, a chip eases out of the way as the pointer nears it.
 */
export function ScatteredLife() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const chips = [...field.querySelectorAll<HTMLElement>(".chip-parallax")];
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        for (const chip of chips) {
          // Measure the chip's resting place (its parent isn't displaced).
          const rect = chip.parentElement!.getBoundingClientRect();
          const dx = rect.left + rect.width / 2 - e.clientX;
          const dy = rect.top + rect.height / 2 - e.clientY;
          const dist = Math.hypot(dx, dy) || 1;
          // Only chips the pointer comes close to step aside, more the closer
          // it gets; the rest stay put.
          const push = Math.max(0, 1 - dist / NUDGE_RADIUS) * NUDGE_MAX;
          chip.style.setProperty("--nx", `${((dx / dist) * push).toFixed(1)}px`);
          chip.style.setProperty("--ny", `${((dy / dist) * push).toFixed(1)}px`);
        }
      });
    };
    const settle = () => {
      for (const chip of chips) {
        chip.style.setProperty("--nx", "0px");
        chip.style.setProperty("--ny", "0px");
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", settle);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", settle);
    };
  }, []);

  return (
    <div
      ref={fieldRef}
      role="img"
      aria-label="Health, mind, organisation, money, experiences, relationships, purpose and growth, each on its own and unconnected"
      className="relative aspect-[4/5] w-full sm:aspect-[5/4]"
    >
      {APP_ORDER.map((id, i) => {
        const spot = SPOTS[i];
        const narrow = SPOTS_NARROW[i];
        return (
          <span
            key={id}
            aria-hidden
            className="reveal-item absolute top-[var(--my)] left-[var(--mx)] sm:top-[var(--y)] sm:left-[var(--x)]"
            style={{
              ["--x" as string]: `${spot.x}%`,
              ["--y" as string]: `${spot.y}%`,
              ["--mx" as string]: `${narrow.x}%`,
              ["--my" as string]: `${narrow.y}%`,
              transitionDelay: `${i * 70}ms`,
            }}
          >
            {/* Steps aside from the pointer (desktop) */}
            <span className="chip-parallax block">
              {/* Drifts on its own (everywhere) */}
              <span
                className="chip-float block"
                style={{ animationDuration: `${DRIFT[i].s}s`, animationDelay: `${DRIFT[i].d}s` }}
              >
                <span
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface px-4 py-2 text-base font-medium text-fg sm:gap-2.5 sm:px-5 sm:py-3 sm:text-lg"
                  style={{ rotate: `${spot.r}deg` }}
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-moss" />
                  {APP_BRANDS[id].domain}
                </span>
              </span>
            </span>
          </span>
        );
      })}
    </div>
  );
}
