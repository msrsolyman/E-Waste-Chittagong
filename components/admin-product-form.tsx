"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { MediaUploader } from "@/components/media-uploader";

interface Category {
  id: string;
  nameEn: string;
}

export function AdminProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<"en" | "bn" | "zh" | "ja">("en");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    categoryId: categories[0]?.id || "",
    status: "DRAFT",
    grade: "Industrial Grade A",
    origin: "Chittagong, Bangladesh",
    packaging: "1 Metric Ton Super Sacks / Wooden Pallets",
    minOrderQuantity: "1 Metric Ton",
    imageUrl: "",

    // Localized fields
    titleEn: "",
    titleBn: "",
    titleZh: "",
    titleJa: "",

    shortDescEn: "",
    shortDescBn: "",
    shortDescZh: "",
    shortDescJa: "",

    fullDescEn: "",
    fullDescBn: "",
    fullDescZh: "",
    fullDescJa: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* General Configuration */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          General Attributes & Logistics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Category *
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Initial Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="DRAFT">DRAFT (Awaiting Confirmation)</option>
              <option value="PUBLISHED">PUBLISHED (Live on Website)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Grade / Quality
            </label>
            <input
              type="text"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Origin
            </label>
            <input
              type="text"
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Packaging Format
            </label>
            <input
              type="text"
              value={formData.packaging}
              onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Min. Order Quantity (MOQ)
            </label>
            <input
              type="text"
              value={formData.minOrderQuantity}
              onChange={(e) => setFormData({ ...formData, minOrderQuantity: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Image / Video Selection via Cloudinary */}
        <div className="pt-2">
          <MediaUploader
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            folder="products"
            label="Product Showcase Media (Photo or Video) *"
            required
            helperText="Drag & drop or browse high-res product photo or video (Cloudinary CDN)"
          />
        </div>
      </div>

      {/* Multilingual Content Tabs */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Multilingual Content & Technical Details
          </h3>

          {/* Language Tabs */}
          <div className="flex items-center gap-1">
            {[
              { id: "en", label: "English (Default)" },
              { id: "bn", label: "বাংলা (Bengali)" },
              { id: "zh", label: "简体中文 (Chinese)" },
              { id: "ja", label: "日本語 (Japanese)" },
            ].map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* English Content */}
        {activeTab === "en" && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Product Title (English) *
              </label>
              <input
                type="text"
                required
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                placeholder="e.g. Telecommunication Transmission Line Card Scrap"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Short Description (English) *
              </label>
              <input
                type="text"
                required
                value={formData.shortDescEn}
                onChange={(e) => setFormData({ ...formData, shortDescEn: e.target.value })}
                placeholder="Concise overview for catalogue cards..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Full Technical Specifications (English)
              </label>
              <textarea
                rows={4}
                value={formData.fullDescEn}
                onChange={(e) => setFormData({ ...formData, fullDescEn: e.target.value })}
                placeholder="Detailed metal content, dismantling criteria, packaging standards..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Bengali Content */}
        {activeTab === "bn" && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                পণ্যের নাম (বাংলা)
              </label>
              <input
                type="text"
                value={formData.titleBn}
                onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                placeholder="যেমন: টেলিযোগাযোগ ট্রান্সমিশন লাইন কার্ড স্ক্র্যাপ"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bengali"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                সংক্ষিপ্ত বিবরণ (বাংলা)
              </label>
              <input
                type="text"
                value={formData.shortDescBn}
                onChange={(e) => setFormData({ ...formData, shortDescBn: e.target.value })}
                placeholder="ক্যাটালগ কার্ডের জন্য সংক্ষিপ্ত সারসংক্ষেপ..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bengali"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                সম্পূর্ণ বিবরণ (বাংলা)
              </label>
              <textarea
                rows={4}
                value={formData.fullDescBn}
                onChange={(e) => setFormData({ ...formData, fullDescBn: e.target.value })}
                placeholder="ধাতব উপাদান ও প্রযুক্তিগত বিশদ বিবরণ..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bengali"
              />
            </div>
          </div>
        )}

        {/* Chinese Content */}
        {activeTab === "zh" && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                产品名称 (简体中文)
              </label>
              <input
                type="text"
                value={formData.titleZh}
                onChange={(e) => setFormData({ ...formData, titleZh: e.target.value })}
                placeholder="例如: 电信级传输线路板废料"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                简要描述 (简体中文)
              </label>
              <input
                type="text"
                value={formData.shortDescZh}
                onChange={(e) => setFormData({ ...formData, shortDescZh: e.target.value })}
                placeholder="产品卡片概要..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                详细技术规格 (简体中文)
              </label>
              <textarea
                rows={4}
                value={formData.fullDescZh}
                onChange={(e) => setFormData({ ...formData, fullDescZh: e.target.value })}
                placeholder="包含金属品位、拆解要求、包装标准等..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Japanese Content */}
        {activeTab === "ja" && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                製品名 (日本語)
              </label>
              <input
                type="text"
                value={formData.titleJa}
                onChange={(e) => setFormData({ ...formData, titleJa: e.target.value })}
                placeholder="例: 通信伝送ラインカードスクラップ"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                概要 (日本語)
              </label>
              <input
                type="text"
                value={formData.shortDescJa}
                onChange={(e) => setFormData({ ...formData, shortDescJa: e.target.value })}
                placeholder="カタログカード向け概要..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                技術仕様詳細 (日本語)
              </label>
              <textarea
                rows={4}
                value={formData.fullDescJa}
                onChange={(e) => setFormData({ ...formData, fullDescJa: e.target.value })}
                placeholder="有価金属含有状況、分別解体基準、梱包要件..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? "Saving..." : "Save Product Listing"}</span>
        </button>
      </div>
    </form>
  );
}
