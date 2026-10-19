"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  X,
  MessageSquare,
  Mail,
  Copy,
  Check,
  Building2,
  ExternalLink,
  Users,
  FileCheck2,
  Percent,
  Clock,
  Sparkles,
  Phone,
  PackageCheck,
  ShieldCheck,
  Radio,
} from "lucide-react";
import type { CountryStat } from "@/lib/analytics-service";
import { useAdminLocale } from "@/lib/admin-i18n";

interface CountryIntelligenceDrawerProps {
  country: CountryStat | null;
  onClose: () => void;
}

export function CountryIntelligenceDrawer({
  country,
  onClose,
}: CountryIntelligenceDrawerProps) {
  const { locale, t } = useAdminLocale();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!country) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-Over Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl shadow-xs rounded-xl p-1 bg-slate-100 dark:bg-slate-800">
                  {country.flag}
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    {locale === "bn" ? country.nameBn : country.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {locale === "bn" ? `${country.name} • ${t("drawer.port")}` : `${country.nameBn} • ${t("drawer.port")}`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label={locale === "bn" ? "ড্রয়ার বন্ধ করুন" : "Close drawer"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Status Pill */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {country.activeNow ?? 2} {t("drawer.active_now")}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <Radio className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                <span>{t("drawer.live_sourcing")}</span>
              </span>
            </div>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* 4 Core Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>{t("drawer.total_visitors")}</span>
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {country.visitors.toLocaleString()}
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">
                  {t("drawer.global_volume")}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>{t("drawer.traffic_share")}</span>
                  <Percent className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {country.share}%
                </div>
                <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.min(100, country.share * 2.5)}%` }}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>{t("drawer.rfqs_received")}</span>
                  <FileCheck2 className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div className="text-xl font-black text-purple-600 dark:text-purple-400">
                  {country.inquiries} {t("table.unit_rfq")}
                </div>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium block">
                  {t("drawer.verified_quotations")}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>{t("drawer.conversion_rate")}</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="text-xl font-black text-amber-600 dark:text-amber-400">
                  {country.conversionRate}%
                </div>
                <span className="text-[10px] text-slate-500 block">
                  {t("drawer.visitor_to_buyer")}
                </span>
              </div>
            </div>

            {/* Primary Commodity Demand Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1.5">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <PackageCheck className="w-3.5 h-3.5" />
                <span>{t("drawer.primary_commodity")}</span>
              </span>
              <p className="text-sm font-black text-emerald-950 dark:text-emerald-100">
                {locale === "bn" ? country.primaryInterestBn : country.primaryInterest}
              </p>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400">
                {locale === "bn" ? country.primaryInterest : country.primaryInterestBn}
              </p>
            </div>

            {/* Recent RFQ Leads & Direct Contact Hub */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    {t("drawer.recent_leads")} ({country.recentLeads?.length || 0})
                  </span>
                </h4>
                <span className="text-[10px] font-semibold text-slate-400">
                  {t("drawer.direct_contact")}
                </span>
              </div>

              {country.recentLeads && country.recentLeads.length > 0 ? (
                <div className="space-y-3">
                  {country.recentLeads.map((lead) => {
                    const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
                    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                      `Hello ${lead.contactPerson}, regarding your E-Waste Chittagong RFQ (${lead.referenceNo || lead.id}) for ${lead.material}...`
                    )}`;
                    const mailtoUrl = `mailto:${lead.email}?subject=${encodeURIComponent(
                      `Quotation & Inventory Details: ${lead.referenceNo || "RFQ Inquiry"} - E-Waste Chittagong`
                    )}`;

                    return (
                      <div
                        key={lead.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 hover:border-emerald-500/50 transition-all"
                      >
                        {/* Company & Status */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block">
                              {lead.referenceNo} • {lead.date}
                            </span>
                            <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                              {lead.companyName}
                            </h5>
                            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                              {t("drawer.person")} {lead.contactPerson}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              lead.status === "QUOTED"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : lead.status === "NEW"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                            }`}
                          >
                            {lead.status}
                          </span>
                        </div>

                        {/* Order Specifications */}
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
                          <div className="text-slate-700 dark:text-slate-300">
                            <span className="text-slate-400 text-[11px]">{t("drawer.product")} </span>
                            <strong className="text-slate-900 dark:text-white">
                              {locale === "bn" ? lead.materialBn : lead.material}
                            </strong>
                          </div>
                          <div className="text-slate-700 dark:text-slate-300">
                            <span className="text-slate-400 text-[11px]">{t("drawer.volume")} </span>
                            <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                              {lead.quantity}
                            </strong>
                          </div>
                        </div>

                        {/* Direct Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xs transition active:scale-95"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{t("drawer.whatsapp")}</span>
                          </a>
                          <a
                            href={mailtoUrl}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-95"
                          >
                            <Mail className="w-3.5 h-3.5 text-blue-500" />
                            <span>{t("drawer.email")}</span>
                          </a>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                `${lead.companyName} (${lead.contactPerson}) - ${lead.email} - ${lead.phone} - ${lead.material} (${lead.quantity})`,
                                lead.id
                              )
                            }
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title={t("drawer.copy_title")}
                          >
                            {copiedId === lead.id ? (
                              <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-1">
                  <p>{t("drawer.no_leads")}</p>
                  <span className="text-[10px] text-slate-400">
                    {t("drawer.no_leads_desc")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {t("drawer.yard_intel")}
            </span>
            <Link
              href="/admin/inquiries"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition active:scale-98"
            >
              <span>{t("drawer.view_all_rfq")}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
