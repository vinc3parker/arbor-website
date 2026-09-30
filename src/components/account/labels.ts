import { appBrand } from "@/lib/brand";

// Core's canonical domain ids → the brand guide's domain names (1.6).
const DOMAIN_LABELS: Record<string, string> = {
  health: "Health",
  wellbeing: "Mind",
  organisation: "Organisation",
  finance: "Money",
  adventure: "Experiences",
  connections: "Relationships",
  purpose: "Purpose",
  growth: "Growth",
};

export function domainLabel(id: string): string {
  return DOMAIN_LABELS[id] ?? id.charAt(0).toUpperCase() + id.slice(1);
}

export function appName(app: string): string {
  return appBrand(app)?.name ?? "Arbor";
}

export function appIcon(app: string): string {
  return appBrand(app)?.icon ?? "/brand/arbor_mark_full.png";
}

/** 29 September 2026 (brand guide 3.11). */
export function formatDay(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
