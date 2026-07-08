'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PortalSurface } from './PortalSurface';
import { heroState, portalGlow } from '../../scroll/heroState';
import type { ArborApp } from '../../data/apps';
import type { RevealRef } from '../../scroll/reveals';

interface PortalProps {
  app: ArborApp;
  revealRef: RevealRef;
}

/**
 * The luminous veil recessed into the wall's thickness, plus the restrained
 * accent light it spills onto the stone. Hover raises the info card; click
 * begins the dolly-and-fade into the app's own page.
 */
export function Portal({ app, revealRef }: PortalProps) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (lightRef.current) {
      // Spill matches the veil: it only lights once the roots are climbing.
      const r = portalGlow(revealRef.value);
      const hovered = heroState.hovered?.id === app.id;
      lightRef.current.intensity = r * (hovered ? 4.2 : 2.6);
    }
  });

  // No hover cards while the intro animation is still scrolling — only once it
  // has finished (progress ≈ 1) and the room is fully awake. On mobile the
  // CameraRig drives selection by orbit + tap, so pointer hover/click is off.
  const interactive = () =>
    !heroState.isMobile &&
    revealRef.value > 0.6 &&
    heroState.progress > 0.98 &&
    !heroState.transition;

  return (
    <group>
      <PortalSurface
        color={app.colour}
        seed={app.angle}
        revealRef={revealRef}
        position={[0, 0.06, -0.35]}
        appId={app.id}
      />

      {/* Invisible hit surface across the opening for hover / click */}
      <mesh
        position={[0, 0, 0.1]}
        visible={false}
        onPointerOver={(e) => {
          if (!interactive()) return;
          e.stopPropagation();
          heroState.setHovered?.(app);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          if (heroState.isMobile) return; // camera drives selection on mobile
          if (heroState.hovered?.id === app.id) heroState.setHovered?.(null);
          document.body.style.cursor = '';
        }}
        onClick={(e) => {
          if (!interactive()) return;
          e.stopPropagation();
          heroState.select?.(app);
          document.body.style.cursor = '';
        }}
      >
        <planeGeometry args={[2.1, 6.1]} />
      </mesh>

      {/* Coloured spill onto the reveal and nearby floor */}
      <pointLight
        ref={lightRef}
        position={[0, -0.6, 0.9]}
        color={app.colour}
        intensity={0}
        distance={11}
        decay={2}
      />
    </group>
  );
}
