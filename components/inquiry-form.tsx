"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Building2,
  Mail,
  User,
  Phone,
  Globe,
  Package,
  Layers,
  FileText,
} from "lucide-react";

const countries = [
  "Japan",
  "Singapore",
  "South Korea",
  "China",
  "Germany",
  "United Arab Emirates",
  "United States",
  "United Kingdom",
  "India",
  "Malaysia",
  "Netherlands",
  "Bangladesh",
  "Other / Global",
];

const categories = [
  "High-Grade Server & Motherboard PCBs",
  "Ceramic & Fiber CPU Processor Scrap",
  "Telecom & Base Station Networking Boards",
  "Whole Discarded Enterprise IT Equipment",
  "Segregated Non-Ferrous & Electronic Metals",
  "General / Custom Industrial Inquiry",
];

function InquiryFormInner({ defaultProductSlug }: { defaultProductSlug?: string }) {
  const t = useTranslations("inquiry");
  const searchParams = useSearchParams();
  const productParam = defaultProductSlug || searchParams.get("product") || "";

  const [formData, setFormData] = React.useState({
    name: "",
    companyName: "",
    email: "",
    phoneOrWhatsApp: "",
    country: "",
    interestedCategory: productParam ? `Product: ${productParam}` : "",
    estimatedQty: "",
    message: "",
    productId: productParam || "",
    website_field_hp: "", // Honeypot
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successReference, setSuccessReference] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Spam honeypot detection
    if (formData.website_field_hp) {
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setSuccessReference(data.referenceNo);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReference = () => {
    if (successReference) {
      navigator.clipboard.writeText(successReference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (successReference) {
    return (
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 p-8 text-center space-y-5 animate-in fade-in duration-300">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t("successTitle")}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            {t("successDesc", { reference: successReference })}
          </p>
        </div>

        <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Reference Code:</span>
          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">
            {successReference}
          </span>
          <button
            type="button"
            onClick={copyReference}
            className="p-1 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
            title="Copy reference code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={() => {
              setSuccessReference(null);
              setFormData({
                name: "",
                companyName: "",
                email: "",
                phoneOrWhatsApp: "",
                country: "",
                interestedCategory: "",
                estimatedQty: "",
                message: "",
                productId: "",
                website_field_hp: "",
              });
            }}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Submit Another Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot field (hidden from real users) */}
      <input
        type="text"
        name="website_field_hp"
        value={formData.website_field_hp}
        onChange={(e) => setFormData({ ...formData, website_field_hp: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {errorMessage && (
        <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 flex items-start gap-3 text-red-700 dark:text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t("fullName")} *</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Kenji Tanaka / Alexander Müller"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>

        {/* Company Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t("companyName")} *</span>
          </label>
          <input
            type="text"
            required
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder="e.g. Global Precious Metals Inc."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>

        {/* Business Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t("email")} *</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="procurement@company.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>

        {/* Phone / WhatsApp */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t("phone")}</span>
          </label>
          <input
            type="tel"
            value={formData.phoneOrWhatsApp}
            onChange={(e) => setFormData({ ...formData, phoneOrWhatsApp: e.target.value })}
            placeholder="+1 / +81 / +65 ..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>

        {/* Country */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t("country")} *</span>
          </label>
          <select
            required
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          >
            <option value="">{t("selectCountry")}</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Interested Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t("category")}</span>
          </label>
          <select
            value={formData.interestedCategory}
            onChange={(e) => setFormData({ ...formData, interestedCategory: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          >
            <option value="">{t("selectCategory")}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t("quantity")}</span>
          </label>
          <input
            type="text"
            value={formData.estimatedQty}
            onChange={(e) => setFormData({ ...formData, estimatedQty: e.target.value })}
            placeholder="e.g. 5 Metric Tons / 1x 20ft Container / Trial Pallet"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>

        {/* Detailed Message */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t("message")} *</span>
          </label>
          <textarea
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder={t("messagePlaceholder")}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          🔒 {t("privacyNotice")}
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-60"
        >
          {isSubmitting ? (
            <span>{t("submitting")}</span>
          ) : (
            <>
              <span>{t("submit")}</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export function InquiryForm(props: { defaultProductSlug?: string }) {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
          Loading inquiry form...
        </div>
      }
    >
      <InquiryFormInner {...props} />
    </React.Suspense>
  );
}
