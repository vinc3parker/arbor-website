'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { makeBrickMaterial } from './stoneMaterials';
import { WALL_APOTHEM } from './constants';

/**
 * The brick dome roofing the rotunda. It springs just above the portal crowns
 * and curves up toward a LARGE central OCULUS, through which the starry sky
 * stays visible even with the roof in place. We see its underside (BackSide),
 * weathered brick like the walls, and it assembles course-by-course with the
 * build reveal so the roof closes over the room as the visitor scrolls.
 */

// Springs just above the portal tops (matches BrickWall's WALL_TOP_Y).
const WALL_TOP_Y = 13.0;

// Dome centred on the springing ring; apex sits R above it.
const DOME_R = WALL_APOTHEM;
// Big oculus: leave the whole central cap open so the sky reads through it.
const OCULUS_ANGLE = 0.62; // polar angle left open (hole radius ≈ R·sinθ ≈ 12)

export function Dome() {
  const geometry = useMemo(
    () =>
      new THREE.SphereGeometry(
        DOME_R,
        120,
        60,
        0,
        Math.PI * 2,
        OCULUS_ANGLE, // start below the apex → leaves the oculus hole
        Math.PI / 2 - OCULUS_ANGLE // down to the equator (the springing)
      ),
    []
  );

  const material = useMemo(
    () =>
      makeBrickMaterial({
        side: THREE.BackSide,
        repeat: [30, 5],
        color: '#5f584a',
        smoothBuild: true,
      }),
    []
  );

  // A stone collar ringing the oculus so its lip reads as built masonry.
  const collar = useMemo(
    () => new THREE.TorusGeometry(DOME_R * Math.sin(OCULUS_ANGLE), 0.6, 12, 100),
    []
  );
  const collarMat = useMemo(
    () => makeBrickMaterial({ repeat: [40, 1], color: '#6a6252', smoothBuild: true }),
    []
  );

  return (
    <group position={[0, WALL_TOP_Y, 0]}>
      <mesh geometry={geometry} material={material} receiveShadow />
      <mesh
        geometry={collar}
        material={collarMat}
        position={[0, DOME_R * Math.cos(OCULUS_ANGLE), 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}
