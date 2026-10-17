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
        <div className="p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-emerald-600/40 transition-colors space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">{t("missionTitle")}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("missionDesc")}
          </p>
        </div>

        <div className="p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-emerald-600/40 transition-colors space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center">
            <Anchor className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">{t("portTitle")}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("portDesc")}
          </p>
        </div>

        <div className="p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-emerald-600/40 transition-colors space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">{t("readinessTitle")}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t("readinessDesc")}
          </p>
        </div>
      </div>
    </div>
  );
}
