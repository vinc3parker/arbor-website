"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import {
  AdditiveBlending, BufferGeometry, CanvasTexture, CatmullRomCurve3, Color, DoubleSide, ExtrudeGeometry,
  Float32BufferAttribute, Path, Shape, TubeGeometry, Vector3,
} from "three";
import { CAMERA_END, CAMERA_START, JOURNEY_STOPS, roadHalfWidth, roadX } from "./journeyConfig";
import { GoldenForest } from "./GoldenForest";
import { useWoodlandTexture } from "./woodlandMaterials";
import { weatherDoorway, weatherRoot } from "./treeGeometry";

type JourneySceneProps = {
  progress: RefObject<number>;
  captions: RefObject<Array<HTMLElement | null>>;
  stage: RefObject<HTMLDivElement | null>;
  animated: boolean;
  onChapter: (chapter: number) => void;
  onReady: (invalidate: () => void) => void;
  onUnavailable: () => void;
};

function randomSequence(seed: number) {
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) | 0; return (seed >>> 0) / 4294967296; };
}


function Road() {
  const geometry = useMemo(() => {
    const shape = new BufferGeometry();
    const vertices: number[] = [], uv: number[] = [], indices: number[] = [];
    for (let i = 0; i <= 210; i++) {
      const z = 59 - i * .65;
      const x = roadX(z);
      const width = roadHalfWidth(z) + Math.sin(z * 3.1) * .05 + Math.sin(z * 8) * .02;
      vertices.push(x - width, .025, z, x + width, .025, z);
      uv.push(0, i * .12, 1, i * .12);
      if (i < 210) { const n = i * 2; indices.push(n, n + 2, n + 1, n + 1, n + 2, n + 3); }
    }
    shape.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    shape.setAttribute("uv", new Float32BufferAttribute(uv, 2));
    shape.setIndex(indices); shape.computeVertexNormals();
    return shape;
  }, []);
  const texture = useWoodlandTexture("ground", 2, 2);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} receiveShadow><meshStandardMaterial map={texture} bumpMap={texture} bumpScale={.055} color="#ddc8a3" roughness={1} side={DoubleSide} /></mesh>;
}


function TreeDoorway() {
  const geometry = useMemo(() => {
    const outline = new Shape();
    outline.moveTo(-6.4, -1.6); outline.lineTo(6.4, -1.6);
    outline.bezierCurveTo(5.2, 2.1, 4.3, 4.5, 4, 10);
    outline.lineTo(2.9, 34); outline.lineTo(-2.9, 34);
    outline.bezierCurveTo(-3.5, 19, -3.6, 8, -6.4, -1.6);
    const opening = new Path();
    opening.moveTo(-2.6, -.8);
    opening.bezierCurveTo(-2.55, .7, -2.8, 1.9, -2.45, 3.5);
    opening.bezierCurveTo(-2.3, 4.8, -1.4, 5.7, -.2, 5.55);
    opening.bezierCurveTo(.9, 5.9, 2.6, 4.85, 2.5, 3.35);
    opening.bezierCurveTo(2.7, 2.2, 2.45, 1.1, 2.65, -.8);
    opening.closePath();
    outline.holes.push(opening);
    const trunk = new ExtrudeGeometry(outline, { depth: 7, bevelEnabled: true, bevelSegments: 4, bevelSize: .28, bevelThickness: .28, curveSegments: 32, steps: 4 });
    const positions = trunk.getAttribute("position"), normals = trunk.getAttribute("normal"), uv = trunk.getAttribute("uv");
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
      // Round the face of the living trunk, and keep bark grain vertical inside the hollow.
      const width = 4 + Math.max(0, 10 - y) * .24;
      const bulge = Math.sqrt(Math.max(0, 1 - Math.pow(x / width, 2))) * 1.7 * Math.max(0, z / 7);
      if (Math.abs(normals.getZ(i)) < .5) uv.setXY(i, z * .6, y);
      positions.setZ(i, z + bulge);
    }
    trunk.computeVertexNormals();
    return weatherDoorway(trunk);
  }, []);
  const bark = useWoodlandTexture("bark", .18, .16);
  const rootBark = useWoodlandTexture("bark", 2, 1, Math.PI / 2);
  const roots = useMemo(() => [-1, 1].flatMap(side => [0, 1, 2, 3].map(i => weatherRoot(new TubeGeometry(new CatmullRomCurve3([
    new Vector3(side * (3.5 + i * .22), 6.5 - i * .7, 6.5 - i * .8),
    new Vector3(side * (3.8 + i * .5), 2.2, 7 - i * .3),
    new Vector3(side * (5.5 + i * .9), .5, 7.2 + i * .5),
    new Vector3(side * (8 + i * 1.2), -.2, 6.6 + i),
  ]), 40, .28 + i * .07, 16, false), i + side * 3))), []);
  useEffect(() => () => { geometry.dispose(); roots.forEach(root => root.dispose()); }, [geometry, roots]);
  return <group position={[0, 0, -26]}>
    <mesh geometry={geometry} castShadow receiveShadow><meshStandardMaterial map={bark} bumpMap={bark} bumpScale={.18} color="#c1ab8f" roughness={1} side={DoubleSide} /></mesh>
    {roots.map((root, i) => <mesh key={i} geometry={root} castShadow receiveShadow><meshStandardMaterial map={rootBark} bumpMap={rootBark} bumpScale={.1} color="#9c9574" roughness={1} /></mesh>)}
  </group>;
}

function WoodlandLight({ animated, progress }: Pick<JourneySceneProps, "animated" | "progress">) {
  const { gl, invalidate } = useThree();
  const atmosphere = useRef({ visible: true, time: 0 });
  const shaft = useMemo(() => {
    const canvas = document.createElement("canvas"); canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    const across = ctx.createLinearGradient(0, 0, 128, 0);
    across.addColorStop(0, "transparent"); across.addColorStop(.5, "#ffffff"); across.addColorStop(1, "transparent");
    ctx.fillStyle = across; ctx.fillRect(0, 0, 128, 128);
    ctx.globalCompositeOperation = "destination-in";
    const down = ctx.createLinearGradient(0, 0, 0, 128);
    down.addColorStop(0, "transparent"); down.addColorStop(.3, "#ffffff"); down.addColorStop(.75, "#ffffff"); down.addColorStop(1, "transparent");
    ctx.fillStyle = down; ctx.fillRect(0, 0, 128, 128);
    return new CanvasTexture(canvas);
  }, []);
  const motes = useMemo(() => {
    const points = new BufferGeometry(), positions: number[] = [], rand = randomSequence(317);
    for (let i = 0; i < 420; i++) {
      const z = 57 - rand() * 135;
      positions.push(roadX(z) + (rand() - .5) * 15, .35 + rand() * 7, z);
    }
    points.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return { geometry: points, base: new Float32Array(positions) };
  }, []);
  const glow = useMemo(() => {
    const canvas = document.createElement("canvas"); canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    const light = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    light.addColorStop(0, "rgba(255,255,255,.85)"); light.addColorStop(.22, "rgba(255,255,255,.45)"); light.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = light; ctx.fillRect(0, 0, 128, 128); return new CanvasTexture(canvas);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      atmosphere.current.visible = entry.isIntersecting;
      if (entry.isIntersecting) invalidate();
    });
    observer.observe(gl.domElement);
    const wake = () => { if (!document.hidden) invalidate(); };
    document.addEventListener("visibilitychange", wake);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", wake); };
  }, [gl, invalidate]);
  useFrame((_, delta) => {
    if (!animated || !atmosphere.current.visible || document.hidden || progress.current < .02 || progress.current > .97) return;
    atmosphere.current.time += Math.min(delta, .05);
    const t = atmosphere.current.time;
    const positions = motes.geometry.getAttribute("position");
    for (let i = 0; i < positions.count; i++) {
      positions.setXYZ(i,
        motes.base[i * 3] + Math.sin(t * .19 + i * 2.1) * .34,
        motes.base[i * 3 + 1] + Math.sin(t * .24 + i * 1.3) * .2,
        motes.base[i * 3 + 2] + Math.cos(t * .13 + i * .7) * .22);
    }
    positions.needsUpdate = true;
    invalidate();
  });
  useEffect(() => () => { shaft.dispose(); motes.geometry.dispose(); glow.dispose(); }, [shaft, motes, glow]);
  return <>
    {[[ -5, 15, 24, -.36 ], [6, 14, -1, -.34], [-5, 16, -35, -.32], [4, 13, -55, -.38]].map(([x, y, z, angle], i) => <mesh key={i} position={[x, y, z]} rotation={[0, 0, angle]}><planeGeometry args={[7, 33]} /><meshBasicMaterial map={shaft} color="#ffe5a7" transparent opacity={.085} blending={AdditiveBlending} depthWrite={false} side={DoubleSide} /></mesh>)}
    <points geometry={motes.geometry} frustumCulled={false}><pointsMaterial map={glow} color="#ffe7b0" size={.095} transparent opacity={.85} alphaTest={.01} blending={AdditiveBlending} depthWrite={false} /></points>
    {[[ -4, .8, 15 ], [5, .65, -12], [-3, .7, -43], [5, .9, -68]].map(([x, y, z], i) => <mesh key={i} position={[x, y, z]}><planeGeometry args={[38, 3.2]} /><meshBasicMaterial map={glow} color="#ede0ba" transparent opacity={.085} depthWrite={false} side={DoubleSide} /></mesh>)}
    <mesh position={[3, 9, -100]}><planeGeometry args={[34, 34]} /><meshBasicMaterial map={glow} color="#ffe2a0" transparent opacity={.65} depthWrite={false} fog={false} /></mesh>
  </>;
}

function smoothRange(value: number, start: number, end: number) {
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
}

function JourneyCamera({ progress, captions, stage, animated, onChapter }: JourneySceneProps) {
  const { camera, scene, invalidate } = useThree();
  const current = useRef<number | null>(null);
  const lastChapter = useRef(-1);
  const colours = useMemo(() => ({ forest: new Color("#d5c69e"), clearing: new Color("#ead7ae"), mixed: new Color() }), []);
  useFrame((_, delta) => {
    const target = animated ? progress.current : 0;
    if (current.current === null) current.current = target;
    current.current += (target - current.current) * (1 - Math.exp(-Math.min(delta, .05) * 13));
    if (Math.abs(target - current.current) < .00003) current.current = target;
    const p = current.current;
    // Share the camera's eased progress so the forest and page surfaces never drift apart.
    const clearing = smoothRange(p, .84, .97);
    stage.current?.style.setProperty("--opening", (1 - smoothRange(p, .015, .14)).toFixed(4));
    stage.current?.style.setProperty("--clearing", clearing.toFixed(4));
    stage.current?.style.setProperty("--clearing-mix", `${(clearing * 100).toFixed(2)}%`);
    const z = CAMERA_START + (CAMERA_END - CAMERA_START) * p;
    const warmth = Math.max(0, Math.min(1, (p - .73) / .19));
    colours.mixed.lerpColors(colours.forest, colours.clearing, warmth * warmth * (3 - 2 * warmth));
    if (scene.background instanceof Color) scene.background.copy(colours.mixed);
    if (scene.fog) scene.fog.color.copy(colours.mixed);
    camera.position.set(roadX(z), 2.05, z);
    camera.lookAt(roadX(z - 11), 1.55, z - 11);
    camera.updateMatrixWorld();
    if (animated) {
      let closest = 0;
      JOURNEY_STOPS.forEach((stop, i) => { if (Math.abs(p - stop) < Math.abs(p - JOURNEY_STOPS[closest])) closest = i; });
      if (lastChapter.current !== closest) { lastChapter.current = closest; onChapter(closest); }
      captions.current.forEach((caption, i) => {
        if (!caption) return;
        const anchorZ = CAMERA_START + (CAMERA_END - CAMERA_START) * JOURNEY_STOPS[i] - 13;
        const distance = z - anchorZ;
        const enter = Math.max(0, Math.min(1, (23 - distance) / 5));
        const exit = Math.max(0, Math.min(1, (distance - 5) / 4));
        // Keep messages still while the camera moves, with no overlapping handoffs.
        const start = i === 0 ? 0 : (JOURNEY_STOPS[i - 1] + JOURNEY_STOPS[i]) / 2;
        const end = i === JOURNEY_STOPS.length - 1 ? 1 : (JOURNEY_STOPS[i] + JOURNEY_STOPS[i + 1]) / 2;
        const fadeIn = i === 0 ? 1 : smoothRange(p, start + .005, start + .035);
        const fadeOut = i === JOURNEY_STOPS.length - 1 ? 1 : 1 - smoothRange(p, end - .035, end - .005);
        const visible = Math.min(enter, exit, fadeIn, fadeOut);
        const opacity = visible * (i === JOURNEY_STOPS.length - 1 ? smoothRange(p, .94, .985) : 1);
        caption.style.opacity = opacity.toFixed(4);
        caption.inert = i !== closest || opacity < .15;
        caption.setAttribute("aria-hidden", String(i !== closest || opacity < .15));
      });
    }
    if (current.current !== target) invalidate();
  });
  return null;
}

export default function JourneyScene(props: JourneySceneProps) {
  return <Canvas shadows frameloop="demand" dpr={[1, 1.35]} camera={{ fov: 59, near: .12, far: 185, position: [roadX(CAMERA_START), 2.05, CAMERA_START] }} gl={{ antialias: true, powerPreference: "high-performance" }} onCreated={({ gl, invalidate }) => { gl.shadowMap.autoUpdate = false; gl.domElement.addEventListener("webglcontextlost", props.onUnavailable, { once: true }); props.onReady(invalidate); }} fallback={<span>A woodland journey through Arbor.</span>}>
    <color attach="background" args={["#d5c69e"]} />
    <fogExp2 attach="fog" args={["#d5c69e", .014]} />
    <hemisphereLight args={["#fff0d2", "#555a35", 2.5]} />
    <directionalLight color="#ffdfa0" intensity={3.8} position={[-22, 45, 8]} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-85} shadow-camera-right={85} shadow-camera-top={85} shadow-camera-bottom={-85} shadow-camera-near={1} shadow-camera-far={170} shadow-bias={-.0002} shadow-normalBias={.05} />
    <directionalLight color="#d1ddc2" intensity={.65} position={[10, 12, 35]} />
    <Suspense fallback={null}><GoldenForest /><Road /><TreeDoorway /><WoodlandLight animated={props.animated} progress={props.progress} /></Suspense>
    <mesh position={[-15, -.3, -98]} scale={[27, 6, 13]}><sphereGeometry args={[1, 24, 14]} /><meshStandardMaterial color="#80916c" roughness={1} /></mesh>
    <mesh position={[22, 0, -110]} scale={[32, 8, 16]}><sphereGeometry args={[1, 24, 14]} /><meshStandardMaterial color="#8d9a75" roughness={1} /></mesh>
    <JourneyCamera {...props} />
  </Canvas>;
}
