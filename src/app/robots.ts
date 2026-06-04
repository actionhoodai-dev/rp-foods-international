import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/admin/*"], // Protect admin panels from indexing
    },
    sitemap: "https://www.rpfoodsinternational.com/sitemap.xml",
  };
}
