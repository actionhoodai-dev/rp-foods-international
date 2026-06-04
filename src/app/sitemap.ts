import { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/firebase/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.rpfoodsinternational.com";

  // 1. Static Routes
  const staticRoutes = [
    "",
    "/about",
    "/products",
    "/reach",
    "/contact",
    "/privacy",
    "/terms",
  ].map((route) => {
    let priority = 0.8;
    let changeFrequency: "weekly" | "monthly" | "daily" = "weekly";

    if (route === "") {
      priority = 1.0;
      changeFrequency = "daily";
    } else if (route === "/privacy" || route === "/terms") {
      priority = 0.3;
      changeFrequency = "monthly";
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    };
  });

  // 2. Dynamic Categories (Fetch active categories from DB)
  let categories: any[] = [];
  try {
    categories = await getCategories(true);
  } catch (err) {
    console.error("Sitemap category fetch error:", err);
  }

  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/products?category=${cat.slug}`,
    lastModified: new Date(cat.updatedAt || new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 3. Dynamic Products (Fetch published products from DB)
  let products: any[] = [];
  try {
    products = await getProducts(undefined, true);
  } catch (err) {
    console.error("Sitemap product fetch error:", err);
  }

  const productRoutes = products.map((prod) => ({
    url: `${baseUrl}/products/${prod.slug}`,
    lastModified: new Date(prod.updatedAt || new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
