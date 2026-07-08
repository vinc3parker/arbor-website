import * as THREE from 'three';

/**
 * Makes a stone material ASSEMBLE brick-by-brick from the ground up as the
 * visitor scrolls. A shared `uBuild` uniform (0..1) is raised each frame from
 * the scroll progress; every fragment works out which brick it belongs to
 * (world-space row + column), and a brick only draws once the rising "build
 * line" — plus a little per-brick jitter so they don't pop in a clean sweep —
 * has reached it. Applied via onBeforeCompile so the material keeps full PBR
 * lighting, shadows and the brick maps.
 */

/** One shared uniform driven by the scene; every buildable material reads it. */
export const buildUniforms = {
  uBuild: { value: 0 },
};

/** World height the fully-built wall reaches. Bricks/instances map their settle
 *  point against this, so the whole uBuild ramp (0..1) is spent building the
 *  wall course-by-course — no dome above it any more, so this is just the wall
 *  top (previously 40 for the dome apex, which made the wall finish in the
 *  first fraction of the ramp, before it was even visible). */
export const BUILD_TOP = 14.0;
/** World height of one brick course. */
const BRICK_H = 0.62;

/** Shared: carry world position through to the fragment stage. */
function injectWorldPos(shader: THREE.WebGLProgramParametersWithUniforms) {
  shader.uniforms.uBuild = buildUniforms.uBuild;
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', `#include <common>\n varying vec3 vBuildWorld;`)
    .replace(
      '#include <project_vertex>',
      `vec4 buildWorld = modelMatrix * vec4(transformed, 1.0);
      vBuildWorld = buildWorld.xyz;
      #include <project_vertex>`
    );
}

/**
 * Big flat masonry (walls, dome cap, backing): reveals BRICK-BY-BRICK. Each
 * fragment resolves its virtual brick cell (world row + angular column) and the
 * whole cell appears together once the rising build line reaches it.
 */
export function makeBuildable<T extends THREE.Material>(material: T): T {
  material.onBeforeCompile = (shader) => {
    injectWorldPos(shader);
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform float uBuild;
        varying vec3 vBuildWorld;
        float buildHash(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }`
      )
      .replace(
        '#include <clipping_planes_fragment>',
        `#include <clipping_planes_fragment>
        {
          float bRow = floor(vBuildWorld.y / ${BRICK_H.toFixed(3)});
          float ang = atan(vBuildWorld.z, vBuildWorld.x);
          float bCol = floor(ang * 17.0 + bRow * 0.5);
          float jitter = buildHash(vec2(bRow, bCol));
          float settleY = bRow * ${BRICK_H.toFixed(3)} + jitter * ${(BRICK_H * 1.6).toFixed(3)};
          float buildLine = uBuild * ${BUILD_TOP.toFixed(1)};
          if (settleY > buildLine) discard;
        }`
      );
  };
  material.customProgramCacheKey = () => 'arbor-buildable-v1';
  return material;
}

/**
 * Small / carved 3D pieces (arch frames, feet, base course, oculus collar):
 * reveals along a CLEAN rising world-height line, no per-brick grid. The brick
 * grid is unrelated to these meshes' geometry, so it used to cut individual
 * blocks in half mid-build (the clipping glitch at the archway feet). A smooth
 * height cut lets each block rise cleanly into place instead.
 */
export function makeBuildableSmooth<T extends THREE.Material>(
  material: T,
  /** How far (world units) this mesh reveals BELOW the brick line mid-build.
   *  The lag tapers to zero as the build completes, so the mesh trails safely
   *  behind the bricks the whole time (e.g. the dark backing is never seen at
   *  the leading edge) yet still reaches full height at the end. */
  lag = 0
): T {
  material.onBeforeCompile = (shader) => {
    injectWorldPos(shader);
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform float uBuild;
        varying vec3 vBuildWorld;`
      )
      .replace(
        '#include <clipping_planes_fragment>',
        `#include <clipping_planes_fragment>
        float buildLine = uBuild * ${BUILD_TOP.toFixed(1)} - ${lag.toFixed(
          2
        )} * (1.0 - uBuild);
        if (vBuildWorld.y > buildLine) discard;`
      );
  };
  material.customProgramCacheKey = () =>
    'arbor-buildable-smooth-lag-' + lag.toFixed(2);
  return material;
}
