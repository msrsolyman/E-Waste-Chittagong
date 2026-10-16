import * as React from "react";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/section-heading";
import { Truck, Cpu, Ship, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const services = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { displayOrder: "asc" },
  });

  const iconMap: Record<string, React.ReactNode> = {
    Truck: <Truck className="w-6 h-6 text-emerald-600" />,
    Cpu: <Cpu className="w-6 h-6 text-blue-600" />,
    Ship: <Ship className="w-6 h-6 text-purple-600" />,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SectionHeading
        badge="Corporate Services"
        title="Comprehensive Electronic Waste & Material Solutions"
        subtitle="End-to-end recycling solutions tailored for telecom providers, corporations, and international commodity refiners."
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
              className="p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md hover:border-emerald-500/40 transition"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {iconMap[svc.iconName || ""] || <ShieldCheck className="w-6 h-6 text-emerald-600" />}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/inquiry"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition"
                >
                  <span>Request Service Information</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
