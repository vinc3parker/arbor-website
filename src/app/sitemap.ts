import type { MetadataRoute } from "next";
import { apps } from "@/content/apps";
import { getAllPosts } from "@/lib/blog";

const BASE = "https://arborapps.co";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    {
      url: `${BASE}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const appRoutes: MetadataRoute.Sitemap = Object.keys(apps).map((slug) => ({
    url: `${BASE}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    // Aevo is the live product — give it top app priority.
    priority: slug === "aevo" ? 0.9 : 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...appRoutes, ...blogRoutes];
}
