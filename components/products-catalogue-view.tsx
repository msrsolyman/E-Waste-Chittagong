"use client";

import * as React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ProductCard, ProductCardData } from "@/components/product-card";
import {
  Search,
  X,
  Eye,
  ArrowUpRight,
  MapPin,
  Package,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Layers,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface CategoryOption {
  id: string;
  slug: string;
  name: string;
}

export function ProductsCatalogueView({
  products,
  categories,
}: {
  products: ProductCardData[];
  categories: CategoryOption[];
}) {
  const t = useTranslations("products");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [activeModalProduct, setActiveModalProduct] = React.useState<ProductCardData | null>(null);
  const [activeImageIndex, setActiveImageIndex] = React.useState<number>(0);

  // Close modal on ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModalProduct(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter products based on search and category
  const filtered = React.useMemo(() => {
    return products.filter((p) => {
      const matchesCat =
        selectedCategory === "ALL" ||
        p.categoryName.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        (p.grade && p.grade.toLowerCase().includes(q)) ||
        (p.origin && p.origin.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleOpenQuickSpecs = (product: ProductCardData) => {
    setActiveModalProduct(product);
    setActiveImageIndex(0);
  };

  const handleCloseQuickSpecs = () => {
    setActiveModalProduct(null);
  };

  const isFiltered = selectedCategory !== "ALL" || searchQuery.trim().length > 0;

  return (
    <div className="space-y-8">
      {/* 1. INTERACTIVE FILTER & SEARCH BAR */}
      <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Input with Clear Button */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Active Inventory Count & Reset Button */}
          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>
                {t("showingCount", { count: filtered.length, total: products.length })}
              </span>
            </div>

            {isFiltered && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("ALL");
                  setSearchQuery("");
                }}
                className="text-[11px] font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 underline underline-offset-4 transition"
              >
                {t("clearFilter")}
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === "ALL"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/15"
                : "bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {t("allCategories")}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.name)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === c.name
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/15"
                  : "bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. PRODUCT CARDS GRID WITH STAGGERED ENTRANCE */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-sm space-y-3">
          <Layers className="w-10 h-10 mx-auto text-slate-400 opacity-60" />
          <div className="font-semibold">{t("empty")}</div>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("ALL");
              setSearchQuery("");
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition"
          >
            <span>{t("clearFilter")}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((p, idx) => (
            <div
              key={p.id}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <ProductCard product={p} onQuickSpecs={handleOpenQuickSpecs} />
            </div>
          ))}
        </div>
      )}

      {/* 3. INTERACTIVE QUICK-SPECS LIGHTBOX MODAL */}
      {activeModalProduct && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={handleCloseQuickSpecs}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {activeModalProduct.categoryName}
                  </span>
                  {activeModalProduct.grade && (
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wider uppercase bg-slate-900 text-white dark:bg-slate-800">
                      {activeModalProduct.grade}
                    </span>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {activeModalProduct.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={handleCloseQuickSpecs}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
              {/* Product Visual Showcase */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800">
                <Image
                  src={
                    activeModalProduct.images && activeModalProduct.images[activeImageIndex]
                      ? activeModalProduct.images[activeImageIndex]
                      : activeModalProduct.imageUrl || "/images/products/pcb-motherboards.jpg"
                  }
                  alt={activeModalProduct.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 border border-white/10 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Verified Chittagong Inventory</span>
                </div>
              </div>

              {/* Multi-angle Thumbnail Strip if available */}
              {activeModalProduct.images && activeModalProduct.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {activeModalProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-12 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                        activeImageIndex === idx
                          ? "border-emerald-600 scale-105"
                          : "border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="Thumb" fill className="object-cover" unoptimized />
                    </button>
                  ))}
                </div>
              )}

              {/* 4-Item Specification Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span>Origin Port</span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    {activeModalProduct.origin || "Chittagong, BD"}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Scale className="w-3 h-3 text-emerald-600" />
                    <span>Minimum Order</span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    {activeModalProduct.moq || "Negotiable"}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Package className="w-3 h-3 text-emerald-600" />
                    <span>Packaging</span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    {activeModalProduct.packaging || "Super Sacks"}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Inspection</span>
                  </div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 truncate">
                    100% Mechanical
                  </div>
                </div>
              </div>

              {/* Description & Technical Notes */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Description & Sorting Specifications
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {activeModalProduct.fullDesc || activeModalProduct.shortDesc}
                </p>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 sm:p-6 pt-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <Link
                href={`/products/${activeModalProduct.slug}`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition"
              >
                <span>View Dedicated Product Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCloseQuickSpecs}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                >
                  {t("closeQuickSpecs")}
                </button>

                <Link
                  href={`/inquiry?product=${encodeURIComponent(activeModalProduct.slug)}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/20 active:scale-95 transition-all"
                >
                  <span>{t("requestQuote")}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
