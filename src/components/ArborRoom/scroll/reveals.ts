import { arborApps, revealRank, type ArborApp } from '../data/apps';

/** Mutable per-frame 0..1 reveal value for one bay. */
export interface RevealRef {
  value: number;
}

/**
 * One shared RevealRef per app, written once per frame by the scene from the
 * scroll progress and read imperatively by portal shaders, lights and roots.
 */
export const revealRefs: ReadonlyMap<string, RevealRef> = new Map(
  arborApps.map((app) => [app.id, { value: 0 }])
);

export function revealFor(app: ArborApp): RevealRef {
  return revealRefs.get(app.id)!;
}

export { revealRank };
