"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  ShieldCheck,
  Sparkles,
  Play,
  Film,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Search,
  Video,
  FileText,
  CalendarCheck,
  ArrowRight,
  ArrowUpRight,
  MessageSquare,
} from "lucide-react";
import { Link } from "@/i18n/routing";

export interface GalleryItemData {
  id: string;
  title: string;
  caption: string | null;
  imageUrl: string;
  isVerified: boolean;
  category: string;
}

export function GalleryClientView({
  galleryItems,
}: {
  galleryItems: GalleryItemData[];
}) {
  const t = useTranslations("gallery");
  const [activeTab, setActiveTab] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [activeModalItem, setActiveModalItem] = React.useState<GalleryItemData | null>(null);

  const isVideo = (url: string) => {
    return url.endsWith(".mp4") || url.includes("/video/upload/");
  };

  const getVideoPoster = (url: string) => {
    if (url.includes("/video/upload/")) {
      return url.replace(/\.mp4$/i, ".jpg");
    }
    return url;
  };

  // Identify featured spotlight video
  const spotlightItem = React.useMemo(() => {
    return galleryItems.find((i) => isVideo(i.imageUrl)) || galleryItems[0];
  }, [galleryItems]);

  const filteredItems = React.useMemo(() => {
    return galleryItems.filter((i) => {
      // Tab matching
      let tabMatch = true;
      if (activeTab === "VIDEOS") tabMatch = isVideo(i.imageUrl);
      else if (activeTab === "PHOTOS") tabMatch = !isVideo(i.imageUrl);
      else if (activeTab !== "ALL") tabMatch = i.category.toUpperCase() === activeTab;

      // Search matching
      let searchMatch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = i.title.toLowerCase().includes(q);
        const inCaption = i.caption ? i.caption.toLowerCase().includes(q) : false;
        const inCategory = i.category.toLowerCase().includes(q);
        searchMatch = inTitle || inCaption || inCategory;
      }

      return tabMatch && searchMatch;
    });
  }, [galleryItems, activeTab, searchQuery]);

  const videoCount = React.useMemo(
    () => galleryItems.filter((i) => isVideo(i.imageUrl)).length,
    [galleryItems]
  );
  const photoCount = React.useMemo(
    () => galleryItems.filter((i) => !isVideo(i.imageUrl)).length,
    [galleryItems]
  );

  // Modal navigation
  const currentIndex = activeModalItem
    ? filteredItems.findIndex((i) => i.id === activeModalItem.id)
    : -1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setActiveModalItem(filteredItems[currentIndex - 1]);
    } else {
      setActiveModalItem(filteredItems[filteredItems.length - 1]);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < filteredItems.length - 1) {
      setActiveModalItem(filteredItems[currentIndex + 1]);
    } else {
      setActiveModalItem(filteredItems[0]);
    }
  };

  // Keyboard controls
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeModalItem) return;
      if (e.key === "Escape") setActiveModalItem(null);
      if (e.key === "ArrowLeft") {
        setActiveModalItem((prev) => {
          if (!prev) return null;
          const idx = filteredItems.findIndex((i) => i.id === prev.id);
          return idx > 0 ? filteredItems[idx - 1] : filteredItems[filteredItems.length - 1];
        });
      }
      if (e.key === "ArrowRight") {
        setActiveModalItem((prev) => {
          if (!prev) return null;
          const idx = filteredItems.findIndex((i) => i.id === prev.id);
          return idx < filteredItems.length - 1 ? filteredItems[idx + 1] : filteredItems[0];
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModalItem, filteredItems]);

  const tabs = [
    { key: "ALL", label: `${t("all")} (${galleryItems.length})` },
    { key: "VIDEOS", label: `🎬 ${t("videos")} (${videoCount})` },
    { key: "PHOTOS", label: `📷 ${t("photos")} (${photoCount})` },
    { key: "MATERIAL", label: t("material") },
    { key: "FACILITY", label: t("facility") },
    { key: "DISMANTLING", label: t("dismantling") },
    { key: "PROCESSING", label: t("processing") },
  ];

  return (
    <div className="space-y-12">
      {/* 1. FEATURED OPERATIONS SPOTLIGHT THEATER CARD */}
      {spotlightItem && (
        <div
          onClick={() => setActiveModalItem(spotlightItem)}
          className="group cursor-pointer relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl hover:border-emerald-500/60 transition-all duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Visual Media Poster */}
            <div className="lg:col-span-7 relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
              <img
                src={getVideoPoster(spotlightItem.imageUrl)}
                alt={spotlightItem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

              {/* Glowing Play Icon Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -inset-3 rounded-full bg-emerald-500/30 blur-md animate-pulse" />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1 fill-white" />
                  </div>
                </div>
              </div>

              {/* Top Badge */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                  <Film className="w-3.5 h-3.5" />
                  <span>{t("spotlightBadge")}</span>
                </span>
              </div>
            </div>

            {/* Spotlight Info Card */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Chittagong Staging Line</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug group-hover:text-emerald-300 transition-colors">
                  {t("spotlightTitle")}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {t("spotlightDesc")}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-emerald-400 group-hover:bg-emerald-300 shadow-lg shadow-emerald-950/60 transition-all duration-200"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>{t("playVideo")}</span>
                </button>
                <span className="text-xs text-slate-400 font-mono">
                  100% Uncut Log
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SMART SEARCH & FILTER CONTROLS */}
      <div className="space-y-4">
        {/* Search Input & Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              Showing {filteredItems.length} of {galleryItems.length} verified assets
            </span>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap active:scale-[0.98] transition-all duration-200 shadow-sm ${
                  isActive
                    ? "bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-sm"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MEDIA CARDS GRID */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <Camera className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="font-bold text-slate-900 dark:text-white">No media found</h4>
          <p className="text-xs text-slate-500">
            No media matching &ldquo;{searchQuery}&rdquo;. Try another search term or reset filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveTab("ALL");
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const itemIsVideo = isVideo(item.imageUrl);
            const posterUrl = itemIsVideo ? getVideoPoster(item.imageUrl) : item.imageUrl;

            return (
              <div
                key={item.id}
                onClick={() => setActiveModalItem(item)}
                className="group cursor-pointer rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                  {itemIsVideo ? (
                    <div className="relative w-full h-full">
                      <img
                        src={posterUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Video play overlay button */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-6 h-6 ml-0.5 fill-white" />
                        </div>
                      </div>
                      {/* Video badge */}
                      <div className="absolute bottom-3 right-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider bg-slate-950/75 border border-white/10 text-slate-200 backdrop-blur-md">
                          <Film className="w-3 h-3 text-emerald-400" />
                          <span>{t("videoBadge")}</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                          <Maximize2 className="w-5 h-5" />
                        </div>
                      </div>
                      {/* Photo badge */}
                      <div className="absolute bottom-3 right-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider bg-slate-950/75 border border-white/10 text-slate-200 backdrop-blur-md">
                          <Camera className="w-3 h-3 text-emerald-400" />
                          <span>{t("photoBadge")}</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Top Verification Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide backdrop-blur-md ${
                        item.isVerified
                          ? "bg-slate-950/80 border border-emerald-500/40 text-emerald-300"
                          : "bg-slate-950/80 border border-white/10 text-slate-300"
                      }`}
                    >
                      {item.isVerified ? (
                        <>
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>{t("verifiedBadge")}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>{t("illustrativeBadge")}</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Text Info */}
                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 mt-0.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 mt-1.5">
                        {item.caption}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>{itemIsVideo ? t("playVideo") : t("viewPhoto")}</span>
                    <span className="text-slate-400 group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. VISUAL INTEGRITY & AUDIT TRAIL MATRIX */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-8">
        <div className="max-w-3xl space-y-2.5">
          <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>{t("integrityBadge")}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t("integrityTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t("integritySubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Film className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">
              {t("pillar1Title")}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t("pillar1Desc")}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">
              {t("pillar2Title")}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t("pillar2Desc")}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">
              {t("pillar3Title")}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t("pillar3Desc")}
            </p>
          </div>
        </div>
      </div>

      {/* 5. LIVE WHATSAPP VIDEO INSPECTION & TOUR RFQ CTA BANNER */}
      <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white border border-emerald-800/50 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Real-Time Visual Verification</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {t("ctaTitle")}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t("ctaSubtitle")}
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              href="/inquiry"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-950/50 hover:shadow-emerald-400/25 transition-all duration-200 group/btn"
            >
              <span>{t("ctaBtn")}</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>

            <a
              href="https://wa.me/8801819385860"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Video Desk</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* 6. DYNAMIC ADAPTIVE LIGHTBOX / VIDEO PLAYER MODAL */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-600 text-white flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-white" />
                  <span>{t("verifiedBadge")}</span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {activeModalItem.category}
                </span>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 flex items-center justify-center transition-all duration-150"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Player Container with Ambient Backdrop */}
            <div className="relative bg-slate-950 flex items-center justify-center flex-1 overflow-hidden min-h-[300px] max-h-[68vh] p-2 sm:p-4">
              <div
                className="absolute inset-0 bg-cover bg-center blur-3xl opacity-25 scale-125 pointer-events-none select-none transition-all duration-700"
                style={{
                  backgroundImage: `url(${
                    isVideo(activeModalItem.imageUrl)
                      ? getVideoPoster(activeModalItem.imageUrl)
                      : activeModalItem.imageUrl
                  })`,
                }}
              />
              <div className="absolute inset-0 bg-radial from-transparent via-slate-950/50 to-slate-950/90 pointer-events-none" />

              {isVideo(activeModalItem.imageUrl) ? (
                <video
                  controls
                  autoPlay
                  playsInline
                  src={activeModalItem.imageUrl}
                  className="relative z-10 max-h-[64vh] max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl"
                />
              ) : (
                <img
                  src={activeModalItem.imageUrl}
                  alt={activeModalItem.title}
                  className="relative z-10 max-h-[64vh] max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl transition-all duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "/images/products/pcb-motherboards.jpg";
                  }}
                />
              )}

              {/* Prev / Next Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-emerald-600 active:scale-95 text-white flex items-center justify-center transition-all duration-150 shadow-lg backdrop-blur-sm"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-emerald-600 active:scale-95 text-white flex items-center justify-center transition-all duration-150 shadow-lg backdrop-blur-sm"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Caption & Details Footer */}
            <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white">
                  {activeModalItem.title}
                </h3>
                <span className="text-xs text-slate-400 font-mono shrink-0">
                  {currentIndex + 1} / {filteredItems.length}
                </span>
              </div>
              {activeModalItem.caption && (
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {activeModalItem.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
