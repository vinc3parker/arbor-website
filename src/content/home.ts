import { APP_BRANDS, APP_ORDER } from "@/lib/brand";
import { APP_ROADMAP } from "@/content/roadmap";

export const homeCopy = {
  hero: {
    // Tagline and descriptor (brand guide 3.2).
    title: "Live more of the life you choose.",
  },

  // Guide order, names, titles and lines all come from the brand guide.
  apps: APP_ORDER.map((id) => {
    const app = APP_BRANDS[id];
    return {
      id,
      name: app.name,
      role: `Your ${app.title}`,
      domain: app.domain,
      description: app.line,
      href: `/${id}`,
      icon: app.icon,
      colour: app.onInk,
      stage: APP_ROADMAP[id].stage,
      badge: APP_ROADMAP[id].label,
    };
  }),
};
