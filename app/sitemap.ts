import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { routing } from "@/i18n/routing";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ewastechittagong.com";

  const staticRoutes = [
    "",
    "/about",
    "/products",
    "/services",
    "/process",
    "/gallery",
    "/inquiry",
    "/contact",
    "/privacy",
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Generate static route entries for all 4 supported locales
  for (const locale of routing.locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" || route === "/products" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : route === "/products" ? 0.9 : 0.8,
      });
    }
  }

  // Add published products
  try {
    const products = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });

    for (const product of products) {
      for (const locale of routing.locales) {
        entries.push({
          url: `${baseUrl}/${locale}/products/${product.slug}`,
          lastModified: product.updatedAt,
          changeFrequency: "weekly",
          priority: 0.85,
        });
      }
    }
  } catch (e) {
    console.error("Sitemap product fetch error:", e);
  }

  return entries;
}
