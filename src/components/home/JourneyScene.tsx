"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import {
  BufferGeometry, CanvasTexture, Color, CylinderGeometry, DoubleSide, ExtrudeGeometry,
  Float32BufferAttribute, InstancedMesh, Object3D, Path, RepeatWrapping,
  Shape, SRGBColorSpace,
} from "three";
import { CAMERA_END, CAMERA_START, JOURNEY_STOPS, roadX } from "./journeyConfig";

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

function surfaceTexture(kind: "bark" | "earth" | "road") {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = kind === "bark" ? 1024 : 256;
  const ctx = canvas.getContext("2d")!;
  const rand = randomSequence(kind === "bark" ? 81 : 47);
  const pixels = ctx.createImageData(canvas.width, canvas.height);
  const base = kind === "bark" ? [92, 69, 48] : kind === "road" ? [160, 145, 111] : [74, 83, 52];
  for (let i = 0; i < pixels.data.length; i += 4) {
    const noise = (rand() - .5) * (kind === "bark" ? 23 : 39);
    pixels.data[i] = base[0] + noise;
    pixels.data[i + 1] = base[1] + noise;
    pixels.data[i + 2] = base[2] + noise;
    pixels.data[i + 3] = 255;
  }
  ctx.putImageData(pixels, 0, 0);
  if (kind === "bark") {
    for (let i = 0; i < 160; i++) {
      const x = rand() * 256;
      ctx.beginPath(); ctx.moveTo(x, -10);
      for (let y = 0; y < 1040; y += 90) ctx.lineTo(x + (rand() - .5) * 10, y);
      ctx.strokeStyle = i % 3 ? "rgba(24,18,12,.24)" : "rgba(191,156,101,.2)";
      ctx.lineWidth = .4 + rand() * 2.7; ctx.stroke();
    }
  } else {
    for (let i = 0; i < 90; i++) {
      ctx.fillStyle = kind === "earth" ? `rgba(123,137,79,${rand() * .16})` : `rgba(225,212,164,${rand() * .2})`;
      ctx.beginPath(); ctx.ellipse(rand() * 256, rand() * 256, rand() * 21 + 2, rand() * 7 + 1, rand() * 6, 0, Math.PI * 2); ctx.fill();
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = texture.wrapT = RepeatWrapping;
  if (kind === "earth") texture.repeat.set(40, 40);
  return texture;
}

function fernTexture() {
  const canvas = document.createElement("canvas"); canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  for (let frond = -2; frond <= 2; frond++) {
    const bend = frond * .29;
    ctx.save(); ctx.translate(256, 495); ctx.rotate(bend);
    ctx.strokeStyle = "#819157"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(12, -190, frond * 10, -370 + Math.abs(frond) * 45); ctx.stroke();
    for (let i = 0; i < 18; i++) {
      const y = -30 - i * 17;
      const width = Math.sin((i + 2) / 21 * Math.PI) * (30 - Math.abs(frond) * 4);
      [-1, 1].forEach(side => {
        ctx.save(); ctx.translate(0, y); ctx.rotate(side * .65);
        ctx.fillStyle = i % 3 ? "#657f46" : "#93a764";
        ctx.beginPath(); ctx.ellipse(side * width * .55, -5, width, 4.4, side * -.3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      });
    }
    ctx.restore();
  }
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace; return texture;
}

function Road() {
  const geometry = useMemo(() => {
    const shape = new BufferGeometry();
    const vertices: number[] = [], uv: number[] = [], indices: number[] = [];
    for (let i = 0; i <= 210; i++) {
      const z = 59 - i * .65;
      const x = roadX(z);
      const width = 2.45 + .6 * (1 - Math.exp(-Math.pow((z + 23) / 11, 2))) + Math.sin(z * 3.1) * .07 + Math.sin(z * 8) * .025;
      vertices.push(x - width, .025, z, x + width, .025, z);
      uv.push(0, i * .12, 1, i * .12);
      if (i < 210) { const n = i * 2; indices.push(n, n + 2, n + 1, n + 1, n + 2, n + 3); }
    }
    shape.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    shape.setAttribute("uv", new Float32BufferAttribute(uv, 2));
    shape.setIndex(indices); shape.computeVertexNormals();
    return shape;
  }, []);
  const texture = useMemo(() => surfaceTexture("road"), []);
  useEffect(() => () => { geometry.dispose(); texture.dispose(); }, [geometry, texture]);
  return <mesh geometry={geometry}><meshStandardMaterial map={texture} color="#d8cdae" roughness={1} side={DoubleSide} /></mesh>;
}

function Forest() {
  const { invalidate } = useThree();
  const trunks = useRef<InstancedMesh>(null);
  const crowns = useRef<InstancedMesh>(null);
  const rocks = useRef<InstancedMesh>(null);
  const plants = useRef<InstancedMesh>(null);
  const bark = useMemo(() => surfaceTexture("bark"), []);
  const earth = useMemo(() => surfaceTexture("earth"), []);
  const fern = useMemo(fernTexture, []);
  const trunkGeometry = useMemo(() => {
    const geometry = new CylinderGeometry(.66, 1, 1, 15, 10);
    const positions = geometry.getAttribute("position");
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
      const angle = Math.atan2(z, x);
      const scale = 1 + Math.sin(angle * 5 + y * 13) * .055 + Math.exp(-(y + .5) * 9) * (.24 + Math.cos(angle * 6) * .17);
      positions.setXYZ(i, x * scale, y, z * scale);
    }
    geometry.computeVertexNormals(); return geometry;
  }, []);
  const trees = useMemo(() => {
    const rand = randomSequence(617);
    return Array.from({ length: 128 }, (_, i) => {
      const z = 61 - Math.floor(i / 2) * 2.15 + (rand() - .5) * 3;
      const side = i % 2 ? 1 : -1;
      const x = roadX(z) + side * (5.5 + rand() * 24);
      return { x, z, height: 18 + rand() * 15, radius: .45 + rand() * .85, green: rand() };
    });
  }, []);
  useEffect(() => {
    const dummy = new Object3D();
    trees.forEach((tree, i) => {
      dummy.position.set(tree.x, tree.height / 2, tree.z);
      dummy.rotation.set(0, i * 2.4, (tree.green - .5) * .045);
      dummy.scale.set(tree.radius, tree.height, tree.radius);
      dummy.updateMatrix(); trunks.current?.setMatrixAt(i, dummy.matrix);
      for (let j = 0; j < 3; j++) {
        dummy.position.set(tree.x + Math.sin(i + j * 2) * 2.4, tree.height - 2 + j * 1.6, tree.z + Math.cos(i + j * 2) * 2.4);
        dummy.rotation.set(0, i, 0); dummy.scale.set(4.5 + tree.green * 2, 3.5, 4.7);
        dummy.updateMatrix(); crowns.current?.setMatrixAt(i * 3 + j, dummy.matrix);
        crowns.current?.setColorAt(i * 3 + j, new Color().setHSL(.22 + tree.green * .035, .18, .17 + tree.green * .11));
      }
    });
    const rand = randomSequence(89);
    for (let i = 0; i < 180; i++) {
      const z = 56 - rand() * 132;
      const x = roadX(z) + (i % 2 ? 1 : -1) * (3.4 + rand() * 12);
      dummy.position.set(x, .06, z); dummy.rotation.set(rand() * 3, rand() * 6, rand() * 3);
      dummy.scale.set(.15 + rand() * .55, .08 + rand() * .2, .2 + rand() * .5);
      dummy.updateMatrix(); rocks.current?.setMatrixAt(i, dummy.matrix);
    }
    for (let i = 0; i < 250; i++) {
      const z = 58 - rand() * 137;
      const x = roadX(z) + (i % 2 ? 1 : -1) * (3.8 + rand() * 8);
      const scale = .6 + rand() * 1.1;
      for (let j = 0; j < 2; j++) {
        dummy.position.set(x, scale * .75, z);
        dummy.rotation.set(0, rand() * Math.PI + j * Math.PI / 2, 0);
        dummy.scale.set(scale, scale, scale); dummy.updateMatrix();
        plants.current?.setMatrixAt(i * 2 + j, dummy.matrix);
      }
    }
    [trunks.current, crowns.current, rocks.current, plants.current].forEach(mesh => { if (mesh) mesh.instanceMatrix.needsUpdate = true; });
    if (crowns.current?.instanceColor) crowns.current.instanceColor.needsUpdate = true;
    invalidate();
  }, [trees, invalidate]);
  useEffect(() => () => { bark.dispose(); earth.dispose(); fern.dispose(); trunkGeometry.dispose(); }, [bark, earth, fern, trunkGeometry]);
  return <>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.015, -10]}><planeGeometry args={[260, 260]} /><meshStandardMaterial map={earth} color="#b0b293" roughness={1} /></mesh>
    <instancedMesh ref={trunks} args={[trunkGeometry, undefined, trees.length]} frustumCulled={false}><meshStandardMaterial map={bark} bumpMap={bark} bumpScale={.16} color="#a08e6e" roughness={1} /></instancedMesh>
    <instancedMesh ref={crowns} args={[undefined, undefined, trees.length * 3]} frustumCulled={false}><sphereGeometry args={[1, 12, 10]} /><meshStandardMaterial roughness={1} /></instancedMesh>
    <instancedMesh ref={rocks} args={[undefined, undefined, 180]} frustumCulled={false}><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color="#626e4d" roughness={1} /></instancedMesh>
    <instancedMesh ref={plants} args={[undefined, undefined, 500]} frustumCulled={false}><planeGeometry args={[2, 1.7]} /><meshStandardMaterial map={fern} alphaTest={.3} side={DoubleSide} roughness={1} /></instancedMesh>
  </>;
}

function TreeDoorway() {
  const geometry = useMemo(() => {
    const outline = new Shape();
    outline.moveTo(-6.4, -1.6); outline.lineTo(6.4, -1.6);
    outline.bezierCurveTo(5.2, 2.1, 4.3, 4.5, 4, 10);
    outline.lineTo(2.9, 34); outline.lineTo(-2.9, 34);
    outline.bezierCurveTo(-3.5, 19, -3.6, 8, -6.4, -1.6);
    const opening = new Path();
    opening.moveTo(-2.6, -.8); opening.lineTo(-2.6, 3.2);
    opening.bezierCurveTo(-2.6, 6.5, 2.6, 6.5, 2.6, 3.2);
    opening.lineTo(2.6, -.8); opening.closePath();
    outline.holes.push(opening);
    return new ExtrudeGeometry(outline, { depth: 7, bevelEnabled: true, bevelSegments: 3, bevelSize: .22, bevelThickness: .22, curveSegments: 28, steps: 1 });
  }, []);
  const bark = useMemo(() => { const t = surfaceTexture("bark"); t.repeat.set(.17, .13); return t; }, []);
  useEffect(() => () => { geometry.dispose(); bark.dispose(); }, [geometry, bark]);
  return <group position={[0, 0, -26]}>
    <mesh geometry={geometry}><meshStandardMaterial map={bark} bumpMap={bark} bumpScale={.18} color="#c2a17b" roughness={1} side={DoubleSide} /></mesh>
    {[-1, 1].map(side => <group key={side}>
      {[0, 1, 2].map(i => <mesh key={i} position={[side * (5 + i * .9), .48, 2.3 + i * 1.1]} rotation={[0, side * (.5 + i * .23), side * -.12]} scale={[1, 1, 2.4]}><sphereGeometry args={[1.3 - i * .18, 12, 9]} /><meshStandardMaterial map={bark} color="#867152" roughness={1} /></mesh>)}
    </group>)}
  </group>;
}

function WoodlandLight() {
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
    for (let i = 0; i < 110; i++) {
      const z = 55 - rand() * 125;
      positions.push(roadX(z) + (rand() - .5) * 12, .8 + rand() * 5, z);
    }
    points.setAttribute("position", new Float32BufferAttribute(positions, 3)); return points;
  }, []);
  const glow = useMemo(() => {
    const canvas = document.createElement("canvas"); canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    const light = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    light.addColorStop(0, "rgba(255,255,255,.85)"); light.addColorStop(.22, "rgba(255,255,255,.45)"); light.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = light; ctx.fillRect(0, 0, 128, 128); return new CanvasTexture(canvas);
  }, []);
  useEffect(() => () => { shaft.dispose(); motes.dispose(); glow.dispose(); }, [shaft, motes, glow]);
  return <>
    {[[ -6, 15, 22, -.28 ], [8, 14, -2, .32], [-8, 16, -35, -.22], [5, 13, -55, .27]].map(([x, y, z, angle], i) => <mesh key={i} position={[x, y, z]} rotation={[0, 0, angle]}><planeGeometry args={[3.3, 31]} /><meshBasicMaterial map={shaft} color="#fff1bf" transparent opacity={.14} depthWrite={false} side={DoubleSide} /></mesh>)}
    <points geometry={motes}><pointsMaterial color="#f4e3b0" size={.055} transparent opacity={.65} depthWrite={false} /></points>
    <mesh position={[3, 9, -100]}><planeGeometry args={[27, 27]} /><meshBasicMaterial map={glow} color="#ffe2a0" transparent opacity={.5} depthWrite={false} fog={false} /></mesh>
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
  const colours = useMemo(() => ({ forest: new Color("#aabda9"), clearing: new Color("#d8cfaf"), mixed: new Color() }), []);
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
  return <Canvas frameloop="demand" dpr={[1, 1.35]} camera={{ fov: 59, near: .12, far: 185, position: [roadX(CAMERA_START), 2.05, CAMERA_START] }} gl={{ antialias: true, powerPreference: "high-performance" }} onCreated={({ gl, invalidate }) => { gl.domElement.addEventListener("webglcontextlost", props.onUnavailable, { once: true }); props.onReady(invalidate); }} fallback={<span>A woodland journey through Arbor.</span>}>
    <color attach="background" args={["#becbb0"]} />
    <fogExp2 attach="fog" args={["#becbb0", .018]} />
    <hemisphereLight args={["#e5e8cf", "#403c2b", 2.1]} />
    <directionalLight color="#ffe4b4" intensity={3.3} position={[-16, 35, -44]} />
    <directionalLight color="#b5c9aa" intensity={.6} position={[10, 12, 35]} />
    <Suspense fallback={null}><Forest /><Road /><TreeDoorway /><WoodlandLight /></Suspense>
    <mesh position={[-15, -.3, -98]} scale={[27, 6, 13]}><sphereGeometry args={[1, 24, 14]} /><meshStandardMaterial color="#80916c" roughness={1} /></mesh>
    <mesh position={[22, 0, -110]} scale={[32, 8, 16]}><sphereGeometry args={[1, 24, 14]} /><meshStandardMaterial color="#8d9a75" roughness={1} /></mesh>
    <mesh position={[3, 9, -101]}><sphereGeometry args={[2.5, 24, 18]} /><meshBasicMaterial color="#f3e5b7" fog={false} /></mesh>
    <JourneyCamera {...props} />
  </Canvas>;
}
