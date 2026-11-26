'use client';

import * as THREE from 'three';
import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { buildArchRoots } from './rootGeometry';
import type { RevealRef } from '../../scroll/reveals';
import { STATUS_GLOW } from '../constants';
import { useBarkTexture } from '../barkTexture';
import { addRootGlow, updateRootGlow, pulseFor, floorPulseEnd } from '../rootGlow';

interface RootsProps {
  /** Which app this arch belongs to (its pulse rhythm continues the floor's). */
  appId: string;
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
export function Roots({ appId, color, status, seed, revealRef }: RootsProps) {
  // Maturity shapes the SYSTEM (dev: rising from the feet, beta: thin to the
  // crown, live: full coverage) — the scroll then grows it from the ground up.
  const strands = useMemo(() => buildArchRoots(seed, status), [seed, status]);

  useEffect(() => {
    return () => strands.forEach((s) => s.geometry.dispose());
  }, [strands]);

  // Same bark as the home journey's trees, so these read as living wood.
  const bark = useBarkTexture(1, 1);

  const material = useMemo(() => {
    // Real, LIT bark: form comes from the scene lights on the knotted tube
    // and the bark photo's relief. A restrained accent emissive keeps a hint
    // of inner glow that still rises with maturity; the bright accent lives
    // in the flowers and runes.
    return new THREE.MeshStandardMaterial({
      color: bark ? '#c4b093' : '#4a3a2a',
      map: bark,
      bumpMap: bark,
      bumpScale: 1.4,
      roughness: 0.95,
      metalness: 0,
    });
  }, [bark]);

  // Rim glow and travelling pulses in the app's colour (see rootGlow).
  const glow = useMemo(
    () => addRootGlow(material, color, STATUS_GLOW[status] * 0.4, pulseFor(appId)),
    [material, color, status, appId]
  );
  const rhythm = useMemo(() => pulseFor(appId), [appId]);

  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ clock }) => {
    // Start where the floor root's pulse arrives at the feet: same rhythm,
    // phase carried on, so the light flows from the centre up the arch.
    const carried = rhythm.offset + (floorPulseEnd.get(appId) ?? 0) * rhythm.freq;
    updateRootGlow(glow, material, THREE.MathUtils.clamp(revealRef.value, 0, 1), clock.getElapsedTime(), carried);
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
