import * as React from "react";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/section-heading";
import { ScrollReveal } from "@/components/scroll-reveal";
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
      <ScrollReveal>
        <SectionHeading
          badge={t("badge")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
      </ScrollReveal>

      {/* Process Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((step, idx) => (
          <ScrollReveal key={step.num} delayMs={idx * 100}>
            <div className="group p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 ease-out space-y-3 h-full">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-sm flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50 group-hover:scale-105 transition-transform duration-200">
                  {step.num}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors duration-200">
                {step.title}
              </h3>

              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                {step.desc}
              </p>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.detail}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Safety & Environment Banner */}
      <ScrollReveal delayMs={150}>
        <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-sm">
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
      </ScrollReveal>
    </div>
  );
}
