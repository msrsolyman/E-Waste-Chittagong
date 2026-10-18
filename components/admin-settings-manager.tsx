"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MediaUploader } from "@/components/media-uploader";
import {
  Sliders,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  RotateCcw,
  Eye,
  ImageIcon,
  Package,
  Layers,
} from "lucide-react";

interface AdminSettingsManagerProps {
  initialAboutBannerUrl?: string;
  initialProductsBannerUrl?: string;
}

const DEFAULT_ABOUT_BANNER =
  "https://res.cloudinary.com/jpzhmh1r/image/upload/v1792327290/ewaste-chittagong/banners/about-hero-banner.jpg";

const DEFAULT_PRODUCTS_BANNER =
  "https://res.cloudinary.com/jpzhmh1r/image/upload/v1792328119/ewaste-chittagong/banners/products-hero-banner.jpg";

export function AdminSettingsManager({
  initialAboutBannerUrl = DEFAULT_ABOUT_BANNER,
  initialProductsBannerUrl = DEFAULT_PRODUCTS_BANNER,
}: AdminSettingsManagerProps) {
  const [activeTab, setActiveTab] = React.useState<"about" | "products">("products");

  const [aboutBannerUrl, setAboutBannerUrl] = React.useState<string>(
    initialAboutBannerUrl || DEFAULT_ABOUT_BANNER
  );
  const [productsBannerUrl, setProductsBannerUrl] = React.useState<string>(
    initialProductsBannerUrl || DEFAULT_PRODUCTS_BANNER
  );

  const [isSaving, setIsSaving] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const currentUrl = activeTab === "about" ? aboutBannerUrl : productsBannerUrl;
  const currentKey = activeTab === "about" ? "about_banner" : "products_banner";
  const defaultUrl = activeTab === "about" ? DEFAULT_ABOUT_BANNER : DEFAULT_PRODUCTS_BANNER;

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: currentKey,
          value: {
            url: currentUrl,
            updatedAt: new Date().toISOString(),
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update setting");
      }

      setSaveStatus({
        type: "success",
        message: `${
          activeTab === "about" ? "About Us" : "Products Catalogue"
        } banner saved successfully! Live changes are now active.`,
      });
    } catch (err) {
      setSaveStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to save settings",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (activeTab === "about") setAboutBannerUrl(DEFAULT_ABOUT_BANNER);
    else setProductsBannerUrl(DEFAULT_PRODUCTS_BANNER);
    setSaveStatus(null);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 w-fit">
        <button
          type="button"
          onClick={() => {
            setActiveTab("products");
            setSaveStatus(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "products"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Package className="w-3.5 h-3.5 text-emerald-600" />
          <span>Products Catalogue Banner</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("about");
            setSaveStatus(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "about"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>About Us Page Banner</span>
        </button>
      </div>

      {/* Status Alert Banner */}
      {saveStatus && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 transition-all animate-in fade-in ${
            saveStatus.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
              : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
          }`}
        >
          {saveStatus.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-semibold">{saveStatus.message}</span>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-emerald-700 dark:text-emerald-400">
              <Sliders className="w-3.5 h-3.5" />
              <span>Public Visual Experience Settings</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {activeTab === "about"
                ? "About Us Page Hero Banner"
                : "Products & Catalogue Hero Banner"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeTab === "about"
                ? "Upload and manage the split-hero banner image displayed on the public About page."
                : "Upload and manage the high-tech sorted scrap banner displayed on the public Products Catalogue page."}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={activeTab === "about" ? "/en/about" : "/en/products"}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>
                View Live {activeTab === "about" ? "About Page" : "Catalogue"}
              </span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Media Uploader Area */}
        <div className="space-y-4">
          <MediaUploader
            key={activeTab}
            value={currentUrl}
            onChange={(url) => {
              if (activeTab === "about") setAboutBannerUrl(url);
              else setProductsBannerUrl(url);
              setSaveStatus(null);
            }}
            folder="general"
            label={`${
              activeTab === "about" ? "About Hero" : "Products Catalogue"
            } Banner Media`}
            acceptVideo={false}
            required
            helperText="Recommended aspect ratio 16:9 or 16:10. High-resolution PNG, JPG or WebP up to 10MB."
          />
        </div>

        {/* Real-time Hero Mockup Preview */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>Interactive Public Split-Hero Mockup Preview</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">16:10 Framing Simulation</span>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 text-white border border-slate-800 overflow-hidden relative shadow-inner">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Column Simulation */}
              <div className="md:col-span-6 space-y-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-900 border border-slate-800 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {activeTab === "about"
                      ? "Verified Chittagong Facility"
                      : "Verified Inventory Streams"}
                  </span>
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                  {activeTab === "about"
                    ? "About E-Waste Chittagong"
                    : "Electronic Scrap & Raw Material Categories"}
                </div>
                <div className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {activeTab === "about"
                    ? "Dedicated to responsible e-waste aggregation, systematic material separation, and international circular economy trade."
                    : "Sorted, graded, and prepared in accordance with international circular economy and pyrometallurgical refiner guidelines."}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-600 text-[11px] font-bold text-white">
                    {activeTab === "about" ? "Request a Quote" : "Explore Categories"}
                  </span>
                  <span className="px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] font-medium text-slate-300">
                    {activeTab === "about" ? "Explore Catalogue" : "Inquiry Form"}
                  </span>
                </div>
              </div>

              {/* Right Column Simulated Banner Frame */}
              <div className="md:col-span-6">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-emerald-500/30 bg-slate-900 shadow-xl group">
                  {currentUrl ? (
                    <Image
                      src={currentUrl}
                      alt="Banner Preview"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized={currentUrl.startsWith("http")}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs">
                      <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                      <span>No Banner Selected</span>
                    </div>
                  )}

                  {/* Simulated Floating Badge */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-white/10 text-white flex items-center gap-1.5 text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold">Chittagong Staging Hub</span>
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-between text-[10px]">
                    <span className="text-slate-300 font-medium">
                      {activeTab === "about"
                        ? "Physical Material Staging"
                        : "High-Grade Scrap Assortment"}
                    </span>
                    <span className="text-emerald-400 font-mono">100% Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handleResetToDefault}
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Official Banner</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !currentUrl}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-950/20 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <Save className="w-3.5 h-3.5" />
              <span>
                {isSaving
                  ? "Saving Banner..."
                  : `Save ${activeTab === "about" ? "About" : "Products"} Banner`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
