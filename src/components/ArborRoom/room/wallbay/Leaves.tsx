'use client';

import * as THREE from 'three';
import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { buildArchLeaves } from './leafGeometry';
import type { RevealRef } from '../../scroll/reveals';
import { STATUS_GLOW } from '../constants';

interface LeavesProps {
  color: string;
  status: 'development' | 'beta' | 'live';
  seed: number;
  revealRef: RevealRef;
}

/**
 * The foliage climbing each archway: deep green leaves that carry a wash of
 * the app's accent colour, brighter the more advanced the app is. Like the
 * roots, the canopy grows from the ground up as the portal wakes (draw-range),
 * and its glow tracks app maturity (STATUS_GLOW).
 */
export function Leaves({ color, status, seed, revealRef }: LeavesProps) {
  const geometry = useMemo(() => buildArchLeaves(seed, status), [seed, status]);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  const material = useMemo(() => {
    // LIT forest-green leaves: form comes from the scene lights on each leaf's
    // real normal (double-sided), with only a faint accent emissive so mature
    // arches read a touch warmer. The bright accent glow lives in the flowers,
    // which stops the canopy from flattening into one block of colour.
    const green = new THREE.Color('#33531f');
    const emissive = green.clone().lerp(new THREE.Color(color), 0.4);
    return new THREE.MeshStandardMaterial({
      color: '#32501f',
      roughness: 0.78,
      metalness: 0,
      emissive,
      // Less inner glow, more matte — the canopy now takes its depth from the
      // lights hitting each faceted leaf rather than washing out flat.
      emissiveIntensity: STATUS_GLOW[status] * 0.09,
      side: THREE.DoubleSide,
      flatShading: true,
    });
  }, [color, status]);

  useEffect(() => {
    return () => material.dispose();
  }, [material]);

  useFrame(() => {
    // Follows the roots (see Roots): the arch canopy plays out over the same
    // late window, a touch behind the branches.
    const arch = THREE.MathUtils.clamp((revealRef.value - 0.16) / 0.84, 0, 1);
    const grown = THREE.MathUtils.clamp((arch - 0.12) / 0.88, 0, 1);
    const total = geometry.index ? geometry.index.count : 0;
    geometry.setDrawRange(0, Math.floor((total * grown) / 3) * 3);
  });

  return <mesh geometry={geometry} material={material} castShadow receiveShadow />;
}
