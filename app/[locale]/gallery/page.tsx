import * as React from "react";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/section-heading";
import { prisma } from "@/lib/prisma";
import { GalleryClientView, GalleryItemData } from "@/components/gallery-client-view";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("gallery");

  const rawItems = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  const galleryItems: GalleryItemData[] = rawItems.map((item) => {
    let title = item.titleEn;
    if (locale === "bn" && item.titleBn) title = item.titleBn;
    else if (locale === "zh-CN" && item.titleZh) title = item.titleZh;
    else if (locale === "ja" && item.titleJa) title = item.titleJa;

    return {
      id: item.id,
      title,
      caption: item.caption,
      imageUrl: item.imageUrl,
      isVerified: item.isVerified,
      category: item.category,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SectionHeading
        badge={t("badge")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <GalleryClientView galleryItems={galleryItems} />
    </div>
  );
}
