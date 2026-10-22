import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { BufferGeometry, Color, DoubleSide, Float32BufferAttribute, InstancedMesh, Object3D, Vector3 } from "three";
import { CAMERA_START, roadHalfWidth, roadX } from "./journeyConfig";
import { makeBarkSampler, useWoodlandTexture } from "./woodlandMaterials";
import { makeBranch, makeTrunk } from "./treeGeometry";

function sequence(seed: number) {
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) | 0; return (seed >>> 0) / 4294967296; };
}

function grassTuft() {
  const geometry = new BufferGeometry();
  const positions: number[] = [], colours: number[] = [];
  const rand = sequence(343);
  for (let blade = 0; blade < 9; blade++) {
    const angle = rand() * Math.PI * 2;
    const height = .18 + rand() * .55;
    const width = .013 + rand() * .015;
    const bend = .1 + rand() * .3;
    for (let part = 0; part < 3; part++) {
      const low = part / 3, high = (part + 1) / 3;
      const points = [[low, -1], [low, 1], [high, -1], [low, 1], [high, 1], [high, -1]];
      for (const [t, edge] of points) {
        const sideways = edge * width * (1 - t);
        positions.push(Math.cos(angle) * bend * t * t + Math.sin(angle) * sideways, height * t, Math.sin(angle) * bend * t * t + Math.cos(angle) * sideways);
        const shade = new Color().setHSL(.21 + blade * .003, .4, .1 + t * .13);
        colours.push(shade.r, shade.g, shade.b);
      }
    }
  }
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new Float32BufferAttribute(colours, 3));
  geometry.computeVertexNormals();
  return geometry;
}

export function GoldenForest() {
  const { gl, invalidate } = useThree();
  const trunks = useRef<Array<InstancedMesh | null>>([]);
  const branches = useRef<InstancedMesh>(null);
  const crowns = useRef<InstancedMesh>(null), shrubs = useRef<InstancedMesh>(null);
  const grasses = useRef<InstancedMesh>(null), rocks = useRef<InstancedMesh>(null);
  const bark = useWoodlandTexture("bark", 2, 6);
  const ground = useWoodlandTexture("ground", 90, 90);
  const leaves = useWoodlandTexture("leaves");
  const grass = useMemo(grassTuft, []);
  const sampler = useMemo(() => makeBarkSampler(bark), [bark]);
  const trunkShapes = useMemo(() => [1, 2, 3, 4].map(seed => makeTrunk(seed, sampler)), [sampler]);
  const branchShape = useMemo(() => makeBranch(2, sampler), [sampler]);
  const trees = useMemo(() => {
    const rand = sequence(617);
    return Array.from({ length: 128 }, (_, i) => {
      const z = CAMERA_START + 15 - Math.floor(i / 2) * 1.65 + (rand() - .5) * 2.5;
      const side = i % 2 ? 1 : -1;
      const distance = i % 4 < 2 ? 4.4 + rand() * 3.6 : 9 + rand() * 12;
      return { x: roadX(z) + side * distance, z, height: 16 + rand() * 13, radius: .55 + rand() * .85, variation: rand() };
    });
  }, []);

  useEffect(() => {
    const dummy = new Object3D(), up = new Vector3(0, 1, 0), direction = new Vector3();
    const rand = sequence(584), tint = new Color();
    trees.forEach((tree, i) => {
      dummy.position.set(tree.x, tree.height / 2, tree.z);
      dummy.rotation.set(0, i * 2.4, (tree.variation - .5) * .08);
      dummy.scale.set(tree.radius, tree.height, tree.radius);
      dummy.updateMatrix();
      const trunk = trunks.current[i % 4], instance = Math.floor(i / 4);
      trunk?.setMatrixAt(instance, dummy.matrix);
      trunk?.setColorAt(instance, tint.setHSL(.09, .1, .68 + rand() * .18));
      for (let j = 0; j < 4; j++) {
        const angle = i * 2.4 + j * 1.7;
        direction.set(Math.cos(angle) * (3 + rand() * 2), 2 + rand() * 3, Math.sin(angle) * (3 + rand() * 2));
        dummy.position.set(tree.x + direction.x / 2, 5.5 + j * 2.2 + direction.y / 2, tree.z + direction.z / 2);
        const length = direction.length();
        dummy.quaternion.setFromUnitVectors(up, direction.normalize());
        dummy.scale.set(tree.radius, length, tree.radius);
        dummy.updateMatrix(); branches.current?.setMatrixAt(i * 4 + j, dummy.matrix);
      }
      for (let j = 0; j < 16; j++) {
        const angle = rand() * Math.PI * 2, radius = 1.5 + rand() * 4;
        const height = j < 4 ? 8.5 + rand() * 3.5 : tree.height * .67 + rand() * 5;
        dummy.position.set(tree.x + Math.cos(angle) * radius, height, tree.z + Math.sin(angle) * radius);
        dummy.rotation.set((rand() - .5) * 1.9, angle, (rand() - .5) * .9);
        dummy.scale.set(3 + rand() * 2.8, 2 + rand() * 1.8, 1);
        dummy.updateMatrix(); crowns.current?.setMatrixAt(i * 16 + j, dummy.matrix);
        crowns.current?.setColorAt(i * 16 + j, tint.setHSL(.15, .1, .65 + rand() * .2));
      }
    });
    for (let i = 0; i < 480; i++) {
      const z = CAMERA_START + 13 - rand() * 105;
      const x = roadX(z) + (i % 2 ? 1 : -1) * (roadHalfWidth(z) + .5 + rand() * 7);
      const scale = .45 + rand() * .7;
      dummy.position.set(x, scale * .48, z);
      dummy.rotation.set((rand() - .5) * .6, rand() * 6.28, (rand() - .5) * .35);
      dummy.scale.set(scale * 1.6, scale, 1);
      dummy.updateMatrix(); shrubs.current?.setMatrixAt(i, dummy.matrix);
      shrubs.current?.setColorAt(i, tint.setHSL(.18, .12, .6 + rand() * .15));
    }
    for (let i = 0; i < 2600; i++) {
      const z = CAMERA_START + 14 - rand() * 105;
      const x = roadX(z) + (i % 2 ? 1 : -1) * (roadHalfWidth(z) + .08 + Math.pow(rand(), 1.8) * 6);
      dummy.position.set(x, -.01, z); dummy.rotation.set(0, rand() * 6.28, 0);
      const scale = .3 + rand() * .7;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix(); grasses.current?.setMatrixAt(i, dummy.matrix);
    }
    for (let i = 0; i < 240; i++) {
      const z = CAMERA_START + 12 - rand() * 104;
      const x = roadX(z) + (i % 2 ? 1 : -1) * (roadHalfWidth(z) + .25 + rand() * 7);
      dummy.position.set(x, .02, z); dummy.rotation.set(rand() * 3, rand() * 6, rand() * 3);
      dummy.scale.set(.15 + rand() * .6, .08 + rand() * .25, .2 + rand() * .7);
      dummy.updateMatrix(); rocks.current?.setMatrixAt(i, dummy.matrix);
      rocks.current?.setColorAt(i, tint.setHSL(.15 + rand() * .05, .14, .24 + rand() * .12));
    }
    [...trunks.current, branches.current, crowns.current, shrubs.current, grasses.current, rocks.current].forEach(mesh => {
      if (!mesh) return;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    });
    gl.shadowMap.needsUpdate = true;
    invalidate();
  }, [trees, gl, invalidate, trunkShapes, branchShape]);
  useEffect(() => () => { trunkShapes.forEach(shape => shape.dispose()); branchShape.dispose(); grass.dispose(); }, [trunkShapes, branchShape, grass]);

  return <>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.02, -10]} receiveShadow><planeGeometry args={[260, 260]} /><meshStandardMaterial map={ground} color="#85845d" roughness={1} /></mesh>
    {trunkShapes.map((shape, index) => <instancedMesh key={index} ref={mesh => { trunks.current[index] = mesh; }} args={[shape, undefined, 32]} frustumCulled={false} castShadow receiveShadow><meshStandardMaterial map={bark} bumpMap={bark} bumpScale={.12} roughness={1} /></instancedMesh>)}
    <instancedMesh ref={branches} args={[branchShape, undefined, 512]} frustumCulled={false} castShadow><meshStandardMaterial map={bark} bumpMap={bark} bumpScale={.08} color="#a79b81" roughness={1} /></instancedMesh>
    <instancedMesh ref={crowns} args={[undefined, undefined, 2048]} frustumCulled={false} castShadow><planeGeometry args={[2.2, 1.5]} /><meshStandardMaterial map={leaves} alphaTest={.65} side={DoubleSide} roughness={.95} /></instancedMesh>
    <instancedMesh ref={shrubs} args={[undefined, undefined, 480]} frustumCulled={false} receiveShadow><planeGeometry args={[2.2, 1.5]} /><meshStandardMaterial map={leaves} alphaTest={.65} side={DoubleSide} roughness={1} /></instancedMesh>
    <instancedMesh ref={grasses} args={[grass, undefined, 2600]} frustumCulled={false} receiveShadow><meshStandardMaterial vertexColors side={DoubleSide} roughness={1} /></instancedMesh>
    <instancedMesh ref={rocks} args={[undefined, undefined, 240]} frustumCulled={false} receiveShadow><icosahedronGeometry args={[1, 2]} /><meshStandardMaterial map={ground} roughness={1} /></instancedMesh>
  </>;
}
