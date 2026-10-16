import * as React from "react";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/section-heading";
import { ShieldCheck } from "lucide-react";

export default function ProcessPage() {
  const t = useTranslations("process");

  const steps = [
    {
      num: "01",
      title: t("step1Title"),
      desc: t("step1Desc"),
      detail: t("step1Detail"),
    },
    {
      num: "02",
      title: t("step2Title"),
      desc: t("step2Desc"),
      detail: t("step2Detail"),
    },
    {
      num: "03",
      title: t("step3Title"),
      desc: t("step3Desc"),
      detail: t("step3Detail"),
    },
    {
      num: "04",
      title: t("step4Title"),
      desc: t("step4Desc"),
      detail: t("step4Detail"),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <SectionHeading
        badge={t("badge")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      {/* Process Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((step) => (
          <div
            key={step.num}
            className="p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {step.num}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                {t("stage")} {step.num}
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {step.title}
            </h3>

            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
              {step.desc}
            </p>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {step.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Safety & Environment Banner */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>{t("safetyBadge")}</span>
        </div>
        <h3 className="text-xl font-bold">
          {t("safetyTitle")}
        </h3>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          {t("safetyDesc")}
        </p>
      </div>
    </div>
  );
}
