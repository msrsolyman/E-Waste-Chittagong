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
    <div className="group flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300">
      {/* Product Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={imageSrc}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 backdrop-blur-md shadow-sm border border-slate-200/60 dark:border-slate-700/60">
            {product.categoryName}
          </span>
          {product.grade && (
            <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-sm border border-emerald-500/30">
              {product.grade}
            </span>
          )}
        </div>

        {product.status === "DRAFT" && (
          <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/95 text-white backdrop-blur-md shadow-sm">
            Pending Confirmation
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 leading-snug">
            {product.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {product.shortDesc}
          </p>

          {/* Quick Specs Matrix */}
          <div className="pt-3 grid grid-cols-2 gap-2.5 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
            {product.origin && (
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate">{product.origin}</span>
              </div>
            )}
            {product.moq && (
              <div className="flex items-center gap-1.5 truncate">
                <PackageCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate">{product.moq}</span>
              </div>
            )}
            {product.packaging && (
              <div className="flex items-center gap-1.5 col-span-2 truncate">
                <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate">{product.packaging}</span>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2.5">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 inline-flex items-center justify-center py-2.5 px-3.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-emerald-500/40 transition-all duration-200"
          >
            {t("viewDetails")}
          </Link>
          <Link
            href={`/inquiry?product=${encodeURIComponent(product.slug)}`}
            className="inline-flex items-center justify-center p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-emerald-600/30 group/btn"
            title={t("requestQuote")}
          >
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
