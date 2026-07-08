import * as THREE from 'three';
import { makeLeafShape, makeParabolicArchOutlineSpacedPoints } from './archShape';

/**
 * Seeded blossoms scattered through the archway foliage. Each flower is five
 * small petals radiating from a centre, seated on the outer archway stone
 * among the leaves. Flowers carry the bright accent GLOW (emissive, blooming),
 * so the colour of the app lives in the blooms rather than flooding the whole
 * vine — which is what made the foliage read as a flat block before.
 *
 * More flowers open, and brighter, the more advanced the app is. Appended in
 * ascending height so one draw-range opens them from the ground up with the
 * portal, like the leaves and roots.
 */

export type FlowerStatus = 'development' | 'beta' | 'live';

const FLOWER_Z = 0.53; // just proud of the outer stone face
const OUTLINE = makeParabolicArchOutlineSpacedPoints(1.22, -3.09, 1.19, 3.26, 240);
const LAST = OUTLINE.length - 1;
const Y_BOTTOM = -3.09;
const Y_TOP = 3.26;

const PETAL = new THREE.ShapeGeometry(makeLeafShape(0.15, 0.09), 4);
const PETAL_POS = PETAL.getAttribute('position').array as Float32Array;
const PETAL_NRM = PETAL.getAttribute('normal').array as Float32Array;
const PETAL_IDX = PETAL.index!.array as Uint16Array | Uint32Array;
const PETAL_VERTS = PETAL_POS.length / 3;
const PETALS = 5;

function mulberry32(seed: number) {
  let a = (seed * 2654435761) >>> 0 || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normalAt(i: number): THREE.Vector2 {
  const a = OUTLINE[Math.max(0, i - 2)];
  const b = OUTLINE[Math.min(LAST, i + 2)];
  const tx = b.x - a.x;
  const ty = b.y - a.y;
  const l = Math.hypot(tx, ty) || 1;
  return new THREE.Vector2(-ty / l, tx / l);
}

const heightFrac = (i: number) =>
  (OUTLINE[THREE.MathUtils.clamp(i, 0, LAST)].y - Y_BOTTOM) / (Y_TOP - Y_BOTTOM);

interface Flower {
  centre: THREE.Vector3;
  roll: number;
  tiltX: number;
  tiltY: number;
  scale: number;
  y: number;
}

export function buildArchFlowers(seed: number, status: FlowerStatus): THREE.BufferGeometry {
  const rng = mulberry32(Math.round(seed * 6.7) + 29);

  const reach = status === 'development' ? 0.35 : status === 'beta' ? 0.85 : 1.0;
  const count = status === 'development' ? 4 : status === 'beta' ? 9 : 18;
  const sizeMul = status === 'development' ? 0.8 : status === 'beta' ? 0.95 : 1.1;

  const flowers: Flower[] = [];
  const place = (i: number, s: number) => {
    const p = OUTLINE[THREE.MathUtils.clamp(i, 0, LAST)];
    const n = normalAt(i);
    const out = (rng() - 0.3) * 0.16;
    flowers.push({
      centre: new THREE.Vector3(p.x + n.x * out, p.y + n.y * out, FLOWER_Z + rng() * 0.04),
      roll: rng() * Math.PI * 2,
      tiltX: 0.2 + rng() * 0.4,
      tiltY: (rng() - 0.5) * 0.5,
      scale: (0.75 + rng() * 0.6) * s,
      y: p.y,
    });
  };

  for (let k = 0; k < count; k++) {
    // Bias toward the reachable band; a few cluster near the crown on mature
    // arches where the canopy is thickest.
    let i: number;
    if (status !== 'development' && rng() < 0.28) i = 120 + Math.floor((rng() - 0.5) * 40);
    else i = 4 + Math.floor(rng() * (LAST - 8));
    if (heightFrac(i) > reach) continue;
    place(i, sizeMul);
  }

  flowers.sort((a, b) => a.y - b.y);

  const position: number[] = [];
  const normal: number[] = [];
  const index: number[] = [];

  const m = new THREE.Matrix4();
  const petalM = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const nrmMat = new THREE.Matrix3();
  const vp = new THREE.Vector3();
  const vn = new THREE.Vector3();
  const petalRot = new THREE.Matrix4();

  for (const f of flowers) {
    e.set(f.tiltX, f.tiltY, f.roll, 'XYZ');
    q.setFromEuler(e);
    m.compose(f.centre, q, new THREE.Vector3(f.scale, f.scale, f.scale));

    for (let pIdx = 0; pIdx < PETALS; pIdx++) {
      // Radiate each petal around the flower's local z (facing the viewer).
      petalRot.makeRotationZ((pIdx / PETALS) * Math.PI * 2);
      petalM.multiplyMatrices(m, petalRot);
      nrmMat.getNormalMatrix(petalM);

      const base = position.length / 3;
      for (let v = 0; v < PETAL_VERTS; v++) {
        vp.set(PETAL_POS[v * 3], PETAL_POS[v * 3 + 1], PETAL_POS[v * 3 + 2]).applyMatrix4(petalM);
        vn.set(PETAL_NRM[v * 3], PETAL_NRM[v * 3 + 1], PETAL_NRM[v * 3 + 2])
          .applyMatrix3(nrmMat)
          .normalize();
        position.push(vp.x, vp.y, vp.z);
        normal.push(vn.x, vn.y, vn.z);
      }
      for (let t = 0; t < PETAL_IDX.length; t++) index.push(base + PETAL_IDX[t]);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normal, 3));
  geo.setIndex(index);
  return geo;
}
