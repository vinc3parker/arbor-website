import * as THREE from 'three';

/**
 * Procedural ANCIENT / WEATHERED brick, drawn once to a canvas and shared as
 * colour + bump maps (same trick the Floor uses). Irregular courses, chipped
 * edges, tonal variation and moss creeping out of the joints — the temple has
 * clearly stood a long time. Browser-only (canvas), memoised, so it is safe to
 * call from a useMemo on the client and never runs during SSR.
 */

let cached: { map: THREE.Texture; bump: THREE.Texture } | null = null;

function drawBrick(size: number): { color: HTMLCanvasElement; height: HTMLCanvasElement } {
  const color = document.createElement('canvas');
  const height = document.createElement('canvas');
  color.width = color.height = size;
  height.width = height.height = size;
  const c = color.getContext('2d')!;
  const h = height.getContext('2d')!;

  // Mortar base (also the low point of the bump map).
  c.fillStyle = '#5c5848';
  c.fillRect(0, 0, size, size);
  h.fillStyle = '#000000';
  h.fillRect(0, 0, size, size);

  const rows = 16;
  const rowH = size / rows;
  const brickW = size / 9;

  for (let r = 0; r < rows; r++) {
    const y = r * rowH;
    const offset = (r % 2) * (brickW / 2); // running bond
    // A little vertical jitter per course — nothing is level any more.
    const rowJitter = (Math.random() - 0.5) * rowH * 0.12;

    for (let x = -brickW; x < size + brickW; x += brickW) {
      const jx = x + offset + (Math.random() - 0.5) * 4;
      const jy = y + rowJitter + (Math.random() - 0.5) * 3;
      const bw = brickW - 3 - Math.random() * 3;
      const bh = rowH - 3 - Math.random() * 3;

      // Weathered warm sandstone, each brick a shade apart. Brighter + warmer
      // than before so the wall carries real colour instead of reading black.
      const base = 138 + Math.random() * 52;
      const g = base - 6;
      const tint = 10 + Math.random() * 8;
      c.fillStyle = `rgb(${base + tint * 0.4}, ${g - tint * 0.5}, ${base - tint * 2.2})`;

      // Rounded, chipped brick.
      const rr = 3 + Math.random() * 3;
      roundRect(c, jx, jy, bw, bh, rr);
      c.fill();

      // Bump: brick face raised, with a soft bevel toward the joints.
      const grd = h.createRadialGradient(
        jx + bw / 2,
        jy + bh / 2,
        1,
        jx + bw / 2,
        jy + bh / 2,
        Math.max(bw, bh) * 0.7
      );
      const level = 150 + Math.random() * 40;
      grd.addColorStop(0, `rgb(${level},${level},${level})`);
      grd.addColorStop(1, 'rgb(70,70,70)');
      h.fillStyle = grd;
      roundRect(h, jx, jy, bw, bh, rr);
      h.fill();

      // Chips and pitting on the face.
      const pits = 3 + Math.floor(Math.random() * 4);
      for (let p = 0; p < pits; p++) {
        const px = jx + Math.random() * bw;
        const py = jy + Math.random() * bh;
        const pr = 1 + Math.random() * 2.5;
        c.fillStyle = `rgba(20,22,18,${0.15 + Math.random() * 0.2})`;
        c.beginPath();
        c.arc(px, py, pr, 0, Math.PI * 2);
        c.fill();
      }

      // Moss creeping from the lower joints, more toward the bottom rows.
      if (Math.random() < 0.28 + (r / rows) * 0.25) {
        c.fillStyle = `rgba(${40 + Math.random() * 30}, ${70 + Math.random() * 45}, ${30 + Math.random() * 25}, ${0.25 + Math.random() * 0.35})`;
        c.beginPath();
        c.ellipse(
          jx + Math.random() * bw,
          jy + bh - Math.random() * 4,
          2 + Math.random() * 5,
          1 + Math.random() * 3,
          0,
          0,
          Math.PI * 2
        );
        c.fill();
      }
    }
  }

  // Overall grime wash, heavier low down.
  for (let i = 0; i < 9000; i++) {
    const yy = Math.random() * size;
    const a = 0.02 + (yy / size) * 0.05 * Math.random();
    c.fillStyle = `rgba(12,16,10,${a})`;
    c.fillRect(Math.random() * size, yy, 2, 2);
  }

  return { color, height };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

export function getBrickTextures(): { map: THREE.Texture; bump: THREE.Texture } | null {
  if (typeof document === 'undefined') return null; // SSR guard
  if (cached) return cached;

  const { color, height } = drawBrick(1024);

  const map = new THREE.CanvasTexture(color);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 8;

  const bump = new THREE.CanvasTexture(height);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  bump.anisotropy = 8;

  cached = { map, bump };
  return cached;
}
