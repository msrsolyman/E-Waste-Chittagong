"use client";

import * as React from "react";
import { useState } from "react";
import {
  Globe2,
  TrendingUp,
  Building2,
  Users,
  FileCheck2,
  Percent,
  Sparkles,
  MapPin,
  Laptop,
  Smartphone,
  Tablet,
  ArrowUpRight,
  Radio,
  Layers,
  ChevronRight,
} from "lucide-react";
import type { SuperDashboardData, CountryStat, CityHubStat } from "@/lib/analytics-service";
import { RealisticWorldMap } from "@/components/realistic-world-map";
import { CountryIntelligenceDrawer } from "@/components/country-intelligence-drawer";
import { CHITTAGONG_EPICENTER } from "@/lib/world-gis-data";
import { useAdminLocale } from "@/lib/admin-i18n";

interface AdminSuperDashboardProps {
  initialData: SuperDashboardData;
}

export function AdminSuperDashboard({ initialData }: AdminSuperDashboardProps) {
  const { locale, t } = useAdminLocale();
  const [data, setData] = useState<SuperDashboardData>(initialData);
  const [timeRange, setTimeRange] = useState<"today" | "7d" | "30d" | "all">("30d");
  const [activeTab, setActiveTab] = useState<"map" | "countries" | "cities" | "trends">("map");
  const [hoveredHub, setHoveredHub] = useState<CountryStat | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryStat | null>(null);

  const [isLoadingRange, setIsLoadingRange] = useState(false);

  // Time filter handler - dynamically queries real live analytics
  const handleTimeRangeChange = async (range: "today" | "7d" | "30d" | "all") => {
    setTimeRange(range);
    setIsLoadingRange(true);
    try {
      const res = await fetch(`/api/admin/analytics?range=${range}`);
      if (res.ok) {
        const liveData: SuperDashboardData = await res.json();
        setData(liveData);
      }
    } catch (err) {
      console.error("[Live Analytics Fetch Error]:", err);
    } finally {
      setIsLoadingRange(false);
    }
  };

  const chittagongPort = CHITTAGONG_EPICENTER;

  // Generate SVG path for trend chart
  const trendMax = Math.max(...data.dailyTrends.map((d) => d.visitors), 10);
  const chartWidth = 800;
  const chartHeight = 160;
  const divisor = Math.max(1, data.dailyTrends.length - 1);
  const points = data.dailyTrends.map((d, i) => {
    const x = (i / divisor) * chartWidth;
    const y = chartHeight - (d.visitors / trendMax) * (chartHeight - 30) - 15;
    return `${x},${y}`;
  });
  const trendPathD = `M 0,${chartHeight} L ${points.join(" L ")} L ${chartWidth},${chartHeight} Z`;
  const trendLineD = `M ${points.join(" L ")}`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm space-y-6 overflow-hidden relative">
      {/* Top Header & Live Radar Status */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {t("radar.badge")}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>
                {data.liveVisitorsNow} {t("radar.active_now")}
              </span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Globe2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>{t("radar.heading")}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            {t("radar.subheading")}
          </p>
        </div>

        {/* Time Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 self-start xl:self-center">
          <button
            type="button"
            onClick={() => handleTimeRangeChange("today")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              timeRange === "today"
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {t("time.today")}
          </button>
          <button
            type="button"
            onClick={() => handleTimeRangeChange("7d")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              timeRange === "7d"
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {t("time.7d")}
          </button>
          <button
            type="button"
            onClick={() => handleTimeRangeChange("30d")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              timeRange === "30d"
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {t("time.30d")}
          </button>
          <button
            type="button"
            onClick={() => handleTimeRangeChange("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              timeRange === "all"
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {t("time.all")}
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {t("metric.total_visitors")}
            </span>
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {data.totalVisitors.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5 mt-0.5">
            <TrendingUp className="w-3 h-3" />
            {t("metric.growth")}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {t("metric.active_countries")}
            </span>
            <Globe2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {data.activeCountriesCount} {t("metric.countries_count")}
          </p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">
            {t("metric.top_country")}{" "}
            <strong className="text-slate-800 dark:text-slate-200">
              {locale === "bn" ? data.topCountryBn : data.topCountry}
            </strong>
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {t("metric.inquiries_received")}
            </span>
            <FileCheck2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {data.totalInquiries} {t("metric.rfq_count")}
          </p>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium flex items-center gap-0.5 mt-0.5">
            <Sparkles className="w-3 h-3" />
            {t("metric.verified_quotations")}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {t("metric.conversion_rate")}
            </span>
            <Percent className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {data.globalConversionRate}%
          </p>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-0.5 block">
            {t("metric.visitor_to_lead")}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {t("metric.device_split")}
            </span>
            <Laptop className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {data.deviceBreakdown.desktop}%
            </p>
            <span className="text-xs text-slate-500">{t("metric.desktop")}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
            <span className="flex items-center gap-0.5">
              <Smartphone className="w-2.5 h-2.5" />
              {data.deviceBreakdown.mobile}% {t("metric.mobile")}
            </span>
            <span className="flex items-center gap-0.5">
              <Tablet className="w-2.5 h-2.5" />
              {data.deviceBreakdown.tablet}% {t("metric.tablet")}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("map")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "map"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Globe2 className="w-3.5 h-3.5" />
          <span>{t("tab.map")}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("countries")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "countries"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>
            {t("tab.countries")} ({data.countryStats.length})
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("cities")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "cities"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>
            {t("tab.cities")} ({data.cityHubs.length})
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("trends")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "trends"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{t("tab.trends")}</span>
        </button>
      </div>

      {/* Tab 1: Realistic High-Definition World Map with Flowing Comets */}
      {activeTab === "map" && (
        <RealisticWorldMap
          countryStats={data.countryStats}
          chittagongPort={chittagongPort}
          hoveredHub={hoveredHub}
          selectedHub={selectedCountry}
          onHoverHub={setHoveredHub}
          onSelectHub={setSelectedCountry}
        />
      )}

      {/* Tab 2: Country Rankings Table with Click-to-Drawer Action */}
      {activeTab === "countries" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-3.5">{t("table.rank")}</th>
                    <th className="py-3 px-3.5">{t("table.country_market")}</th>
                    <th className="py-3 px-3.5 text-right">{t("table.visitors")}</th>
                    <th className="py-3 px-3.5">{t("table.traffic_share")}</th>
                    <th className="py-3 px-3.5 text-center">{t("table.inquiries")}</th>
                    <th className="py-3 px-3.5 text-right">{t("table.conversion_rate")}</th>
                    <th className="py-3 px-3.5">{t("table.primary_interest")}</th>
                    <th className="py-3 px-3.5 text-right">{t("table.action")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {data.countryStats.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-xs text-slate-400">
                        {locale === "bn"
                          ? "এই সময়ের মধ্যে কোনো আন্তর্জাতিক ভিজিটর লগ পাওয়া যায়নি।"
                          : "No international visitor records tracked in this time range."}
                      </td>
                    </tr>
                  ) : (
                    data.countryStats.map((c, index) => (
                    <tr
                      key={c.code}
                      onClick={() => setSelectedCountry(c)}
                      className="hover:bg-emerald-50/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-3.5 font-bold text-slate-400 text-center">
                        #{index + 1}
                      </td>
                      <td className="py-3 px-3.5 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="text-xl">{c.flag}</span>
                        <div>
                          <span className="block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {locale === "bn" ? c.nameBn : c.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {locale === "bn" ? c.name : c.nameBn}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-right font-black text-slate-900 dark:text-white">
                        {c.visitors.toLocaleString()}
                      </td>
                      <td className="py-3 px-3.5 min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, c.share * 2.5)}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] w-10 text-right">
                            {c.share}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          {c.inquiries} {t("table.unit_rfq")}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        {c.conversionRate}%
                      </td>
                      <td className="py-3 px-3.5 text-slate-600 dark:text-slate-400 font-medium">
                        {locale === "bn" ? c.primaryInterestBn : c.primaryInterest}
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCountry(c);
                              setActiveTab("map");
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-600 text-emerald-700 hover:text-white dark:text-emerald-300 dark:hover:text-white font-bold text-[11px] flex items-center gap-1 transition"
                            title={locale === "bn" ? "ম্যাপে জুম করে জেলা ও শহর দেখুন" : "Zoom map to inspect cities & districts"}
                          >
                            <MapPin className="w-3 h-3" />
                            <span>{t("table.map_zoom")}</span>
                          </button>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-emerald-500">
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Major Commercial City Hubs with Click Action */}
      {activeTab === "cities" && (
        data.cityHubs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            {locale === "bn"
              ? "এই সময়ের জন্য কোনো সক্রিয় বাণিজ্যিক হাব ডেটা রেকর্ড করা নেই।"
              : "No commercial city hubs recorded in this time range."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {data.cityHubs.map((hub) => {
              const matchedCountry = data.countryStats.find((c) => c.name === hub.country);

              return (
                <div
                  key={hub.city}
                  onClick={() => {
                    if (matchedCountry) {
                      setSelectedCountry(matchedCountry);
                      setActiveTab("map");
                    }
                  }}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-md transition-all space-y-2.5 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{hub.flag}</span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {locale === "bn" ? hub.cityBn : hub.city}
                      </h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {hub.city}, {locale === "bn" ? hub.countryBn : hub.country}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      hub.status === "High Volume"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : hub.status === "Active Deals"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                    }`}
                  >
                    {locale === "bn" ? hub.statusBn : hub.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center bg-white dark:bg-slate-900/60 rounded-xl p-2 border border-slate-200/80 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">{t("cities.visitors")}</span>
                    <strong className="font-black text-slate-900 dark:text-white">
                      {hub.visitors.toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">{t("cities.inquiries")}</span>
                    <strong className="font-black text-emerald-600 dark:text-emerald-400">
                      {hub.inquiries} {t("cities.unit_rfq")}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <div className="flex items-start gap-1.5 text-slate-600 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{locale === "bn" ? hub.specialtyBn : hub.specialty}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* Tab 4: Traffic Velocity Trend Curve */}
      {activeTab === "trends" && (
        <div className="space-y-4">
          <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>{t("trends.title")}</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {t("trends.subtitle")}
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800">
                {t("trends.peak")} {trendMax} {t("trends.unit")}
              </span>
            </div>

            {/* Pure SVG Velocity Wave */}
            <div className="w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-44 select-none"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid Guides */}
                <line x1="0" y1="30" x2={chartWidth} y2="30" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                <line x1="0" y1="80" x2={chartWidth} y2="80" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                <line x1="0" y1="130" x2={chartWidth} y2="130" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />

                {/* Shaded Area */}
                <path d={trendPathD} fill="url(#trendGradient)" />

                {/* Top Stroke Line */}
                <path
                  d={trendLineD}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                {data.dailyTrends.map((d, i) => {
                  if (i % 3 !== 0 && i !== data.dailyTrends.length - 1) return null;
                  const x = (i / (data.dailyTrends.length - 1)) * chartWidth;
                  const y = chartHeight - (d.visitors / trendMax) * (chartHeight - 30) - 15;
                  return (
                    <g key={`pt-${i}`}>
                      <circle cx={x} cy={y} r="3.5" fill="#34d399" stroke="#064e3b" strokeWidth="2" />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Date Labels Bar */}
            <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-800 pt-2 px-1">
              <span>{data.dailyTrends[0]?.label}</span>
              <span>{data.dailyTrends[Math.floor(data.dailyTrends.length / 2)]?.label}</span>
              <span>{data.dailyTrends[data.dailyTrends.length - 1]?.label}</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer Insight Note */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>{t("insight.smart_badge")}</strong> {t("insight.text")}
          </span>
        </div>
        <a
          href="/admin/inquiries"
          className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 hover:underline shrink-0"
        >
          <span>{t("insight.view_all")}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Slide-Over Country Intelligence Drawer (Only opens on non-map tabs to keep the map 100% unobstructed) */}
      {activeTab !== "map" && (
        <CountryIntelligenceDrawer
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
}
