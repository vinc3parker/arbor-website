'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { FLOOR_RADIUS, DAIS_RADIUS, DAIS_HEIGHT } from './constants';

/**
 * Draws the slab pattern: concentric rings of enormous stone pieces with
 * staggered radial joints, fine engraved rings, per-slab tonal variation and
 * a dusting of noise. Used as both colour map and bump map — the dark seams
 * read as carved recesses.
 */
function drawSlabTexture(size: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const C = size / 2;
  const R = size / 2;

  ctx.fillStyle = '#14171d';
  ctx.fillRect(0, 0, size, size);

  // Subtle mineral noise
  for (let i = 0; i < 16000; i++) {
    const g = 22 + Math.random() * 26;
    ctx.fillStyle = `rgba(${g},${g},${g + 5},${0.025 + Math.random() * 0.03})`;
    ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
  }

  // Ring boundaries as fractions of the floor radius. The innermost disc is
  // the dais footprint (the raised mesh sits on top of it).
  const rings = [
    DAIS_RADIUS / FLOOR_RADIUS,
    0.34,
    0.5,
    0.66,
    0.82,
    0.985,
  ];
  const seam = '#0a0c10';
  const catchLight = 'rgba(190,200,220,0.05)';

  // Per-slab tonal variation — big stone pieces, each fractionally different.
  for (let ring = 0; ring < rings.length - 1; ring++) {
    const r0 = rings[ring] * R;
    const r1 = rings[ring + 1] * R;
    const n = 5 + ring * 3; // few, enormous pieces per ring
    const stagger = (ring % 2) * (Math.PI / n);
    for (let k = 0; k < n; k++) {
      const a0 = (k / n) * Math.PI * 2 + stagger;
      const a1 = ((k + 1) / n) * Math.PI * 2 + stagger;
      const tone = Math.random();
      ctx.beginPath();
      ctx.arc(C, C, r1, a0, a1);
      ctx.arc(C, C, r0, a1, a0, true);
      ctx.closePath();
      ctx.fillStyle =
        tone > 0.5
          ? `rgba(210,218,235,${(tone - 0.5) * 0.05})`
          : `rgba(0,0,0,${(0.5 - tone) * 0.09})`;
      ctx.fill();

      // Radial joints between slabs — finer than the ring seams so the
      // concentric geometry dominates
      ctx.strokeStyle = seam;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(C + Math.cos(a0) * r0, C + Math.sin(a0) * r0);
      ctx.lineTo(C + Math.cos(a0) * r1, C + Math.sin(a0) * r1);
      ctx.stroke();
    }
  }

  // Ring seams with a hair of catch-light on the outer lip
  for (const f of rings) {
    const r = f * R;
    ctx.strokeStyle = seam;
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(C, C, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = catchLight;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(C, C, r + 5, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Fine engraved rings — decoration with the restraint turned up
  for (const f of [0.29, 0.44, 0.61, 0.76, 0.9]) {
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(C, C, f * R, 0, Math.PI * 2);
    ctx.stroke();
  }

  return canvas;
}

export function Floor() {
  const { map, bumpMap } = useMemo(() => {
    const canvas = drawSlabTexture(2048);
    const map = new THREE.CanvasTexture(canvas);
    map.anisotropy = 8;
    map.colorSpace = THREE.SRGBColorSpace;
    const bumpMap = new THREE.CanvasTexture(canvas);
    bumpMap.anisotropy = 8;
    return { map, bumpMap };
  }, []);

  return (
    <>
      {/* The slab floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[FLOOR_RADIUS, 96]} />
        <meshStandardMaterial
          map={map}
          bumpMap={bumpMap}
          bumpScale={0.6}
          color="#c9ccd4"
          roughness={0.88}
          metalness={0.06}
        />
      </mesh>

      {/* Structural mass beneath */}
      <mesh position={[0, -0.24, 0]} receiveShadow>
        <cylinderGeometry args={[FLOOR_RADIUS + 0.05, FLOOR_RADIUS + 0.25, 0.32, 96]} />
        <meshStandardMaterial color="#1d2025" roughness={0.95} metalness={0.04} />
      </mesh>

      {/* Raised central dais — one enormous carved piece */}
      <mesh position={[0, DAIS_HEIGHT / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[DAIS_RADIUS, DAIS_RADIUS + 0.12, DAIS_HEIGHT, 96]} />
        <meshStandardMaterial color="#1b1e24" roughness={0.85} metalness={0.08} />
      </mesh>

      {/* Engraved inset ring on the dais top */}
      <mesh
        position={[0, DAIS_HEIGHT + 0.002, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[DAIS_RADIUS - 0.55, DAIS_RADIUS - 0.48, 96]} />
        <meshStandardMaterial color="#0a0c10" roughness={1} metalness={0} />
      </mesh>

      {/* Warm pool of light resting on the dais — where the tree will live */}
      <mesh
        position={[0, DAIS_HEIGHT + 0.006, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[DAIS_RADIUS - 0.7, 64]} />
        <meshBasicMaterial
          color="#85714a"
          transparent
          opacity={0.14}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
