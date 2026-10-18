import * as React from "react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ScrollReveal } from "@/components/scroll-reveal";
import {
  Cpu,
  ShieldCheck,
  FileText,
  Ship,
  Truck,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Workflow,
  Building2,
  Wind,
  ShieldAlert,
  Award,
  CalendarCheck,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function ProcessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "process" });

  let processBannerUrl =
    "https://res.cloudinary.com/jpzhmh1r/image/upload/v1792330610/ewaste-chittagong/banners/process-hero-banner.jpg";

  try {
    const bannerSetting = await prisma.companySetting.findUnique({
      where: { key: "process_banner" },
    });
    if (bannerSetting?.value) {
      const parsed = JSON.parse(bannerSetting.value);
      if (parsed.url) processBannerUrl = parsed.url;
    }
  } catch (err) {
    console.error("Failed to read process_banner setting:", err);
  }

  // 4 Core Stages with visual photography assets & concrete deliverables
  const stages = [
    {
      num: "01",
      badge: "STAGE 01 · MATERIAL INTAKE",
      tag: t("step1Tag"),
      title: t("step1Title"),
      desc: t("step1Desc"),
      detail: t("step1Detail"),
      image: "/images/products/facility-dismantling.jpg",
      deliverables: [
        t("step1Deliv1"),
        t("step1Deliv2"),
        t("step1Deliv3"),
      ],
      icon: Truck,
      color: "emerald",
    },
    {
      num: "02",
      badge: "STAGE 02 · PRECISION SORTING",
      tag: t("step2Tag"),
      title: t("step2Title"),
      desc: t("step2Desc"),
      detail: t("step2Detail"),
      image: "/images/products/pcb-motherboards.jpg",
      deliverables: [
        t("step2Deliv1"),
        t("step2Deliv2"),
        t("step2Deliv3"),
      ],
      icon: Cpu,
      color: "blue",
    },
    {
      num: "03",
      badge: "STAGE 03 · HAZARD ISOLATION",
      tag: t("step3Tag"),
      title: t("step3Title"),
      desc: t("step3Desc"),
      detail: t("step3Detail"),
      image: "/images/services/services-hero-banner.jpg",
      deliverables: [
        t("step3Deliv1"),
        t("step3Deliv2"),
        t("step3Deliv3"),
      ],
      icon: ShieldCheck,
      color: "amber",
    },
    {
      num: "04",
      badge: "STAGE 04 · PORT LOGISTICS",
      tag: t("step4Tag"),
      title: t("step4Title"),
      desc: t("step4Desc"),
      detail: t("step4Detail"),
      image: "/images/products/telecom-boards.jpg",
      deliverables: [
        t("step4Deliv1"),
        t("step4Deliv2"),
        t("step4Deliv3"),
      ],
      icon: Ship,
      color: "teal",
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 py-8 sm:py-12">
      {/* 1. SPLIT-HERO BANNER & OPERATIONAL HUB */}
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

            {/* 3 Operational Capability Badges */}
            <ScrollReveal delayMs={200}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                    <Cpu className="w-4 h-4 shrink-0" />
                    <span>{t("metric1Value")}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {t("metric1Desc")}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span>{t("metric2Value")}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {t("metric2Desc")}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                    <Ship className="w-4 h-4 shrink-0" />
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
                      src={processBannerUrl}
                      alt="Chittagong E-Waste Sorting Line & Mechanical Disassembly Facility"
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
                        <span>Chittagong Sorting Floor</span>
                      </div>
                    </div>

                    {/* Top Right Pill */}
                    <div className="absolute top-3.5 right-3.5 z-10">
                      <div className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-emerald-950/85 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                        Basel Aligned
                      </div>
                    </div>

                    {/* Bottom Status Bar */}
                    <div className="absolute bottom-3.5 inset-x-3.5 z-10 flex items-center justify-between text-xs text-slate-200 px-3.5 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10">
                      <span className="font-semibold text-white truncate pr-2">
                        Mechanical Sorting & Segregation Line
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

      {/* 2. STAGE-BY-STAGE CONNECTED RECOVERY JOURNEY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60">
              <Workflow className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t("journeyBadge")}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">
              {t("journeyTitle")}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {t("journeySubtitle")}
            </p>
          </div>
        </ScrollReveal>

        {/* Chronological Connected Stages */}
        <div className="space-y-12 relative before:hidden lg:before:block before:absolute before:inset-y-12 before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-teal-500 before:to-emerald-800 before:opacity-30">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isEven = idx % 2 === 1;

            return (
              <ScrollReveal key={stage.num} delayMs={idx * 100}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 group">
                  {/* Visual Photo Card */}
                  <div
                    className={`lg:col-span-5 relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 shadow-md ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <Image
                      src={stage.image}
                      alt={stage.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

                    {/* Step Floating Badge */}
                    <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-md">
                        {stage.num}
                      </span>
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase bg-slate-900/90 text-slate-200 backdrop-blur-sm border border-white/10">
                        {stage.badge}
                      </span>
                    </div>

                    {/* Bottom Tag */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 z-10 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-emerald-300 bg-slate-950/80 px-2.5 py-1 rounded-md backdrop-blur-sm border border-emerald-500/20">
                        {stage.tag}
                      </span>
                    </div>
                  </div>

                  {/* Content & Deliverables Card */}
                  <div
                    className={`lg:col-span-7 space-y-4 ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
                          Stage {stage.num} of 04
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                          {stage.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                      {stage.desc}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {stage.detail}
                    </p>

                    {/* 3 Concrete Deliverable Pills */}
                    <div className="pt-2 space-y-2">
                      <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                        Quality Deliverables & Manifests:
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {stage.deliverables.map((deliv, dIdx) => (
                          <div
                            key={dIdx}
                            className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>{deliv}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* 3. ENVIRONMENTAL PROTECTION & WORKER SAFETY MATRIX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal>
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl space-y-8">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>{t("envBadge")}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t("envTitle")}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t("envSubtitle")}
              </p>
            </div>

            {/* 3 Safety & Compliance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">
                  {t("card1Title")}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t("card1Desc")}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Wind className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">
                  {t("card2Title")}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t("card2Desc")}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <Building2 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">
                  {t("card3Title")}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t("card3Desc")}
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. ENTERPRISE FACILITY AUDIT & TOUR RFQ CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal delayMs={100}>
          <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white border border-emerald-800/50 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>On-Site Inspection & Verification</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {t("ctaTitle")}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t("ctaSubtitle")}
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/inquiry"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-950/50 hover:shadow-emerald-400/25 transition-all duration-200 group/btn"
                >
                  <span>{t("ctaBtn")}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all duration-200"
                >
                  <span>{t("galleryBtn")}</span>
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
