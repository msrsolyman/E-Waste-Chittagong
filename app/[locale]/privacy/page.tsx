import * as React from "react";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/section-heading";
import { Lock } from "lucide-react";

export default function PrivacyPolicyPage() {
  const t = useTranslations("privacy");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SectionHeading
        badge={t("badge")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {t("guarantee")}
          </span>
        </div>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            {t("sec1Title")}
          </h3>
          <p>{t("sec1Desc")}</p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            {t("sec2Title")}
          </h3>
          <p>{t("sec2Desc")}</p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            {t("sec3Title")}
          </h3>
          <p>{t("sec3Desc")}</p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            {t("sec4Title")}
          </h3>
          <p>{t("sec4Desc")}</p>
        </section>
      </div>
    </div>
  );
}
