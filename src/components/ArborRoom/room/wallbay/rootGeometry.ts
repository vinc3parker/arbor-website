import * as THREE from 'three';
import { buildArchSurfaceSlices } from './frameGeometry';
import { makeParabolicArchOutlineSpacedPoints } from './archShape';

/**
 * Seeded root generator, guided by the SAME geometry that builds the stone
 * surround — including the plinth blocks at the feet.
 *
 * Strand centrelines follow the band outline and, in the plane perpendicular
 * to it, ride a WRAP PATH traced around the stone's real cross-section: across
 * the front face, around the outer corner, down the outer flank to the wall.
 * The profile is Y-AWARE — near the floor it expands to the plinth block's
 * larger profile, so roots climb OVER the base instead of clipping through
 * it. Every wrap position is offset outward by the strand's own radius.
 *
 * The look is BRANCHES, not vines: thick primaries that stay heavy for most
 * of their length (slow taper), short offshoot stubs forking off them, and
 * base wraps that rise out of the ground and grip the plinth before the
 * climb begins.
 *
 * Maturity shapes the whole system:
 *   development → branches just coming up from the ground around the base
 *   beta        → reaching the crown, but much thinner
 *   live        → thick branches fully cover the archway stone
 *
 * Growth windows are ordered by base height, so scroll growth is ground-up.
 */

export type ArchStatus = 'development' | 'beta' | 'live';

/** The StoneFrame mesh sits at z = 0.2 in bay space (see StoneFrame FRONT). */
const FRAME_Z = 0.2;
const BEVEL = 0.05;

/** Band cross-section (from the shared surface description). */
const SLICES = buildArchSurfaceSlices();
const Z_FRONT = FRAME_Z + SLICES[0].frontZ + BEVEL; // front face plane
const ROOT_SURFACE_LIFT = BEVEL;

/**
 * Roots are driven by the actual OUTER EDGE curve of the outer stone.
 * From that curve they can move in two local surface directions:
 *
 * - across the front face, perpendicular to the curve, into the stone band
 * - across the external side face, backwards in Z from the front corner
 *
 * This avoids horizontal y-slice interpolation, which breaks once the arch
 * begins curving near the crown.
 */
// Trace the ACTUAL outer edge of the outer stone band so the vines sit on the
// stone, not floating outside it. The band is built by
// makeParabolicArchFrameShape(1.98, 6.18, 0.4, 0.34): inner half-width 0.99 +
// sideThickness 0.4 = 1.39 outer half-width; springY = 3.09 - 1.9 = 1.19;
// crownY = 3.09 + topThickness 0.34 = 3.43.
const OUTER_EDGE = makeParabolicArchOutlineSpacedPoints(1.39, -3.09, 1.19, 3.43, 240);
const FRONT_FACE_WIDTH = 0.4;

/** Plinth block cross-section (StoneFrame baseGeometry: 0.52 wide, 0.5 deep,
 *  0.5 tall, centred at the jamb, front at z ≈ 0.56 incl. bevel). */
const PLINTH_TOP = -2.54; // top of the block + bevel
// Front face of the foot block (StoneFrame places it at z 0.25 + half its 0.86
// depth + bevel ≈ 0.7). Roots sit proud of THIS at the base, not inside it.
const PLINTH_Z_FRONT = 0.7;
/** Where the block sits: centre of the foot in bay space. Aligned to the
 *  outer stone jamb (half-width 1.39) so the base wraps meet the climbers. */
const FOOT_X = 1.39;

/** Outer edge curve used as the root path authority. */
const OUTLINE = OUTER_EDGE.map((p) => new THREE.Vector3(p.x, p.y, Z_FRONT + ROOT_SURFACE_LIFT));
const LAST = OUTLINE.length - 1;
const LEFT_TOP = Math.floor(LAST / 2);
const RIGHT_TOP = LEFT_TOP + 1;
const Y_BOTTOM = Math.min(...OUTLINE.map((point) => point.y));
const Y_TOP = Math.max(...OUTLINE.map((point) => point.y));
const Y_SPAN = Y_TOP - Y_BOTTOM;

export interface RootStrand {
  geometry: THREE.BufferGeometry;
  /** [start, end] fraction of the arch growth budget this strand grows in. */
  window: [number, number];
}

/** Deterministic per-arch randomness. */
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

const smoothstep = (a: number, b: number, x: number) => {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

function surfacePoint(idx: number, w: number, r: number): THREE.Vector3 {
  const i = THREE.MathUtils.clamp(idx, 0, LAST);
  const p = OUTLINE[i];
  const prev = OUTLINE[Math.max(0, i - 2)];
  const next = OUTLINE[Math.min(LAST, i + 2)];

  const tangent = new THREE.Vector2(next.x - prev.x, next.y - prev.y).normalize();
  const side: -1 | 1 = p.x < 0 ? -1 : 1;

  // Two possible normals exist around a curve. Choose the one that points from
  // the outer edge back into the front face of the stone band, not out into air.
  const normalA = new THREE.Vector2(-tangent.y, tangent.x);
  const normalB = new THREE.Vector2(tangent.y, -tangent.x);
  const inward = normalA.x * -side > normalB.x * -side ? normalA : normalB;

  const t = THREE.MathUtils.clamp(w, 0, 1);

  // Weave ACROSS the front face of the band, but never dive in z: the strand
  // stays lifted proud of the stone (by the surface lift + its own radius) so
  // it reads as growing along the surface rather than sinking into the stone.
  const acrossFront = FRONT_FACE_WIDTH * smoothstep(0, 1, t);

  // Y-aware depth: down at the feet the stone is the proud plinth block, so the
  // strand rides its front face; higher up it settles back onto the thinner
  // arch band. Prevents roots sinking through the plinth at the base.
  const baseZ = THREE.MathUtils.lerp(
    PLINTH_Z_FRONT,
    Z_FRONT,
    smoothstep(PLINTH_TOP, PLINTH_TOP + 0.7, p.y)
  );

  return new THREE.Vector3(
    p.x + inward.x * acrossFront,
    p.y + inward.y * acrossFront,
    baseZ + ROOT_SURFACE_LIFT + r
  );
}

/** Build a tapered tube through the control points. Branch-like: the radius
 *  holds heavy for most of the length and only tapers near the tip. */
function taperedTube(
  controlPts: THREE.Vector3[],
  rStart: number,
  rEnd: number,
  segs = 54,
  radial = 8,
  taperPow = 2.2
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(controlPts, false, 'catmullrom', 0.5);
  const frames = curve.computeFrenetFrames(segs, false);
  const pts = curve.getSpacedPoints(segs);

  const position: number[] = [];
  const normal: number[] = [];
  const index: number[] = [];
  const v = new THREE.Vector3();

  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const r = THREE.MathUtils.lerp(rStart, rEnd, Math.pow(t, taperPow));
    const N = frames.normals[i];
    const B = frames.binormals[i];
    const P = pts[i];
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const cx = Math.cos(a);
      const sy = Math.sin(a);
      v.set(N.x * cx + B.x * sy, N.y * cx + B.y * sy, N.z * cx + B.z * sy);
      position.push(P.x + v.x * r, P.y + v.y * r, P.z + v.z * r);
      normal.push(v.x, v.y, v.z);
    }
  }

  for (let i = 0; i < segs; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j;
      const b = a + radial + 1;
      index.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normal, 3));
  geo.setIndex(index);
  return geo;
}

interface StrandOpts {
  from: number;
  to: number;
  /** Wrap w(f): base, oscillation amplitude/freq/phase. The oscillation is
   *  full-range so strands repeatedly dive around the outer flank (vanishing
   *  behind the stone from the front) and re-emerge — the wrap feel. */
  w0: number;
  wAmp: number;
  wFreq: number;
  wPhase: number;
  r: number;
  control?: number;
  /** Prepend an underground emergence in front of the foot. */
  fromGround?: boolean;
}

/** Height fraction (0 floor → 1 crown) of an outline index. */
function heightFrac(idx: number): number {
  return (OUTLINE[THREE.MathUtils.clamp(idx, 0, LAST)].y - Y_BOTTOM) / Y_SPAN;
}

/** The w value a strand has at fraction f along its path. The oscillation
 *  ramps in over the first stretch so strands leave the ground calmly and
 *  find the stone before they start weaving. */
function wAt(o: StrandOpts, f: number): number {
  const ramp = Math.min(1, f * 2.5);
  return THREE.MathUtils.clamp(
    o.w0 + o.wAmp * ramp * Math.sin(o.wFreq * f * Math.PI * 2 + o.wPhase),
    0,
    1
  );
}

/** Sample a stretch of the outline into control points riding the wrap. */
function outlineStrand(o: StrandOpts): THREE.Vector3[] {
  const control = o.control ?? 14;
  const pts: THREE.Vector3[] = [];

  if (o.fromGround) {
    // Rise out of the floor in front of the plinth before finding the stone.
    const side = OUTLINE[THREE.MathUtils.clamp(o.from, 0, LAST)].x < 0 ? -1 : 1;
    pts.push(
      new THREE.Vector3(side * (FOOT_X - 0.1), -3.55, PLINTH_Z_FRONT + 0.3),
      new THREE.Vector3(side * (FOOT_X + 0.02), -3.18, PLINTH_Z_FRONT + 0.18)
    );
  }

  for (let k = 0; k <= control; k++) {
    const f = k / control;
    const idx = Math.round(THREE.MathUtils.lerp(o.from, o.to, f));
    pts.push(surfacePoint(idx, wAt(o, f), o.r));
  }
  return pts;
}

/**
 * A root gripping the base: rises from underground at the plinth's inner
 * front corner, then traces the plinth's OWN cross-section profile — across
 * its front face, around the outer corner, ending against the wall — rising
 * slightly as it wraps. It hugs the block the same way climbers hug the band.
 */
function baseWrap(side: -1 | 1, rng: () => number, r: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];

  // Emerge from the floor just in front of the block.
  pts.push(
    new THREE.Vector3(side * (FOOT_X - 0.18), -3.55, PLINTH_Z_FRONT + 0.28),
    new THREE.Vector3(side * (FOOT_X - 0.08), -3.2, PLINTH_Z_FRONT + 0.12)
  );

  const wStart = 0.02 + rng() * 0.08;
  const wEnd = 0.9 + rng() * 0.1;
  const yStart = -3.05;
  const yEnd = -2.86 + rng() * 0.22;
  const steps = 10;
  for (let k = 0; k <= steps; k++) {
    const f = k / steps;
    const w = THREE.MathUtils.lerp(wStart, wEnd, f);
    const y = THREE.MathUtils.lerp(yStart, yEnd, Math.pow(f, 0.8));
    const t = THREE.MathUtils.clamp(w, 0, 1);
    const frontT = smoothstep(0, 0.55, t);
    const x = side * (FOOT_X + 0.28 - FRONT_FACE_WIDTH * frontT);
    // Hug the front face of the plinth, lifted proud — never behind it.
    const z = PLINTH_Z_FRONT + ROOT_SURFACE_LIFT + r;
    pts.push(new THREE.Vector3(x, y, z));
  }
  return pts;
}

interface ClimberSpec {
  side: -1 | 1;
  reach: number; // fraction of the outline (0..1)
  rStart: number;
  rEnd: number;
}

interface BuiltClimber {
  strand: RootStrand;
  opts: StrandOpts;
  window: [number, number];
}

/** Build one climber (rising from the ground) and its growth window. */
function climber(
  spec: ClimberSpec,
  rng: () => number,
  wWander: number
): BuiltClimber {
  const fromIdx =
    spec.side === -1
      ? 1 + Math.floor(rng() * 5)
      : LAST - 1 - Math.floor(rng() * 5);
  const toIdx =
    spec.side === -1
      ? Math.round(THREE.MathUtils.lerp(0, LEFT_TOP, spec.reach))
      : Math.round(THREE.MathUtils.lerp(LAST, RIGHT_TOP, spec.reach));

  // Normalise the weave SPATIALLY: long strands wave a few times, short
  // strands barely half a wave — otherwise short climbers zigzag wildly.
  const span = Math.abs(toIdx - fromIdx) / LAST;
  const opts: StrandOpts = {
    from: fromIdx,
    to: toIdx,
    w0: 0.28 + rng() * 0.2,
    wAmp: wWander * (0.5 + span * 0.9) * (0.7 + rng() * 0.6),
    wFreq: (0.7 + rng() * 0.7) * Math.max(0.9, span * 4),
    wPhase: rng() * Math.PI * 2,
    r: spec.rStart,
    control: Math.max(9, Math.round(span * 34)),
    fromGround: true,
  };

  const geometry = taperedTube(outlineStrand(opts), spec.rStart, spec.rEnd, 76);

  const h1 = heightFrac(toIdx);
  const window: [number, number] = [
    0.02 + rng() * 0.05,
    Math.min(1, 0.3 + h1 * 0.7),
  ];
  return { strand: { geometry, window }, opts, window };
}

/** Short offshoot branches forking off a climber part-way up. */
function branchStubs(
  parent: BuiltClimber,
  count: number,
  rng: () => number
): RootStrand[] {
  const stubs: RootStrand[] = [];
  for (let i = 0; i < count; i++) {
    const t = 0.3 + rng() * 0.55; // fraction along the parent
    const baseIdx = Math.round(
      THREE.MathUtils.lerp(parent.opts.from, parent.opts.to, t)
    );
    const dir = parent.opts.to > parent.opts.from ? 1 : -1;
    const span = (4 + Math.floor(rng() * 7)) * dir * (rng() > 0.25 ? 1 : -1);
    const r = parent.opts.r * (0.4 + rng() * 0.15);

    const stubOpts: StrandOpts = {
      from: baseIdx,
      to: THREE.MathUtils.clamp(baseIdx + span, 0, LAST),
      // Fork off from wherever the parent is on the wrap, then diverge.
      w0: wAt(parent.opts, t),
      wAmp: 0.3 + rng() * 0.3,
      wFreq: 1 + rng() * 1.5,
      wPhase: rng() > 0.5 ? Math.PI / 2 : -Math.PI / 2,
      r,
      control: 8,
    };

    // Sprouts once the parent's growth has passed the fork.
    const sprout =
      parent.window[0] + t * (parent.window[1] - parent.window[0]);
    stubs.push({
      geometry: taperedTube(outlineStrand(stubOpts), r, r * 0.2, 30),
      window: [Math.min(0.9, sprout), Math.min(1, sprout + 0.15)],
    });
  }
  return stubs;
}

/** Build the full root system for one archway, shaped by maturity. */
export function buildArchRoots(seed: number, status: ArchStatus): RootStrand[] {
  const rng = mulberry32(Math.round(seed * 7.13) + 97);
  const strands: RootStrand[] = [];

  // --- base wraps: out of the ground, gripping each plinth first ----------
  const wrapsPerFoot = status === 'live' ? 3 : 2;
  for (const side of [-1, 1] as const) {
    for (let i = 0; i < wrapsPerFoot; i++) {
      const r = 0.05 + rng() * 0.02 - (status === 'beta' ? 0.018 : 0);
      strands.push({
        geometry: taperedTube(baseWrap(side, rng, r), r, r * 0.3, 44),
        window: [rng() * 0.05, 0.16 + rng() * 0.06],
      });
    }
  }

  // --- climbers, thickness and reach shaped by maturity -------------------
  let specs: ClimberSpec[];
  let wWander: number;
  let stubsPer: number;

  if (status === 'development') {
    // Just coming up from the ground around the base.
    specs = [
      { side: -1, reach: 0.2 + rng() * 0.06, rStart: 0.065, rEnd: 0.016 },
      { side: 1, reach: 0.17 + rng() * 0.06, rStart: 0.06, rEnd: 0.015 },
      { side: rng() > 0.5 ? -1 : 1, reach: 0.1 + rng() * 0.05, rStart: 0.04, rEnd: 0.01 },
    ];
    wWander = 0.2;
    stubsPer = 1;
  } else if (status === 'beta') {
    // Reaching the top — but much thinner.
    specs = [
      { side: -1, reach: 0.55 + rng() * 0.08, rStart: 0.038, rEnd: 0.008 },
      { side: 1, reach: 0.52 + rng() * 0.08, rStart: 0.035, rEnd: 0.008 },
      { side: -1, reach: 0.32 + rng() * 0.1, rStart: 0.024, rEnd: 0.006 },
      { side: 1, reach: 0.3 + rng() * 0.1, rStart: 0.022, rEnd: 0.006 },
    ];
    wWander = 0.3;
    stubsPer = 2;
  } else {
    // Live: heavy branches fully cover the archway stone.
    specs = [
      { side: -1, reach: 0.62 + rng() * 0.08, rStart: 0.085, rEnd: 0.02 },
      { side: 1, reach: 0.58 + rng() * 0.08, rStart: 0.08, rEnd: 0.02 },
      { side: -1, reach: 0.44 + rng() * 0.1, rStart: 0.055, rEnd: 0.013 },
      { side: 1, reach: 0.42 + rng() * 0.1, rStart: 0.052, rEnd: 0.013 },
      { side: -1, reach: 0.26 + rng() * 0.08, rStart: 0.04, rEnd: 0.01 },
      { side: 1, reach: 0.24 + rng() * 0.08, rStart: 0.038, rEnd: 0.01 },
    ];
    wWander = 0.38;
    stubsPer = 3;
  }

  for (const spec of specs) {
    const built = climber(spec, rng, wWander);
    strands.push(built.strand);
    strands.push(...branchStubs(built, stubsPer, rng));
  }

  // --- extra ground shoots: MANY rise from the base, but reach is biased
  //     short (pow curve) so only a few climb high — the natural look of a
  //     plant throwing up runners that mostly clamber over the base while a
  //     handful make it up and over toward the crown. -----------------------
  const shootCount = status === 'development' ? 5 : status === 'beta' ? 7 : 9;
  for (let i = 0; i < shootCount; i++) {
    const side: -1 | 1 = i % 2 === 0 ? -1 : 1;
    const reach = 0.06 + Math.pow(rng(), 2.0) * 0.42;
    const rStart = 0.028 + rng() * 0.03;
    const shoot = climber(
      { side, reach, rStart, rEnd: rStart * 0.22 },
      rng,
      wWander * 0.9
    );
    strands.push(shoot.strand);
    if (rng() > 0.55) strands.push(...branchStubs(shoot, 1, rng));
  }

  // --- live arches close the ring: a heavy drape over the crown -----------
  if (status === 'live') {
    const cFrom = Math.round(THREE.MathUtils.lerp(LEFT_TOP, 0, 0.12 + rng() * 0.08));
    const cTo = Math.round(THREE.MathUtils.lerp(RIGHT_TOP, LAST, 0.12 + rng() * 0.08));
    strands.push({
      geometry: taperedTube(
        outlineStrand({
          from: rng() > 0.5 ? cFrom : cTo,
          to: rng() > 0.5 ? cTo : cFrom,
          w0: 0.3 + rng() * 0.2,
          wAmp: 0.35 + rng() * 0.2,
          wFreq: 1.5 + rng() * 1.5,
          wPhase: rng() * Math.PI * 2,
          r: 0.05,
          control: 12,
        }),
        0.05,
        0.014,
        48
      ),
      window: [0.8, 1],
    });
  }

  return strands;
}
