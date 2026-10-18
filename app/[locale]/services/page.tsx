import * as React from "react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ScrollReveal } from "@/components/scroll-reveal";
import {
  Truck,
  Cpu,
  Ship,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  FileText,
  Lock,
  CheckCircle2,
  Sparkles,
  Layers,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });

  let servicesBannerUrl =
    "https://res.cloudinary.com/jpzhmh1r/image/upload/v1792329707/ewaste-chittagong/banners/services-hero-banner.jpg";

  const [rawServices, bannerSetting] = await Promise.all([
    prisma.service.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.companySetting.findUnique({
      where: { key: "services_banner" },
    }),
  ]);

  if (bannerSetting?.value) {
    try {
      const parsed = JSON.parse(bannerSetting.value);
      if (parsed.url) servicesBannerUrl = parsed.url;
    } catch (err) {
      console.error("Failed to parse services_banner setting:", err);
    }
  }

  // Visual Assets & Scope of Work mapped to each service
  const serviceExtras: Record<
    number,
    {
      image: string;
      scopesEn: string[];
      scopesBn: string[];
      scopesZh: string[];
      scopesJa: string[];
    }
  > = {
    0: {
      image: "/images/products/facility-dismantling.jpg",
      scopesEn: [
        "Corporate IT Asset Retirement",
        "Chain of Custody Intake Manifest",
        "Safe Transit & Inbound Logistics",
      ],
      scopesBn: [
        "কর্পোরেট আইটি অ্যাসেট অবসর",
        "স্বচ্ছ চেইন অব কাস্টডি ম্যানিফেস্ট",
        "নিরাপদ মেটেরিয়াল পরিবহন লজিস্টিকস",
      ],
      scopesZh: [
        "企业级 IT 资产正规退役",
        "全程监管链台账清单",
        "安全物流与入厂交接",
      ],
      scopesJa: [
        "企業IT資産の適正廃棄処理",
        "トレーサビリティ受入記録の作成",
        "安全輸送およびロジスティクス管理",
      ],
    },
    1: {
      image: "/images/products/pcb-motherboards.jpg",
      scopesEn: [
        "Manual Component Segregation",
        "IC & Circuit Board Grading",
        "Hazardous Battery Isolation",
      ],
      scopesBn: [
        "ম্যানুয়াল উপাদান পৃথকীকরণ",
        "আইসি ও সার্কিট বোর্ড গ্রেডিং",
        "ক্ষতিকারক ব্যাটারি নিরাপদ নিষ্কাশন",
      ],
      scopesZh: [
        "纯手工精细化物理分选",
        "高品位主板与芯片等级标定",
        "有害电池与电容安全隔离",
      ],
      scopesJa: [
        "熟練作業員による手作業選別",
        "基板・ICチップの高精度グレーディング",
        "有害バッテリー・コンデンサの分離",
      ],
    },
    2: {
      image: "/images/products/telecom-boards.jpg",
      scopesEn: [
        "Chittagong Port Container Stuffing",
        "FOB / CIF Export Documentation",
        "Licensed Smelter Deliveries",
      ],
      scopesBn: [
        "চট্টগ্রাম বন্দর কন্টেইনার স্টাফিং",
        "FOB / CIF আন্তর্জাতিক রপ্তানি ডকুমেন্টস",
        "স্বীকৃত আন্তর্জাতিক রিফাইনারে সরবরাহ",
      ],
      scopesZh: [
        "吉大港直接集装箱装箱",
        "标准 FOB / CIF 出口全套单据",
        "全球合规冶炼厂直供",
      ],
      scopesJa: [
        "チッタゴン港直結のコンテナ詰め",
        "FOB / CIF 貿易書類作成対応",
        "認定リファイン製錬所への納入",
      ],
    },
  };

  const iconMap: Record<string, React.ReactNode> = {
    Truck: <Truck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />,
    Cpu: <Cpu className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />,
    Ship: <Ship className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />,
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-20 overflow-hidden">
      {/* 1. CINEMATIC ENTERPRISE SERVICES SPLIT-HERO BANNER */}
      <section className="relative pt-8 pb-14 lg:pt-16 lg:pb-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/70 overflow-hidden">
        {/* Subtle Tech Grid Backdrop */}
        <div className="absolute inset-0 bg-grid-tech mask-radial opacity-60 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column (7 cols): Executive Presentation & Capability Strip */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Operational Status Pill */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-white/95 dark:bg-slate-900/90 text-emerald-700 dark:text-emerald-400 border border-slate-200/80 dark:border-slate-800 shadow-2xs backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>{t("liveBadge")}</span>
              </div>

              {/* Authoritative Page Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.16]">
                {t("pageTitle")}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
                {t("pageSubtitle")}
              </p>

              {/* 3-Item Trust & Operational Capability Metric Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs sm:text-sm">
                    <Truck className="w-4 h-4 shrink-0" />
                    <span>{t("metric1Value")}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    {t("metric1Desc")}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs sm:text-sm">
                    <Cpu className="w-4 h-4 shrink-0" />
                    <span>{t("metric2Value")}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    {t("metric2Desc")}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs sm:text-sm">
                    <Ship className="w-4 h-4 shrink-0" />
                    <span>{t("metric3Value")}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    {t("metric3Desc")}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Dynamic Cloudinary Hero Banner with Metallic Glow & Floating Badges */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-2xl lg:rounded-3xl overflow-hidden border border-emerald-500/20 dark:border-emerald-500/30 shadow-2xl bg-slate-950 transition-all duration-500 group">
                <Image
                  src={servicesBannerUrl}
                  alt="E-Waste Chittagong Enterprise Decommissioning Facility"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  unoptimized={servicesBannerUrl.startsWith("http")}
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
                  Enterprise B2B
                </div>

                {/* Bottom Caption Bar */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 px-3.5 py-2.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 text-white flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200 truncate pr-2">
                    Decommissioning & Mechanical Segregation
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono font-bold shrink-0">
                    100% Verified
                  </span>
                </div>
              </div>

              {/* Decorative Corner Glow */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. DUAL-MEDIA CORPORATE SERVICE CARDS WITH SCOPE OF WORK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <ScrollReveal>
          <div className="space-y-2 text-left">
            <div className="text-xs font-bold tracking-widest uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t("badge")}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t("title")}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {rawServices.map((svc, idx) => {
            let title = svc.titleEn;
            let description = svc.descriptionEn;

            if (locale === "bn") {
              if (svc.titleBn) title = svc.titleBn;
              if (svc.descriptionBn) description = svc.descriptionBn;
            } else if (locale === "zh-CN") {
              if (svc.titleZh) title = svc.titleZh;
              if (svc.descriptionZh) description = svc.descriptionZh;
            } else if (locale === "ja") {
              if (svc.titleJa) title = svc.titleJa;
              if (svc.descriptionJa) description = svc.descriptionJa;
            }

            const extra = serviceExtras[idx] || serviceExtras[0];
            let scopes = extra.scopesEn;
            if (locale === "bn") scopes = extra.scopesBn;
            else if (locale === "zh-CN") scopes = extra.scopesZh;
            else if (locale === "ja") scopes = extra.scopesJa;

            return (
              <ScrollReveal key={svc.id} delayMs={idx * 100}>
                <div className="group flex flex-col rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-2xl hover:shadow-emerald-950/10 dark:hover:shadow-emerald-950/20 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 hover:-translate-y-1.5 transition-all duration-300 ease-out h-full">
                  {/* Photo Header with Floating Icon Badge */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={extra.image}
                      alt={title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />

                    {/* Floating Icon Badge */}
                    <div className="absolute top-3.5 left-3.5 p-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center">
                      {iconMap[svc.iconName || ""] || (
                        <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                      )}
                    </div>

                    {/* Step Number Tag */}
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-mono font-bold tracking-wider uppercase">
                      Stream 0{idx + 1}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 leading-snug">
                        {title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                        {description}
                      </p>

                      {/* 3 Scope of Work / Deliverable Pills */}
                      <div className="space-y-1.5 pt-2">
                        {scopes.map((scope, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="font-medium truncate">{scope}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Link
                        href={`/inquiry?service=${encodeURIComponent(svc.slug)}`}
                        className="inline-flex items-center justify-between w-full py-3 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600 dark:bg-slate-800 dark:hover:from-emerald-600 dark:hover:to-teal-600 text-slate-800 dark:text-slate-200 hover:text-white shadow-2xs hover:shadow-md hover:shadow-emerald-950/20 active:scale-[0.98] transition-all duration-200 group/btn"
                      >
                        <span>{t("requestService")}</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* 3. 4-COLUMN OPERATIONAL SLA & COMPLIANCE STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal>
          <div className="space-y-2 text-left">
            <div className="text-xs font-bold tracking-widest uppercase text-emerald-700 dark:text-emerald-400">
              {t("slaBadge")}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t("slaTitle")}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {t("slaDesc")}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <ScrollReveal delayMs={0}>
            <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 space-y-3 h-full">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {t("sla1Title")}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t("sla1Desc")}
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={80}>
            <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 space-y-3 h-full">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {t("sla2Title")}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t("sla2Desc")}
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={160}>
            <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 space-y-3 h-full">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center">
                <Ship className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {t("sla3Title")}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t("sla3Desc")}
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={240}>
            <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 space-y-3 h-full">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {t("sla4Title")}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t("sla4Desc")}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. ENTERPRISE CONSULTATION & PARTNERSHIP CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative rounded-3xl overflow-hidden border border-emerald-900/30 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-8 sm:p-12 lg:p-14 shadow-2xl">
            {/* Tech Ambient Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/70 border border-emerald-500/30 text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enterprise Decommissioning Partner</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {t("ctaTitle")}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {t("ctaSubtitle")}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <Link
                  href="/inquiry"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98] transition-all duration-200 group/btn"
                >
                  <span>{t("ctaBtn")}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </Link>

                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm backdrop-blur-md active:scale-[0.98] transition-all duration-200"
                >
                  <span>{t("exploreBtn")}</span>
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
