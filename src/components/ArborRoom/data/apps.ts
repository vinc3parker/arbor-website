import { APP_BRANDS, type AppId } from "@/lib/brand";
import { APP_ROADMAP } from "@/content/roadmap";

export interface ArborApp {
  id: AppId;
  name: string;
  dimension: string;
  colour: string;
  angle: number;
  /** Visual plant maturity only; public stages come from APP_ROADMAP. */
  status: "development" | "beta" | "live";
  route: string;
  blurb: string;
}

const bays: { id: AppId; angle: number }[] = [
  { id: "nura", angle: -56 }, { id: "wend", angle: -40 },
  { id: "salus", angle: -24 }, { id: "aevo", angle: -8 },
  { id: "telos", angle: 8 }, { id: "sage", angle: 24 },
  { id: "kith", angle: 40 }, { id: "thrive", angle: 56 },
];

export const arborApps: ArborApp[] = bays.map(({ id, angle }) => {
  const app = APP_BRANDS[id];
  return {
    id, angle, name: app.name, dimension: app.domain,
    colour: app.lead, route: `/${id}`, blurb: app.line,
    status: APP_ROADMAP[id].stage === "testing" ? "beta" : "development",
  };
});

export function revealRank(app: ArborApp): number {
  return Math.round((Math.abs(app.angle) - 8) / 16);
}
