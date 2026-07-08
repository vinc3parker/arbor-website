import * as THREE from 'three';
import { makeParabolicArchOutlineSpacedPoints } from './archShape';

/**
 * Seeded generator for the glowing marks carved into each archway stone:
 *
 *   - constellation medallions — a ring of star-dots joined by faint lines —
 *     set at the crown and the two shoulders (dot-and-line, celestial);
 *   - angular runes running in a column down each jamb (Nordic/arcane strokes).
 *
 * Everything is built in WallBay-local space, sitting just proud of the stone
 * frame's front face so the marks read as inlaid light. Two buffers come back:
 * `dots` (small octahedra, drawn with a MeshBasicMaterial) and `lines` (drawn
 * as LineSegments). Both are tinted and brightened at runtime by Glyphs.tsx,
 * so the marks glow harder the more advanced the app is.
 */

/** Front face of the INNER order band the runes are etched into (StoneFrame
 *  innerBead sits proud at ~0.56; the marks sit just on top of it). */
const GLYPH_Z = 0.6;

/** Centreline of the inner order band the marks are laid along. */
const OUTLINE = makeParabolicArchOutlineSpacedPoints(1.07, -3.09, 1.19, 3.26, 240);
const LAST = OUTLINE.length - 1;
const SPRING_Y = 1.19;

export interface GlyphBuffers {
  dots: THREE.BufferGeometry;
  lines: THREE.BufferGeometry;
}

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

/** Outward in-plane normal at an outline index (unit). */
function normalAt(i: number): THREE.Vector2 {
  const a = OUTLINE[Math.max(0, i - 2)];
  const b = OUTLINE[Math.min(LAST, i + 2)];
  const tx = b.x - a.x;
  const ty = b.y - a.y;
  const l = Math.hypot(tx, ty) || 1;
  return new THREE.Vector2(-ty / l, tx / l);
}

/** First outline index on a given side whose y is closest to a target. */
function indexNearY(targetY: number, side: -1 | 1): number {
  let best = side < 0 ? 0 : LAST;
  let bestD = Infinity;
  for (let i = 0; i <= LAST; i++) {
    const onSide = side < 0 ? OUTLINE[i].x <= 0 : OUTLINE[i].x >= 0;
    if (!onSide) continue;
    const d = Math.abs(OUTLINE[i].y - targetY);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

// --- dot merging -----------------------------------------------------------

// OctahedronGeometry (a PolyhedronGeometry) is NON-indexed — its position
// buffer is already an expanded triangle soup, so we append it directly.
const DOT = new THREE.OctahedronGeometry(1, 0);
const DOT_POS = DOT.getAttribute('position').array as Float32Array;
const DOT_VERTS = DOT_POS.length / 3;

interface DotSink {
  pos: number[];
}

function pushDot(sink: DotSink, c: THREE.Vector3, r: number) {
  for (let i = 0; i < DOT_VERTS; i++) {
    sink.pos.push(
      c.x + DOT_POS[i * 3] * r,
      c.y + DOT_POS[i * 3 + 1] * r,
      c.z + DOT_POS[i * 3 + 2] * r
    );
  }
}

// --- medallions & runes ----------------------------------------------------

/** A constellation medallion centred on the stone at `centre`, laid in the
 *  local x/y plane (the front face). A ring of dots, a few brighter "stars"
 *  inside, and faint lines tracing a path between the inner stars. */
function medallion(
  centre: THREE.Vector3,
  radius: number,
  rng: () => number,
  dots: DotSink,
  lines: number[]
) {
  // Outer ring of small dots.
  const ringCount = 8 + Math.floor(rng() * 3);
  const ringR = radius;
  const ringPts: THREE.Vector3[] = [];
  const phase = rng() * Math.PI * 2;
  for (let i = 0; i < ringCount; i++) {
    const a = phase + (i / ringCount) * Math.PI * 2;
    const wob = 0.9 + rng() * 0.2;
    const p = new THREE.Vector3(
      centre.x + Math.cos(a) * ringR * wob,
      centre.y + Math.sin(a) * ringR * wob,
      centre.z
    );
    ringPts.push(p);
    pushDot(dots, p, 0.006 + rng() * 0.003);
  }
  // Faint arcs joining every other ring dot — a broken circle.
  for (let i = 0; i < ringCount; i += 2) {
    const a = ringPts[i];
    const b = ringPts[(i + 1) % ringCount];
    lines.push(a.x, a.y, a.z, b.x, b.y, b.z);
  }

  // Inner constellation: 3–5 brighter stars joined in a wandering path.
  const starCount = 3 + Math.floor(rng() * 3);
  const stars: THREE.Vector3[] = [];
  for (let i = 0; i < starCount; i++) {
    const a = rng() * Math.PI * 2;
    const rr = radius * (0.15 + rng() * 0.5);
    const p = new THREE.Vector3(
      centre.x + Math.cos(a) * rr,
      centre.y + Math.sin(a) * rr,
      centre.z + 0.004
    );
    stars.push(p);
    pushDot(dots, p, 0.011 + rng() * 0.005);
  }
  for (let i = 0; i < stars.length - 1; i++) {
    const a = stars[i];
    const b = stars[i + 1];
    lines.push(a.x, a.y, a.z, b.x, b.y, b.z);
  }
}

/** One angular rune drawn around `centre` in the local x/y plane. A vertical
 *  stave with one or two diagonal branches — a compact runic mark. */
function rune(
  centre: THREE.Vector3,
  h: number,
  side: -1 | 1,
  rng: () => number,
  lines: number[]
) {
  const top = new THREE.Vector3(centre.x, centre.y + h / 2, centre.z);
  const bot = new THREE.Vector3(centre.x, centre.y - h / 2, centre.z);
  lines.push(top.x, top.y, top.z, bot.x, bot.y, bot.z);

  const w = h * (0.28 + rng() * 0.14) * side;
  const branches = 1 + Math.floor(rng() * 2);
  for (let b = 0; b < branches; b++) {
    const t = 0.2 + rng() * 0.6;
    const from = new THREE.Vector3(
      centre.x,
      THREE.MathUtils.lerp(bot.y, top.y, t),
      centre.z
    );
    const dY = (rng() > 0.5 ? 1 : -1) * h * (0.2 + rng() * 0.25);
    const to = new THREE.Vector3(from.x + w, from.y + dY, from.z);
    lines.push(from.x, from.y, from.z, to.x, to.y, to.z);
  }
}

/** Build every mark for one archway. */
export function buildGlyphs(seed: number): GlyphBuffers {
  const rng = mulberry32(Math.round(seed * 5.7) + 41);
  const dotSink: DotSink = { pos: [] };
  const lineArr: number[] = [];

  // Place a point on the stone band, nudged outward onto the face and lifted
  // to the front (GLYPH_Z), from an outline index.
  const onBand = (i: number, out = 0): THREE.Vector3 => {
    const p = OUTLINE[THREE.MathUtils.clamp(i, 0, LAST)];
    const n = normalAt(i);
    return new THREE.Vector3(p.x + n.x * out, p.y + n.y * out, GLYPH_Z);
  };

  // --- constellation medallions: crown + two shoulders --------------------
  // Small enough to sit within the narrow inner-order band (~0.16 wide).
  // The crown medallion drops below the apex so it sits centred within the
  // inner arch rather than riding the very top of the band.
  const crown = onBand(120, 0.0);
  crown.y -= 0.1;
  medallion(crown, 0.065 + rng() * 0.015, rng, dotSink, lineArr);
  const shoulderY = SPRING_Y + 0.55;
  medallion(onBand(indexNearY(shoulderY, -1), 0.0), 0.05 + rng() * 0.012, rng, dotSink, lineArr);
  medallion(onBand(indexNearY(shoulderY, 1), 0.0), 0.05 + rng() * 0.012, rng, dotSink, lineArr);

  // --- rune columns down each jamb ---------------------------------------
  for (const side of [-1, 1] as const) {
    const runeCount = 8 + Math.floor(rng() * 3);
    const yTop = SPRING_Y - 0.15;
    const yBot = -2.85;
    for (let k = 0; k < runeCount; k++) {
      const y = THREE.MathUtils.lerp(yTop, yBot, (k + 0.5) / runeCount);
      const idx = indexNearY(y, side);
      const c = onBand(idx, 0.0);
      rune(c, 0.14 + rng() * 0.04, side, rng, lineArr);
    }
  }

  // --- runes climbing the arch curve, shoulder up toward the crown --------
  for (const side of [-1, 1] as const) {
    const archRunes = 3 + Math.floor(rng() * 2);
    for (let k = 0; k < archRunes; k++) {
      const y = THREE.MathUtils.lerp(SPRING_Y + 0.2, 2.7, (k + 0.5) / archRunes);
      const idx = indexNearY(y, side);
      const c = onBand(idx, 0.0);
      rune(c, 0.1 + rng() * 0.03, side, rng, lineArr);
    }
  }

  const dots = new THREE.BufferGeometry();
  dots.setAttribute('position', new THREE.Float32BufferAttribute(dotSink.pos, 3));
  dots.computeVertexNormals();

  const lines = new THREE.BufferGeometry();
  lines.setAttribute('position', new THREE.Float32BufferAttribute(lineArr, 3));

  return { dots, lines };
}
