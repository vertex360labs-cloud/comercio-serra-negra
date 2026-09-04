import { SITE_URL } from "@/lib/constantes";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/painel", "/admin"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
