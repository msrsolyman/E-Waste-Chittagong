import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { ScrollReveal } from "@/components/scroll-reveal";
import {
  ShieldCheck,
  Target,
  Globe,
  Anchor,
  Layers,
  Ship,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

export default async function AboutPage() {
  let bannerUrl =
    "https://res.cloudinary.com/jpzhmh1r/image/upload/v1792327290/ewaste-chittagong/banners/about-hero-banner.jpg";

  try {
    const bannerSetting = await prisma.companySetting.findUnique({
      where: { key: "about_banner" },
    });
    if (bannerSetting?.value) {
      const parsed = JSON.parse(bannerSetting.value);
      if (parsed.url) {
        bannerUrl = parsed.url;
      }
    }
  } catch (err) {
    console.error("Failed to load about_banner setting:", err);
  }

  return <AboutView bannerUrl={bannerUrl} />;
}

function AboutView({ bannerUrl }: { bannerUrl: string }) {
  const t = useTranslations("about");

  return (
    <div className="space-y-16 lg:space-y-24 pb-20 overflow-hidden">
      {/* 1. CINEMATIC EXECUTIVE SPLIT-HERO BANNER */}
      <section className="relative pt-8 pb-14 lg:pt-16 lg:pb-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/70 overflow-hidden">
        {/* Subtle Tech Grid Backdrop */}
        <div className="absolute inset-0 bg-grid-tech mask-radial opacity-60 pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column (7 cols): Authoritative Executive Narrative */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Live Operational Status Pill */}
              <ScrollReveal delayMs={50}>
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-white/95 dark:bg-slate-900/90 text-emerald-700 dark:text-emerald-400 border border-slate-200/80 dark:border-slate-800 shadow-2xs backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>{t("liveBadge")}</span>
                </div>
              </ScrollReveal>

              {/* Authoritative Page Headline */}
              <ScrollReveal delayMs={100}>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.16]">
                  {t("title")}
                </h1>
              </ScrollReveal>

              {/* Subtitle with High-Legibility Typography */}
              <ScrollReveal delayMs={150}>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
                  {t("subtitle")}
                </p>
              </ScrollReveal>

              {/* Quick Action Buttons */}
              <ScrollReveal delayMs={200}>
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <Link
                    href="/inquiry"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-emerald-500/20 active:scale-[0.98] transition-all duration-200 group/btn"
                  >
                    <span>{t("ctaButton")}</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </Link>

                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm active:scale-[0.98] transition-all duration-200"
                  >
                    <span>{t("exploreButton")}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column (5 cols): Dynamic Cloudinary Hero Banner with Metallic Glow & Floating Badges */}
            <div className="lg:col-span-5 relative">
              <ScrollReveal delayMs={250}>
                <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-2xl lg:rounded-3xl overflow-hidden border border-emerald-500/20 dark:border-emerald-500/30 shadow-2xl bg-slate-950 transition-all duration-500 group">
                  <Image
                    src={bannerUrl}
                    alt="E-Waste Chittagong High-Tech Circular Electronics Recovery Facility"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    unoptimized={bannerUrl.startsWith("http")}
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
                    Verified Facility
                  </div>

                  {/* Bottom Caption Bar */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 px-3.5 py-2.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 text-white flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200 truncate pr-2">
                      High-Tech Circular Electronics & Sorting
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono font-bold shrink-0">
                      100% Mechanical
                    </span>
                  </div>
                </div>

                {/* Decorative Corner Glow */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* 2. DUAL-MEDIA INTERACTIVE NARRATIVE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Narrative & Formal Operational Policy */}
          <ScrollReveal className="lg:col-span-7 space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            <p className="font-normal text-slate-700 dark:text-slate-200 leading-relaxed">
              {t("p1")}
            </p>
            <p className="leading-relaxed">
              {t("p2")}
            </p>
            <p className="leading-relaxed">
              {t("p3")}
            </p>

            {/* Policy Callout Card with Emerald Ambient Glow */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/60 dark:from-emerald-950/40 dark:to-slate-900/60 border border-emerald-200/80 dark:border-emerald-800/60 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 shadow-xs flex items-start gap-4 transition-all duration-300 hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs border border-emerald-100 dark:border-emerald-900/60 shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {t("policyTitle")}
                </div>
                <div className="leading-relaxed text-slate-600 dark:text-slate-300">
                  {t("policyDesc")}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Dual-Media Interactive Showcase with Floating Live Badges */}
          <ScrollReveal delayMs={120} className="lg:col-span-5 relative">
            {/* Primary Facility Dismantling Photography */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-lg hover:shadow-2xl bg-slate-900 transition-all duration-500 group">
              <Image
                src="/images/products/facility-dismantling.jpg"
                alt="E-Waste Chittagong Organized Sorting Workstation"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

              {/* Floating Live Operation Badge */}
              <div className="absolute top-3.5 left-3.5 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/15 text-white flex items-center gap-2 text-xs shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="font-medium tracking-wide">Chittagong Staging Hub · 22.3°N, 91.8°E</span>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 px-3.5 py-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">Physical Sorting Bench</span>
                <span className="text-[11px] text-emerald-400 font-mono">100% Mechanical</span>
              </div>
            </div>

            {/* Secondary Overlapping Scrap Preview Card */}
            <div className="hidden sm:flex absolute -bottom-6 -left-6 items-center gap-3 p-2.5 pr-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-950/15 group/float">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800">
                <Image
                  src="/images/products/pcb-motherboards.jpg"
                  alt="Circuit Scrap Sorting"
                  fill
                  className="object-cover transition-transform duration-500 group-hover/float:scale-110"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  High-Grade Scrap Sorting
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Zero Informal Open-Burning
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. 4-COLUMN TRUST & OPERATIONAL CAPACITY STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <ScrollReveal delayMs={0}>
            <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 ease-out space-y-3 h-full">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {t("metric1Value")}
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {t("metric1Title")}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t("metric1Desc")}
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={80}>
            <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 ease-out space-y-3 h-full">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center">
                <Ship className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {t("metric2Value")}
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {t("metric2Title")}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t("metric2Desc")}
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={160}>
            <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 ease-out space-y-3 h-full">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {t("metric3Value")}
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {t("metric3Title")}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t("metric3Desc")}
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={240}>
            <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 ease-out space-y-3 h-full">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {t("metric4Value")}
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {t("metric4Title")}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t("metric4Desc")}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. STRATEGIC PILLARS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal>
          <div className="text-xs font-bold tracking-widest uppercase text-emerald-800 dark:text-emerald-400">
            STRATEGIC FOUNDATIONS
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Operational Principles & Global Standards
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScrollReveal delayMs={0}>
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 ease-out space-y-4 h-full group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {t("missionTitle")}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t("missionDesc")}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={100}>
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 ease-out space-y-4 h-full group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Anchor className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {t("portTitle")}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t("portDesc")}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={200}>
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 ease-out space-y-4 h-full group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {t("readinessTitle")}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t("readinessDesc")}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. CIRCULAR ECONOMY PARTNERSHIP & INQUIRY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative rounded-3xl overflow-hidden border border-emerald-900/30 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-8 sm:p-12 lg:p-14 shadow-2xl">
            {/* Background Tech Ambient Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/70 border border-emerald-500/30 text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Circular Economy Gateway</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {t("ctaHeadline")}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {t("ctaSubtitle")}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <Link
                  href="/inquiry"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98] transition-all duration-200 group/btn"
                >
                  <span>{t("ctaButton")}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </Link>

                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm backdrop-blur-md active:scale-[0.98] transition-all duration-200"
                >
                  <span>{t("exploreButton")}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
