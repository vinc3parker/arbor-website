'use client';

import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Floor } from '../room/Floor';
import { WallBay } from '../room/wallbay/WallBay';
import { BrickWall } from '../room/BrickWall';
import { buildUniforms } from '../room/buildReveal';
import { StarrySky } from './StarrySky';
import { RootRun } from '../room/RootRun';
import { arborApps } from '../data/apps';
import { revealRefs, revealRank } from '../scroll/reveals';
import { heroState, portalReveal, buildLevel } from '../scroll/heroState';
import { DAIS_HEIGHT } from '../room/constants';
import { ObservatoryLights } from './ObservatoryLights';
import { CameraRig } from './CameraRig';
import { Effects } from './Effects';

/**
 * A one-shot flare that marks the build finishing: the central stump flashes,
 * then a bright ring of light races out across the floor. Time-based (not
 * scroll-scrubbed) so it reads as a quick burst, and it only fires when the
 * intro actually completes live — arriving pre-completed (Esc) never triggers
 * it, because progress is already 1 and never crosses the threshold from below.
 */
const PULSE_TRIGGER = 0.85;
const PULSE_SECONDS = 0.9;

function CompletionPulse() {
  const ring = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);
  const startRef = useRef(-1);
  const lastP = useRef(0);
  const primed = useRef(false);

  useFrame(({ clock }) => {
    const p = heroState.progress;
    const now = clock.getElapsedTime();

    if (!primed.current) {
      primed.current = true;
      lastP.current = p;
    } else {
      if (lastP.current < PULSE_TRIGGER && p >= PULSE_TRIGGER && startRef.current < 0) {
        startRef.current = now;
      }
      lastP.current = p;
    }

    const t = startRef.current < 0 ? -1 : (now - startRef.current) / PULSE_SECONDS;
    const show = t >= 0 && t < 1;

    if (ring.current) {
      const ease = t <= 0 ? 0 : t * (2 - t); // easeOut
      // Reach the wall / archways (apothem ≈ 20.5) and stop there, not past it.
      const s = 0.4 + ease * 19;
      ring.current.scale.set(s, s, s);
      ring.current.visible = show;
    }
    if (ringMat.current) ringMat.current.opacity = show ? Math.sin(t * Math.PI) * 0.9 : 0;

    if (glow.current) {
      const g = 1 + Math.max(0, t) * 5;
      glow.current.scale.set(g, g, g);
      glow.current.visible = show;
    }
    if (glowMat.current) {
      glowMat.current.opacity = show ? Math.max(0, 1 - t * 1.7) * 0.85 : 0;
    }
  });

  return (
    <group position={[0, DAIS_HEIGHT + 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={glow} visible={false}>
        <circleGeometry args={[1.4, 48]} />
        <meshBasicMaterial
          ref={glowMat}
          color="#fff3d6"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={ring} visible={false}>
        <ringGeometry args={[0.82, 1.0, 96]} />
        <meshBasicMaterial
          ref={ringMat}
          color="#fff6e2"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** Writes each bay's 0..1 reveal once per frame from the scroll progress. */
function RevealDriver() {
  useFrame(() => {
    const p = heroState.progress;
    for (const app of arborApps) {
      revealRefs.get(app.id)!.value = portalReveal(p, revealRank(app));
    }
    // Raise the brick "build line" as the room assembles from the ground up.
    buildUniforms.uBuild.value = buildLevel(p);
  });
  return null;
}

export function ObservatoryScene() {
  return (
    <>
      <color attach="background" args={["#050608"]} />
      {/* Lets the top of the walls dissolve into darkness overhead; the
          portal shaders ignore fog so the veils stay clear. */}
      <fog attach="fog" args={["#070810", 24, 50]} />

      <RevealDriver />
      <ObservatoryLights />

      <StarrySky />

      <BrickWall />
      {arborApps.map((app) => (
        <WallBay key={app.id} app={app} />
      ))}

      {arborApps.map((app) => (
        <RootRun key={app.id} app={app} revealRef={revealRefs.get(app.id)!} />
      ))}

      <Floor />

      <CompletionPulse />

      <CameraRig />

      <Effects />
    </>
  );
}
