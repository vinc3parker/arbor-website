'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { heroState, lightRamp } from '../scroll/heroState';

/**
 * Restrained lighting that WAKES with the scroll: at rest the room is a dark
 * silhouette; as the visitor scrolls the ambient fill, the oculus light from
 * high above and the warm glow at the centre all breathe in together. The
 * portals then add the only colour, one at a time.
 */
export function ObservatoryLights() {
  const ambient = useRef<THREE.AmbientLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const oculus = useRef<THREE.DirectionalLight>(null);
  const centre = useRef<THREE.PointLight>(null);

  useFrame(() => {
    // Kept low and moody — the room stays mysterious even fully woken; the
    // glowing runes, flowers and portals carry the eye, not flat fill light.
    const m = 0.08 + 0.92 * lightRamp(heroState.progress);
    // Lifted so the floor and brickwork actually read once woken, while the
    // at-rest room stays a dark, eerie silhouette.
    if (ambient.current) ambient.current.intensity = 0.2 * m;
    if (hemi.current) hemi.current.intensity = 0.55 * m;
    if (oculus.current) oculus.current.intensity = 1.15 * m;
    if (centre.current) centre.current.intensity = 2.0 * m;
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.02} />

      <hemisphereLight ref={hemi} args={['#aeb6c4', '#0a0c0e', 0.05]} />

      {/* Oculus: soft moonlight falling from high above the centre */}
      <directionalLight
        ref={oculus}
        position={[3, 28, 8]}
        intensity={0.1}
        color="#cfd6e4"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={24}
        shadow-camera-bottom={-24}
        shadow-camera-far={70}
      />

      {/* Warm centre — the light beneath the future Arbor tree */}
      <pointLight
        ref={centre}
        position={[0, 3, 0]}
        intensity={0.2}
        color="#b79258"
        distance={34}
        decay={1.8}
      />
    </>
  );
}
