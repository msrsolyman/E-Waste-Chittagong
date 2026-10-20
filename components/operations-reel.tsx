"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ShieldCheck,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Sparkles,
  Radio,
  FileCheck2,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

interface ReelItem {
  id: string;
  type: "video" | "image";
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
  mediaUrl: string;
  posterUrl: string;
  duration?: string;
  tag: string;
  tagBn: string;
}

export function OperationsReel() {
  const t = useTranslations("operationsReel");
  const locale = useLocale();
  const isBn = locale === "bn";

  const [activeVideoIndex, setActiveVideoIndex] = React.useState<number | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showControls, setShowControls] = React.useState(true);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const reelItems: ReelItem[] = [
    {
      id: "reel-1",
      type: "video",
      title: "Chittagong Facility Tour & Scrap Ingestion",
      titleBn: "চট্টগ্রাম ইয়ার্ড ট্যুর ও স্ক্র্যাপ ইনটেক কার্যক্রম",
      subtitle: "Unedited look at incoming corporate e-waste and floor segregation.",
      subtitleBn: "ইনকামিং করপোরেট ই-বর্জ্য আনলোডিং ও ফ্লোর সর্টিংয়ের বাস্তব ভিডিও চিত্র।",
      mediaUrl: "https://res.cloudinary.com/jpzhmh1r/video/upload/v1792259177/ewaste-chittagong/videos/gonbeawvjtlqnsorogod.mp4",
      posterUrl: "https://res.cloudinary.com/jpzhmh1r/video/upload/v1792259177/ewaste-chittagong/videos/gonbeawvjtlqnsorogod.jpg",
      duration: "0:18",
      tag: "FACILITY TOUR",
      tagBn: "ইয়ার্ড ট্যুর",
    },
    {
      id: "reel-2",
      type: "video",
      title: "Precision PCB Sorting & Motherboard Grading",
      titleBn: "পিসিবি মাদারবোর্ড নির্ভুল গ্রেডিং ও কোয়ালিটি সর্টিং",
      subtitle: "Trained manual inspection isolating gold-finger circuit boards.",
      subtitleBn: "দক্ষ কর্মীদের দ্বারা গোল্ড-কানেক্টর সার্ভার মাদারবোর্ড ক্যাটালগিং ও পৃথকীকরণ।",
      mediaUrl: "https://res.cloudinary.com/jpzhmh1r/video/upload/v1792259182/ewaste-chittagong/videos/gauparuby4pdrs6wzznp.mp4",
      posterUrl: "https://res.cloudinary.com/jpzhmh1r/video/upload/v1792259182/ewaste-chittagong/videos/gauparuby4pdrs6wzznp.jpg",
      duration: "0:27",
      tag: "MANUAL SORTING",
      tagBn: "ম্যানুয়াল সর্টিং",
    },
    {
      id: "reel-3",
      type: "video",
      title: "Lot Weighing & Physical Tonnage Check",
      titleBn: "লট ওজন ও সঠিক টনপরিমাপ ক্রস-ভেরিফিকেশন",
      subtitle: "Commercial lot weighing documenting exact gross and tare tonnage.",
      subtitleBn: "রপ্তানি চালানের জন্য কমার্শিয়াল স্কেলে গ্রস ও নেট ওজন নিখুঁতভাবে যাচাইকরণ।",
      mediaUrl: "https://res.cloudinary.com/jpzhmh1r/video/upload/v1792259186/ewaste-chittagong/videos/a4eks71bqyiggbz0ul3k.mp4",
      posterUrl: "https://res.cloudinary.com/jpzhmh1r/video/upload/v1792259186/ewaste-chittagong/videos/a4eks71bqyiggbz0ul3k.jpg",
      duration: "0:16",
      tag: "WEIGHING & DISPATCH",
      tagBn: "ওজন ও সরবরাহ",
    },
    {
      id: "reel-4",
      type: "video",
      title: "Copper Wire Stripping & Metal Segregation",
      titleBn: "কপার তার স্ট্রিপিং ও ধাতব উপাদান পৃথকীকরণ",
      subtitle: "Mechanical conductor stripping and non-ferrous metal separation.",
      subtitleBn: "যান্ত্রিক পদ্ধতিতে তামার তারের কন্ডাক্টর সেপারেশন ও স্ক্র্যাপ রিকভারি কার্যক্রম।",
      mediaUrl: "https://res.cloudinary.com/jpzhmh1r/video/upload/v1792259227/ewaste-chittagong/videos/ukmi01yqkcmnmr5ssr5t.mp4",
      posterUrl: "https://res.cloudinary.com/jpzhmh1r/video/upload/v1792259227/ewaste-chittagong/videos/ukmi01yqkcmnmr5ssr5t.jpg",
      duration: "1:07",
      tag: "MECHANICAL RECOVERY",
      tagBn: "ধাতব পুনরুদ্ধার",
    },
  ];

  const activeVideo = activeVideoIndex !== null ? reelItems[activeVideoIndex] : null;

  // Safe lock scroll preventing layout twitching (shifts)
  React.useEffect(() => {
    if (activeVideoIndex !== null) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [activeVideoIndex]);

  // Keyboard shortcut listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeVideoIndex === null) return;

      if (e.key === "Escape") {
        setActiveVideoIndex(null);
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === " " || e.key === "k") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "m") {
        toggleMute();
      } else if (e.key === "f") {
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeVideoIndex, isPlaying, isMuted, isFullscreen]);

  // Auto-hide controls when playing after 2.5s
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setIsPlaying(!videoRef.current.paused);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeVideoIndex === null) return;
    setActiveVideoIndex((prev) => (prev! > 0 ? prev! - 1 : reelItems.length - 1));
    setIsPlaying(true);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeVideoIndex === null) return;
    setActiveVideoIndex((prev) => (prev! < reelItems.length - 1 ? prev! + 1 : 0));
    setIsPlaying(true);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 select-none">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <SectionHeading
          badge={t("badge")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <Link
          href={`/${locale}/gallery`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 transition shrink-0 group"
        >
          <span>{t("viewAll")}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 4 Video Reel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reelItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => {
              setActiveVideoIndex(index);
              setIsPlaying(true);
            }}
            className="group cursor-pointer rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-600/50 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative aspect-[9/14] sm:aspect-[4/5] w-full overflow-hidden bg-slate-950">
              <img
                src={item.posterUrl}
                alt={isBn ? item.titleBn : item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/40 flex flex-col justify-between p-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                    <span>{isBn ? "লাইভ রিল" : "Video Reel"}</span>
                  </span>
                  {item.duration && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-black/70 text-slate-300 border border-white/10 backdrop-blur-xs">
                      {item.duration}
                    </span>
                  )}
                </div>

                {/* Center Play Button */}
                <div className="flex items-center justify-center">
                  <div className="w-13 h-13 rounded-full bg-emerald-600/90 group-hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-950/50 transition-all duration-300 group-hover:scale-110 border border-white/20">
                    <Play className="w-5 h-5 ml-0.5 fill-white" />
                  </div>
                </div>

                {/* Bottom text */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    {isBn ? item.tagBn : item.tag}
                  </span>
                  <h4 className="font-bold text-sm text-white line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors">
                    {isBn ? item.titleBn : item.title}
                  </h4>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-1.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {isBn ? item.subtitleBn : item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Smart Cinematic Lightbox Modal */}
      {mounted && activeVideo && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/85 backdrop-blur-xl p-3 sm:p-5 md:p-6 overflow-hidden animate-in fade-in duration-200"
          onClick={() => setActiveVideoIndex(null)}
        >
          {/* Main Modal Card */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[92vh] bg-slate-950 border border-slate-800/90 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 transition-all"
          >
            {/* Top Bar Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md shrink-0 z-20">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isBn ? "যাচাইকৃত চট্টগ্রাম ভিডিও ফুটেজ" : "Verified Chittagong Video"}</span>
                </span>
                <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {isBn ? activeVideo.tagBn : activeVideo.tag}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60">
                  {activeVideoIndex! + 1} / {reelItems.length}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveVideoIndex(null)}
                  className="w-8 h-8 rounded-full bg-slate-800/90 hover:bg-red-500/80 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95"
                  aria-label="Close video player"
                  title={isBn ? "বন্ধ করুন (Esc)" : "Close player (Esc)"}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Video Stage with Dynamic Ambient Glow */}
            <div className="relative flex-1 bg-slate-950 flex items-center justify-center overflow-hidden min-h-[320px] max-h-[64vh] select-none group">
              {/* Colorful Blurred Ambient Backdrop (Eliminates harsh black bars on vertical videos) */}
              <div
                className="absolute inset-0 bg-cover bg-center blur-3xl opacity-35 scale-125 select-none pointer-events-none transition-all duration-700"
                style={{ backgroundImage: `url(${activeVideo.posterUrl})` }}
              />
              <div className="absolute inset-0 bg-radial from-transparent via-slate-950/40 to-slate-950/90 pointer-events-none select-none" />

              {/* The Video Element */}
              <video
                ref={videoRef}
                key={activeVideo.id}
                autoPlay
                playsInline
                src={activeVideo.mediaUrl}
                poster={activeVideo.posterUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => handleNext()}
                onClick={togglePlay}
                className="relative z-10 max-h-[64vh] max-w-full w-auto h-auto object-contain cursor-pointer shadow-2xl transition-all duration-300"
              />

              {/* Big Floating Play / Pause Overlay when Paused */}
              {!isPlaying && (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="absolute z-20 w-16 h-16 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
                  title={isBn ? "প্লে করুন" : "Play"}
                >
                  <Play className="w-7 h-7 ml-1 fill-white" />
                </button>
              )}

              {/* Navigation Arrows on Sides */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white flex items-center justify-center transition-all duration-200 shadow-xl backdrop-blur-md border border-white/10 active:scale-90"
                title={isBn ? "পূর্ববর্তী ভিডিও (Left Arrow)" : "Previous video (Left Arrow)"}
                aria-label="Previous video"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white flex items-center justify-center transition-all duration-200 shadow-xl backdrop-blur-md border border-white/10 active:scale-90"
                title={isBn ? "পরবর্তী ভিডিও (Right Arrow)" : "Next video (Right Arrow)"}
                aria-label="Next video"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Glassmorphic On-Video Control Bar */}
              <div
                className={`absolute bottom-3 left-3 right-3 z-20 p-2 sm:p-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 shadow-xl flex flex-col gap-2 transition-all duration-300 ${
                  showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
                }`}
              >
                {/* Scrub Progress Bar */}
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={duration > 0 ? (currentTime / duration) * 100 : 0}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-hidden"
                  />
                </div>

                {/* Bottom Row Controls */}
                <div className="flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition"
                      title={isPlaying ? (isBn ? "পজ করুন" : "Pause") : (isBn ? "চালু করুন" : "Play")}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition"
                      title={isMuted ? (isBn ? "আনমিউট" : "Unmute") : (isBn ? "মিউট" : "Mute")}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <span className="font-mono text-[11px] text-slate-300">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-block text-[11px] text-slate-400">
                      {isBn ? "চট্টগ্রাম ডিসম্যান্তলিং ইয়ার্ড" : "Chittagong Staging Yard"}
                    </span>
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition"
                      title={isBn ? "ফুলস্ক্রিন" : "Fullscreen"}
                    >
                      {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Lead & Metadata Footer */}
            <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center md:justify-between gap-3.5 shrink-0 z-20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    {isBn ? activeVideo.tagBn : activeVideo.tag}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {isBn ? activeVideo.titleBn : activeVideo.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 max-w-xl line-clamp-1 sm:line-clamp-2">
                  {isBn ? activeVideo.subtitleBn : activeVideo.subtitle}
                </p>
              </div>

              {/* Direct Actions */}
              <div className="flex items-center gap-2.5 shrink-0">
                <a
                  href={`https://wa.me/8801819385860?text=${encodeURIComponent(
                    `Hello E-Waste Chittagong, I am inquiring about the commercial stock featured in your video: ${activeVideo.title}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md shadow-green-950/40 transition active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isBn ? "WhatsApp কোটেশন" : "WhatsApp RFQ"}</span>
                </a>

                <Link
                  href={`/${locale}/inquiry?subject=${encodeURIComponent(activeVideo.title)}`}
                  onClick={() => setActiveVideoIndex(null)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 transition active:scale-95"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>{isBn ? "আরএফকিউ পাঠান" : "Request Quote"}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
