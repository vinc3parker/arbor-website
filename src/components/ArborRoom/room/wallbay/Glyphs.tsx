'use client';

import * as THREE from 'three';
import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { buildGlyphs } from './glyphGeometry';
import type { RevealRef } from '../../scroll/reveals';
import { STATUS_GLOW } from '../constants';

interface GlyphsProps {
  color: string;
  status: 'development' | 'beta' | 'live';
  seed: number;
  revealRef: RevealRef;
}

/**
 * The runes and constellation glyphs inlaid in the archway stone. They carry
 * no light of their own until the portal wakes; then they kindle in the app's
 * accent colour, brighter the more advanced the app is (STATUS_GLOW). The
 * marks are unlit/emissive (MeshBasic + Line) with tone-mapping off so their
 * cores cross the bloom threshold and breathe.
 */
export function Glyphs({ color, status, seed, revealRef }: GlyphsProps) {
  const { dots, lines } = useMemo(() => buildGlyphs(seed), [seed]);

  useEffect(() => {
    return () => {
      dots.dispose();
      lines.dispose();
    };
  }, [dots, lines]);

  const base = useMemo(() => new THREE.Color(color), [color]);
  const glow = STATUS_GLOW[status] / 2; // 0.5 dev · 0.75 beta · 1.0 live

  const dotMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: base.clone(), toneMapped: false }),
    [base]
  );
  const lineMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: base.clone(),
        toneMapped: false,
        transparent: true,
        opacity: 1,
      }),
    [base]
  );

  useEffect(() => {
    return () => {
      dotMat.dispose();
      lineMat.dispose();
    };
  }, [dotMat, lineMat]);

  useFrame(({ clock }) => {
    const wake = THREE.MathUtils.clamp(revealRef.value, 0, 1);
    const breathe = 0.9 + 0.1 * Math.sin(clock.getElapsedTime() * 0.8 + seed);
    // Off when unlit; kindles with the portal, strongest on mature apps.
    const intensity = wake * wake * (0.5 + 1.3 * glow) * breathe;
    dotMat.color.copy(base).multiplyScalar(intensity * 1.25);
    lineMat.color.copy(base).multiplyScalar(intensity);
    lineMat.opacity = Math.min(1, 0.35 + wake);
  });

  return (
    <group>
      <mesh geometry={dots} material={dotMat} />
      <lineSegments geometry={lines} material={lineMat} />
    </group>
  );
}
