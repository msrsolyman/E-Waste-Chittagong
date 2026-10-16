import * as React from "react";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/section-heading";
import { InquiryForm } from "@/components/inquiry-form";
import { MapPin, Mail, Phone, Clock, MessageSquare, Anchor } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SectionHeading
        badge="Direct Channels"
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            <h3 className="font-bold text-base text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Chittagong Commercial Desk
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                    {t("addressTitle")}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 mt-0.5">
                    {t("address")}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                    {t("emailTitle")}
                  </div>
                  <a
                    href={`mailto:${t("email")}`}
                    className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline mt-0.5 block"
                  >
                    {t("email")}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                    {t("phoneTitle")}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 mt-0.5">
                    {t("phone")}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                    {t("hoursTitle")}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 mt-0.5">
                    {t("hours")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Anchor className="w-4 h-4" />
              <span>{t("mapTitle")}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Operating within close distance of the Port of Chittagong enables direct handling of 20ft and 40ft containerized shipments, minimizing domestic drayage risks.
            </p>
          </div>
        </div>

        {/* Inquiry Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Send Us a Message
              </h3>
              <p className="text-xs text-slate-500">
                Reach out for material inspections, enterprise electronics decommissioning, or bulk purchase pricing.
              </p>
            </div>
            <InquiryForm />
          </div>
        </div>
      </div>
    </div>
  );
}
