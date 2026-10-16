import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight, Layers, Tag, MapPin, PackageCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export interface ProductCardData {
  id: string;
  slug: string;
  title: string;
  categoryName: string;
  shortDesc: string;
  grade?: string | null;
  origin?: string | null;
  packaging?: string | null;
  moq?: string | null;
  status: string;
  imageUrl?: string;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const t = useTranslations("products");

  const imageSrc =
    product.imageUrl && product.imageUrl.length > 5
      ? product.imageUrl
      : "/images/products/pcb-motherboards.jpg";

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-500/50 dark:hover:border-emerald-500/40 transition-all duration-300">
      {/* Product Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={imageSrc}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 backdrop-blur-sm shadow-sm border border-slate-200/50 dark:border-slate-700/50">
            {product.categoryName}
          </span>
          {product.grade && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-600 text-white shadow-sm">
              {product.grade}
            </span>
          )}
        </div>
        {product.status === "DRAFT" && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/90 text-white backdrop-blur-sm">
            Pending Confirmation
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
            {product.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {product.shortDesc}
          </p>

          {/* Quick Specs */}
          <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
            {product.origin && (
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{product.origin}</span>
              </div>
            )}
            {product.moq && (
              <div className="flex items-center gap-1.5 truncate">
                <PackageCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{product.moq}</span>
              </div>
            )}
            {product.packaging && (
              <div className="flex items-center gap-1.5 col-span-2 truncate">
                <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{product.packaging}</span>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 inline-flex items-center justify-center py-2 px-3 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            {t("viewDetails")}
          </Link>
          <Link
            href={`/inquiry?product=${encodeURIComponent(product.slug)}`}
            className="inline-flex items-center justify-center p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
            title={t("requestQuote")}
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
