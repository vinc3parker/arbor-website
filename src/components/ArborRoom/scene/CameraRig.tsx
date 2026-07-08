'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { heroState } from '../scroll/heroState';
import { arborApps } from '../data/apps';
import { WALL_APOTHEM, BAY_ORIGIN_Y } from '../room/constants';

const DRAG_SENSITIVITY = 0.0016;
const YAW_LIMIT = 0.3;
const ORBIT_SENSITIVITY = 0.0042;
const ORBIT_LIMIT = (56 * Math.PI) / 180;
const SETTLE_RATE = 2.4;
const TRANSITION_SECONDS = 1.15;
const TAP_SLOP = 9;

const smooth = (t: number) => {
  const c = Math.min(Math.max(t, 0), 1);
  return c * c * (3 - 2 * c);
};

/** The portal whose bay angle is nearest the current view angle. */
function frontApp(angleRad: number) {
  const deg = (angleRad * 180) / Math.PI;
  let best = arborApps[0];
  let bestD = Infinity;
  for (const a of arborApps) {
    const d = Math.abs(a.angle - deg);
    if (d < bestD) {
      bestD = d;
      best = a;
    }
  }
  return best;
}

/**
 * The viewer stands on the open side of the room, looking across the floor at
 * the wall of portals.
 *
 * Desktop: scroll eases forward as the room wakes; drag glances along the wall;
 * hovering a portal raises its card; clicking dollies through it.
 *
 * Mobile: once built, horizontal drag ORBITS the room (clamped so you can bring
 * the outermost portals to centre); whichever portal is centred carries the
 * info, and a tap enters it.
 */
export function CameraRig() {
  const { camera, gl } = useThree();

  const yaw = useRef(0);
  const targetYaw = useRef(0);
  const orbit = useRef(0);
  const targetOrbit = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const travel = useRef(0);
  const isMobile = useRef(false);
  const lastFrontId = useRef<string | null>(null);
  const dolly = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());

  useEffect(() => {
    isMobile.current = window.matchMedia(
      '(pointer: coarse), (max-width: 768px)'
    ).matches;
    heroState.isMobile = isMobile.current;

    const el = gl.domElement;

    const onDown = (e: PointerEvent) => {
      dragging.current = true;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      travel.current = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      const dy = e.clientY - lastY.current;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      travel.current += Math.hypot(dx, dy);
      if (isMobile.current) {
        targetOrbit.current = THREE.MathUtils.clamp(
          targetOrbit.current - dx * ORBIT_SENSITIVITY,
          -ORBIT_LIMIT,
          ORBIT_LIMIT
        );
      } else {
        targetYaw.current = THREE.MathUtils.clamp(
          targetYaw.current - dx * DRAG_SENSITIVITY,
          -YAW_LIMIT,
          YAW_LIMIT
        );
      }
    };
    const onUp = () => {
      if (
        dragging.current &&
        isMobile.current &&
        travel.current < TAP_SLOP &&
        heroState.progress > 0.98 &&
        !heroState.transition
      ) {
        heroState.select?.(frontApp(orbit.current));
      }
      dragging.current = false;
    };
    const onCancel = () => {
      dragging.current = false;
    };

    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
    };
  }, [gl]);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const p = heroState.progress;
    const wake = smooth(p / 0.45);
    const baseY = 1.95 + 0.35 * wake;
    const baseZ = 16.4 - 2.0 * wake;

    if (isMobile.current) {
      orbit.current +=
        (targetOrbit.current - orbit.current) *
        (1 - Math.exp(-dt * SETTLE_RATE));
      // Stay put and TURN THE HEAD to face each archway (rather than orbiting
      // the whole body around the room). The camera holds its viewing spot; the
      // look direction sweeps across the wall, clamped so the outermost portal
      // sits dead centre when you look fully to that side.
      dolly.current.set(0, baseY, baseZ);
      look.current.set(
        Math.sin(orbit.current) * WALL_APOTHEM,
        4.1,
        -Math.cos(orbit.current) * WALL_APOTHEM
      );

      if (p > 0.98 && !heroState.transition) {
        const front = frontApp(orbit.current);
        if (front.id !== lastFrontId.current) {
          lastFrontId.current = front.id;
          heroState.setHovered?.(front);
        }
      } else if (lastFrontId.current !== null) {
        lastFrontId.current = null;
        heroState.setHovered?.(null);
      }
    } else {
      yaw.current +=
        (targetYaw.current - yaw.current) * (1 - Math.exp(-dt * SETTLE_RATE));
      dolly.current.set(0, baseY, baseZ);
      look.current.set(
        Math.sin(yaw.current) * 20,
        4.1,
        -Math.cos(yaw.current) * 20
      );
    }

    const tr = heroState.transition;
    if (tr) {
      const t = smooth(
        (performance.now() - tr.startedAt) / 1000 / TRANSITION_SECONDS
      );
      const radians = (tr.app.angle * Math.PI) / 180;
      const bx = Math.sin(radians) * WALL_APOTHEM;
      const bz = -Math.cos(radians) * WALL_APOTHEM;
      const dest = new THREE.Vector3(bx, BAY_ORIGIN_Y - 1.2, bz)
        .sub(dolly.current)
        .multiplyScalar(0.72)
        .add(dolly.current);
      dolly.current.lerp(dest, t);
      look.current.lerp(new THREE.Vector3(bx, BAY_ORIGIN_Y, bz), t);
    }

    camera.position.copy(dolly.current);
    camera.lookAt(look.current);
  });

  return null;
}
