'use client';

import * as THREE from 'three';
import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ArborApp } from '../data/apps';
import type { RevealRef } from '../scroll/reveals';
import { DAIS_RADIUS, WALL_APOTHEM, STATUS_GLOW } from './constants';

interface RootRunProps {
  app: ArborApp;
  revealRef: RevealRef;
}

/**
 * A glowing root running across the floor from the central dais out to the
 * foot of an archway — Arbor reaching from the centre of the room into each
 * of its worlds. Grows tip-first via drawRange as the portal wakes; how far
 * and how brightly it has grown reflects the app's maturity.
 */
export function RootRun({ app, revealRef }: RootRunProps) {
  const geometry = useMemo(() => {
    const theta = (app.angle * Math.PI) / 180;
    const dir = new THREE.Vector2(Math.sin(theta), -Math.cos(theta));
    const perp = new THREE.Vector2(-dir.y, dir.x);

    const r0 = DAIS_RADIUS - 0.4; // starts under the dais lip
    const r1 = WALL_APOTHEM - 0.9; // ends at the foot of the arch
    const seedPhase = app.angle * 0.37;

    const pts: THREE.Vector3[] = [];
    const N = 11;
    for (let k = 0; k <= N; k++) {
      const f = k / N;
      const r = THREE.MathUtils.lerp(r0, r1, f);
      // Organic meander that straightens as it approaches the arch.
      const sway =
        Math.sin(f * Math.PI * 2.15 + seedPhase) * 0.55 * (1 - f * 0.72);
      const x = dir.x * r + perp.x * sway;
      const z = dir.y * r + perp.y * sway;
      // Hugs the floor, with the faintest lift over the slab seams.
      const y = 0.055 + 0.02 * Math.sin(f * Math.PI * 5.0 + seedPhase);
      pts.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
    const geo = new THREE.TubeGeometry(curve, 90, 0.052, 6, false);

    // TubeGeometry radius is constant — taper it by hand toward the tip.
    const pos = geo.getAttribute('position') as THREE.BufferAttribute;
    const spine = curve.getSpacedPoints(90);
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      const seg = Math.min(90, Math.floor(i / 7)); // 6 radial + 1 seam vertex
      const centre = spine[seg];
      v.fromBufferAttribute(pos, i).sub(centre);
      const taper = 1 - 0.68 * Math.pow(seg / 90, 1.4);
      v.multiplyScalar(taper).add(centre);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    pos.needsUpdate = true;
    return geo;
  }, [app.angle]);

  const material = useMemo(() => {
    // Matches the arch roots: LIT bark with only a restrained accent core, so
    // the runner reads as a rounded root, not a flat glowing line.
    return new THREE.MeshStandardMaterial({
      color: '#33281e',
      roughness: 0.82,
      metalness: 0,
      emissive: new THREE.Color(app.colour),
      emissiveIntensity: STATUS_GLOW[app.status] * 0.22,
    });
  }, [app.colour, app.status]);

  useFrame(() => {
    // The runner crosses the floor first; the arch roots continue from
    // there (see Roots). Every status completes the run — maturity shows in
    // how far the ARCH system gets, not whether the root arrives.
    const runner = Math.min(revealRef.value / 0.3, 1);
    const total = geometry.index ? geometry.index.count : 0;
    geometry.setDrawRange(0, Math.floor((total * runner) / 3) * 3);
  });

  return <mesh geometry={geometry} material={material} />;
}
