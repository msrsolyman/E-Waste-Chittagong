"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/scroll-reveal";
import {
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  Mail,
  Globe2,
  Package,
  Calendar,
  Copy,
  Check,
  MessageCircle,
  Phone,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

interface TrackingInquiry {
  referenceNo: string;
  status: "NEW" | "CONTACTED" | "IN_PROGRESS" | "QUOTED" | "CLOSED" | string;
  currentStep: number;
  companyNameMasked: string;
  emailMasked: string;
  country: string;
  interestedCategory: string | null;
  estimatedQty: string | null;
  createdAt: string;
  updatedAt: string;
  linkedProduct: {
    slug: string;
    titleEn: string;
    titleBn: string | null;
    grade: string | null;
  } | null;
}

export function RfqTrackerView() {
  const t = useTranslations("tracking");
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "";

  const [inputRef, setInputRef] = React.useState(initialRef);
  const [activeRef, setActiveRef] = React.useState(initialRef);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<TrackingInquiry | null>(null);
  const [copied, setCopied] = React.useState(false);

  const fetchTracking = React.useCallback(async (refToSearch: string) => {
    if (!refToSearch || refToSearch.trim().length < 5) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/inquiry/track?ref=${encodeURIComponent(refToSearch.trim())}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Unable to find inquiry matching this reference.");
        setData(null);
      } else {
        setData(json.inquiry);
        setActiveRef(json.inquiry.referenceNo);
        // Sync URL query without page reload
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          url.searchParams.set("ref", json.inquiry.referenceNo);
          window.history.replaceState({}, "", url.toString());
        }
      }
    } catch {
      setError("Network or server error while tracking. Please check your connection.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (initialRef) {
      fetchTracking(initialRef);
    }
  }, [initialRef, fetchTracking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRef.trim()) return;
    fetchTracking(inputRef.trim());
  };

  const handleCopy = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const stages = [
    {
      step: 1,
      key: "NEW",
      title: t("stage1Title"),
      desc: t("stage1Desc"),
    },
    {
      step: 2,
      key: "CONTACTED",
      title: t("stage2Title"),
      desc: t("stage2Desc"),
    },
    {
      step: 3,
      key: "IN_PROGRESS",
      title: t("stage3Title"),
      desc: t("stage3Desc"),
    },
    {
      step: 4,
      key: "QUOTED",
      title: t("stage4Title"),
      desc: t("stage4Desc"),
    },
    {
      step: 5,
      key: "CLOSED",
      title: t("stage5Title"),
      desc: t("stage5Desc"),
    },
  ];

  const whatsappMessage = data
    ? encodeURIComponent(
        `Hello E-Waste Chittagong Commercial Desk,\nI am following up on my procurement RFQ inquiry.\nReference Number: ${data.referenceNo}\nStatus: ${data.status}\nCould you please provide the latest update?`
      )
    : encodeURIComponent(
        `Hello E-Waste Chittagong Commercial Desk,\nI would like to inquire about bulk electronic scrap procurement.`
      );

  return (
    <div className="space-y-10">
      {/* Search Bar Card */}
      <ScrollReveal delayMs={100}>
        <div className="relative p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <form onSubmit={handleSubmit} className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={inputRef}
                  onChange={(e) => setInputRef(e.target.value.toUpperCase())}
                  placeholder={t("inputPlaceholder")}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-mono text-sm sm:text-base tracking-wider transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !inputRef.trim()}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-semibold text-sm shadow-md hover:shadow-emerald-500/25 transition-all duration-200 disabled:cursor-not-allowed shrink-0"
              >
                {loading ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>{t("searching")}</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>{t("searchButton")}</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <span>{t("recentLabel")}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {t("slaNotice")}
              </span>
            </div>
          </form>
        </div>
      </ScrollReveal>

      {/* Error Card */}
      {error && !loading && (
        <ScrollReveal delayMs={150}>
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">{t("notFoundTitle")}</h4>
                <p className="text-xs text-amber-700/90 dark:text-amber-400/90 mt-0.5">{error}</p>
              </div>
            </div>

            <a
              href={`https://wa.me/8801352328093?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shrink-0 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact Support</span>
            </a>
          </div>
        </ScrollReveal>
      )}

      {/* Active Tracking Result */}
      {data && !loading && (
        <div className="space-y-8">
          {/* Milestone Stepper */}
          <ScrollReveal delayMs={200}>
            <div className="p-6 sm:p-10 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-emerald-500/20 dark:border-emerald-500/30 shadow-xl space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Live Procurement Timeline
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <span className="font-mono tracking-wide">{data.referenceNo}</span>
                    <button
                      onClick={() => handleCopy(data.referenceNo)}
                      title="Copy Reference Number"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </h3>
                </div>

                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide uppercase border ${
                      data.status === "QUOTED"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                        : data.status === "CLOSED"
                        ? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-800"
                    }`}
                  >
                    {data.status}
                  </span>
                </div>
              </div>

              {/* 5-Step Progress Timeline */}
              <div className="relative">
                {/* Connecting Line */}
                <div className="hidden md:block absolute top-6 left-8 right-8 h-1 bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(0, ((data.currentStep - 1) / 4) * 100))}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                  {stages.map((st) => {
                    const isDone = st.step < data.currentStep;
                    const isCurrent = st.step === data.currentStep;

                    return (
                      <div
                        key={st.step}
                        className={`flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-3 transition-all duration-300 ${
                          isDone || isCurrent ? "opacity-100" : "opacity-40"
                        }`}
                      >
                        {/* Node circle */}
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-bold transition-all duration-300 shadow-md ${
                            isDone
                              ? "bg-emerald-600 text-white shadow-emerald-500/20"
                              : isCurrent
                              ? "bg-emerald-500 text-white ring-4 ring-emerald-500/20 animate-pulse shadow-emerald-500/30"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : (
                            <span className="font-mono text-base">{st.step}</span>
                          )}
                        </div>

                        {/* Text */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 md:justify-center">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {st.title}
                            </span>
                            {isCurrent && (
                              <span className="inline-flex md:hidden px-2 py-0.5 text-[10px] rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px] md:mx-auto">
                            {st.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Inquiry Details Grid */}
          <ScrollReveal delayMs={250}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Details Card */}
              <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-6">
                <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>{t("detailsTitle")}</span>
                  <span className="ml-auto text-[11px] font-normal text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    Encrypted Verification
                  </span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t("companyLabel")}</span>
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">
                      {data.companyNameMasked || "Corporate Trader"}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t("emailLabel")}</span>
                    </div>
                    <div className="font-mono font-semibold text-slate-900 dark:text-white text-sm">
                      {data.emailMasked}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t("countryLabel")}</span>
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">
                      {data.country || "International"}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Package className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t("categoryLabel")}</span>
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                      {data.interestedCategory || "Mixed Electronic Scrap"}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t("qtyLabel")}</span>
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">
                      {data.estimatedQty || "Trial Lot / Spot Contract"}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t("submittedLabel")}</span>
                    </div>
                    <div className="font-medium text-slate-700 dark:text-slate-300 text-sm">
                      {new Date(data.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                {/* Linked Specific Product (If RFQ was initiated from product page) */}
                {data.linkedProduct && (
                  <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        Target Material Lot
                      </div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">
                        {data.linkedProduct.titleEn}
                      </div>
                      {data.linkedProduct.grade && (
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Grade: {data.linkedProduct.grade}
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/products/${data.linkedProduct.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:border-emerald-500 transition-colors"
                    >
                      <span>View Specifications</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Right Col: Instant WhatsApp & Commercial Desk Actions */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-900 to-slate-950 text-white shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-3 relative z-10">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold tracking-wider uppercase inline-block">
                    Direct Staging Terminal
                  </span>
                  <h4 className="text-xl font-bold leading-snug">{t("urgentTitle")}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{t("urgentDesc")}</p>
                </div>

                <div className="space-y-3 relative z-10">
                  <a
                    href={`https://wa.me/8801352328093?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>{t("whatsappAction")}</span>
                  </a>

                  <a
                    href="tel:+8801352328093"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>+880 1352 328093</span>
                  </a>

                  <div className="pt-2 text-[11px] text-slate-400 text-center">
                    মীর আউলিয়া সড়ক NR স্টিল সিটি গেট আকবরশা চট্টগ্রাম
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      )}
    </div>
  );
}
