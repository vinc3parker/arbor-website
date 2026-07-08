'use client';

import * as THREE from 'three';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { buildUniforms, BUILD_TOP, makeBuildableSmooth } from './buildReveal';
import { arborApps } from '../data/apps';
import { WALL_APOTHEM, BAY_SCALE, BAY_ORIGIN_Y } from './constants';

/**
 * The room's wall, laid as ACTUAL bricks. A curved course-by-course wall of
 * instanced bricks wraps the back of the room; the eight archway openings are
 * carved out of the courses so the pathways stay clear. As the visitor scrolls,
 * each brick FALLS in from above and DISSOLVES into existence the moment the
 * rising build line reaches its course — so the wall assembles brick by brick,
 * not in chunks.
 *
 * The bricks are a backdrop (no shadows, lit by ambient/hemi + accent spill),
 * tinted per-instance for weathered variation.
 */

// Wall reaches just above the portal crowns, then opens to the sky above.
const WALL_TOP_Y = 13.0;
const R = WALL_APOTHEM;

// Brick size (world) and the mortar gap between them. Kept tight so you can't
// see between them at eye level; a dark backing shell (below) blocks anything
// showing through the remaining hairline joints.
const BRICK_W = 1.15;
const BRICK_H = 0.5;
const BRICK_D = 0.62;
const GAP = 0.035;
const COURSE = BRICK_H + GAP;
const HALF_BRICK_ANG = BRICK_W / 2 / WALL_APOTHEM;

// The build loop steps in whole courses and stops before WALL_TOP_Y, so the
// real top of the brickwork sits a little below it. The backing shell is capped
// here so no dark shell shows above the wall now that the dome is gone.
const WALL_ACTUAL_TOP =
  BRICK_H / 2 +
  Math.floor((WALL_TOP_Y - BRICK_H / 2) / COURSE) * COURSE +
  BRICK_H / 2;

// The wall wraps the back arc (open toward the viewer), a touch past the
// outermost filler positions.
const HALF_SPAN = (114 * Math.PI) / 180;

// Arch opening silhouette (bay-local), matching the panel hole that used to be
// cut here: 1.98 × 6.18 parabolic.
const OPEN_HALF_W = 0.99;
const OPEN_HALF_H = 3.09;
const OPEN_SPRING = 1.19;

function openingHalfWidth(localY: number): number {
  if (localY < -OPEN_HALF_H || localY > OPEN_HALF_H) return 0;
  if (localY <= OPEN_SPRING) return OPEN_HALF_W;
  const t = (localY - OPEN_SPRING) / (OPEN_HALF_H - OPEN_SPRING);
  return OPEN_HALF_W * Math.sqrt(Math.max(0, 1 - t * t));
}

const BAY_RAD = arborApps.map((a) => (a.angle * Math.PI) / 180);

const localYAt = (y: number) => (y - BAY_ORIGIN_Y) / BAY_SCALE;

/** Would a brick of the given size, centred at (theta, worldY), poke into any
 *  archway opening? Tests the brick's FULL extent — its top/centre/bottom rows
 *  (openings are widest low down and narrow to the crown) and its own angular
 *  half-width — so no brick edge intrudes into the clear pathway. */
function insideOpening(theta: number, y: number): boolean {
  const hw = Math.max(
    openingHalfWidth(localYAt(y - BRICK_H / 2)),
    openingHalfWidth(localYAt(y)),
    openingHalfWidth(localYAt(y + BRICK_H / 2))
  );
  if (hw <= 0) return false;
  const angHalf = Math.atan(((hw + 0.08) * BAY_SCALE) / R) + HALF_BRICK_ANG;
  for (const b of BAY_RAD) {
    if (Math.abs(theta - b) < angHalf) return true;
  }
  return false;
}

function hash(n: number): number {
  return ((Math.sin(n * 127.1) * 43758.5453) % 1 + 1) % 1;
}

/** The brick material: falls + dissolves in per instance, keyed to uBuild. */
function makeInstancedBrickMaterial(): THREE.MeshStandardMaterial {
  const material = new THREE.MeshStandardMaterial({
    color: '#ffffff', // tinted by per-instance colour
    roughness: 0.96,
    metalness: 0.02,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uBuild = buildUniforms.uBuild;

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        attribute float aSettle;
        attribute float aSeed;
        uniform float uBuild;
        varying float vProgress;
        varying float vSeed;
        varying vec3 vDissPos;`
      )
      .replace(
        '#include <project_vertex>',
        `float prog = smoothstep(aSettle - 0.07, aSettle, uBuild);
        vProgress = prog;
        vSeed = aSeed;

        vec4 mvPosition = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          mvPosition = instanceMatrix * mvPosition;
        #endif
        // Fall in from above (+ a little drift) until settled.
        float fall = 1.0 - prog;
        mvPosition.y += fall * (3.0 + aSeed * 2.5);
        mvPosition.xz += fall * (aSeed - 0.5) * 0.5;
        vDissPos = mvPosition.xyz;

        mvPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * mvPosition;`
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        varying float vProgress;
        varying float vSeed;
        varying vec3 vDissPos;
        float dhash(vec3 p) {
          return fract(sin(dot(floor(p * 7.0), vec3(12.9898, 78.233, 37.719))) * 43758.5453);
        }`
      )
      .replace(
        '#include <clipping_planes_fragment>',
        `#include <clipping_planes_fragment>
        // Dissolve into existence: speckle appears as the brick settles.
        if (dhash(vDissPos + vSeed * 17.0) > vProgress * 1.05 + 0.02) discard;`
      );
  };
  material.customProgramCacheKey = () => 'arbor-brick-instance-v1';
  return material;
}

// A dark shell that stops the starry sky showing through the brick joints. It
// sits just behind the bricks (R + 0.2) — close, so there's almost no parallax
// between it and the wall — and its height is capped at the true top of the
// brickwork so nothing shows above the wall now the dome is gone. A parabolic
// hole is cut at each bay so you look straight through the opening to the sky;
// the hole is cut GENEROUSLY (wider than the clear opening) so it never
// intrudes into the portal, and the coplanar arch spandrel (see WallBay) hides
// the hole's edge, so no background shows at the outside of the archways.
const BACKING_SPAN = (118 * Math.PI) / 180;
const BACKING_R = R + 0.2;

// The backing hole is cut generously — comfortably wider than both the clear
// opening (half 0.99 × 3.09) and the luminous veil (half 1.12 × 3.2) — so the
// backing never shows inside the portal even for the oblique outer arches. The
// coplanar spandrel (WallBay) hides this hole's edge, so cutting it wide costs
// nothing at the outside of the arch.
const HOLE_HALF_W = 1.28;
const HOLE_HALF_H = 3.35;
const HOLE_SPRING = 1.19;

function holeHalfWidth(localY: number): number {
  if (localY < -HOLE_HALF_H || localY > HOLE_HALF_H) return 0;
  if (localY <= HOLE_SPRING) return HOLE_HALF_W;
  const t = (localY - HOLE_SPRING) / (HOLE_HALF_H - HOLE_SPRING);
  return HOLE_HALF_W * Math.sqrt(Math.max(0, 1 - t * t));
}

/** Is a point (angle theta, world height y) inside an archway hole? Sized to
 *  clear the veil (see above) so no backing ever shows inside the portal. */
function pointInOpening(theta: number, y: number): boolean {
  const hw = holeHalfWidth(localYAt(y));
  if (hw <= 0) return false;
  const angHalf = Math.atan((hw * BAY_SCALE) / R);
  for (const b of BAY_RAD) {
    if (Math.abs(theta - b) < angHalf) return true;
  }
  return false;
}

/** The backing shell as a curved grid with the archway holes removed. */
function buildBackingGeometry(): THREE.BufferGeometry {
  const N = 340; // angular divisions across the span
  const M = 100; // vertical divisions up the wall
  const yTop = WALL_ACTUAL_TOP;
  const thetaAt = (i: number) => -BACKING_SPAN + (i / N) * (2 * BACKING_SPAN);

  const positions: number[] = [];
  const vIndex = (i: number, j: number) => i * (M + 1) + j;

  for (let i = 0; i <= N; i++) {
    const theta = thetaAt(i);
    const x = Math.sin(theta) * BACKING_R;
    const z = -Math.cos(theta) * BACKING_R;
    for (let j = 0; j <= M; j++) {
      positions.push(x, (j / M) * yTop, z);
    }
  }

  const indices: number[] = [];
  for (let i = 0; i < N; i++) {
    const t0 = thetaAt(i);
    const t1 = thetaAt(i + 1);
    for (let j = 0; j < M; j++) {
      const y0 = (j / M) * yTop;
      const y1 = ((j + 1) / M) * yTop;
      // Drop the cell if ANY of its corners (or centre) sits in an opening, so
      // the hole always fully CONTAINS the arch — no backing pokes into the
      // opening at the curved corners.
      if (
        pointInOpening(t0, y0) ||
        pointInOpening(t1, y0) ||
        pointInOpening(t0, y1) ||
        pointInOpening(t1, y1) ||
        pointInOpening((t0 + t1) / 2, (y0 + y1) / 2)
      ) {
        continue;
      }
      const a = vIndex(i, j);
      const b = vIndex(i + 1, j);
      const c = vIndex(i + 1, j + 1);
      const d = vIndex(i, j + 1);
      indices.push(a, c, b, a, d, c);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function BrickBacking() {
  const geometry = useMemo(() => buildBackingGeometry(), []);
  const material = useMemo(
    () =>
      makeBuildableSmooth(
        new THREE.MeshStandardMaterial({
          color: '#0c0e14',
          roughness: 1,
          metalness: 0,
          side: THREE.DoubleSide,
        }),
        // Trail well behind the brick line through the build (lag tapers to 0
        // at the end) so the backing is always tucked behind the bricks and
        // never seen before them, yet still closes over the wall completely.
        2.5
      ),
    []
  );
  return <mesh geometry={geometry} material={material} />;
}

export function BrickWall() {
  const ref = useRef<THREE.InstancedMesh>(null);

  const { geometry, material, count, matrices, colors, settle, seed } = useMemo(() => {
    const geometry = new THREE.BoxGeometry(BRICK_W, BRICK_H, BRICK_D);
    const material = makeInstancedBrickMaterial();

    const matrices: THREE.Matrix4[] = [];
    const colors: THREE.Color[] = [];
    const settle: number[] = [];
    const seed: number[] = [];

    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const pos = new THREE.Vector3();
    const scl = new THREE.Vector3(1, 1, 1);
    const cutScale = new THREE.Vector3(1, 1, 1);
    const warm = new THREE.Color('#6a6152');
    const cool = new THREE.Color('#4b4a44');

    const angStep = (BRICK_W + GAP) / R;
    const nBricks = Math.floor((2 * HALF_SPAN) / angStep);

    let course = 0;
    for (let y = BRICK_H / 2; y <= WALL_TOP_Y; y += COURSE, course++) {
      const bond = (course % 2) * (angStep / 2); // running bond
      for (let i = 0; i <= nBricks; i++) {
        const theta = -HALF_SPAN + bond + i * angStep;
        if (Math.abs(theta) > HALF_SPAN) continue;
        if (insideOpening(theta, y)) continue;

        const h1 = hash(course * 31.7 + i * 7.13);
        const h2 = hash(course * 5.1 + i * 91.7);

        pos.set(Math.sin(theta) * R, y + (h1 - 0.5) * 0.05, -Math.cos(theta) * R);
        // Face the room centre, with a hair of weathered irregularity.
        e.set((h2 - 0.5) * 0.06, -theta + (h1 - 0.5) * 0.05, (h1 - 0.5) * 0.05);
        q.setFromEuler(e);
        m.compose(pos, q, scl);
        matrices.push(m.clone());

        colors.push(warm.clone().lerp(cool, h1).multiplyScalar(0.85 + h2 * 0.3));
        // Lower courses settle first; small per-brick jitter within a course.
        settle.push(THREE.MathUtils.clamp(y / BUILD_TOP + h2 * 0.015, 0, 1));
        seed.push(h1);
      }
    }

    // --- cut bricks: fill the gaps the square grid leaves where each course
    //     meets the curved archways. Full bricks can't butt right up to the
    //     stone (they'd poke through it) and don't align to the arch, so a
    //     variable sliver was left. Here we drop in narrower, scaled "cut"
    //     bricks that fill from the last full brick out to the stone edge — the
    //     way a mason cuts bricks to fit an arch — so there are no gaps.
    const baysSorted = [...BAY_RAD].sort((a, b) => a - b);

    const placeCutBrick = (course: number, y: number, c: number, wAng: number) => {
      if (Math.abs(c) > HALF_SPAN) return;
      const worldW = wAng * R - GAP; // leave the mortar joint
      if (worldW < 0.05) return;
      const h1 = hash(course * 31.7 + c * 53.3);
      const h2 = hash(course * 5.1 + c * 17.7);
      pos.set(Math.sin(c) * R, y + (h1 - 0.5) * 0.05, -Math.cos(c) * R);
      e.set((h2 - 0.5) * 0.06, -c + (h1 - 0.5) * 0.05, (h1 - 0.5) * 0.05);
      q.setFromEuler(e);
      cutScale.set(worldW / BRICK_W, 1, 1);
      m.compose(pos, q, cutScale);
      matrices.push(m.clone());
      colors.push(warm.clone().lerp(cool, h1).multiplyScalar(0.85 + h2 * 0.3));
      settle.push(THREE.MathUtils.clamp(y / BUILD_TOP + h2 * 0.015, 0, 1));
      seed.push(h1);
    };

    // Tile a span with N ~equal cut bricks (never one absurdly wide brick).
    const fillSpan = (course: number, y: number, a0: number, a1: number) => {
      const width = a1 - a0;
      if (width <= 0.002) return;
      const n = Math.max(1, Math.round(width / angStep));
      const w = width / n;
      for (let k = 0; k < n; k++) placeCutBrick(course, y, a0 + (k + 0.5) * w, w);
    };

    {
      let course = 0;
      for (let y = BRICK_H / 2; y <= WALL_TOP_Y; y += COURSE, course++) {
        const oh = Math.max(
          openingHalfWidth(localYAt(y - BRICK_H / 2)),
          openingHalfWidth(localYAt(y)),
          openingHalfWidth(localYAt(y + BRICK_H / 2))
        );
        if (oh <= 0) continue; // course clears the arches — already solid

        // Stone-edge angle (where the visible wall may resume) and the full-brick
        // exclusion angle (centre must clear this — it includes a half brick).
        const stoneBound = Math.atan(((oh + 0.08) * BAY_SCALE) / R);
        const edge = stoneBound + HALF_BRICK_ANG;
        const bond = (course % 2) * (angStep / 2);
        const base = -HALF_SPAN + bond;

        // Solid regions bounded by the stone edges of the openings.
        const regions: [number, number][] = [];
        let cur = -HALF_SPAN;
        for (const b of baysSorted) {
          const a0 = b - stoneBound;
          if (a0 > cur) regions.push([cur, Math.min(a0, HALF_SPAN)]);
          cur = Math.max(cur, b + stoneBound);
        }
        if (cur < HALF_SPAN) regions.push([cur, HALF_SPAN]);

        for (const [s0, s1] of regions) {
          const leftStone = s0 > -HALF_SPAN + 1e-4;
          const rightStone = s1 < HALF_SPAN - 1e-4;
          const eL = s0 + (leftStone ? HALF_BRICK_ANG : 0);
          const eR = s1 - (rightStone ? HALF_BRICK_ANG : 0);
          const i0 = Math.ceil((eL - base) / angStep);
          const i1 = Math.floor((eR - base) / angStep);
          if (i1 < i0) {
            // No full brick fits (a thin pier between two close arches).
            if (leftStone && rightStone) fillSpan(course, y, s0, s1);
            continue;
          }
          // Fill the sliver from the stone to the first/last full brick.
          const firstInner = base + i0 * angStep - HALF_BRICK_ANG;
          const lastOuter = base + i1 * angStep + HALF_BRICK_ANG;
          if (leftStone && firstInner - s0 > angStep * 0.12)
            fillSpan(course, y, s0, firstInner);
          if (rightStone && s1 - lastOuter > angStep * 0.12)
            fillSpan(course, y, lastOuter, s1);
        }
      }
    }

    return { geometry, material, count: matrices.length, matrices, colors, settle, seed };
  }, []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    for (let i = 0; i < count; i++) {
      mesh.setMatrixAt(i, matrices[i]);
      mesh.setColorAt(i, colors[i]);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    geometry.setAttribute('aSettle', new THREE.InstancedBufferAttribute(new Float32Array(settle), 1));
    geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(new Float32Array(seed), 1));
  }, [count, matrices, colors, settle, seed, geometry]);

  return (
    <>
      <BrickBacking />
      <instancedMesh
        ref={ref}
        args={[geometry, material, count]}
        frustumCulled={false}
      />
    </>
  );
}
