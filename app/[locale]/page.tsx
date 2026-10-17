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
    <div className="space-y-16 lg:space-y-28 pb-20">
      {/* 1. FUTURISTIC SIGNATURE HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-20 lg:pb-28 border-b border-slate-200/70 dark:border-slate-800/80 bg-gradient-to-b from-emerald-50/60 via-slate-50/40 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950">
        {/* Subtle Cyber Grid Background with Radial Mask */}
        <div className="absolute inset-0 bg-grid-tech mask-radial pointer-events-none opacity-70 dark:opacity-90" />

        {/* Ambient Eco-Tech Radial Glows */}
        <div className="absolute top-1/4 -left-28 w-96 h-96 bg-emerald-500/15 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-28 w-96 h-96 bg-sky-500/10 dark:bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column (7 cols): Authoritative B2B Corporate Messaging */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Eyebrow Pill with Pulsing Live Status Dot */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{tHero("signatureTagline")}</span>
              </div>

              {/* Masterpiece Signature Headline */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                  {tHero("signatureHeadline")}
                </h1>
                <p className="text-sm font-semibold tracking-wide uppercase text-emerald-700 dark:text-emerald-400">
                  {tHero("title")}
                </p>
              </div>

              {/* Concise Supporting Narrative */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {tHero("subtitle")}
              </p>

              {/* CTAs with Micro-Interactions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  href="/products"
                  className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <span>{tHero("ctaPrimary")}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/inquiry"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-slate-300/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-800 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800 font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 group"
                >
                  <span>{tHero("ctaSecondary")}</span>
                  <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              {/* Verified Trust Strip */}
              <div className="pt-4 flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{tHero("verifiedNotice")}</span>
              </div>
            </div>

            {/* Right Column (5 cols): Signature Futuristic Visual Showcase */}
            <div className="lg:col-span-5 relative">
              {/* Precision Viewfinder Framing Accents */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-emerald-950/20 bg-slate-950 aspect-[4/3] group">
                <Image
                  src="/images/concepts/circular-hero.jpg"
                  alt="Sustainable Circular Electronics Material Recovery"
                  fill
                  priority
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                {/* Floating Top-Right Glass Badge: Port Logistics */}
                <div className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-white shadow-xl flex items-center gap-2.5 max-w-[230px]">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/90 flex items-center justify-center shrink-0">
                    <Ship className="w-4 h-4 text-white" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[11px] font-bold leading-tight">
                      {tHero("portAdvantageTitle")}
                    </div>
                    <div className="text-[10px] text-emerald-300 leading-tight">
                      FOB / CIF Maritime Export
                    </div>
                  </div>
                </div>

                {/* Floating Bottom-Left Glass Badge: Pure Physical Sorting */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/30 dark:border-slate-700/60 shadow-xl flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>{tHero("taglineMechanical")}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {tHero("taglineSmelter")}
                    </div>
                  </div>
                  <div className="hidden sm:block shrink-0 px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    99.8% Pure
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
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-inner">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {tStats("sortingTitle")}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {tStats("sortingDesc")}
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shadow-inner">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {tStats("recoveryTitle")}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {tStats("recoveryDesc")}
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-500/50 hover:-translate-y-1 transition-all duration-300 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shadow-inner">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {tStats("b2bTitle")}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {tStats("b2bDesc")}
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/50 hover:-translate-y-1 transition-all duration-300 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center shadow-inner">
              <Ship className="w-6 h-6" />
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

      {/* 3. CURATED INDUSTRIAL PRODUCT CATALOGUE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <SectionHeading
            badge={tProducts("verifiedInventoryBadge")}
            title={tProducts("title")}
            subtitle={tProducts("subtitle")}
          />
          <Link
            href="/products"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 transition"
          >
            <span>{tProducts("viewFullCatalogue")}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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

      {/* 5. CONNECTED COMPLIANT RECYCLING WORKFLOW */}
      <section className="bg-slate-50/80 dark:bg-slate-900/60 py-20 border-y border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-grid-tech mask-radial pointer-events-none opacity-40 dark:opacity-60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <SectionHeading
            centered
            badge={tProcess("operationalStandardsBadge")}
            title={tProcess("title")}
            subtitle={tProcess("subtitle")}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connected horizontal accent line for desktop */}
            <div className="hidden md:block absolute top-10 left-12 right-12 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-500/50 to-emerald-500/20 z-0" />

            {/* Step 1 */}
            <div className="p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-mono font-extrabold text-sm flex items-center justify-center shadow-md shadow-emerald-600/30">
                  01
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                  Intake
                </span>
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white pt-1">
                {tProcess("step1Title")}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {tProcess("step1Desc")}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-mono font-extrabold text-sm flex items-center justify-center shadow-md shadow-emerald-600/30">
                  02
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                  Grading
                </span>
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white pt-1">
                {tProcess("step2Title")}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {tProcess("step2Desc")}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-mono font-extrabold text-sm flex items-center justify-center shadow-md shadow-emerald-600/30">
                  03
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                  Disassembly
                </span>
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white pt-1">
                {tProcess("step3Title")}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {tProcess("step3Desc")}
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-mono font-extrabold text-sm flex items-center justify-center shadow-md shadow-emerald-600/30">
                  04
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                  Dispatch
                </span>
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white pt-1">
                {tProcess("step4Title")}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {tProcess("step4Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DEDICATED INTERNATIONAL RFQ PROMPT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 text-white p-8 sm:p-14 shadow-2xl border border-emerald-500/20 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Subtle cyber grid */}
          <div className="absolute inset-0 bg-grid-tech mask-radial opacity-30 pointer-events-none" />

          <div className="relative space-y-3 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>International Procurement</span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              {tHero("ctaBannerTitle")}
            </h3>
            <p className="text-sm text-emerald-100/80 leading-relaxed max-w-xl">
              {tHero("ctaBannerDesc")}
            </p>
          </div>

          <div className="relative flex flex-col sm:flex-row gap-3.5 shrink-0">
            <Link
              href="/inquiry"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white text-emerald-950 font-bold text-sm shadow-lg hover:bg-emerald-50 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>{tNav("rfq")}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md text-white font-semibold text-sm hover:bg-white/15 transition-all duration-200"
            >
              <span>{tNav("contact")}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
