"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Play, ShieldCheck, Film, ArrowRight, X } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

interface ReelItem {
  id: string;
  type: "video" | "image";
  title: string;
  subtitle: string;
  mediaUrl: string;
  posterUrl: string;
  duration?: string;
  tag: string;
}

export function OperationsReel() {
  const t = useTranslations("operationsReel");
  const [activeVideo, setActiveVideo] = React.useState<ReelItem | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveVideo(null);
      }
    };
    if (activeVideo) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [activeVideo]);

  const reelItems: ReelItem[] = [
    {
      id: "reel-1",
      type: "video",
      title: "Chittagong Facility Tour & Scrap Ingestion",
      subtitle: "Unedited look at incoming corporate e-waste and floor segregation.",
      mediaUrl: "https://res.cloudinary.com/jpzhmh1r/video/upload/v1792259177/ewaste-chittagong/videos/gonbeawvjtlqnsorogod.mp4",
      posterUrl: "https://res.cloudinary.com/jpzhmh1r/video/upload/v1792259177/ewaste-chittagong/videos/gonbeawvjtlqnsorogod.jpg",
      duration: "0:18",
      tag: "FACILITY TOUR",
    },
    {
      id: "reel-2",
      type: "video",
      title: "Precision PCB Sorting & Motherboard Grading",
      subtitle: "Trained manual inspection isolating gold-finger circuit boards.",
      mediaUrl: "https://res.cloudinary.com/jpzhmh1r/video/upload/v1792259182/ewaste-chittagong/videos/gauparuby4pdrs6wzznp.mp4",
      posterUrl: "https://res.cloudinary.com/jpzhmh1r/video/upload/v1792259182/ewaste-chittagong/videos/gauparuby4pdrs6wzznp.jpg",
      duration: "0:27",
      tag: "MANUAL SORTING",
    },
    {
      id: "reel-3",
      type: "video",
      title: "Lot Weighing & Physical Tonnage Check",
      subtitle: "Commercial lot weighing documenting exact gross and tare tonnage.",
      mediaUrl: "https://res.cloudinary.com/jpzhmh1r/video/upload/v1792259186/ewaste-chittagong/videos/a4eks71bqyiggbz0ul3k.mp4",
      posterUrl: "https://res.cloudinary.com/jpzhmh1r/video/upload/v1792259186/ewaste-chittagong/videos/a4eks71bqyiggbz0ul3k.jpg",
      duration: "0:16",
      tag: "WEIGHING & DISPATCH",
    },
    {
      id: "reel-4",
      type: "video",
      title: "Copper Wire Stripping & Metal Segregation",
      subtitle: "Mechanical conductor stripping and non-ferrous metal separation.",
      mediaUrl: "https://res.cloudinary.com/jpzhmh1r/video/upload/v1792259227/ewaste-chittagong/videos/ukmi01yqkcmnmr5ssr5t.mp4",
      posterUrl: "https://res.cloudinary.com/jpzhmh1r/video/upload/v1792259227/ewaste-chittagong/videos/ukmi01yqkcmnmr5ssr5t.jpg",
      duration: "1:07",
      tag: "MECHANICAL RECOVERY",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <SectionHeading
          badge={t("badge")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <Link
          href="/gallery"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 transition shrink-0"
        >
          <span>{t("viewAll")}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4 Video Reel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reelItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveVideo(item)}
            className="group cursor-pointer rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-600/40 transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-[9/14] sm:aspect-[4/5] w-full overflow-hidden bg-slate-950">
              <img
                src={item.posterUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102 opacity-90 group-hover:opacity-100"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-black/30 flex flex-col justify-between p-4">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-900/80 text-emerald-400 border border-slate-700/60">
                    Video Reel
                  </span>
                  {item.duration && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-black/70 text-slate-300 border border-white/10">
                      {item.duration}
                    </span>
                  )}
                </div>

                {/* Center Play Button */}
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-700/90 group-hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-105">
                    <Play className="w-5 h-5 ml-0.5 fill-white" />
                  </div>
                </div>

                {/* Bottom text */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    {item.tag}
                  </span>
                  <h4 className="font-bold text-sm text-white line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                </div>
              </div>
            </div>

            <div className="p-4.5 space-y-1.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-600 text-white flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Chittagong Video</span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {activeVideo.tag}
                </span>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative bg-black flex items-center justify-center max-h-[70vh]">
              <video
                controls
                autoPlay
                playsInline
                src={activeVideo.mediaUrl}
                className="w-full h-full max-h-[70vh] object-contain"
              />
            </div>

            <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-2">
              <h3 className="font-bold text-lg text-white">
                {activeVideo.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {activeVideo.subtitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
