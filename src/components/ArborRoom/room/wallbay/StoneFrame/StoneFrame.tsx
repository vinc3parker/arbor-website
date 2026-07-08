'use client';

import {
  frameGeometry,
  innerBeadGeometry,
  baseGeometry,
  stoneMaterial,
  stoneLightMaterial,
  stoneDarkMaterial,
} from '../frameGeometry';

// Reference lines of the opening (WallBay-local, arch centred on y = 0).
const BOTTOM_Y = -6.18 / 2;

// Feet sit just outside the opening edge (0.99), spanning the inner order and
// outer stone (~1.0–1.58) so one block reads as the base of the whole archway
// without intruding into the clear pathway.
const FOOT_X = 1.28;

// How far the whole frame sits in front of the WallBay origin.
const FRONT = 0.2;

export function StoneFrame() {
  return (
    <>
      {/* Outer archway stone — the chunky band the foliage grows over */}
      <mesh
        geometry={frameGeometry}
        material={stoneMaterial}
        position={[0, 0, FRONT]}
        castShadow
        receiveShadow
      />

      {/* Inner order — proud band framing the opening; runes are etched here */}
      <mesh
        geometry={innerBeadGeometry}
        material={stoneLightMaterial}
        position={[0, 0, FRONT + 0.22]}
        castShadow
        receiveShadow
      />

      {/* Substantial feet at the base of each jamb — proud in z (front ≈ 0.65)
          so they don't share a depth plane with the jamb walls (no z-fight) */}
      {([-1, 1] as const).map((dir) => (
        <mesh
          key={dir}
          geometry={baseGeometry}
          material={stoneDarkMaterial}
          position={[dir * FOOT_X, BOTTOM_Y + 0.37, FRONT + 0.05]}
          castShadow
          receiveShadow
        />
      ))}
    </>
  );
}
