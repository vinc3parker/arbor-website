'use client';

import * as THREE from 'three';
import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { ArborApp } from '../data/apps';
import type { RevealRef } from '../scroll/reveals';
import { DAIS_RADIUS, WALL_APOTHEM, STATUS_GLOW, BAY_SCALE, BAY_ORIGIN_Y } from './constants';
import { taperedTube } from './wallbay/rootGeometry';
import { useBarkTexture } from './barkTexture';
import { addRootGlow, updateRootGlow, pulseFor, floorPulseEnd } from './rootGlow';
import { APP_BRANDS } from '@/lib/brand';

interface RootRunProps {
  app: ArborApp;
  revealRef: RevealRef;
}

const R_START = 0.17; // thick where it leaves the central dais
const R_FORK = 0.13; // where it splits toward the two feet of the arch
const R_FOOT = 0.085; // matches the arch roots rising from the feet

/** Bark/pulse length units per world unit (taperedTube's default barkScale). */
const BARK_SCALE = 1.6;

/** A point in an archway's local space (WallBay group) → world space. */
function bayToWorld(angleDeg: number, local: THREE.Vector3): THREE.Vector3 {
  const theta = (angleDeg * Math.PI) / 180;
  const radius = WALL_APOTHEM;
  const v = local.clone().multiplyScalar(BAY_SCALE);
  v.applyAxisAngle(new THREE.Vector3(0, 1, 0), -theta);
  return v.add(new THREE.Vector3(Math.sin(theta) * radius, BAY_ORIGIN_Y, -Math.cos(theta) * radius));
}

/** Arch-local point just in front of each stone foot, where the arch roots
 *  emerge from the ground (see rootGeometry baseWrap / fromGround). */
const FOOT_LOCAL_X = 1.24;
const FOOT_LOCAL_Z = 1.02;
const FLOOR_LOCAL_Y = -3.09;

let contactShadowMaterial: THREE.MeshBasicMaterial | null = null;

/** Shared soft-edged black band: dark under the root, fading at the sides and ends. */
function getContactShadowMaterial(): THREE.MeshBasicMaterial {
  if (contactShadowMaterial) return contactShadowMaterial;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const across = ctx.createLinearGradient(0, 0, 64, 0);
  across.addColorStop(0, 'rgba(0,0,0,0)');
  across.addColorStop(0.5, 'rgba(0,0,0,1)');
  across.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = across;
  ctx.fillRect(0, 0, 64, 64);
  ctx.globalCompositeOperation = 'destination-in';
  const along = ctx.createLinearGradient(0, 0, 0, 64);
  along.addColorStop(0, 'rgba(0,0,0,1)');
  along.addColorStop(0.85, 'rgba(0,0,0,1)');
  along.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = along;
  ctx.fillRect(0, 0, 64, 64);
  contactShadowMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(canvas),
    color: '#000000',
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
  });
  return contactShadowMaterial;
}

/** A flat ribbon on the floor following the root, about three root-widths wide. */
function contactShadowRibbon(
  curve: THREE.CatmullRomCurve3,
  radiusAt: (f: number) => number,
  segs = 100
): THREE.BufferGeometry {
  const position: number[] = [];
  const uv: number[] = [];
  const index: number[] = [];
  for (let i = 0; i <= segs; i++) {
    const f = i / segs;
    const p = curve.getPointAt(f);
    const t = curve.getTangentAt(f);
    const side = new THREE.Vector2(-t.z, t.x).normalize();
    const w = radiusAt(f) * 1.7;
    position.push(p.x + side.x * w, 0.012, p.z + side.y * w, p.x - side.x * w, 0.012, p.z - side.y * w);
    uv.push(0, 1 - f, 1, 1 - f);
    if (i < segs) {
      const n = i * 2;
      index.push(n, n + 1, n + 2, n + 1, n + 3, n + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(index);
  return geo;
}

function seeded(seed: number) {
  let s = Math.round(seed * 1000) | 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) | 0;
    return (s >>> 0) / 4294967296;
  };
}

/**
 * A surface root running across the forest floor from the central dais out
 * to the foot of an archway: Arbor reaching from the centre of the room into
 * each of its worlds. Like a real tree's roots it is thick at the trunk and
 * tapers away, sits half-buried, dips under the soil and breaks the surface
 * again, and throws off a few rootlets that wander off and sink back into the
 * ground. Just before the archway it forks, one branch to each stone foot,
 * so it runs straight into the roots that climb the arch. Bark-textured to
 * match the trees on the home journey, with a glow in the app's colour.
 * Grows tip-first via drawRange as the portal wakes: the main root, then the
 * forks, then the rootlets.
 */
export function RootRun({ app, revealRef }: RootRunProps) {
  const geometry_ = useMemo(() => {
    const rng = seeded(app.angle + 101);
    const theta = (app.angle * Math.PI) / 180;
    const dir = new THREE.Vector2(Math.sin(theta), -Math.cos(theta));
    const perp = new THREE.Vector2(-dir.y, dir.x);
    const r0 = DAIS_RADIUS - 0.5; // starts under the dais lip
    // Forks a little over halfway across, leaving room for a long, natural
    // sweep to each foot of the arch.
    const r1 = THREE.MathUtils.lerp(r0, WALL_APOTHEM, 0.55);
    const phase = app.angle * 0.37;
    const radiusAt = (f: number) => THREE.MathUtils.lerp(R_START, R_FORK, Math.pow(f, 0.8));

    // --- main root -----------------------------------------------------------
    const main: THREE.Vector3[] = [];
    const N = 22;
    for (let k = 0; k <= N; k++) {
      const f = k / N;
      const r = THREE.MathUtils.lerp(r0, r1, f);
      // Organic meander that straightens as it approaches the arch.
      const sway =
        Math.sin(f * Math.PI * 2.15 + phase) * 0.55 * Math.sin(f * Math.PI) +
        Math.sin(f * Math.PI * 7.3 + phase * 2.1) * 0.12;
      const rad = radiusAt(f);
      // Half-buried, with stretches that dive under the soil and resurface.
      const dive = Math.pow(Math.max(0, Math.sin(f * Math.PI * 3.4 + phase)), 3);
      const y = rad * 0.35 - rad * 1.25 * dive * (f > 0.12 && f < 0.75 ? 1 : 0);
      main.push(new THREE.Vector3(dir.x * r + perp.x * sway, y, dir.y * r + perp.y * sway));
    }
    const parts: THREE.BufferGeometry[] = [taperedTube(main, R_START, R_FORK, 120, 16, 0.9)];
    const mainCurve = new THREE.CatmullRomCurve3(main, false, 'catmullrom', 0.5);
    const mainLength = mainCurve.getLength();

    // --- forks: about halfway across, the root splits and each branch grows
    //     in a long, gentle sweep toward one foot of the arch ---------------
    const forkEnd = mainCurve.getPointAt(1);
    const forkTangent = mainCurve.getTangentAt(1);
    const heading = new THREE.Vector3(forkTangent.x, 0, forkTangent.z).normalize();
    const inward = new THREE.Vector3(-dir.x, 0, -dir.y); // from the wall toward the centre
    const forkCurves: THREE.CatmullRomCurve3[] = [];
    let longestFork = 0;
    for (const side of [-1, 1] as const) {
      const foot = bayToWorld(app.angle, new THREE.Vector3(side * FOOT_LOCAL_X, FLOOR_LOCAL_Y, FOOT_LOCAL_Z));
      // Which way is "outward" for this branch, in world space.
      const away = bayToWorld(app.angle, new THREE.Vector3(side * (FOOT_LOCAL_X + 1), FLOOR_LOCAL_Y, FOOT_LOCAL_Z))
        .sub(foot)
        .setY(0)
        .normalize();
      // Cubic sweep: leave along the trunk's heading, splay gently, swing a
      // little wide, and come into the foot from the front.
      const sweep = new THREE.CubicBezierCurve3(
        forkEnd.clone(),
        forkEnd.clone().add(heading.clone().multiplyScalar(2.6)).add(away.clone().multiplyScalar(0.7)),
        foot.clone().add(inward.clone().multiplyScalar(2.4)).add(away.clone().multiplyScalar(1.1)),
        foot.clone()
      );
      const steps = 16;
      const pts: THREE.Vector3[] = [];
      const wobblePhase = phase * 1.7 + side * 2.3;
      for (let k = 0; k <= steps; k++) {
        const f = k / steps;
        const p = sweep.getPoint(f);
        const t = sweep.getTangent(f).setY(0).normalize();
        const lateral = new THREE.Vector3(-t.z, 0, t.x);
        // Natural wander, calm at both ends so it joins cleanly.
        const wander = Math.sin(f * Math.PI * 2.6 + wobblePhase) * 0.32 * Math.sin(f * Math.PI);
        p.add(lateral.multiplyScalar(wander));
        const rad = THREE.MathUtils.lerp(R_FORK * 0.85, R_FOOT, f);
        // Half-buried; one shallow dive mid-way; sinks into the soil at the
        // foot, where the arch roots break out of it.
        const dive = Math.pow(Math.max(0, Math.sin(f * Math.PI * 2 + wobblePhase)), 4) * (f > 0.15 && f < 0.8 ? 1 : 0);
        const sink = Math.pow(Math.max(0, (f - 0.88) / 0.12), 2);
        p.y = rad * 0.35 - rad * 1.1 * dive - rad * 0.95 * sink;
        pts.push(p);
      }
      const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
      forkCurves.push(curve);
      longestFork = Math.max(longestFork, curve.getLength());
      parts.push(taperedTube(pts, R_FORK * 0.85, R_FOOT, 110, 14, 1.2, BARK_SCALE, mainLength));
    }
    floorPulseEnd.set(app.id, (mainLength + longestFork) * BARK_SCALE);

    // --- rootlets: branch off, wander, and sink back into the soil ----------
    const count = 3 + Math.floor(rng() * 2);
    for (let i = 0; i < count; i++) {
      const f = 0.18 + (i / count) * 0.6 + rng() * 0.08;
      const start = mainCurve.getPointAt(f);
      const tangent = mainCurve.getTangentAt(f);
      const side = rng() > 0.5 ? 1 : -1;
      const turn = side * (0.45 + rng() * 0.5);
      const heading = new THREE.Vector2(tangent.x, tangent.z).normalize().rotateAround(new THREE.Vector2(), turn);
      const len = 1.2 + rng() * 2.2;
      const rad = radiusAt(f) * 0.45;
      const pts: THREE.Vector3[] = [];
      const steps = 7;
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const bend = Math.sin(t * Math.PI * 1.4 + rng() * 2) * 0.25 * t;
        const along = heading.clone().multiplyScalar(t * len);
        const sideways = new THREE.Vector2(-heading.y, heading.x).multiplyScalar(bend);
        // Leaves the parent at its surface, then slips under the ground.
        const y = THREE.MathUtils.lerp(Math.max(start.y, rad * 0.4), -rad * 1.6, Math.pow(t, 1.6));
        pts.push(new THREE.Vector3(start.x + along.x + sideways.x, y, start.z + along.y + sideways.y));
      }
      parts.push(taperedTube(pts, rad, rad * 0.25, 36, 7, 1.1, BARK_SCALE, f * mainLength));
    }

    // Main root plus forks grow first; the rootlets follow.
    const trunkIndices = parts.slice(0, 3).reduce((sum, p) => sum + p.index!.count, 0);
    const merged = mergeGeometries(parts) ?? parts[0];
    if (merged !== parts[0]) parts.forEach((p) => p.dispose());

    // --- contact shadow: a soft dark band on the soil beneath root and forks --
    const shadowParts = [
      contactShadowRibbon(mainCurve, radiusAt),
      ...forkCurves.map((c) => contactShadowRibbon(c, (f) => THREE.MathUtils.lerp(R_FORK * 0.82, R_FOOT, f), 40)),
    ];
    const shadow = mergeGeometries(shadowParts) ?? shadowParts[0];
    if (shadow !== shadowParts[0]) shadowParts.forEach((p) => p.dispose());

    // Share of the merged draw range the main root and forks take.
    const mainShare = trunkIndices / merged.index!.count;
    return { roots: merged, shadow, mainShare };
  }, [app.angle, app.id]);
  const { roots: geometry, shadow, mainShare } = geometry_;

  useEffect(() => () => {
    geometry.dispose();
    shadow.dispose();
  }, [geometry, shadow]);

  const bark = useBarkTexture(1, 1);

  const material = useMemo(() => {
    // LIT bark; the app-colour glow is layered on below.
    return new THREE.MeshStandardMaterial({
      color: bark ? '#c4b093' : '#4a3a2a',
      map: bark,
      bumpMap: bark,
      bumpScale: 1.4,
      roughness: 0.95,
      metalness: 0,
    });
  }, [bark]);

  // Rim glow and pulses flowing out from the centre, in the app's on-dark
  // colour (Wend, Telos and Sage leads are too dark to glow).
  const glow = useMemo(
    () => addRootGlow(material, APP_BRANDS[app.id].onInk, STATUS_GLOW[app.status] * 0.4, pulseFor(app.id)),
    [material, app.id, app.status]
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ clock }) => {
    // The runner crosses the floor first; the arch roots continue from
    // there (see Roots). Every status completes the run — maturity shows in
    // how far the ARCH system gets, not whether the root arrives.
    const runner = Math.min(revealRef.value / 0.3, 1);
    updateRootGlow(glow, material, runner, clock.getElapsedTime());
    const total = geometry.index ? geometry.index.count : 0;
    geometry.setDrawRange(0, Math.floor((total * runner) / 3) * 3);
    // The shadow band keeps pace with the main root, which grows first.
    const shadowTotal = shadow.index ? shadow.index.count : 0;
    shadow.setDrawRange(0, Math.floor((shadowTotal * Math.min(runner / mainShare, 1)) / 6) * 6);
  });

  return (
    <>
      <mesh geometry={shadow} material={getContactShadowMaterial()} renderOrder={1} />
      <mesh geometry={geometry} material={material} castShadow receiveShadow />
    </>
  );
}
