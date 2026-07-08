'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { heroState, lightRamp } from '../scroll/heroState';

/**
 * The night sky arching over the observatory. A large inverted sphere carries
 * a procedural starfield: stars gather in a dense band just above the wall
 * line and thin to nothing higher up, so the dome reads as fading into pure
 * black overhead. A faint cool haze sits on the horizon behind the arches.
 *
 * The material ignores scene fog (fog only touches the stone), and its cores
 * are pushed past the bloom threshold so the brightest stars breathe. The
 * whole sky eases in with the same scroll ramp that wakes the room, so the
 * page still opens on "Arbor" in near-darkness.
 */
const vertexShader = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec3 vDir;

  uniform float uTime;
  uniform float uWake;   // 0..1 master fade-in with the scroll

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // One layer of stars on an (azimuth, elevation) grid. Each cell holds at
  // most one star, jittered inside the cell; brightness and twinkle vary.
  float starLayer(vec2 uv, float freq, float sparsity, float coreSize) {
    vec2 g = uv * freq;
    vec2 id = floor(g);
    vec2 f = fract(g);

    float r = hash21(id);
    if (r < sparsity) return 0.0;

    // Star position within the cell + a per-star size / brightness.
    vec2 star = vec2(hash21(id + 3.1), hash21(id + 7.7)) * 0.7 + 0.15;
    float bright = hash21(id + 11.3);
    float twinkle = 0.6 + 0.4 * sin(uTime * (0.6 + bright * 1.8) + r * 40.0);

    float d = length(f - star);
    float core = coreSize * (0.4 + bright * 0.9);
    float s = smoothstep(core, 0.0, d);
    return s * s * (0.35 + 0.9 * bright) * twinkle;
  }

  void main() {
    vec3 dir = normalize(vDir);
    float elev = clamp(dir.y, -1.0, 1.0);

    // Stars densest just above the horizon, gone by the time we look up.
    float band = 1.0 - smoothstep(0.02, 0.72, elev);
    band *= smoothstep(-0.28, 0.05, elev); // thin out below the wall line too

    // Equirectangular sample direction (poles are straight up/down, never
    // shown, so the pinch is invisible).
    vec2 uv = vec2(atan(dir.z, dir.x), asin(elev));

    float s =
        starLayer(uv, 34.0, 0.55, 0.14) * 1.0
      + starLayer(uv, 62.0, 0.72, 0.10) * 0.7
      + starLayer(uv, 120.0, 0.86, 0.07) * 0.5;
    s *= band;

    // A cool, extremely faint haze hugging the horizon.
    vec3 haze = vec3(0.03, 0.05, 0.09) * band * 0.5;

    // Star tint: mostly cool white, a few warm.
    vec3 starCol = mix(vec3(0.75, 0.83, 1.0), vec3(1.0, 0.92, 0.78),
                       smoothstep(0.6, 1.0, fract(s * 3.0)));

    vec3 col = haze + starCol * s * 1.6;
    col *= uWake;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function StarrySky() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uWake: { value: 0 },
        },
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        toneMapped: false,
      }),
    []
  );

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime();
    // Comes up a touch ahead of the room lights so the sky is already there
    // as the architecture resolves out of the dark.
    material.uniforms.uWake.value = Math.min(
      1,
      0.15 + lightRamp(heroState.progress) * 1.1
    );
  });

  return (
    <mesh material={material} renderOrder={-1}>
      <sphereGeometry args={[90, 48, 32]} />
    </mesh>
  );
}
