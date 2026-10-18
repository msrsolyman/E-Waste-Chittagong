import * as React from "react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ProductsCatalogueView } from "@/components/products-catalogue-view";
import { ProductCardData } from "@/components/product-card";
import { getTranslations } from "next-intl/server";
import {
  Layers,
  ShieldCheck,
  Ship,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { ScrollReveal } from "@/components/scroll-reveal";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let productsBannerUrl =
    "https://res.cloudinary.com/jpzhmh1r/image/upload/v1792328119/ewaste-chittagong/banners/products-hero-banner.jpg";

  const [rawProducts, rawCategories, bannerSetting] = await Promise.all([
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
    prisma.companySetting.findUnique({
      where: { key: "products_banner" },
    }),
  ]);

  if (bannerSetting?.value) {
    try {
      const parsed = JSON.parse(bannerSetting.value);
      if (parsed.url) productsBannerUrl = parsed.url;
    } catch (err) {
      console.error("Failed to parse products_banner setting:", err);
    }
  }

  const localizedProducts: ProductCardData[] = rawProducts.map((p) => {
    let title = p.titleEn;
    let shortDesc = p.shortDescEn;
    let fullDesc = p.fullDescEn;
    let categoryName = p.category.nameEn;

    if (locale === "bn") {
      if (p.titleBn) title = p.titleBn;
      if (p.shortDescBn) shortDesc = p.shortDescBn;
      if (p.fullDescBn) fullDesc = p.fullDescBn;
      if (p.category.nameBn) categoryName = p.category.nameBn;
    } else if (locale === "zh-CN") {
      if (p.titleZh) title = p.titleZh;
      if (p.shortDescZh) shortDesc = p.shortDescZh;
      if (p.fullDescZh) fullDesc = p.fullDescZh;
      if (p.category.nameZh) categoryName = p.category.nameZh;
    } else if (locale === "ja") {
      if (p.titleJa) title = p.titleJa;
      if (p.shortDescJa) shortDesc = p.shortDescJa;
      if (p.fullDescJa) fullDesc = p.fullDescJa;
      if (p.category.nameJa) categoryName = p.category.nameJa;
    }

    let imageUrl = "/images/products/pcb-motherboards.jpg";
    let imagesList: string[] = [];
    try {
      const parsed = JSON.parse(p.images);
      if (Array.isArray(parsed) && parsed.length > 0) {
        imagesList = parsed;
        if (parsed[0]) imageUrl = parsed[0];
      }
    } catch {}

    return {
      id: p.id,
      slug: p.slug,
      title,
      categoryName,
      shortDesc,
      fullDesc,
      grade: p.grade,
      origin: p.origin,
      packaging: p.packaging,
      moq: p.minOrderQuantity,
      status: p.status,
      imageUrl,
      images: imagesList,
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
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* 1. CINEMATIC B2B SOURCING SPLIT-HERO BANNER */}
      <section className="relative pt-8 pb-14 lg:pt-16 lg:pb-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/70 overflow-hidden">
        {/* Tech Grid Backdrop */}
        <div className="absolute inset-0 bg-grid-tech mask-radial opacity-60 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column (7 cols): Executive Inventory Presentation */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Operational Status Pill */}
              <ScrollReveal delayMs={50}>
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-white/95 dark:bg-slate-900/90 text-emerald-700 dark:text-emerald-400 border border-slate-200/80 dark:border-slate-800 shadow-2xs backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>{t("verifiedInventoryBadge")}</span>
                </div>
              </ScrollReveal>

              {/* Authoritative Page Title */}
              <ScrollReveal delayMs={100}>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.16]">
                  {t("pageTitle")}
                </h1>
              </ScrollReveal>

              {/* Subtitle */}
              <ScrollReveal delayMs={150}>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
                  {t("pageSubtitle")}
                </p>
              </ScrollReveal>

              {/* 3-Item Trust & Operational Metric Strip */}
              <ScrollReveal delayMs={200}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs sm:text-sm">
                      <Layers className="w-4 h-4 shrink-0" />
                      <span>{t("streamMetric")}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      {t("streamMetricSub")}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs sm:text-sm">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>{t("gradingMetric")}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      {t("gradingMetricSub")}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs sm:text-sm">
                      <Ship className="w-4 h-4 shrink-0" />
                      <span>{t("logisticsMetric")}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      {t("logisticsMetricSub")}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column (5 cols): Dynamic Cloudinary Hero Banner with Metallic Glow & Floating Badges */}
            <div className="lg:col-span-5 relative">
              <ScrollReveal delayMs={250}>
                <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-2xl lg:rounded-3xl overflow-hidden border border-emerald-500/20 dark:border-emerald-500/30 shadow-2xl bg-slate-950 transition-all duration-500 group">
                  <Image
                    src={productsBannerUrl}
                    alt="E-Waste Chittagong Verified Inventory Streams"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    unoptimized={productsBannerUrl.startsWith("http")}
                  />
                  {/* Soft Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20 pointer-events-none" />

                  {/* Floating Live Operations Pill (Top-Left) */}
                  <div className="absolute top-3.5 left-3.5 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/15 text-white flex items-center gap-2 text-xs shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="font-semibold tracking-wide">Chittagong Staging Hub</span>
                  </div>

                  {/* Floating Operational Badge (Top-Right) */}
                  <div className="hidden sm:inline-flex absolute top-3.5 right-3.5 px-2.5 py-1 rounded-lg bg-emerald-950/85 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                    Verified Inventory
                  </div>

                  {/* Bottom Caption Bar */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 px-3.5 py-2.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 text-white flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200 truncate pr-2">
                      High-Grade Scrap Assortment & Segregation
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono font-bold shrink-0">
                      100% Mechanical
                    </span>
                  </div>
                </div>

                {/* Decorative Corner Ambient Glow */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE PRODUCTS CATALOGUE & MOTION GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal delayMs={100}>
          <ProductsCatalogueView
            products={localizedProducts}
            categories={localizedCategories}
          />
        </ScrollReveal>
      </section>
    </div>
  );
}
