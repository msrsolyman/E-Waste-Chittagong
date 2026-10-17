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
            className="group p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 space-y-4 relative overflow-hidden"
          >
            {/* Subtle corner glow on hover */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 group-hover:bg-emerald-500/10 rounded-bl-full transition-all duration-300 pointer-events-none" />

            <div className="flex items-center justify-between">
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {step.num}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 px-3 py-1 rounded-full">
                {t("stage")} {step.num}
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {step.title}
            </h3>

            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
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
