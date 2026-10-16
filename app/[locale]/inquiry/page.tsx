import * as React from "react";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/section-heading";
import { InquiryForm } from "@/components/inquiry-form";
import { ShieldCheck, Mail, Globe, Clock } from "lucide-react";

export default function InquiryPage() {
  const t = useTranslations("inquiry");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SectionHeading
        badge="Commercial Trade"
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
        <InquiryForm />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">Prompt Response</div>
            <div>Official quotes issued within 24 business hours.</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5">
          <Globe className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">Global Export Terms</div>
            <div>FOB Chittagong Sea Port or CIF worldwide available.</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">Confidentiality Assured</div>
            <div>Buyer specifications kept strictly confidential.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
