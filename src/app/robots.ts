import { MetadataRoute } from "next";
import { getSettings } from "@/lib/data";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const s = (await getSettings()) as any;
  const siteUrl = (s.siteUrl || "https://biworsourcing.com").replace(/\/$/, "");
  const allowIndex = s.robotsIndex !== false;
  return {
    rules: [
      { userAgent: "*", allow: allowIndex ? "/" : undefined, disallow: allowIndex ? ["/admin", "/api/", "/admin/"] : "/" },
      { userAgent: "GPTBot", allow: allowIndex ? "/" : undefined, disallow: allowIndex ? ["/admin", "/api/"] : "/" },
      { userAgent: "Google-Extended", allow: allowIndex ? "/" : undefined, disallow: allowIndex ? ["/admin", "/api/"] : "/" },
      { userAgent: "CCBot", allow: allowIndex ? "/" : undefined, disallow: allowIndex ? ["/admin", "/api/"] : "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
