import * as React from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ScrollReveal } from "@/components/scroll-reveal";
import { RfqTrackerView } from "@/components/rfq-tracker-view";
import { ShieldCheck, Clock, Globe, ArrowRight, FileCheck, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tracking" });
  const tBrand = await getTranslations({ locale, namespace: "brand" });

  return {
    title: `${t("title")} | ${tBrand("name")}`,
    description: t("subtitle"),
  };
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "tracking" });

  return (
    <div className="min-h-screen py-10 sm:py-16 space-y-12">
      {/* Hero Section with Staggered Motion */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <ScrollReveal delayMs={50}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wide uppercase shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>{t("badge")}</span>
          </div>
        </ScrollReveal>

        <ScrollReveal delayMs={100}>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-tight">
            {t("title")}
          </h1>
        </ScrollReveal>

        <ScrollReveal delayMs={150}>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </ScrollReveal>
      </section>

      {/* Main Interactive Tracker View */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <React.Suspense
          fallback={
            <div className="p-16 text-center text-xs text-slate-400 animate-pulse">
              Loading tracking engine...
            </div>
          }
        >
          <RfqTrackerView />
        </React.Suspense>
      </main>

      {/* Trust & Verification Badges */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ScrollReveal delayMs={200}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 flex items-start gap-3.5 shadow-xs">
              <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  Real-Time Staging Desk
                </div>
                <div>Live milestone updates synced directly with Chittagong operations team.</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 flex items-start gap-3.5 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  Encrypted Confidentiality
                </div>
                <div>Buyer identity, email, and volume data are masked for enterprise privacy.</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 flex items-start gap-3.5 shadow-xs">
              <FileCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  Direct FOB / CIF Quotes
                </div>
                <div>Formal quotes include container logistics, assay specs, and port terms.</div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
