import * as React from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { GalleryClientView, GalleryItemData } from "@/components/gallery-client-view";
import { ScrollReveal } from "@/components/scroll-reveal";
import {
  Film,
  Camera,
  ShieldCheck,
  Video,
  FileText,
  Sparkles,
} from "lucide-react";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });

  let galleryBannerUrl =
    "https://res.cloudinary.com/jpzhmh1r/image/upload/v1792331523/ewaste-chittagong/banners/gallery-hero-banner.jpg";

  const [rawItems, bannerSetting] = await Promise.all([
    prisma.galleryItem.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.companySetting.findUnique({
      where: { key: "gallery_banner" },
    }),
  ]);

  if (bannerSetting?.value) {
    try {
      const parsed = JSON.parse(bannerSetting.value);
      if (parsed.url) galleryBannerUrl = parsed.url;
    } catch (err) {
      console.error("Failed to parse gallery_banner setting:", err);
    }
  }

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
    <div className="space-y-12 lg:space-y-16 py-8 sm:py-12">
      {/* 1. SPLIT-HERO BANNER & LIVE MEDIA MATRIX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            <ScrollReveal delayMs={50}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t("liveBadge")}</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delayMs={100}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                {t("title")}
              </h1>
            </ScrollReveal>

            <ScrollReveal delayMs={150}>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {t("subtitle")}
              </p>
            </ScrollReveal>

            {/* 3 Operational Media Badges */}
            <ScrollReveal delayMs={200}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                    <Film className="w-4 h-4 shrink-0" />
                    <span>{t("metric1Value")}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {t("metric1Desc")}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                    <Camera className="w-4 h-4 shrink-0" />
                    <span>{t("metric2Value")}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {t("metric2Desc")}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>{t("metric3Value")}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {t("metric3Desc")}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Metallic-Framed Hero Banner (5 cols on lg) */}
          <div className="lg:col-span-5">
            <ScrollReveal delayMs={250}>
              <div className="relative group">
                {/* Ambient Glow */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-600/30 to-teal-500/30 blur-xl opacity-70 group-hover:opacity-100 transition duration-700" />

                {/* Metallic Frame */}
                <div className="relative p-2 sm:p-2.5 rounded-3xl bg-gradient-to-b from-slate-200 via-slate-100 to-emerald-200/50 dark:from-slate-800 dark:via-slate-800/90 dark:to-emerald-950/40 border border-slate-300 dark:border-slate-700 shadow-2xl overflow-hidden">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950">
                    <Image
                      src={galleryBannerUrl}
                      alt="Chittagong Facility Operations & Media Documentation"
                      fill
                      priority
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />

                    {/* Top Left Floating Pill */}
                    <div className="absolute top-3.5 left-3.5 z-10">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-slate-900/85 backdrop-blur-md text-white border border-white/10 shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Chittagong Media Matrix</span>
                      </div>
                    </div>

                    {/* Top Right Pill */}
                    <div className="absolute top-3.5 right-3.5 z-10">
                      <div className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-emerald-950/85 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                        Raw Ground Logs
                      </div>
                    </div>

                    {/* Bottom Status Bar */}
                    <div className="absolute bottom-3.5 inset-x-3.5 z-10 flex items-center justify-between text-xs text-slate-200 px-3.5 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10">
                      <span className="font-semibold text-white truncate pr-2">
                        Chittagong Facility Visual Verification
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold shrink-0">
                        100% Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 2. GALLERY CLIENT VIEW WITH SPOTLIGHT THEATER, SEARCH, TABS & LIGHTBOX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GalleryClientView galleryItems={galleryItems} />
      </section>
    </div>
  );
}
