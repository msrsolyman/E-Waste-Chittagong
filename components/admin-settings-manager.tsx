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
  Wrench,
  Workflow,
  Camera,
  PhoneCall,
} from "lucide-react";

interface AdminSettingsManagerProps {
  initialContactBannerUrl?: string;
  initialGalleryBannerUrl?: string;
  initialProcessBannerUrl?: string;
  initialServicesBannerUrl?: string;
  initialProductsBannerUrl?: string;
  initialAboutBannerUrl?: string;
}

const DEFAULT_CONTACT_BANNER =
  "https://res.cloudinary.com/jpzhmh1r/image/upload/v1792340096/ewaste-chittagong/banners/contact-hero-banner.jpg";

const DEFAULT_GALLERY_BANNER =
  "https://res.cloudinary.com/jpzhmh1r/image/upload/v1792331523/ewaste-chittagong/banners/gallery-hero-banner.jpg";

const DEFAULT_PROCESS_BANNER =
  "https://res.cloudinary.com/jpzhmh1r/image/upload/v1792330610/ewaste-chittagong/banners/process-hero-banner.jpg";

const DEFAULT_SERVICES_BANNER =
  "https://res.cloudinary.com/jpzhmh1r/image/upload/v1792329707/ewaste-chittagong/banners/services-hero-banner.jpg";

const DEFAULT_PRODUCTS_BANNER =
  "https://res.cloudinary.com/jpzhmh1r/image/upload/v1792328119/ewaste-chittagong/banners/products-hero-banner.jpg";

const DEFAULT_ABOUT_BANNER =
  "https://res.cloudinary.com/jpzhmh1r/image/upload/v1792327290/ewaste-chittagong/banners/about-hero-banner.jpg";

export function AdminSettingsManager({
  initialContactBannerUrl = DEFAULT_CONTACT_BANNER,
  initialGalleryBannerUrl = DEFAULT_GALLERY_BANNER,
  initialProcessBannerUrl = DEFAULT_PROCESS_BANNER,
  initialServicesBannerUrl = DEFAULT_SERVICES_BANNER,
  initialProductsBannerUrl = DEFAULT_PRODUCTS_BANNER,
  initialAboutBannerUrl = DEFAULT_ABOUT_BANNER,
}: AdminSettingsManagerProps) {
  const [activeTab, setActiveTab] = React.useState<
    "contact" | "gallery" | "process" | "services" | "products" | "about"
  >("contact");

  const [contactBannerUrl, setContactBannerUrl] = React.useState<string>(
    initialContactBannerUrl || DEFAULT_CONTACT_BANNER
  );
  const [galleryBannerUrl, setGalleryBannerUrl] = React.useState<string>(
    initialGalleryBannerUrl || DEFAULT_GALLERY_BANNER
  );
  const [processBannerUrl, setProcessBannerUrl] = React.useState<string>(
    initialProcessBannerUrl || DEFAULT_PROCESS_BANNER
  );
  const [servicesBannerUrl, setServicesBannerUrl] = React.useState<string>(
    initialServicesBannerUrl || DEFAULT_SERVICES_BANNER
  );
  const [productsBannerUrl, setProductsBannerUrl] = React.useState<string>(
    initialProductsBannerUrl || DEFAULT_PRODUCTS_BANNER
  );
  const [aboutBannerUrl, setAboutBannerUrl] = React.useState<string>(
    initialAboutBannerUrl || DEFAULT_ABOUT_BANNER
  );

  const [isSaving, setIsSaving] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const getCurrentState = () => {
    switch (activeTab) {
      case "about":
        return {
          url: aboutBannerUrl,
          key: "about_banner",
          defaultUrl: DEFAULT_ABOUT_BANNER,
          title: "About Us Page Hero Banner",
          desc: "Upload and manage the split-hero banner image displayed on the public About Us page.",
          liveLink: "/en/about",
          liveLabel: "About Page",
          mockBadge: "Verified Chittagong Facility",
          mockTitle: "About E-Waste Chittagong",
          mockDesc:
            "Dedicated to responsible e-waste aggregation, systematic material separation, and international circular economy trade.",
          btn1: "Request a Quote",
          btn2: "Explore Catalogue",
          caption: "Physical Material Staging",
        };
      case "products":
        return {
          url: productsBannerUrl,
          key: "products_banner",
          defaultUrl: DEFAULT_PRODUCTS_BANNER,
          title: "Products & Catalogue Hero Banner",
          desc: "Upload and manage the high-tech sorted scrap banner displayed on the public Products Catalogue page.",
          liveLink: "/en/products",
          liveLabel: "Products Catalogue",
          mockBadge: "Verified Inventory Streams",
          mockTitle: "Electronic Scrap & Raw Material Categories",
          mockDesc:
            "Sorted, graded, and prepared in accordance with international circular economy and pyrometallurgical refiner guidelines.",
          btn1: "Explore Categories",
          btn2: "Inquiry Form",
          caption: "High-Grade Scrap Assortment",
        };
      case "services":
        return {
          url: servicesBannerUrl,
          key: "services_banner",
          defaultUrl: DEFAULT_SERVICES_BANNER,
          title: "Corporate Services Hero Banner",
          desc: "Upload and manage the enterprise decommissioning and recovery facility banner displayed on the public Corporate Services page.",
          liveLink: "/en/services",
          liveLabel: "Services Page",
          mockBadge: "Chittagong Decommissioning Hub",
          mockTitle: "Comprehensive Electronic Waste & Material Solutions",
          mockDesc:
            "End-to-end recycling solutions tailored for telecom providers, corporations, and international commodity refiners.",
          btn1: "Request Consultation",
          btn2: "View Services",
          caption: "Enterprise Decommissioning Hub",
        };
      case "process":
        return {
          url: processBannerUrl,
          key: "process_banner",
          defaultUrl: DEFAULT_PROCESS_BANNER,
          title: "Work Process Hero Banner",
          desc: "Upload and manage the mechanical sorting and disassembly pipeline banner displayed on the public Work Process page.",
          liveLink: "/en/process",
          liveLabel: "Work Process Page",
          mockBadge: "Chittagong Sorting Floor",
          mockTitle: "Compliant & Traceable Recycling Process",
          mockDesc:
            "Every stage adheres to transparency, worker safety, mechanical segregation, and systematic resource recovery.",
          btn1: "Facility Audit",
          btn2: "Explore Journey",
          caption: "Mechanical Sorting Pipeline",
        };
      case "gallery":
        return {
          url: galleryBannerUrl,
          key: "gallery_banner",
          defaultUrl: DEFAULT_GALLERY_BANNER,
          title: "Media Gallery & Activities Hero Banner",
          desc: "Upload and manage the operational documentation and inspection floor banner displayed on the public Gallery page.",
          liveLink: "/en/gallery",
          liveLabel: "Gallery Page",
          mockBadge: "Chittagong Recovery Logs",
          mockTitle: "Verified Facility Activities & Operational Gallery",
          mockDesc:
            "A transparent look at our handling practices, physical dismantling, and container staging at our Chittagong hub.",
          btn1: "Live Video Audit",
          btn2: "Browse Media",
          caption: "Chittagong Inspection Station",
        };
      case "contact":
      default:
        return {
          url: contactBannerUrl,
          key: "contact_banner",
          defaultUrl: DEFAULT_CONTACT_BANNER,
          title: "Contact Page Hero Banner",
          desc: "Upload and manage the reception and dispatch logistics desk banner displayed on the public Contact Us page.",
          liveLink: "/en/contact",
          liveLabel: "Contact Page",
          mockBadge: "Chittagong Operations Hub",
          mockTitle: "Chittagong Facility & Logistics Gateway",
          mockDesc:
            "Connect directly with our Akbarshah operations desk for bulk material inspections, enterprise electronics decommissioning, and global export inquiries.",
          btn1: "WhatsApp Desk",
          btn2: "Inquiry Form",
          caption: "Akbarshah Operations & Dispatch Hub",
        };
    }
  };

  const current = getCurrentState();

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: current.key,
          value: {
            url: current.url,
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
        message: `${current.title} saved successfully! Live changes are now active.`,
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
    if (activeTab === "contact") setContactBannerUrl(DEFAULT_CONTACT_BANNER);
    else if (activeTab === "gallery") setGalleryBannerUrl(DEFAULT_GALLERY_BANNER);
    else if (activeTab === "process") setProcessBannerUrl(DEFAULT_PROCESS_BANNER);
    else if (activeTab === "services") setServicesBannerUrl(DEFAULT_SERVICES_BANNER);
    else if (activeTab === "products") setProductsBannerUrl(DEFAULT_PRODUCTS_BANNER);
    else setAboutBannerUrl(DEFAULT_ABOUT_BANNER);
    setSaveStatus(null);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* 6-Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 w-fit">
        <button
          type="button"
          onClick={() => {
            setActiveTab("contact");
            setSaveStatus(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "contact"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
          <span>Contact Page Banner</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("gallery");
            setSaveStatus(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "gallery"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-emerald-600" />
          <span>Media Gallery Banner</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("process");
            setSaveStatus(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "process"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Workflow className="w-3.5 h-3.5 text-teal-600" />
          <span>Work Process Banner</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("services");
            setSaveStatus(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "services"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-cyan-600" />
          <span>Corporate Services Banner</span>
        </button>

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
          <Package className="w-3.5 h-3.5 text-blue-600" />
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
          <Layers className="w-3.5 h-3.5 text-purple-600" />
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
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{current.title}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{current.desc}</p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={current.liveLink}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Live {current.liveLabel}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Media Uploader Area */}
        <div className="space-y-4">
          <MediaUploader
            key={activeTab}
            value={current.url}
            onChange={(url) => {
              if (activeTab === "contact") setContactBannerUrl(url);
              else if (activeTab === "gallery") setGalleryBannerUrl(url);
              else if (activeTab === "process") setProcessBannerUrl(url);
              else if (activeTab === "services") setServicesBannerUrl(url);
              else if (activeTab === "products") setProductsBannerUrl(url);
              else setAboutBannerUrl(url);
              setSaveStatus(null);
            }}
            folder="general"
            label={`${current.title} Media`}
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
                  <span>{current.mockBadge}</span>
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                  {current.mockTitle}
                </div>
                <div className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {current.mockDesc}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-600 text-[11px] font-bold text-white">
                    {current.btn1}
                  </span>
                  <span className="px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] font-medium text-slate-300">
                    {current.btn2}
                  </span>
                </div>
              </div>

              {/* Right Column Simulated Banner Frame */}
              <div className="md:col-span-6">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-emerald-500/30 bg-slate-900 shadow-xl group">
                  {current.url ? (
                    <Image
                      src={current.url}
                      alt="Banner Preview"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized={current.url.startsWith("http")}
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
                    <span className="text-slate-300 font-medium">{current.caption}</span>
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
              disabled={isSaving || !current.url}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-950/20 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving Banner..." : `Save ${current.title}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
