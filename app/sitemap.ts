import type { MetadataRoute } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import { SD } from "@/lib/sd";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SD.url;
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/articles`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  let articles: { slug: string; published_at: string | null }[] = [];
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("articles")
      .select("slug, published_at")
      .eq("brand", SD.brand)
      .eq("status", "published");
    articles = data ?? [];
  } catch {
    // A sitemap must never break the build/runtime — fall back to static routes.
  }

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${base}/articles/${a.slug}`,
    lastModified: a.published_at ? new Date(a.published_at) : undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes];
}
