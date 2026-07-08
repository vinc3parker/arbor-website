import * as THREE from 'three';
import type { ArborApp } from '../../data/apps';
import { StoneFrame } from './StoneFrame/StoneFrame';
import { Portal } from './Portal';
import { Roots } from './Roots';
import { Leaves } from './Leaves';
import { Flowers } from './Flowers';
import { Glyphs } from './Glyphs';
import { makeParabolicArchShape } from './archShape';
import { makeBuildableSmooth } from '../buildReveal';
import { revealFor } from '../../scroll/reveals';
import { BAY_SCALE, WALL_APOTHEM, BAY_ORIGIN_Y } from '../constants';

/**
 * A dark "spandrel" — the wall immediately around each arch, with the opening
 * cut out. It is a CHILD of the bay (so it is exactly coplanar with the stone
 * and moves with it: zero parallax however obliquely the outer arches are
 * viewed). This is what actually frames the opening: it hides the far backing
 * shell's hole edge and fills any sliver between the stone and the bricks, so
 * no background ever shows at the outside edge of an archway. The opening cut
 * is a touch larger than the stone's inner opening, so the spandrel tucks
 * behind the stone and never intrudes into the clear portal.
 */
const spandrelShape = (() => {
  const s = new THREE.Shape();
  // Wide enough to reach past the widest strip of removed bricks beside the
  // arch (bricks can't butt right up to the stone or they'd poke through it),
  // but not so wide it reaches the neighbouring bay's opening.
  s.moveTo(-2.15, -3.5);
  s.lineTo(2.15, -3.5);
  s.lineTo(2.15, 3.9);
  s.lineTo(-2.15, 3.9);
  s.closePath();
  s.holes.push(makeParabolicArchShape(2.06, 6.34)); // half 1.03 × 3.17
  return s;
})();
const spandrelGeometry = new THREE.ShapeGeometry(spandrelShape, 80);
// A dark MASONRY tone (not near-black): where a sliver of removed bricks would
// otherwise show a void beside the arch, this reads as shadowed wall instead of
// a hole, while still hiding the backing's hole edge behind the stone. It is
// BUILDABLE — it rises with the brickwork (trailing just behind, lag tapering
// to zero) so at the start there's only the stone archway, and it fills in as
// the wall goes up rather than sitting there from the first frame.
const spandrelMaterial = makeBuildableSmooth(
  new THREE.MeshStandardMaterial({
    color: '#3a342b',
    roughness: 1,
    metalness: 0,
    side: THREE.DoubleSide,
  }),
  1.5
);

export interface WallBayProps {
  app: ArborApp;
}

/**
 * One bay of the curved observatory wall: a thick stone panel with the arch
 * cut through it, the slender stone surround, the luminous veil, and the
 * glowing roots that have climbed as far as the app has grown.
 */
export function WallBay({ app }: WallBayProps) {
  const radians = (app.angle * Math.PI) / 180;
  const revealRef = revealFor(app);

  const x = Math.sin(radians) * WALL_APOTHEM;
  const z = -Math.cos(radians) * WALL_APOTHEM;

  return (
    <group
      position={[x, BAY_ORIGIN_Y, z]}
      rotation={[0, -radians, 0]}
      scale={BAY_SCALE}
    >
      {/* Coplanar dark frame around the opening — sits just behind the stone. */}
      <mesh
        geometry={spandrelGeometry}
        material={spandrelMaterial}
        position={[0, 0, -0.2]}
      />

      <StoneFrame />

      <Glyphs
        color={app.colour}
        status={app.status}
        seed={app.angle + 211}
        revealRef={revealRef}
      />

      <Roots
        color={app.colour}
        status={app.status}
        seed={app.angle + 137}
        revealRef={revealRef}
      />

      <Leaves
        color={app.colour}
        status={app.status}
        seed={app.angle + 59}
        revealRef={revealRef}
      />

      <Flowers
        color={app.colour}
        status={app.status}
        seed={app.angle + 83}
        revealRef={revealRef}
      />

      <Portal app={app} revealRef={revealRef} />
    </group>
  );
}
