import * as THREE from 'three';
import { useEffect, useState } from 'react';

/**
 * The same bark photo the home journey's trees and roots use, so the roots in
 * the room read as the same living wood. Loaded once (browser only) and cloned
 * per use; returns null until it arrives, so nothing in the room has to wait
 * on it (no Suspense) — roots just pick up their bark a moment later.
 */
let base: Promise<THREE.Texture> | null = null;

function loadBark(): Promise<THREE.Texture> {
  if (!base) {
    base = new THREE.TextureLoader()
      .loadAsync('/images/woodland/golden-bark.webp')
      .then((texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.anisotropy = 8;
        return texture;
      });
  }
  return base;
}

export function useBarkTexture(repeatX = 1, repeatY = 1): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let live = true;
    let clone: THREE.Texture | null = null;
    loadBark()
      .then((loaded) => {
        if (!live) return;
        clone = loaded.clone();
        clone.repeat.set(repeatX, repeatY);
        clone.needsUpdate = true;
        setTexture(clone);
      })
      .catch(() => {
        // Plain bark colour still reads fine without the photo.
      });
    return () => {
      live = false;
      clone?.dispose();
    };
  }, [repeatX, repeatY]);
  return texture;
}
