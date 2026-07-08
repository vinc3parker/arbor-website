'use client';

import * as THREE from 'three';
import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { buildArchRoots } from './rootGeometry';
import type { RevealRef } from '../../scroll/reveals';
import { STATUS_GLOW } from '../constants';

interface RootsProps {
  /** App accent colour the roots glow in, e.g. '#D4FF00'. */
  color: string;
  status: 'development' | 'beta' | 'live';
  /** Makes this arch's root system unique. */
  seed: number;
  revealRef: RevealRef;
}

/**
 * The root system growing over this archway — unique per arch (seeded), and
 * assembled in a natural order as (scroll reveal × app maturity) rises: foot
 * flares meet the floor runner first, primaries climb the jambs, thinner
 * strands follow, the crown closes late and wrapping tendrils come last.
 * Live apps complete the whole system; apps in development have only begun.
 */
export function Roots({ color, status, seed, revealRef }: RootsProps) {
  // Maturity shapes the SYSTEM (dev: rising from the feet, beta: thin to the
  // crown, live: full coverage) — the scroll then grows it from the ground up.
  const strands = useMemo(() => buildArchRoots(seed, status), [seed, status]);

  useEffect(() => {
    return () => strands.forEach((s) => s.geometry.dispose());
  }, [strands]);

  const material = useMemo(() => {
    // Real, LIT bark — form comes from the scene lights hitting the tube, not
    // from flooding it with emissive (that read as a flat block of colour).
    // A restrained accent emissive keeps a hint of inner glow that still rises
    // with maturity; the bright accent now lives in the flowers.
    return new THREE.MeshStandardMaterial({
      color: '#33281e',
      roughness: 0.92,
      metalness: 0,
      emissive: new THREE.Color(color),
      // Lower emissive so the bark takes its form from the scene lights (below)
      // rather than a flat inner glow; flat shading facets the tubes so they
      // read with real light-and-shade instead of a smooth, flat noodle.
      emissiveIntensity: STATUS_GLOW[status] * 0.12,
      flatShading: true,
    });
  }, [color, status]);

  useFrame(() => {
    // The floor runner (see RootRun) crosses the room first; the arch system
    // then plays bottom-to-top, each strand growing inside its own window.
    // The reveal alone drives growth — maturity is baked into the system.
    const arch = Math.min(Math.max((revealRef.value - 0.16) / 0.84, 0), 1);
    for (const s of strands) {
      const local = Math.min(
        Math.max((arch - s.window[0]) / (s.window[1] - s.window[0]), 0),
        1
      );
      const total = s.geometry.index ? s.geometry.index.count : 0;
      s.geometry.setDrawRange(0, Math.floor((total * local) / 3) * 3);
    }
  });

  return (
    <group>
      {strands.map((s, i) => (
        <mesh key={i} geometry={s.geometry} material={material} castShadow receiveShadow />
      ))}
    </group>
  );
}
