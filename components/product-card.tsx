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
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium truncate">{product.categoryName}</span>
            {product.origin && <span className="shrink-0">{product.origin}</span>}
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
            {product.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {product.shortDesc}
          </p>
        </div>

        {/* Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 inline-flex items-center justify-center py-2 px-3 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {t("viewDetails")}
          </Link>
          <Link
            href={`/inquiry?product=${encodeURIComponent(product.slug)}`}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-colors"
          >
            <span>{t("requestQuote")}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
