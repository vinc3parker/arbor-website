import type { ArborApp } from '../data/apps';

/**
 * Tiny mutable store bridging the DOM (scroll position, overlays, router)
 * and the three.js scene (read per-frame inside useFrame). Deliberately not
 * React state — scroll updates every frame and must not re-render the tree.
 */
export interface PortalTransition {
  app: ArborApp;
  /** ms timestamp when the transition started. */
  startedAt: number;
}

export const heroState = {
  /** 0..1 scroll scrub through the intro sequence. */
  progress: 0,

  /** App currently hovered, if any. */
  hovered: null as ArborApp | null,

  /** Set while a portal has been clicked and we dolly + fade + navigate. */
  transition: null as PortalTransition | null,

  /** Wired up by the ArborRoom component (React side). */
  setHovered: undefined as ((app: ArborApp | null) => void) | undefined,
  select: undefined as ((app: ArborApp) => void) | undefined,

  /** True on touch/small screens — the CameraRig drives selection by orbit +
   *  tap instead of the desktop hover/click, so portals skip pointer hover. */
  isMobile: false,
};

/** Master room-light ramp — the observatory "wakes" early in the scroll. */
export function lightRamp(p: number): number {
  const t = Math.min(Math.max((p - 0.1) / 0.28, 0), 1);
  return t * t * (3 - 2 * t);
}

/**
 * The brick "build line", 0..1, raised as the room assembles from the ground
 * up. Runs slightly ahead of the light ramp and finishes (dome closed) before
 * the portals begin waking, so the visitor watches the room built for them.
 */
export function buildLevel(p: number): number {
  // Slower + later so the wall visibly assembles course-by-course AFTER the
  // room has lit and the title has faded — it used to be finished before you
  // could even see it.
  const t = Math.min(Math.max((p - 0.15) / 0.45, 0), 1);
  return t * t * (3 - 2 * t);
}

/** Per-portal reveal window, centre-out by rank (0..3). Windows are 0.16 wide
 *  but staggered only 0.08 apart, so each ring of portals begins waking around
 *  the midpoint of the previous one — they overlap to keep the sequence brisk. */
export function portalReveal(p: number, rank: number): number {
  // Start after the wall has mostly assembled (build finishes ~0.6), then wake
  // centre-out, overlapping, finishing before the intro locks (~0.9).
  const start = 0.46 + rank * 0.08;
  const end = start + 0.16;
  const t = Math.min(Math.max((p - start) / (end - start), 0), 1);
  return t * t * (3 - 2 * t);
}

/**
 * Portal glow, gated on a bay's own 0..1 reveal. The veil stays dark until the
 * roots begin climbing the arch (reveal ≈ 0.16, matching Roots.tsx), then the
 * light fades in behind them — the pathway lights up only once it's alive.
 */
export function portalGlow(reveal: number): number {
  const t = Math.min(Math.max((reveal - 0.16) / (0.62 - 0.16), 0), 1);
  return t * t * (3 - 2 * t);
}

/** Title opacity — full at rest, gone once the room starts waking. */
export function titleOpacity(p: number): number {
  const t = Math.min(Math.max((p - 0.04) / 0.16, 0), 1);
  return 1 - t * t * (3 - 2 * t);
}
