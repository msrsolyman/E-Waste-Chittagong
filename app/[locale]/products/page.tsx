import * as React from "react";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/section-heading";
import { ProductsCatalogueView } from "@/components/products-catalogue-view";
import { ProductCardData } from "@/components/product-card";
import { getTranslations } from "next-intl/server";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [rawProducts, rawCategories] = await Promise.all([
    prisma.product.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { nameEn: true, nameBn: true, nameZh: true, nameJa: true } },
      },
    }),
    prisma.category.findMany({
      where: { products: { some: { status: "PUBLISHED" } } },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  const localizedProducts: ProductCardData[] = rawProducts.map((p) => {
    let title = p.titleEn;
    let shortDesc = p.shortDescEn;
    let categoryName = p.category.nameEn;

    if (locale === "bn") {
      if (p.titleBn) title = p.titleBn;
      if (p.shortDescBn) shortDesc = p.shortDescBn;
      if (p.category.nameBn) categoryName = p.category.nameBn;
    } else if (locale === "zh-CN") {
      if (p.titleZh) title = p.titleZh;
      if (p.shortDescZh) shortDesc = p.shortDescZh;
      if (p.category.nameZh) categoryName = p.category.nameZh;
    } else if (locale === "ja") {
      if (p.titleJa) title = p.titleJa;
      if (p.shortDescJa) shortDesc = p.shortDescJa;
      if (p.category.nameJa) categoryName = p.category.nameJa;
    }

    let imageUrl = "/images/products/pcb-motherboards.jpg";
    try {
      const parsed = JSON.parse(p.images);
      if (Array.isArray(parsed) && parsed[0]) imageUrl = parsed[0];
    } catch {}

    return {
      id: p.id,
      slug: p.slug,
      title,
      categoryName,
      shortDesc,
      grade: p.grade,
      origin: p.origin,
      packaging: p.packaging,
      moq: p.minOrderQuantity,
      status: p.status,
      imageUrl,
    };
  });

  const localizedCategories = rawCategories.map((c) => {
    let name = c.nameEn;
    if (locale === "bn" && c.nameBn) name = c.nameBn;
    else if (locale === "zh-CN" && c.nameZh) name = c.nameZh;
    else if (locale === "ja" && c.nameJa) name = c.nameJa;

    return {
      id: c.id,
      slug: c.slug,
      name,
    };
  });

  const t = await getTranslations({ locale, namespace: "products" });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SectionHeading
        badge={t("badge")}
        title={t("pageTitle")}
        subtitle={t("pageSubtitle")}
      />

      <ProductsCatalogueView
        products={localizedProducts}
        categories={localizedCategories}
      />
    </div>
  );
}
