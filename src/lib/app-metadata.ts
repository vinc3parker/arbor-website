import { apps } from "@/content/apps";
import { APP_ROADMAP } from "@/content/roadmap";
import type { AppId } from "@/lib/brand";

/** Keep search, social previews and structured data aligned with public stages. */
export function getAppDescription(id: AppId): string {
  return `${apps[id].hero} ${APP_ROADMAP[id].note}`;
}
