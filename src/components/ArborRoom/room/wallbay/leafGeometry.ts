import * as THREE from 'three';
import { makeLeafShape, makeParabolicArchOutlineSpacedPoints } from './archShape';

/**
 * Seeded foliage generator for one archway. Small leaves sprout along the same
 * stone the roots climb — sparse and low on young apps, climbing to the crown
 * on mature ones — with denser moss massing at the feet and a leafy drape over
 * the crown once an app is live.
 *
 * Leaves are appended in ascending height so a single draw-range grows the
 * whole canopy from the ground up as the portal wakes (mirroring the roots).
 * One merged BufferGeometry keeps it to a single draw call per bay.
 */

export type LeafStatus = 'development' | 'beta' | 'live';

// Seated on the OUTER archway stone's front face (StoneFrame frame front
// ≈ 0.525); leaves start ON that surface, no floating gap.
const LEAF_Z = 0.5;
const OUTLINE = makeParabolicArchOutlineSpacedPoints(1.24, -3.09, 1.19, 3.26, 240);
const LAST = OUTLINE.length - 1;
const Y_BOTTOM = -3.09;
const Y_TOP = 3.26;

/** Base leaf silhouette, grown once and reused (transformed per instance). */
const LEAF = new THREE.ShapeGeometry(makeLeafShape(0.34, 0.15), 6);
const LEAF_POS = LEAF.getAttribute('position').array as Float32Array;
const LEAF_NRM = LEAF.getAttribute('normal').array as Float32Array;
const LEAF_IDX = LEAF.index!.array as Uint16Array | Uint32Array;
const LEAF_VERTS = LEAF_POS.length / 3;

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

interface Leaf {
  pos: THREE.Vector3;
  angle: number; // z-rotation so the leaf tip points along its growth dir
  tiltX: number;
  tiltY: number;
  scale: number;
  y: number; // sort key (attach height)
}

/** One leaf rooted at outline index `i`, fanning outward and up. */
function makeLeaf(i: number, rng: () => number, sizeMul: number): Leaf {
  const p = OUTLINE[THREE.MathUtils.clamp(i, 0, LAST)];
  const n = normalAt(i);
  const outward = (rng() - 0.3) * 0.12; // spread a little in/out along the band
  const pos = new THREE.Vector3(
    p.x + n.x * outward,
    p.y + n.y * outward,
    LEAF_Z + rng() * 0.03 // sits ON the stone face, barely lifted
  );

  // Grow up-and-out: blend the outward normal with global up, plus spread.
  const spread = (rng() - 0.5) * 1.3;
  const dir = new THREE.Vector2(n.x * 0.55 + spread * 0.5, n.y * 0.4 + 0.85).normalize();
  const angle = Math.atan2(dir.y, dir.x) - Math.PI / 2;

  return {
    pos,
    // Lie closer to the stone (small tilts) so leaves cling to the surface
    // rather than jutting straight out of it.
    angle,
    tiltX: 0.15 + rng() * 0.5, // gentle lift toward the viewer
    tiltY: (rng() - 0.5) * 0.5,
    scale: (0.7 + rng() * 0.7) * sizeMul,
    y: p.y,
  };
}

/** Build the full foliage buffer for one archway, shaped by maturity. */
export function buildArchLeaves(seed: number, status: LeafStatus): THREE.BufferGeometry {
  const rng = mulberry32(Math.round(seed * 9.31) + 17);

  const reach = status === 'development' ? 0.34 : status === 'beta' ? 0.85 : 1.0;
  const density = status === 'development' ? 0.22 : status === 'beta' ? 0.4 : 0.62;
  const sizeMul = status === 'development' ? 0.85 : status === 'beta' ? 0.92 : 1.05;

  const leaves: Leaf[] = [];

  // Leaves along the climbable stone.
  for (let i = 2; i < LAST - 2; i += 2) {
    if (heightFrac(i) > reach) continue;
    if (rng() < density) leaves.push(makeLeaf(i, rng, sizeMul));
  }

  // Moss massing at the feet — dense little leaves low on both jambs.
  const footClumps = status === 'development' ? 6 : status === 'beta' ? 9 : 13;
  for (const end of [0, LAST] as const) {
    for (let k = 0; k < footClumps; k++) {
      const i = end === 0 ? 2 + Math.floor(rng() * 22) : LAST - 2 - Math.floor(rng() * 22);
      leaves.push(makeLeaf(i, rng, sizeMul * (0.6 + rng() * 0.5)));
    }
  }

  // Leafy drape over the crown once the tree has truly taken (live), lighter
  // for beta, none for development.
  const crownClumps = status === 'live' ? 16 : status === 'beta' ? 7 : 0;
  for (let k = 0; k < crownClumps; k++) {
    const i = 120 + Math.floor((rng() - 0.5) * 46);
    leaves.push(makeLeaf(i, rng, sizeMul * (0.8 + rng() * 0.5)));
  }

  // Grow from the ground up.
  leaves.sort((a, b) => a.y - b.y);

  const position: number[] = [];
  const normal: number[] = [];
  const index: number[] = [];

  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const nrmMat = new THREE.Matrix3();
  const vp = new THREE.Vector3();
  const vn = new THREE.Vector3();

  for (const leaf of leaves) {
    e.set(leaf.tiltX, leaf.tiltY, leaf.angle, 'XYZ');
    q.setFromEuler(e);
    m.compose(leaf.pos, q, new THREE.Vector3(leaf.scale, leaf.scale, leaf.scale));
    nrmMat.getNormalMatrix(m);

    const base = position.length / 3;
    for (let v = 0; v < LEAF_VERTS; v++) {
      vp.set(LEAF_POS[v * 3], LEAF_POS[v * 3 + 1], LEAF_POS[v * 3 + 2]).applyMatrix4(m);
      vn.set(LEAF_NRM[v * 3], LEAF_NRM[v * 3 + 1], LEAF_NRM[v * 3 + 2])
        .applyMatrix3(nrmMat)
        .normalize();
      position.push(vp.x, vp.y, vp.z);
      normal.push(vn.x, vn.y, vn.z);
    }
    for (let t = 0; t < LEAF_IDX.length; t++) index.push(base + LEAF_IDX[t]);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normal, 3));
  geo.setIndex(index);
  return geo;
}
