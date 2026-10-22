import { BufferGeometry, CylinderGeometry, Float32BufferAttribute, TubeGeometry, Vector3 } from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

export type BarkSampler = (u: number, v: number) => number;

// Physical relief is deliberately shallow: silhouette, bark plates and light/shade,
// rather than a spiky or flat-shaded low-poly approximation of a tree.
export function makeTrunk(seed: number, sample: BarkSampler) {
  const geometry = new CylinderGeometry(.43, 1, 1, 64, 84);
  const positions = geometry.getAttribute("position"), uv = geometry.getAttribute("uv");
  const phase = seed * 1.73;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
    const t = y + .5, radius = Math.hypot(x, z), angle = Math.atan2(z, x);
    const bendX = (.25 * Math.sin(t * 4.3 + phase) + .08 * Math.sin(t * 11 + phase)) * t;
    const bendZ = .2 * Math.sin(t * 3.7 + phase * .7) * t;
    if (radius < .00001) { positions.setXYZ(i, bendX, y, bendZ); continue; }
    const buttress = Math.exp(-t * 15) * (.48 + .34 * Math.cos(angle * 5 + phase));
    const flutes = .075 * Math.sin(angle * 5 + Math.sin(t * 8 + phase)) + .045 * Math.sin(angle * 9 - t * 5 + phase);
    const knot = .13 * Math.exp(-Math.pow((t - .23 - seed * .035) / .055, 2)) * Math.pow(Math.max(0, Math.cos(angle - phase)), 5);
    const plates = (sample(uv.getX(i), uv.getY(i)) - .45) * .15;
    const ridges = .015 * Math.sin(angle * 23 + Math.sin(t * 33 + phase));
    const roughRadius = Math.max(.1, radius * (1 + buttress + flutes + knot) + plates + ridges);
    positions.setXYZ(i, Math.cos(angle) * roughRadius + bendX, y, Math.sin(angle) * roughRadius + bendZ);
  }
  const result = mergeVertices(geometry, .00001);
  result.computeVertexNormals();
  result.computeBoundingBox();
  geometry.dispose();
  return result;
}

export function makeBranch(seed: number, sample: BarkSampler) {
  const geometry = new CylinderGeometry(.025, .3, 1, 24, 32);
  const positions = geometry.getAttribute("position"), uv = geometry.getAttribute("uv");
  const phase = seed * 1.37;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
    const t = y + .5, radius = Math.hypot(x, z), angle = Math.atan2(z, x);
    const bendX = Math.sin(t * Math.PI) * (.28 + seed * .06);
    const bendZ = Math.sin(t * Math.PI * 2) * .1 * Math.cos(phase);
    const relief = (sample(uv.getX(i), uv.getY(i)) - .45) * .045 * (1 - t * .75);
    const knot = .06 * Math.exp(-Math.pow((t - .32 - seed * .07) / .09, 2));
    const roughRadius = radius < .00001 ? 0 : Math.max(.012, radius * (1 + .12 * Math.sin(angle * 7 + t * 11 + phase)) + relief + knot);
    positions.setXYZ(i, Math.cos(angle) * roughRadius + bendX, y, Math.sin(angle) * roughRadius + bendZ);
  }
  geometry.computeVertexNormals();
  return geometry;
}

export function weatherRoot(geometry: TubeGeometry, seed: number) {
  const positions = geometry.getAttribute("position"), uv = geometry.getAttribute("uv");
  const centre = new Vector3();
  for (let i = 0; i < positions.count; i++) {
    const t = uv.getX(i), angle = uv.getY(i) * Math.PI * 2;
    geometry.parameters.path.getPointAt(t, centre);
    const taper = .1 + Math.pow(1 - t, .75);
    const grain = 1 + .11 * Math.sin(angle * 7 + t * 23 + seed) + .06 * Math.sin(angle * 13 - t * 41);
    positions.setXYZ(i,
      centre.x + (positions.getX(i) - centre.x) * taper * grain,
      centre.y + (positions.getY(i) - centre.y) * taper * grain,
      centre.z + (positions.getZ(i) - centre.z) * taper * grain);
  }
  geometry.computeVertexNormals();
  return geometry;
}

// Split long edges before adding relief, so the doorway's broad faces are not
// smooth planes with a picture of bark. Shared positions use the same field.
export function weatherDoorway(original: BufferGeometry) {
  const source = original.index ? original.toNonIndexed() : original;
  const p = source.getAttribute("position"), uv = source.getAttribute("uv");
  const vertices: number[] = [], coords: number[] = [];
  type Vertex = [number, number, number, number, number];
  const midpoint = (a: Vertex, b: Vertex): Vertex => a.map((v, i) => (v + b[i]) / 2) as Vertex;
  const distance = (a: Vertex, b: Vertex) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
  const emit = (a: Vertex, b: Vertex, c: Vertex, depth: number) => {
    const lengths = [distance(a, b), distance(b, c), distance(c, a)];
    const limit = Math.min(a[1], b[1], c[1]) > 12 ? 1.2 : .36;
    const longest = Math.max(...lengths);
    if (longest > limit * limit && depth < 16) {
      const edge = lengths.indexOf(longest);
      if (edge === 0) { const m = midpoint(a, b); emit(a, m, c, depth + 1); emit(m, b, c, depth + 1); }
      else if (edge === 1) { const m = midpoint(b, c); emit(a, b, m, depth + 1); emit(a, m, c, depth + 1); }
      else { const m = midpoint(c, a); emit(a, b, m, depth + 1); emit(m, b, c, depth + 1); }
      return;
    }
    for (const vertex of [a, b, c]) {
      const [x, y, z, u, v] = vertex;
      const angle = Math.atan2(z - 3.5, x);
      const grooves = .065 * Math.sin(angle * 49 + Math.sin(y * 1.3)) + .025 * Math.sin(angle * 91 + y * 4.7);
      const burls = .085 * Math.sin(x * 1.7 + Math.sin(y * .8)) * Math.sin(y * 1.4 + z * .7);
      vertices.push(x + Math.cos(angle) * (grooves + burls), y, z + Math.sin(angle) * (grooves + burls));
      coords.push(u, v);
    }
  };
  const read = (i: number): Vertex => [p.getX(i), p.getY(i), p.getZ(i), uv.getX(i), uv.getY(i)];
  for (let i = 0; i < p.count; i += 3) emit(read(i), read(i + 1), read(i + 2), 0);
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(coords, 2));
  const result = mergeVertices(geometry, .00001);
  result.computeVertexNormals();
  result.computeBoundingBox();
  geometry.dispose();
  if (source !== original) source.dispose();
  original.dispose();
  return result;
}
