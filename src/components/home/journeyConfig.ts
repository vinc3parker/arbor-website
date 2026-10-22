// Start at the previous third chapter's woodland position, preserving all six messages.
export const JOURNEY_STOPS = [0, 8 / 53, 15 / 53, 22 / 53, 28 / 53, 1];
export const CAMERA_START = 12;
export const CAMERA_END = -41;

export function roadHalfWidth(z: number) {
  return 1.65 + .35 * (1 - Math.exp(-Math.pow((z + 23) / 11, 2)));
}

export function roadX(z: number) {
  // The road straightens through the tree opening at z=-19 ... -26.
  const opening = 1 - Math.exp(-Math.pow((z + 23) / 10, 2));
  return Math.sin((z + 20) * .095) * 2.4 * opening;
}
