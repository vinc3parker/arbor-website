// Chapter positions are places along the road, not evenly spaced slide changes.
export const JOURNEY_STOPS = [0, 17 / 87, 34 / 87, 48 / 87, 59 / 87, 1];
export const CAMERA_START = 46;
export const CAMERA_END = -41;

export function roadX(z: number) {
  // The road straightens through the tree opening at z=-19 ... -26.
  const opening = 1 - Math.exp(-Math.pow((z + 23) / 10, 2));
  return Math.sin((z + 20) * .095) * 2.4 * opening;
}
