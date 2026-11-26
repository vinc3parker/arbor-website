import * as THREE from 'three';
import { useEffect, useMemo } from 'react';

/**
 * A weathered, sage-tinged stone surface for the archways and dais: soft
 * tonal mottling, pitting, fine grain, a few hairline cracks and faint moss in
 * the low spots. Drawn once in the browser as a seamless tile and used as both
 * colour and bump map; the material's own colour tints it, so the map stays
 * light (mostly 150–235) and only carries the variation.
 */
const SIZE = 512;

function seeded(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
    return (seed >>> 0) / 4294967296;
  };
}

/** Draws `paint` at (x, y) and at each wrapped copy so the tile is seamless. */
function wrapped(x: number, y: number, reach: number, paint: (x: number, y: number) => void) {
  for (const dx of [-SIZE, 0, SIZE]) {
    for (const dy of [-SIZE, 0, SIZE]) {
      const px = x + dx;
      const py = y + dy;
      if (px + reach < 0 || px - reach > SIZE || py + reach < 0 || py - reach > SIZE) continue;
      paint(px, py);
    }
  }
}

function drawStone(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;
  const rand = seeded(9127);

  ctx.fillStyle = 'rgb(196,196,190)';
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Broad tonal mottling: large soft light and dark clouds.
  for (let i = 0; i < 120; i++) {
    const x = rand() * SIZE;
    const y = rand() * SIZE;
    const r = 24 + rand() * 110;
    const light = rand() > 0.5;
    const a = 0.14 + rand() * 0.22;
    wrapped(x, y, r, (px, py) => {
      const g = ctx.createRadialGradient(px, py, 0, px, py, r);
      g.addColorStop(0, light ? `rgba(250,248,238,${a})` : `rgba(70,72,62,${a})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(px - r, py - r, r * 2, r * 2);
    });
  }

  // Faint moss gathering in patches.
  for (let i = 0; i < 34; i++) {
    const x = rand() * SIZE;
    const y = rand() * SIZE;
    const r = 18 + rand() * 50;
    const a = 0.2 + rand() * 0.2;
    wrapped(x, y, r, (px, py) => {
      const g = ctx.createRadialGradient(px, py, 0, px, py, r);
      g.addColorStop(0, `rgba(82,112,56,${a})`);
      g.addColorStop(1, 'rgba(96,118,70,0)');
      ctx.fillStyle = g;
      ctx.fillRect(px - r, py - r, r * 2, r * 2);
    });
  }

  // Fine grain.
  for (let i = 0; i < 34000; i++) {
    const v = 100 + rand() * 150;
    ctx.fillStyle = `rgba(${v},${v},${v - 6},${0.08 + rand() * 0.12})`;
    ctx.fillRect(rand() * SIZE, rand() * SIZE, 1 + rand() * 1.5, 1 + rand() * 1.5);
  }

  // Pits: small dark hollows with a lit lower lip, so the bump reads as depth.
  for (let i = 0; i < 420; i++) {
    const x = rand() * SIZE;
    const y = rand() * SIZE;
    const r = 1 + rand() * 3.6;
    wrapped(x, y, r + 2, (px, py) => {
      ctx.fillStyle = `rgba(40,41,34,${0.4 + rand() * 0.35})`;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(245,243,232,0.3)';
      ctx.beginPath();
      ctx.arc(px + r * 0.35, py + r * 0.45, r * 0.7, 0, Math.PI);
      ctx.fill();
    });
  }

  // A few hairline cracks wandering across the face.
  ctx.lineCap = 'round';
  for (let i = 0; i < 16; i++) {
    let x = rand() * SIZE;
    let y = rand() * SIZE;
    let angle = rand() * Math.PI * 2;
    const steps = 10 + Math.floor(rand() * 18);
    const width = 0.9 + rand() * 1.4;
    const alpha = 0.4 + rand() * 0.3;
    for (let s = 0; s < steps; s++) {
      angle += (rand() - 0.5) * 0.9;
      const len = 4 + rand() * 9;
      const nx = x + Math.cos(angle) * len;
      const ny = y + Math.sin(angle) * len;
      const x0 = x, y0 = y;
      wrapped(x0, y0, len + 2, (px, py) => {
        ctx.strokeStyle = `rgba(32,33,28,${alpha})`;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + (nx - x0), py + (ny - y0));
        ctx.stroke();
      });
      x = ((nx % SIZE) + SIZE) % SIZE;
      y = ((ny % SIZE) + SIZE) % SIZE;
    }
  }

  return canvas;
}

let shared: THREE.CanvasTexture | null = null;

/** The one stone tile, drawn on first use (browser only). */
export function getStoneTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  if (!shared) {
    shared = new THREE.CanvasTexture(drawStone());
    shared.colorSpace = THREE.SRGBColorSpace;
    shared.wrapS = shared.wrapT = THREE.RepeatWrapping;
    shared.anisotropy = 8;
  }
  return shared;
}

/** A clone of the stone tile at its own repeat, disposed with the component. */
export function useStoneTexture(repeatX: number, repeatY: number) {
  const texture = useMemo(() => {
    const base = getStoneTexture();
    if (!base) return null;
    const t = base.clone();
    t.repeat.set(repeatX, repeatY);
    t.needsUpdate = true;
    return t;
  }, [repeatX, repeatY]);
  useEffect(() => () => texture?.dispose(), [texture]);
  return texture;
}

/**
 * Gives shared, module-scope stone materials the texture. They are created
 * at import time (where there is no canvas during SSR), so this runs from an
 * effect the first time an archway mounts.
 */
export function applyStoneTexture(
  materials: THREE.MeshStandardMaterial[],
  repeat: number,
  bumpScale: number
) {
  const base = getStoneTexture();
  if (!base) return;
  for (const material of materials) {
    if (material.map) continue;
    const t = base.clone();
    t.repeat.set(repeat, repeat);
    t.needsUpdate = true;
    material.map = t;
    material.bumpMap = t;
    material.bumpScale = bumpScale;
    material.needsUpdate = true;
  }
}
