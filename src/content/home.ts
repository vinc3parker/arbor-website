import { APP_BRANDS, APP_ORDER } from "@/lib/brand";

// Default badges when the app_states table can't be read.
const FALLBACK_BADGES: Partial<Record<string, string>> = {
  aevo: "Beta",
  salus: "Beta",
};

export const homeCopy = {
  hero: {
    // Tagline and descriptor (brand guide 3.2).
    title: "Live more of the life you choose.",
    subtitle: "A guide for your whole life.",
  },

  // Guide order, names, titles and lines all come from the brand guide.
  apps: APP_ORDER.map((id) => {
    const app = APP_BRANDS[id];
    return {
      name: app.name,
      guide: `${app.domain} · Your ${app.title}`,
      description: app.line,
      href: `/${id}`,
      icon: app.icon,
      badge: FALLBACK_BADGES[id],
    };
  }),
};
