'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { heroState, lightRamp } from '../scroll/heroState';

/**
 * Restrained lighting that WAKES with the scroll: at rest the room is a dark
 * silhouette; as the visitor scrolls the ambient fill, the golden light from
 * high above and the warm glow at the centre all breathe in together. The
 * portals then add the only strong colour, one at a time.
 *
 * The palette is the home journey's woodland (warm sun, green-gold fill,
 * forest-floor shadow), so the room reads as the clearing at the end of the
 * path rather than a separate, moonlit place.
 */

export function ObservatoryLights() {
  const ambient = useRef<THREE.AmbientLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const sun = useRef<THREE.DirectionalLight>(null);
  const centre = useRef<THREE.PointLight>(null);

  useFrame(() => {
    // Kept low and moody — the room stays mysterious even fully woken; the
    // glowing runes, flowers and portals carry the eye, not flat fill light.
    const m = 0.08 + 0.92 * lightRamp(heroState.progress);
    if (ambient.current) ambient.current.intensity = 0.2 * m;
    if (hemi.current) hemi.current.intensity = 0.55 * m;
    if (sun.current) sun.current.intensity = 1.15 * m;
    if (centre.current) centre.current.intensity = 2.0 * m;
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.02} />

      {/* Green-gold canopy fill above, forest floor below */}
      <hemisphereLight ref={hemi} args={['#e6dbb4', '#16231a', 0.05]} />

      {/* Late sun falling through the canopy onto the centre */}
      <directionalLight
        ref={sun}
        // A little off vertical so roots and leaves throw visible shadows.
        position={[9, 21, 15]}
        intensity={0.1}
        color="#ffe2a6"
        castShadow
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
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
        color="#c99a5a"
        distance={34}
        decay={1.8}
      />

    </>
  );
}
