import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/section-heading";
import { ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function ProcessPage() {
  const t = useTranslations("process");

  const steps = [
    {
      num: "01",
      title: t("step1Title"),
      desc: t("step1Desc"),
      detail:
        "Commercial lots and enterprise electronic hardware are logged and assigned traceability tracking codes upon intake at our Chittagong handling hub.",
    },
    {
      num: "02",
      title: t("step2Title"),
      desc: t("step2Desc"),
      detail:
        "Trained sorting teams classify circuit board grades based on component density, multilayer plating, and IC architecture to ensure pure batches.",
    },
    {
      num: "03",
      title: t("step3Title"),
      desc: t("step3Desc"),
      detail:
        "Subassemblies are physically dismantled using specialized tools. Batteries and hazardous capacitors are isolated into certified storage drums.",
    },
    {
      num: "04",
      title: t("step4Title"),
      desc: t("step4Desc"),
      detail:
        "Graded materials are packaged into export-ready super sacks or drums, palletized, and loaded into shipping containers for maritime transit.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <SectionHeading
        badge="Quality & Compliance"
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
                Stage {step.num}
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
          <span>Worker Safety & Zero Informal Acid Leaching</span>
        </div>
        <h3 className="text-xl font-bold">
          Strict Policy Against Informal Chemical Refining
        </h3>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          E-Waste Chittagong operates purely on physical dismantling, sorting, and mechanical segregation principles. We strictly prohibit crude open-burning, acid bath leaching, or environmentally destructive chemical stripping. All downstream pyrometallurgical refining is conducted exclusively by licensed, accredited international smelters.
        </p>
      </div>
    </div>
  );
}
