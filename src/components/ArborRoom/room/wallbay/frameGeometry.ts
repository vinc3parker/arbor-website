import * as THREE from 'three';
import { makeParabolicArchFrameShape, makeTaperedBlockShape } from './archShape';

/**
 * Geometry and materials for the minimal parabolic stone arch. Built ONCE at
 * module scope and shared across every WallBay — the stone is deliberately
 * quiet; the glowing roots (see rootGeometry.ts) carry the life.
 */

const bevel = {
  bevelEnabled: true,
  bevelThickness: 0.05,
  bevelSize: 0.05,
  bevelSegments: 2,
} as const;

function centeredExtrude(
  shape: THREE.Shape,
  depth: number,
  bevelOpts: Partial<THREE.ExtrudeGeometryOptions> = bevel,
  curveSegments = 64
): THREE.ExtrudeGeometry {
  const geo = new THREE.ExtrudeGeometry(shape, { depth, curveSegments, ...bevelOpts });
  geo.translate(0, 0, -depth / 2);
  geo.computeVertexNormals();
  return geo;
}

// --- Arch surface description for root generator --------------------------------

export type ArchRootSurface = 'outer' | 'inner';

export interface ArchSurfacePoint {
  /** Vertical position of this slice. */
  y: number;
  /** Right-hand x position of the surface edge. Mirror this for the left side. */
  x: number;
  /** Front face of the outer stone, where the visible roots sit. */
  frontZ: number;
  /** Back face, kept for depth-aware placement if roots wrap around later. */
  backZ: number;
  /** Which climbable edge of the outer arch this point describes. */
  surface: ArchRootSurface;
}

export interface ArchSlice {
  y: number;
  /** Outside edge of the outer arch stone. */
  outerX: number;
  /** Inward-facing edge of the same outer arch stone. */
  innerX: number;
  frontZ: number;
  backZ: number;
  /** Only these two edges should be considered available root surface. */
  availableSurfaces: ArchSurfacePoint[];
}

function outerArchHalfWidthAtY(y: number, halfH: number, halfW: number, springY: number): number {
  if (y <= springY) return halfW;

  const t = (y - springY) / (halfH - springY);
  return halfW * Math.sqrt(Math.max(0, 1 - t * t));
}

/**
 * Returns horizontal slices describing ONLY the climbable surface of the OUTER
 * stone arch. The roots should grow around the corner made by:
 *
 * - the outside edge of the outer stone
 * - the inward-facing edge of that same outer stone
 *
 * It deliberately does not expose the whole filled arch silhouette, because
 * that lets roots choose points inside the stone volume.
 */
export function buildArchSurfaceSlices(
  height = 6.18,
  width = 1.98,
  outerBandWidth = 0.4,
  depth = 0.55,
  samples = 120
): ArchSlice[] {
  const halfH = height / 2;
  const halfW = width / 2;
  const springY = halfH - 1.9;
  const frontZ = depth / 2;
  const backZ = -depth / 2;

  const slices: ArchSlice[] = [];

  for (let i = 0; i <= samples; i++) {
    const y = -halfH + (i / samples) * height;
    const outerX = outerArchHalfWidthAtY(y, halfH, halfW, springY);
    const innerX = Math.max(0, outerX - outerBandWidth);

    slices.push({
      y,
      outerX,
      innerX,
      frontZ,
      backZ,
      availableSurfaces: [
        { y, x: outerX, frontZ, backZ, surface: 'outer' },
        { y, x: innerX, frontZ, backZ, surface: 'inner' },
      ],
    });
  }

  return slices;
}

/**
 * The OUTER archway stone — a chunky parabolic band, the surface the roots,
 * vines and flowers grow over. Wide and deep enough that the foliage has real
 * stone to sit on (it used to be a thin reveal, so the roots read as floating).
 */
export const frameGeometry = centeredExtrude(
  makeParabolicArchFrameShape(1.98, 6.18, 0.4, 0.34),
  0.55
);

/**
 * The INNER order — a proud band framing the opening whose front face carries
 * the etched runes and constellation glyphs (see Glyphs.tsx). Physically it
 * reads as the carved inner archivolt, distinct from the overgrown outer stone.
 */
export const innerBeadGeometry = centeredExtrude(
  makeParabolicArchFrameShape(1.98, 6.18, 0.16, 0.17),
  0.24,
  { bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 1 }
);

/**
 * A substantial foot anchoring each jamb to the floor — wide enough to span
 * BOTH the inner order and the outer stone, and DEEP in z so its faces never
 * sit at the same depth as the jamb/inner wall (which is what caused the
 * z-fighting flicker at the pillar bases).
 */
export const baseGeometry = centeredExtrude(
  makeTaperedBlockShape(0.84, 0.72, 0.74),
  0.86
);

// --- materials --------------------------------------------------------------

// The archways are permanent — they stand from the start and the brick wall
// builds around them, so the carved stone is NOT buildable.

/** Main sage-tinged stone. */
export const stoneMaterial = new THREE.MeshStandardMaterial({
  color: '#9aa584',
  roughness: 0.85,
  metalness: 0.04,
});

/** Slightly lighter sage for the inner order / catch-light bead. */
export const stoneLightMaterial = new THREE.MeshStandardMaterial({
  color: '#b3bd9c',
  roughness: 0.8,
  metalness: 0.04,
});

/** Deeper sage for the feet. */
export const stoneDarkMaterial = new THREE.MeshStandardMaterial({
  color: '#7c8a70',
  roughness: 0.9,
  metalness: 0.03,
});
