import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { ProductCard, ProductCardData } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { OperationsReel } from "@/components/operations-reel";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Cpu,
  Layers,
  Ship,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fetch featured published products from database
  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
    },
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { nameEn: true, nameBn: true, nameZh: true, nameJa: true } },
    },
  });

  // Map to localized card data
  const localizedProducts: ProductCardData[] = products.map((p) => {
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

  return <HomeView localizedProducts={localizedProducts} />;
}

function HomeView({ localizedProducts }: { localizedProducts: ProductCardData[] }) {
  const tHero = useTranslations("hero");
  const tStats = useTranslations("stats");
  const tProducts = useTranslations("products");
  const tProcess = useTranslations("process");
  const tServices = useTranslations("services");
  const tNav = useTranslations("nav");

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 lg:pt-16 lg:pb-20 border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-emerald-50/40 via-white to-white dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100/80 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{tHero("badge")}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                {tHero("title")}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {tHero("subtitle")}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <span>{tHero("ctaPrimary")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/inquiry"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <span>{tHero("ctaSecondary")}</span>
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                </Link>
              </div>

              {/* Verified Trust Strip */}
              <div className="pt-4 flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{tHero("verifiedNotice")}</span>
              </div>
            </div>

            {/* Right Column (5 cols) - Visual Showcase */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none bg-slate-900 aspect-[4/3] group">
                <Image
                  src="/images/concepts/circular-hero.jpg"
                  alt="Sustainable Circular Electronics Recycling Concept"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 dark:border-slate-700/50">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {tHero("portAdvantageTitle")}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {tHero("portAdvantageSubtitle")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUR PILLARS / STRATEGIC METRICS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {tStats("sortingTitle")}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {tStats("sortingDesc")}
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {tStats("recoveryTitle")}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {tStats("recoveryDesc")}
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {tStats("b2bTitle")}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {tStats("b2bDesc")}
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <Ship className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {tStats("portTitle")}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {tStats("portDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <SectionHeading
            badge={tProducts("verifiedInventoryBadge")}
            title={tProducts("title")}
            subtitle={tProducts("subtitle")}
          />
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 transition"
          >
            <span>{tProducts("viewFullCatalogue")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {localizedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 4. LIVE OPERATIONS VIDEO REEL */}
      <OperationsReel />

      {/* 5. WORKFLOW / COMPLIANT PROCESS */}
      <section className="bg-slate-50 dark:bg-slate-900/60 py-16 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionHeading
            centered
            badge={tProcess("operationalStandardsBadge")}
            title={tProcess("title")}
            subtitle={tProcess("subtitle")}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 relative">
              <span className="text-4xl font-extrabold text-emerald-100 dark:text-emerald-950">01</span>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">{tProcess("step1Title")}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{tProcess("step1Desc")}</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 relative">
              <span className="text-4xl font-extrabold text-emerald-100 dark:text-emerald-950">02</span>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">{tProcess("step2Title")}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{tProcess("step2Desc")}</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 relative">
              <span className="text-4xl font-extrabold text-emerald-100 dark:text-emerald-950">03</span>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">{tProcess("step3Title")}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{tProcess("step3Desc")}</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 relative">
              <span className="text-4xl font-extrabold text-emerald-100 dark:text-emerald-950">04</span>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">{tProcess("step4Title")}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{tProcess("step4Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DEDICATED RFQ PROMPT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {tHero("ctaBannerTitle")}
            </h3>
            <p className="text-sm text-emerald-100 leading-relaxed">
              {tHero("ctaBannerDesc")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/inquiry"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-emerald-900 font-bold text-sm shadow hover:bg-emerald-50 transition"
            >
              <span>{tNav("rfq")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition"
            >
              <span>{tNav("contact")}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
