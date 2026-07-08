'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { makeParabolicArchShape } from './archShape';
import { heroState, portalGlow } from '../../scroll/heroState';
import type { RevealRef } from '../../scroll/reveals';

interface PortalSurfaceProps {
  /** App accent colour, e.g. '#38C5A2'. */
  color: string;
  /** Randomises each veil so no two portals move identically. */
  seed?: number;
  /** Per-frame 0..1 reveal driven by the scroll choreography. */
  revealRef: RevealRef;
  position?: [number, number, number];
  /** App id, so the veil can lift its own glow while it is hovered. */
  appId?: string;
}

// Must match the geometry passed to makeParabolicArchShape below.
const SURF_W = 2.24;
const SURF_H = 6.4;

const vertexShader = /* glsl */ `
  varying vec2 vLocal;

  void main() {
    vLocal = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * The luminous veil: a soft standing curtain of light held inside the stone
 * arch. Slow vertical drift, a restrained bright rim tracing the arch edge
 * (pushed into HDR so the bloom pass makes it breathe), everything scaled by
 * uReveal so portals wake one at a time as the visitor scrolls.
 */
const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vLocal;

  uniform vec3  uColor;
  uniform float uSeed;
  uniform float uTime;
  uniform float uReveal;
  uniform float uHover;   // 0..1 lift while this portal is hovered

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = vLocal;

    float halfW = ${(SURF_W / 2).toFixed(3)};
    float halfH = ${(SURF_H / 2).toFixed(3)};
    float springY = halfH - 1.9;

    // --- approximate distance to the arch edge (for the rim glow) ---------
    float edge;
    if (p.y < springY) {
      edge = halfW - abs(p.x);
    } else {
      vec2 q = vec2(p.x / halfW, (p.y - springY) / (halfH - springY));
      edge = (1.0 - length(q)) * halfW;
    }
    edge = max(edge, 0.0);

    // --- the veil: slow rising curtains of light ---------------------------
    float t = uTime;
    float flow  = fbm(vec2(p.x * 1.05, p.y * 0.45 - t * 0.055) + uSeed);
    float flow2 = fbm(vec2(p.x * 2.3 + t * 0.03, p.y * 0.85 - t * 0.02) - uSeed);

    // Kept deliberately LOW and DESATURATED: a fully-saturated hue reads as
    // a neon slab at almost any luminance. The body is a pale, near-dark
    // shimmer — the accent colour lives in the rim.
    float body = 0.02 + 0.05 * flow + 0.03 * flow2;
    vec3 bodyTint = mix(uColor, vec3(0.82, 0.86, 0.84), 0.55);

    // Luminance rises through the middle heights of the arch, settles low.
    float grad = smoothstep(-halfH, springY, p.y) * (1.0 - 0.35 * smoothstep(springY, halfH, p.y));
    vec3 col = bodyTint * body * (0.25 + 0.75 * grad);

    // A quiet central shaft, breathing very slowly.
    float shaft = exp(-p.x * p.x * 1.8) * (0.028 + 0.014 * sin(t * 0.22 + uSeed));
    col += bodyTint * shaft;

    // --- the rim: bright edge hugging the stone, blooms softly -------------
    // exp falloff must be STEEP: even 15% of a pure hue reads vivid after
    // the sRGB transform, so a slow tail turns the whole opening neon.
    float rim = exp(-edge * 9.0) * (0.75 + 0.35 * fbm(vec2(p.x * 2.0, p.y * 0.8 - t * 0.04) + uSeed));
    float breathe = 0.85 + 0.15 * sin(t * 0.4 + uSeed * 2.0);
    col += uColor * rim * breathe * 1.2;

    // Hover lift: the arch the visitor is pointing at glows a little harder —
    // brighter rim and a gentle overall bloom in the accent colour.
    col += uColor * rim * uHover * 0.9;
    col += bodyTint * body * uHover * 0.6;

    // Depth: veil darkens toward the very bottom, like it pools at the floor.
    col *= mix(0.3, 1.0, smoothstep(-halfH, -halfH + 1.6, p.y));

    // --- reveal ------------------------------------------------------------
    // Unlit portals are near-black voids in the stone; the veil pours in
    // from the rim as the portal wakes.
    float wake = uReveal * uReveal;
    float rimFirst = mix(rim, 1.0, wake); // rim lights before the body fills
    col *= 0.02 + 0.98 * wake * rimFirst;

    // The opening stays clear — you look straight through it — until the portal
    // is created: the veil only materialises as uReveal ramps up in the scroll.
    float alpha = clamp(uReveal * 1.15, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;

export function PortalSurface({
  color,
  seed = 0,
  revealRef,
  position = [0, 0, 0],
  appId,
}: PortalSurfaceProps) {
  const geometry = useMemo(() => {
    // Slightly larger than the opening so its edges hide behind the reveals.
    return new THREE.ShapeGeometry(makeParabolicArchShape(SURF_W, SURF_H), 96);
  }, []);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uSeed: { value: (seed % 360) * 0.11 },
        uTime: { value: 0 },
        uReveal: { value: 0 },
        uHover: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    });
  }, [color, seed]);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime();
    // Glow trails the roots: dark until they start climbing, then fades in.
    material.uniforms.uReveal.value = portalGlow(revealRef.value);
    // Ease the hover lift in/out so it never snaps.
    const target = appId && heroState.hovered?.id === appId ? 1 : 0;
    material.uniforms.uHover.value +=
      (target - material.uniforms.uHover.value) * 0.12;
  });

  return <mesh geometry={geometry} material={material} position={position} />;
}
