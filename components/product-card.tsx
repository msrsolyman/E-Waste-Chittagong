"use client";

import * as React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight, Eye, MapPin, Package, Scale, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export interface ProductCardData {
  id: string;
  slug: string;
  title: string;
  categoryName: string;
  shortDesc: string;
  fullDesc?: string | null;
  grade?: string | null;
  origin?: string | null;
  packaging?: string | null;
  moq?: string | null;
  status: string;
  imageUrl?: string;
  images?: string[];
}

export function ProductCard({
  product,
  onQuickSpecs,
}: {
  product: ProductCardData;
  onQuickSpecs?: (product: ProductCardData) => void;
}) {
  const t = useTranslations("products");

  const imageSrc =
    product.imageUrl && product.imageUrl.length > 5
      ? product.imageUrl
      : "/images/products/pcb-motherboards.jpg";

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 overflow-hidden shadow-xs hover:shadow-2xl hover:shadow-emerald-950/10 dark:hover:shadow-emerald-950/20 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 hover:-translate-y-1.5 transition-all duration-300 ease-out">
      {/* Product Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={imageSrc}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          unoptimized={imageSrc.startsWith("http")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/20 opacity-70 group-hover:opacity-50 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold tracking-wide uppercase bg-slate-950/85 text-white backdrop-blur-md shadow-sm border border-white/10">
            {product.categoryName}
          </span>
          {product.grade && (
            <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-sm border border-emerald-500/30">
              {product.grade}
            </span>
          )}
        </div>

        {/* Floating Quick Specs Action on Image Hover */}
        {onQuickSpecs && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickSpecs(product);
            }}
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/90 hover:bg-emerald-600 text-white text-[11px] font-bold backdrop-blur-md border border-white/20 shadow-lg active:scale-95 transition-all duration-200"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white" />
            <span>{t("quickSpecs")}</span>
          </button>
        )}

        {/* Origin / MOQ Micro-pill on Image Bottom-Left */}
        {product.origin && (
          <div className="absolute bottom-3 left-3 hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-slate-300 text-[10px] font-medium border border-white/10">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>{product.origin}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              {product.categoryName}
            </span>
            {product.moq && (
              <span className="flex items-center gap-1 font-mono text-[10px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                <Scale className="w-2.5 h-2.5 text-emerald-600" />
                <span>MOQ: {product.moq}</span>
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 line-clamp-1">
            {product.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {product.shortDesc}
          </p>

          {/* Packaging Spec Tag */}
          {product.packaging && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <Package className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">{product.packaging}</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          {onQuickSpecs ? (
            <button
              type="button"
              onClick={() => onQuickSpecs(product)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98] transition-all duration-200"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t("quickSpecs")}</span>
            </button>
          ) : (
            <Link
              href={`/products/${product.slug}`}
              className="flex-1 inline-flex items-center justify-center py-2.5 px-3 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98] transition-all duration-200"
            >
              {t("viewDetails")}
            </Link>
          )}

          <Link
            href={`/inquiry?product=${encodeURIComponent(product.slug)}`}
            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm hover:shadow-emerald-900/20 active:scale-[0.98] transition-all duration-200 group/btn"
          >
            <span>{t("requestQuote")}</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
