/**
 * Shared dimensions of the observatory.
 *
 * The eight portal bays stand along ONE side of the room — a curved wall the
 * viewer looks across at, like windows around an observatory floor. Bays are
 * authored in compact "local" units (arch opening 1.98 × 6.18) and scaled by
 * BAY_SCALE so each arch stands ~11 m tall.
 */

/** Uniform scale applied to every wall bay group. */
export const BAY_SCALE = 1.8;

/** Perpendicular distance from room centre to each (flat) wall panel. */
export const WALL_APOTHEM = 20.5;

/** Angular spacing between neighbouring bays (degrees). */
export const BAY_SPACING_DEG = 16;

/** Local Y of the floor line inside a bay (arch is centred on y = 0). */
export const BAY_FLOOR_Y = -6.18 / 2;

/** World Y of a bay group's origin so the arch base sits on the floor. */
export const BAY_ORIGIN_Y = -BAY_FLOOR_Y * BAY_SCALE;

/** Local wall panel size — tiles the arc exactly (slight overlap). */
export const PANEL_WIDTH =
  ((2 *
    WALL_APOTHEM *
    Math.tan(((BAY_SPACING_DEG / 2) * Math.PI) / 180)) /
    BAY_SCALE) *
  1.04;
export const PANEL_TOP_Y = 6.4; // local — fades into darkness overhead
export const PANEL_DEPTH = 0.85; // local ≈ 1.5 m of real wall thickness

/** Camera: stands on the far side of the floor, looking across at the wall.
 *  FOV + distance chosen so the outermost arches sit FULLY in a 16:9 frame
 *  with margin — a cropped arch reads as less important. */
export const CAMERA_POS: [number, number, number] = [0, 2.1, 14.5];
export const CAMERA_FOV = 52;

/** Floor disc radius. */
export const FLOOR_RADIUS = 22.5;

/** Raised central dais the roots grow from. */
export const DAIS_RADIUS = 2.9;
export const DAIS_HEIGHT = 0.22;

/** Root growth per app status — how far the tree has reached. */
export const STATUS_GROWTH: Record<'development' | 'beta' | 'live', number> = {
  development: 0.45,
  beta: 0.78,
  live: 1,
};

/** Root glow strength per status. */
export const STATUS_GLOW: Record<'development' | 'beta' | 'live', number> = {
  development: 1.0,
  beta: 1.5,
  live: 2.0,
};
