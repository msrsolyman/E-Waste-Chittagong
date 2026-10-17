import * as React from "react";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/section-heading";
import { Truck, Cpu, Ship, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });

  const services = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { displayOrder: "asc" },
  });

  const iconMap: Record<string, React.ReactNode> = {
    Truck: <Truck className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />,
    Cpu: <Cpu className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />,
    Ship: <Ship className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SectionHeading
        badge={t("badge")}
        title={t("pageTitle")}
        subtitle={t("pageSubtitle")}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((svc) => {
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

          return (
            <div
              key={svc.id}
              className="p-6 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-emerald-600/40 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center">
                  {iconMap[svc.iconName || ""] || <ShieldCheck className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />}
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/inquiry"
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition group/link"
                >
                  <span>{t("requestService")}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
