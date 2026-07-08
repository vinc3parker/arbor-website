'use client';

import * as THREE from 'three';
import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { buildArchFlowers } from './flowerGeometry';
import type { RevealRef } from '../../scroll/reveals';
import { STATUS_GLOW } from '../constants';

interface FlowersProps {
  color: string;
  status: 'development' | 'beta' | 'live';
  seed: number;
  revealRef: RevealRef;
}

/**
 * The glowing blossoms in the archway foliage. These carry the app's accent
 * colour as real light (emissive, tone-mapping off so the cores bloom), and
 * open from the ground up with the portal — more of them, and brighter, the
 * more advanced the app. Concentrating the glow here keeps the roots and
 * leaves reading as lit, shaded plants rather than flat colour.
 */
export function Flowers({ color, status, seed, revealRef }: FlowersProps) {
  const geometry = useMemo(() => buildArchFlowers(seed, status), [seed, status]);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  const base = useMemo(() => new THREE.Color(color), [color]);
  const glow = STATUS_GLOW[status] / 2; // 0.5 dev · 0.75 beta · 1.0 live

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: base.clone(),
        emissive: base.clone(),
        emissiveIntensity: 1,
        roughness: 0.5,
        metalness: 0,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    [base]
  );

  useEffect(() => {
    return () => material.dispose();
  }, [material]);

  useFrame(({ clock }) => {
    // Open with the portal; the canopy grows behind the roots/leaves.
    const arch = THREE.MathUtils.clamp((revealRef.value - 0.16) / 0.84, 0, 1);
    const grown = THREE.MathUtils.clamp((arch - 0.2) / 0.8, 0, 1);
    const total = geometry.index ? geometry.index.count : 0;
    geometry.setDrawRange(0, Math.floor((total * grown) / 3) * 3);

    const breathe = 0.85 + 0.15 * Math.sin(clock.getElapsedTime() * 0.7 + seed);
    material.emissiveIntensity = (0.5 + 1.6 * glow) * breathe * (0.4 + 0.6 * arch);
  });

  return <mesh geometry={geometry} material={material} castShadow />;
}
