'use client';

import * as THREE from 'three';
import { useWoodlandTexture } from '@/components/home/woodlandMaterials';
import { useStoneTexture } from './wallbay/stoneTexture';
import { FLOOR_RADIUS, DAIS_RADIUS, DAIS_HEIGHT } from './constants';

/**
 * The room's floor is the same forest ground as the home page's trail (same
 * photo texture, tint and bump), so walking out of the woods and into the
 * clearing feels continuous. Tiled to roughly the trail's world scale: the
 * trail repeats its texture about every 2 m, the floor is 45 m across.
 */
const GROUND_REPEAT = 20;

export function Floor() {
  const ground = useWoodlandTexture('ground', GROUND_REPEAT, GROUND_REPEAT);
  const stone = useStoneTexture(3, 3);

  return (
    <>
      {/* Forest ground, as on the trail */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[FLOOR_RADIUS, 96]} />
        <meshStandardMaterial
          map={ground}
          bumpMap={ground}
          bumpScale={0.055}
          color="#ddc8a3"
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Earth mass beneath */}
      <mesh position={[0, -0.24, 0]} receiveShadow>
        <cylinderGeometry args={[FLOOR_RADIUS + 0.05, FLOOR_RADIUS + 0.25, 0.32, 96]} />
        <meshStandardMaterial color="#1f1a12" roughness={1} metalness={0} />
      </mesh>

      {/* Raised central dais — one carved piece in the same stone as the archways */}
      <mesh position={[0, DAIS_HEIGHT / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[DAIS_RADIUS, DAIS_RADIUS + 0.12, DAIS_HEIGHT, 96]} />
        <meshStandardMaterial
          map={stone ?? undefined}
          bumpMap={stone ?? undefined}
          bumpScale={1.2}
          color="#5f6a55"
          roughness={0.92}
          metalness={0.02}
        />
      </mesh>

      {/* Engraved inset ring on the dais top */}
      <mesh
        position={[0, DAIS_HEIGHT + 0.002, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[DAIS_RADIUS - 0.55, DAIS_RADIUS - 0.48, 96]} />
        <meshStandardMaterial color="#0c0f0a" roughness={1} metalness={0} />
      </mesh>

      {/* Warm pool of light resting on the dais — where the tree will live */}
      <mesh
        position={[0, DAIS_HEIGHT + 0.006, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[DAIS_RADIUS - 0.7, 64]} />
        <meshBasicMaterial
          color="#85714a"
          transparent
          opacity={0.14}
          toneMapped={false}
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>
    </>
  );
}
