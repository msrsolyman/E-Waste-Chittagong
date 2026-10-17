import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { ProductCard, ProductCardData } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { OperationsReel } from "@/components/operations-reel";
import { ScrollReveal } from "@/components/scroll-reveal";
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
    <div className="space-y-16 lg:space-y-24 pb-20">
      {/* 1. PREMIUM INDUSTRIAL EDITORIAL HERO (55/45 ASYMMETRICAL LAYOUT) */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/60">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column (55% on Desktop - 7 of 12 cols): Refined Executive Messaging */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Business Category Label */}
              <div className="animate-hero-eyebrow text-xs font-bold tracking-widest uppercase text-emerald-800 dark:text-emerald-400">
                {tHero("signatureTagline")}
              </div>

              {/* Authoritative Editorial Headline */}
              <h1 className="animate-hero-headline text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15] whitespace-pre-line">
                {tHero("signatureHeadline")}
              </h1>

              {/* Concise Supporting Copy */}
              <p className="animate-hero-subtitle text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-normal">
                {tHero("subtitle")}
              </p>

              {/* CTAs: Primary Explore Products + Secondary Request a Quote */}
              <div className="animate-hero-ctas flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-semibold text-sm shadow-sm hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <span>{tHero("ctaPrimary")}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/inquiry"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-[0.98] font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <span>{tHero("ctaSecondary")}</span>
                  <ArrowUpRight className="w-4 h-4 text-emerald-700 dark:text-emerald-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              {/* Trust & Verifiability Line */}
              <div className="animate-hero-trust pt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800/80">
                <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span>{tHero("verifiedNotice")}</span>
              </div>
            </div>

            {/* Right Column (45% on Desktop - 5 of 12 cols): Authentic Industrial Material Showcase */}
            <div className="lg:col-span-5 relative animate-hero-image">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm aspect-[4/3] group transition-all duration-500 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700">
                <Image
                  src="/images/products/pcb-motherboards.jpg"
                  alt="Industrial Electronic Circuit Scrap Sorting in Chittagong"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                {/* Minimalist Authentic Caption Strip */}
                <div className="absolute bottom-3 left-3 right-3 px-3.5 py-2 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200 truncate">
                    {tHero("taglineMechanical")}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono shrink-0 pl-2">
                    Chittagong
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUR PILLARS / STRATEGIC METRICS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScrollReveal delayMs={0}>
            <div className="p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 ease-out space-y-3 h-full">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {tStats("sortingTitle")}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {tStats("sortingDesc")}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={80}>
            <div className="p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 ease-out space-y-3 h-full">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {tStats("recoveryTitle")}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {tStats("recoveryDesc")}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={160}>
            <div className="p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 ease-out space-y-3 h-full">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {tStats("b2bTitle")}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {tStats("b2bDesc")}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={240}>
            <div className="p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 ease-out space-y-3 h-full">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
                <Ship className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {tStats("portTitle")}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {tStats("portDesc")}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. CURATED INDUSTRIAL PRODUCT CATALOGUE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <SectionHeading
              badge={tProducts("verifiedInventoryBadge")}
              title={tProducts("title")}
              subtitle={tProducts("subtitle")}
            />
            <Link
              href="/products"
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
            >
              <span>{tProducts("viewFullCatalogue")}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {localizedProducts.map((p, idx) => (
            <ScrollReveal key={p.id} delayMs={idx * 100}>
              <ProductCard product={p} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 4. LIVE OPERATIONS VIDEO REEL */}
      <ScrollReveal delayMs={60}>
        <OperationsReel />
      </ScrollReveal>

      {/* 5. CONNECTED COMPLIANT RECYCLING WORKFLOW */}
      <section className="bg-slate-50/80 dark:bg-slate-900/60 py-20 border-y border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-grid-tech mask-radial pointer-events-none opacity-40 dark:opacity-60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <ScrollReveal>
            <SectionHeading
              centered
              badge={tProcess("operationalStandardsBadge")}
              title={tProcess("title")}
              subtitle={tProcess("subtitle")}
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <ScrollReveal delayMs={0}>
              <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 ease-out space-y-3 relative z-10 h-full">
                <span className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-sm flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
                  01
                </span>
                <h4 className="font-bold text-base text-slate-900 dark:text-white pt-1">
                  {tProcess("step1Title")}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {tProcess("step1Desc")}
                </p>
              </div>
            </ScrollReveal>

            {/* Step 2 */}
            <ScrollReveal delayMs={80}>
              <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 ease-out space-y-3 relative z-10 h-full">
                <span className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-sm flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
                  02
                </span>
                <h4 className="font-bold text-base text-slate-900 dark:text-white pt-1">
                  {tProcess("step2Title")}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {tProcess("step2Desc")}
                </p>
              </div>
            </ScrollReveal>

            {/* Step 3 */}
            <ScrollReveal delayMs={160}>
              <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 ease-out space-y-3 relative z-10 h-full">
                <span className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-sm flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
                  03
                </span>
                <h4 className="font-bold text-base text-slate-900 dark:text-white pt-1">
                  {tProcess("step3Title")}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {tProcess("step3Desc")}
                </p>
              </div>
            </ScrollReveal>

            {/* Step 4 */}
            <ScrollReveal delayMs={240}>
              <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 ease-out space-y-3 relative z-10 h-full">
                <span className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-sm flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
                  04
                </span>
                <h4 className="font-bold text-base text-slate-900 dark:text-white pt-1">
                  {tProcess("step4Title")}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {tProcess("step4Desc")}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 6. DEDICATED INTERNATIONAL RFQ PROMPT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-8 sm:p-12 shadow-sm border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="relative space-y-2 max-w-2xl text-center lg:text-left">
              <div className="text-xs font-bold tracking-widest uppercase text-emerald-400">
                International Procurement
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {tHero("ctaBannerTitle")}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl font-normal">
                {tHero("ctaBannerDesc")}
              </p>
            </div>

            <div className="relative flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/inquiry"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-semibold text-sm shadow-sm transition-all duration-200"
              >
                <span>{tNav("rfq")}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-800 active:scale-[0.98] text-slate-200 font-semibold text-sm transition-all duration-200"
              >
                <span>{tNav("contact")}</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
