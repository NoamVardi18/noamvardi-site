import type { MetadataRoute } from "next";
import { SD } from "@/lib/sd";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/hub", "/login", "/api"],
    },
    sitemap: `${SD.url}/sitemap.xml`,
    host: SD.url,
  };
}
