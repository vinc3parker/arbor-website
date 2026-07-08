'use client';

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';

export function Effects() {
  return (
    <EffectComposer enableNormalPass={false}>
      {/* Only the HDR portal cores/rims (values > threshold) bloom. */}
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.82}
        luminanceSmoothing={0.2}
        kernelSize={KernelSize.MEDIUM}
        mipmapBlur
      />
      {/* Gentle darkening at the edges to focus the eye on the arches. */}
      <Vignette eskil={false} offset={0.25} darkness={0.75} />
    </EffectComposer>
  );
}
