import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/section-heading";
import { ShieldCheck, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const rawItems = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  const galleryItems = rawItems.map((item) => {
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

  return <GalleryView galleryItems={galleryItems} />;
}

function GalleryView({
  galleryItems,
}: {
  galleryItems: Array<{
    id: string;
    title: string;
    caption: string | null;
    imageUrl: string;
    isVerified: boolean;
    category: string;
  }>;
}) {
  const t = useTranslations("gallery");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SectionHeading
        badge="Visual Verification"
        title={t("title")}
        subtitle={t("subtitle")}
      />

      {/* Transparency Note */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          E-Waste Chittagong clearly distinguishes between authentic facility handling photographs and illustrative industry concepts for complete buyer transparency.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md transition space-y-3"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
                    item.isVerified
                      ? "bg-emerald-600/90 text-white"
                      : "bg-slate-900/80 text-slate-200"
                  }`}
                >
                  {item.isVerified ? (
                    <>
                      <ShieldCheck className="w-3 h-3" />
                      <span>{t("verifiedBadge")}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{t("illustrativeBadge")}</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {item.category}
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                {item.title}
              </h3>
              {item.caption && (
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {item.caption}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
