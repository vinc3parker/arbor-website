import * as THREE from 'three';

/**
 * Inner light for the bark roots, in the app's colour: a soft rim glow on the
 * edges of each root (strongest where it turns away from the viewer, so the
 * bark itself stays readable) plus slow pulses travelling outward along its
 * length, like life flowing from the centre of the room up into each archway.
 * Both rise with the portal's reveal. Bright enough at the rim and pulse
 * peaks to catch the scene's bloom.
 *
 * Applied with onBeforeCompile so the bark keeps full lighting and shadows.
 * Needs the tube's `uv` (v runs along the length; see taperedTube).
 */
export interface RootGlowUniforms {
  uGlowColor: { value: THREE.Color };
  uGlowStrength: { value: number };
  uGlowTime: { value: number };
  uGlowSpeed: { value: number };
  uGlowFreq: { value: number };
  uGlowPhase: { value: number };
}

/** Each archway's own pulse: how fast it travels, how far apart the pulses
 *  are, and where in its cycle it starts, so the arches never beat together. */
export interface PulseRhythm {
  speed: number;
  freq: number;
  offset: number;
}

export function pulseFor(appId: string): PulseRhythm {
  let h = 2166136261;
  for (let i = 0; i < appId.length; i++) h = Math.imul(h ^ appId.charCodeAt(i), 16777619);
  const r = (n: number) => (((h = Math.imul(h ^ (h >>> 13), 0x5bd1e995 + n)) >>> 0) % 10000) / 10000;
  return {
    speed: 0.9 + r(1) * 0.9, // 0.9–1.8
    freq: 0.85 + r(2) * 0.5, // pulse spacing
    offset: r(3) * Math.PI * 2,
  };
}

/**
 * Where each floor root's pulse has reached when it arrives at the arch feet,
 * in the tube's v units (set by RootRun). The arch roots start their pulse
 * from here, so the light runs on from the floor up the archway.
 */
export const floorPulseEnd = new Map<string, number>();

export function addRootGlow(
  material: THREE.MeshStandardMaterial,
  color: string,
  strength: number,
  rhythm: PulseRhythm
): RootGlowUniforms {
  // Idempotent per material: React may run the calling memo twice (Strict
  // Mode), and the shader must read the same uniforms the frame loop writes.
  const existing = material.userData.rootGlow as RootGlowUniforms | undefined;
  if (existing) {
    existing.uGlowColor.value.set(color);
    existing.uGlowSpeed.value = rhythm.speed;
    existing.uGlowFreq.value = rhythm.freq;
    existing.uGlowPhase.value = rhythm.offset;
    material.userData.glowBase = strength;
    return existing;
  }
  const uniforms: RootGlowUniforms = {
    uGlowColor: { value: new THREE.Color(color) },
    uGlowStrength: { value: 0 },
    uGlowTime: { value: 0 },
    uGlowSpeed: { value: rhythm.speed },
    uGlowFreq: { value: rhythm.freq },
    uGlowPhase: { value: rhythm.offset },
  };
  // vUv is only declared when USE_UV is on; the bark map may not be loaded yet.
  material.defines = { ...(material.defines ?? {}), USE_UV: '' };
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform vec3 uGlowColor;
        uniform float uGlowStrength;
        uniform float uGlowTime;
        uniform float uGlowSpeed;
        uniform float uGlowFreq;
        uniform float uGlowPhase;`
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        {
          float facing = abs(dot(normalize(normal), normalize(vViewPosition)));
          float rim = pow(1.0 - facing, 2.4);
          // Pulses travel away from the root's base (v grows along it).
          float wave = sin(vUv.y * uGlowFreq - uGlowTime * uGlowSpeed + uGlowPhase);
          float pulse = smoothstep(0.82, 1.0, wave);
          float glow = rim * 0.75 + pulse * (0.7 + rim * 0.6) + 0.04;
          totalEmissiveRadiance += uGlowColor * glow * uGlowStrength;
        }`
      );
  };
  // Same shader code for every root: uniforms carry the per-app colour.
  material.customProgramCacheKey = () => 'arbor-root-glow';
  material.userData.glowBase = strength;
  material.userData.rootGlow = uniforms;
  return uniforms;
}

/** Per-frame update: wake is the portal's 0..1 reveal. */
export function updateRootGlow(
  uniforms: RootGlowUniforms | null,
  material: THREE.Material | null,
  wake: number,
  time: number,
  /** Overrides the pulse phase (the arch roots continue the floor's pulse). */
  phase?: number
) {
  if (!uniforms || !material) return;
  // Always drive the uniforms the shader was actually built with.
  const live = (material.userData.rootGlow as RootGlowUniforms | undefined) ?? uniforms;
  live.uGlowTime.value = time;
  if (phase !== undefined) live.uGlowPhase.value = phase;
  live.uGlowStrength.value = (material.userData.glowBase as number) * wake;
}
