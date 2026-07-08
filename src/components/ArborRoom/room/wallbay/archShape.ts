/** Shared dimensions for the parabolic arch. */
export const ARCH_PROFILE = {
  width: 1.98,
  height: 6.18,
  frameThickness: 0.17,
  cornerRadius: 0.19,
} as const;

import * as THREE from 'three';

/**
 * An OPEN parabolic (catenary-style) arch outline: vertical jambs that sweep
 * up through a single smooth curve to a rounded crown — no point, no lobes.
 * This is the "minimal parabolic" silhouette.
 */
export function makeParabolicArchOutlinePoints(
  halfW: number,
  bottomY: number,
  springY: number,
  crownY: number,
  divisions = 60
): THREE.Vector2[] {
  const path = new THREE.Path();
  path.moveTo(-halfW, bottomY);
  path.lineTo(-halfW, springY);
  path.quadraticCurveTo(-halfW, crownY, 0, crownY);
  path.quadraticCurveTo(halfW, crownY, halfW, springY);
  path.lineTo(halfW, bottomY);
  return path.getPoints(divisions);
}

/**
 * Same open parabolic outline, but sampled UNIFORMLY BY ARC LENGTH — for
 * path-following (roots). Path.getPoints gives line segments a single
 * division while curves get many, so index-fractions of that variant are
 * heavily crown-biased; getSpacedPoints distributes evenly instead.
 */
export function makeParabolicArchOutlineSpacedPoints(
  halfW: number,
  bottomY: number,
  springY: number,
  crownY: number,
  divisions = 200
): THREE.Vector2[] {
  const path = new THREE.Path();
  path.moveTo(-halfW, bottomY);
  path.lineTo(-halfW, springY);
  path.quadraticCurveTo(-halfW, crownY, 0, crownY);
  path.quadraticCurveTo(halfW, crownY, halfW, springY);
  path.lineTo(halfW, bottomY);
  return path.getSpacedPoints(divisions);
}

/** Returns guide points that exactly match the current arch profile. */
export function makeArchGuidePoints(samples = 220) {
  const halfW = ARCH_PROFILE.width / 2;
  const halfH = ARCH_PROFILE.height / 2;
  const springY = halfH - 1.9;

  return makeParabolicArchOutlinePoints(
    halfW,
    -halfH,
    springY,
    halfH,
    samples
  );
}

/** Closed parabolic arch silhouette — used for the glowing portal surface. */
export function makeParabolicArchShape(width = 1.72, height = 6.18): THREE.Shape {
  const halfW = width / 2;
  const halfH = height / 2;
  const springLine = halfH - 1.9;

  const shape = new THREE.Shape();
  shape.moveTo(-halfW, -halfH);
  shape.lineTo(-halfW, springLine);
  shape.quadraticCurveTo(-halfW, halfH, 0, halfH);
  shape.quadraticCurveTo(halfW, halfH, halfW, springLine);
  shape.lineTo(halfW, -halfH);
  shape.closePath();
  return shape;
}

/**
 * A slender molded parabolic frame band (open at the bottom), built by tracing
 * an outer parabolic outline forward and an inner one back.
 */
export function makeParabolicArchFrameShape(
  innerWidth = 1.72,
  innerHeight = 6.18,
  sideThickness = 0.18,
  topThickness = 0.2
): THREE.Shape {
  const innerHalfW = innerWidth / 2;
  const innerHalfH = innerHeight / 2;
  const bottomY = -innerHalfH;
  const springY = innerHalfH - 1.9;
  const innerCrownY = innerHalfH;

  const outer = makeParabolicArchOutlinePoints(
    innerHalfW + sideThickness,
    bottomY,
    springY,
    innerCrownY + topThickness
  );
  const inner = makeParabolicArchOutlinePoints(innerHalfW, bottomY, springY, innerCrownY);

  const shape = new THREE.Shape();
  shape.moveTo(outer[0].x, outer[0].y);
  for (let i = 1; i < outer.length; i++) shape.lineTo(outer[i].x, outer[i].y);
  for (let i = inner.length - 1; i >= 0; i--) shape.lineTo(inner[i].x, inner[i].y);
  shape.closePath();
  return shape;
}

/**
 * A simple, symmetrical leaf silhouette (pointed tip, rounded belly) used for
 * the foliate capitals and keystone. Grows in +Y from its stem at the origin.
 */
export function makeLeafShape(length = 0.5, width = 0.22): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(width, length * 0.28, width * 0.7, length * 0.82, 0, length);
  shape.bezierCurveTo(-width * 0.7, length * 0.82, -width, length * 0.28, 0, 0);
  return shape;
}

/**
 * A trapezoidal block (wider at one end) for keystones, capitals and bases —
 * gives the frame proper carved massing instead of plain cuboids.
 */
export function makeTaperedBlockShape(
  bottomWidth: number,
  topWidth: number,
  height: number
): THREE.Shape {
  const bh = bottomWidth / 2;
  const th = topWidth / 2;
  const hh = height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-bh, -hh);
  shape.lineTo(bh, -hh);
  shape.lineTo(th, hh);
  shape.lineTo(-th, hh);
  shape.closePath();
  return shape;
}

/** Half-extents of the default arch, handy for shader normalisation. */
export const ARCH_HALF_WIDTH = 1.72 / 2;
export const ARCH_HALF_HEIGHT = 6.18 / 2;

/** Key reference lines of the default opening, reused when placing ornament. */
export const ARCH_SPRING_Y = 6.18 / 2 - 1.9; // where the arch springs from the jambs
export const ARCH_CROWN_Y = 6.18 / 2; // inner crown
export const ARCH_BOTTOM_Y = -6.18 / 2;
