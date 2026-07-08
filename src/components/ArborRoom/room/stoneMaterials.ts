import * as THREE from 'three';
import { getBrickTextures } from './brickTexture';
import { makeBuildable, makeBuildableSmooth } from './buildReveal';

/**
 * Client-side factories for the weathered-brick stone. Textures are drawn once
 * (browser-only) and cloned per material so each surface can tile them at its
 * own scale. Call these inside a useMemo — never at module scope (SSR has no
 * canvas).
 */

interface BrickOpts {
  side?: THREE.Side;
  repeat?: [number, number];
  color?: string;
  /** Assemble brick-by-brick with the scroll (default true). */
  buildable?: boolean;
  /** Use the clean rising-line reveal instead of the per-brick grid. Small or
   *  short pieces (base course, oculus collar) split on the brick grid, so
   *  they should build smooth. */
  smoothBuild?: boolean;
  roughness?: number;
}

export function makeBrickMaterial({
  side = THREE.FrontSide,
  repeat = [4, 4],
  color = '#c3b596',
  buildable = true,
  smoothBuild = false,
  roughness = 0.95,
}: BrickOpts = {}): THREE.MeshStandardMaterial {
  const tex = getBrickTextures();

  const map = tex ? tex.map.clone() : null;
  const bump = tex ? tex.bump.clone() : null;
  if (map) {
    map.needsUpdate = true;
    map.repeat.set(repeat[0], repeat[1]);
  }
  if (bump) {
    bump.needsUpdate = true;
    bump.repeat.set(repeat[0], repeat[1]);
  }

  const material = new THREE.MeshStandardMaterial({
    map,
    bumpMap: bump,
    bumpScale: 0.9,
    color,
    roughness,
    metalness: 0.02,
    side,
  });

  if (!buildable) return material;
  return smoothBuild ? makeBuildableSmooth(material) : makeBuildable(material);
}
