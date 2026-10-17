import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/section-heading";
import { ShieldCheck, Target, Globe, Anchor } from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Title */}
      <SectionHeading
        badge={t("badge")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      {/* Main Narrative with Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>

          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600" />
            <div>
              <div className="font-bold">{t("policyTitle")}</div>
              <div>{t("policyDesc")}</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg bg-slate-900">
            <Image
              src="/images/products/facility-dismantling.jpg"
              alt="E-Waste Chittagong Organized Sorting Workstation"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Strategic Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 space-y-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{t("missionTitle")}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("missionDesc")}
          </p>
        </div>

        <div className="group p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 space-y-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
            <Anchor className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{t("portTitle")}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("portDesc")}
          </p>
        </div>

        <div className="group p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/50 hover:-translate-y-1 transition-all duration-300 space-y-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{t("readinessTitle")}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("readinessDesc")}
          </p>
        </div>
      </div>
    </div>
  );
}
