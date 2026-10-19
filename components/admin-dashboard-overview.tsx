"use client";

import * as React from "react";
import Link from "next/link";
import {
  Inbox,
  Package,
  Layers,
  FileClock,
  ArrowRight,
  CheckCircle,
  PlusCircle,
  Image as ImageIcon,
  Users,
  ShieldCheck,
  Download,
  ExternalLink,
} from "lucide-react";
import { AdminSuperDashboard } from "@/components/admin-super-dashboard";
import { AdminLanguageSwitcher } from "@/components/admin-language-switcher";
import { useAdminLocale } from "@/lib/admin-i18n";

interface AdminDashboardOverviewProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  stats: {
    totalInquiries: number;
    newInquiries: number;
    quotedInquiries: number;
    totalProducts: number;
    publishedProducts: number;
    totalCategories: number;
    totalGalleryItems: number;
    totalUsers: number;
  };
  recentInquiries: Array<{
    id: string;
    referenceNo: string;
    status: string;
    companyName: string;
    name: string;
    email: string;
    country: string;
    estimatedQty: string | null;
    createdAt: Date | string;
  }>;
  recentAuditLogs: Array<{
    id: string;
    action: string;
    details: string | null;
    ipAddress: string | null;
    createdAt: Date | string;
    user: { name: string; email: string } | null;
  }>;
  geoAnalyticsData: any;
}

export function AdminDashboardOverview({
  user,
  stats,
  recentInquiries,
  recentAuditLogs,
  geoAnalyticsData,
}: AdminDashboardOverviewProps) {
  const { locale, t } = useAdminLocale();

  const statusTranslations: Record<string, { bn: string; en: string }> = {
    NEW: { bn: "নতুন", en: "NEW" },
    CONTACTED: { bn: "যোগাযোগকৃত", en: "CONTACTED" },
    IN_PROGRESS: { bn: "চলমান", en: "IN PROGRESS" },
    QUOTED: { bn: "কোটেশন প্রেরিত", en: "QUOTED" },
    CLOSED: { bn: "সম্পন্ন", en: "CLOSED" },
  };

  const statusColors: Record<string, string> = {
    NEW: "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300",
    CONTACTED: "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300",
    IN_PROGRESS: "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300",
    QUOTED: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300",
    CLOSED: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
  };

  return (
    <div className="space-y-8 select-none">
      {/* Header & Quick Action Hub */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t("header.title")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>
              {t("header.welcome")}{" "}
              <strong className="text-emerald-600 dark:text-emerald-400">
                {user.name}
              </strong>
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="inline-flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                {user.role === "SUPER_ADMIN"
                  ? t("nav.super_admin")
                  : t("nav.content_manager")}
              </span>
            </span>
          </p>
        </div>

        {/* Quick Action Hub & Language Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Top Header Language Switcher */}
          <AdminLanguageSwitcher compact={false} />

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition active:scale-[0.98]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t("header.add_product")}</span>
          </Link>
          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition"
          >
            <Inbox className="w-3.5 h-3.5 text-blue-600" />
            <span>{t("header.rfq_pipeline")}</span>
          </Link>
          <Link
            href="/admin/gallery"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition"
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
            <span>{t("header.upload_media")}</span>
          </Link>
          <a
            href="/api/admin/inquiries/export"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition"
            title={locale === "bn" ? "ইনকোয়ারি CSV ডাউনলোড" : "Download Inquiries as CSV"}
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t("header.export_inquiries")}</span>
          </a>
        </div>
      </div>

      {/* KPI Stats Grid - 6 Core Management Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-3.5">
        {/* New Leads */}
        <Link
          href="/admin/inquiries?status=NEW"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5 hover:border-blue-500/50 hover:shadow-md transition-all group block"
        >
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {t("kpi.new_inquiries")}
            </span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 group-hover:scale-105 transition-transform">
              <Inbox className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {stats.newInquiries}
          </div>
          <div className="text-[10px] text-slate-400">
            {locale === "bn"
              ? `মোট ${stats.totalInquiries}টি লিড থেকে`
              : `Of ${stats.totalInquiries} total leads`}
          </div>
        </Link>

        {/* Quoted Deals */}
        <Link
          href="/admin/inquiries?status=QUOTED"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5 hover:border-emerald-500/50 hover:shadow-md transition-all group block"
        >
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {t("kpi.quoted_deals")}
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 group-hover:scale-105 transition-transform">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {stats.quotedInquiries}
          </div>
          <div className="text-[10px] text-slate-400">
            {t("kpi.active_negotiations")}
          </div>
        </Link>

        {/* Products */}
        <Link
          href="/admin/products"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5 hover:border-amber-500/50 hover:shadow-md transition-all group block"
        >
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <span className="group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {t("kpi.catalogue_items")}
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 group-hover:scale-105 transition-transform">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {stats.publishedProducts}
          </div>
          <div className="text-[10px] text-slate-400">
            {locale === "bn"
              ? `${stats.totalProducts - stats.publishedProducts}টি ড্রাফট বাকি`
              : `${stats.totalProducts - stats.publishedProducts} drafts pending`}
          </div>
        </Link>

        {/* Categories */}
        <Link
          href="/admin/categories"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5 hover:border-purple-500/50 hover:shadow-md transition-all group block"
        >
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <span className="group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {t("kpi.taxonomies")}
            </span>
            <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 group-hover:scale-105 transition-transform">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {stats.totalCategories}
          </div>
          <div className="text-[10px] text-slate-400">
            {t("kpi.recycling_streams")}
          </div>
        </Link>

        {/* Media & Gallery */}
        <Link
          href="/admin/gallery"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5 hover:border-teal-500/50 hover:shadow-md transition-all group block"
        >
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <span className="group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              {t("kpi.media_assets")}
            </span>
            <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 group-hover:scale-105 transition-transform">
              <ImageIcon className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {stats.totalGalleryItems}
          </div>
          <div className="text-[10px] text-slate-400">
            {t("kpi.facility_photos")}
          </div>
        </Link>

        {/* Personnel / Admin Users */}
        <Link
          href="/admin/users"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5 hover:border-indigo-500/50 hover:shadow-md transition-all group block"
        >
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {t("kpi.admin_team")}
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 group-hover:scale-105 transition-transform">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {stats.totalUsers}
          </div>
          <div className="text-[10px] text-slate-400">
            {t("kpi.registered_personnel")}
          </div>
        </Link>
      </div>

      {/* Global Buyer Traffic & International Geo-Analytics Super Dashboard */}
      <AdminSuperDashboard initialData={geoAnalyticsData} />

      {/* Two-Column Section: Recent Inquiries & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Inquiries (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Inbox className="w-4 h-4 text-emerald-600" />
              <span>
                {locale === "bn"
                  ? "সর্বশেষ ইনকোয়ারি (RFQ পাইপলাইন)"
                  : "Latest Inquiries (RFQ Pipeline)"}
              </span>
            </h3>
            <Link
              href="/admin/inquiries"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1"
            >
              <span>{locale === "bn" ? "সম্পূর্ণ পাইপলাইন দেখুন" : "View All Pipeline"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-400">
              {locale === "bn"
                ? "কোনো ক্রেতার অনুসন্ধান রেকর্ড করা নেই।"
                : "No buyer inquiries recorded yet."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200/60 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">
                      {locale === "bn" ? "রেফারেন্স" : "Reference"}
                    </th>
                    <th className="py-2.5 px-3">
                      {locale === "bn" ? "প্রতিষ্ঠান ও যোগাযোগ" : "Company / Contact"}
                    </th>
                    <th className="py-2.5 px-3">
                      {locale === "bn" ? "দেশ" : "Country"}
                    </th>
                    <th className="py-2.5 px-3">
                      {locale === "bn" ? "স্ট্যাটাস" : "Status"}
                    </th>
                    <th className="py-2.5 px-3">
                      {locale === "bn" ? "তারিখ" : "Date"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentInquiries.map((inq) => {
                    const st = statusTranslations[inq.status] || {
                      bn: inq.status,
                      en: inq.status,
                    };
                    const statusText = locale === "bn" ? st.bn : st.en;
                    const dateFormatted = new Date(inq.createdAt).toLocaleDateString(
                      locale === "bn" ? "bn-BD" : "en-US",
                      { year: "numeric", month: "short", day: "numeric" }
                    );

                    return (
                      <tr
                        key={inq.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
                      >
                        <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                          <Link
                            href={`/admin/inquiries?search=${inq.referenceNo}`}
                            className="hover:underline text-emerald-600 dark:text-emerald-400"
                          >
                            {inq.referenceNo}
                          </Link>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {inq.companyName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {inq.name} ({inq.email})
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                          {inq.country}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              statusColors[inq.status] ||
                              "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {statusText}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-400 text-[11px]">
                          {dateFormatted}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Audit Log Stream (1 Col) */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <FileClock className="w-4 h-4 text-slate-500" />
              <span>
                {locale === "bn"
                  ? "সাম্প্রতিক নিরাপত্তা ও অডিট লগ"
                  : "Recent Activity Stream"}
              </span>
            </h3>
            <Link
              href="/admin/audit-logs"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1"
            >
              <span>{locale === "bn" ? "সম্পূর্ণ লগ" : "Full Log"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentAuditLogs.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-400">
              {locale === "bn"
                ? "কোনো নিরাপত্তা লগ পাওয়া যায়নি।"
                : "No security or audit events recorded yet."}
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentAuditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 space-y-1 hover:border-emerald-500/30 transition"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {log.action}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      {new Date(log.createdAt).toLocaleTimeString(
                        locale === "bn" ? "bn-BD" : "en-US",
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                    {log.user
                      ? `${log.user.name} (${log.user.email})`
                      : locale === "bn"
                      ? "সিস্টেম / স্বয়ংক্রিয়"
                      : "System / Automated"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
