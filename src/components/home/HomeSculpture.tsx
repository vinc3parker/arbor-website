"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Component, useEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { Curve, Group, Mesh, TubeGeometry, Vector3 } from "three";
import styles from "./HomeNarrative.module.css";

// Eight pieces share one continuous curve. Separating them during the story
// makes the sculpture read as fragments, an open path, and a whole again.
class RibbonCurve extends Curve<Vector3> {
  constructor(private start: number, private end: number) { super(); }
  getPoint(t: number, target = new Vector3()) {
    const angle = (this.start + (this.end - this.start) * t) * Math.PI * 2;
    const radius = 1.75 + .68 * Math.cos(3 * angle);
    return target.set(radius * Math.cos(2 * angle), radius * Math.sin(2 * angle), .82 * Math.sin(3 * angle));
  }
}

const colours = ["#b2c1a4", "#b9d1c4", "#d6bcb0", "#d5c2a9", "#b2b99c", "#d5c1be", "#aabfbd", "#c9ccb5"];
const expansion = [0, .7, .14, -.13, .6, -.06];
const scales = [1, .86, .76, .8, .84, .91];
const rotations = [0, .55, 1.3, 2.2, 3.1, 4.1];
const clamp = (x: number) => Math.min(1, Math.max(0, x));

function Ribbons({ progress }: { progress: RefObject<number> }) {
  const group = useRef<Group>(null);
  const pieces = useRef<Array<Mesh | null>>([]);
  const geometry = useMemo(() => colours.map((_, i) => new TubeGeometry(new RibbonCurve(i / 8 + .002, (i + 1) / 8 - .002), 64, .25, 20, false)), []);
  useEffect(() => () => geometry.forEach(item => item.dispose()), [geometry]);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const p = clamp(progress.current / 5) * 5;
    const i = Math.min(4, Math.floor(p));
    const fraction = p - i;
    const spread = expansion[i] + (expansion[i + 1] - expansion[i]) * fraction;
    const scale = scales[i] + (scales[i + 1] - scales[i]) * fraction;
    const rotation = rotations[i] + (rotations[i + 1] - rotations[i]) * fraction;
    const ease = 1 - Math.exp(-Math.min(delta, .05) * 7);
    group.current.rotation.x += (-.48 + Math.sin(clock.elapsedTime * .12) * .08 - group.current.rotation.x) * ease;
    group.current.rotation.y += (.28 + rotation * .22 - group.current.rotation.y) * ease;
    group.current.rotation.z += (rotation * .17 - .18 - group.current.rotation.z) * ease;
    group.current.position.y = Math.sin(clock.elapsedTime * .4) * .045;
    group.current.scale.setScalar(scale);
    pieces.current.forEach((piece, index) => {
      if (!piece) return;
      const angle = (index / 8) * Math.PI * 2;
      piece.position.set(Math.cos(angle) * spread, Math.sin(angle) * spread, Math.sin(angle * 2) * spread * .35);
      piece.rotation.z = Math.sin(angle) * spread * .11;
    });
  });

  return <group ref={group} rotation={[-.48, .28, -.18]}>{geometry.map((shape, i) => <mesh key={i} geometry={shape} ref={element => { pieces.current[i] = element; }}><meshPhysicalMaterial color={colours[i]} roughness={.29} metalness={.32} clearcoat={.65} clearcoatRoughness={.26} /></mesh>)}</group>;
}

class GraphicBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function HomeSculpture({ progress }: { progress: RefObject<number> }) {
  return <GraphicBoundary><div className={styles.canvas}><Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8.4], fov: 43 }} gl={{ alpha: true, antialias: true, powerPreference: "low-power" }} onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); gl.domElement.closest(`.${styles.sculpture}`)?.setAttribute("data-ready", "true"); }} fallback={<span />}><ambientLight intensity={1.25} /><hemisphereLight args={["#f9fcf2", "#9b9e8e", 2]} /><directionalLight position={[-4, 6, 7]} intensity={4.5} color="#ffffff" /><directionalLight position={[4, -2, 3]} intensity={1.6} color="#e5e4cf" /><directionalLight position={[0, 3, -4]} intensity={3.2} color="#ffffff" /><Ribbons progress={progress} /></Canvas></div></GraphicBoundary>;
}
