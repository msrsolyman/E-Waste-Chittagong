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
} from "lucide-react";

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
  const [activeModalItem, setActiveModalItem] = React.useState<GalleryItemData | null>(null);

  const isVideo = (url: string) => {
    return url.endsWith(".mp4") || url.includes("/video/upload/");
  };

  const getVideoPoster = (url: string) => {
    if (url.includes("/video/upload/")) {
      // Cloudinary video thumbnail trick: change extension to .jpg
      return url.replace(/\.mp4$/i, ".jpg");
    }
    return url;
  };

  const filteredItems = React.useMemo(() => {
    if (activeTab === "ALL") return galleryItems;
    if (activeTab === "VIDEOS") return galleryItems.filter((i) => isVideo(i.imageUrl));
    if (activeTab === "PHOTOS") return galleryItems.filter((i) => !isVideo(i.imageUrl));
    return galleryItems.filter((i) => i.category.toUpperCase() === activeTab);
  }, [galleryItems, activeTab]);

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
    <div className="space-y-8">
      {/* Transparency Note */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-medium leading-relaxed">{t("transparencyNote")}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          <span>{galleryItems.length} {t("all").toLowerCase()} ({videoCount} {t("videos").toLowerCase()}, {photoCount} {t("photos").toLowerCase()})</span>
        </div>
      </div>

      {/* Filter Tabs */}
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

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const itemIsVideo = isVideo(item.imageUrl);
          const posterUrl = itemIsVideo ? getVideoPoster(item.imageUrl) : item.imageUrl;

          return (
            <div
              key={item.id}
              onClick={() => setActiveModalItem(item)}
              className="group cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                {itemIsVideo ? (
                  <div className="relative w-full h-full">
                    {/* Video poster / preview */}
                    <img
                      src={posterUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
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
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
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

      {/* Lightbox / Video Player Modal */}
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

            {/* Media Player Container */}
            <div className="relative bg-black flex items-center justify-center flex-1 overflow-hidden min-h-[300px] max-h-[65vh]">
              {isVideo(activeModalItem.imageUrl) ? (
                <video
                  controls
                  autoPlay
                  playsInline
                  src={activeModalItem.imageUrl}
                  className="w-full h-full max-h-[65vh] object-contain"
                />
              ) : (
                <div className="relative w-full h-full max-h-[65vh] flex items-center justify-center p-4">
                  <img
                    src={activeModalItem.imageUrl}
                    alt={activeModalItem.title}
                    className="max-w-full max-h-[60vh] object-contain rounded-lg"
                  />
                </div>
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
