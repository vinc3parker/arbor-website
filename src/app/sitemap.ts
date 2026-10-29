import type { MetadataRoute } from "next";
import { apps } from "@/content/apps";
import { getAllPosts } from "@/lib/blog";

const BASE = "https://arborapps.co";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1.0 },
    ...["guides", "how-it-works", "progress", "early-access"].map((path) => ({
      url: `${BASE}/${path}`, changeFrequency: "monthly" as const, priority: 0.8,
    })),
    {
      url: `${BASE}/blog`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/grove`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE}/legal`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const appRoutes: MetadataRoute.Sitemap = Object.keys(apps).map((slug) => ({
    url: `${BASE}/${slug}`,
    changeFrequency: "monthly",
    // Aevo is the first testing release.
    priority: slug === "aevo" ? 0.9 : 0.8,
  }));

  const appLegalRoutes: MetadataRoute.Sitemap = Object.keys(apps).map((slug) => ({
    url: `${BASE}/legal/${slug}`,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  const blogRoutes: MetadataRoute.Sitemap = (await getAllPosts()).map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...appRoutes, ...appLegalRoutes, ...blogRoutes];
}
