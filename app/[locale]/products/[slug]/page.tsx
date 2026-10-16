import * as React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { InquiryForm } from "@/components/inquiry-form";
import {
  ArrowLeft,
  ShieldCheck,
  Package,
  Layers,
  MapPin,
  Clock,
  ArrowUpRight,
  FileText,
} from "lucide-react";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Localize content with fallback to English
  let title = product.titleEn;
  let shortDesc = product.shortDescEn;
  let fullDesc = product.fullDescEn;
  let categoryName = product.category.nameEn;

  if (locale === "bn") {
    if (product.titleBn) title = product.titleBn;
    if (product.shortDescBn) shortDesc = product.shortDescBn;
    if (product.fullDescBn) fullDesc = product.fullDescBn;
    if (product.category.nameBn) categoryName = product.category.nameBn;
  } else if (locale === "zh-CN") {
    if (product.titleZh) title = product.titleZh;
    if (product.shortDescZh) shortDesc = product.shortDescZh;
    if (product.fullDescZh) fullDesc = product.fullDescZh;
    if (product.category.nameZh) categoryName = product.category.nameZh;
  } else if (locale === "ja") {
    if (product.titleJa) title = product.titleJa;
    if (product.shortDescJa) shortDesc = product.shortDescJa;
    if (product.fullDescJa) fullDesc = product.fullDescJa;
    if (product.category.nameJa) categoryName = product.category.nameJa;
  }

  let imageUrl = "/images/products/pcb-motherboards.jpg";
  try {
    const parsed = JSON.parse(product.images);
    if (Array.isArray(parsed) && parsed[0]) imageUrl = parsed[0];
  } catch {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb & Back */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/products" className="hover:text-emerald-600 transition flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product Catalogue</span>
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs">{title}</span>
      </div>

      {/* Main Product Showcase (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Image (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-md">
            <Image
              src={imageUrl}
              alt={title}
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Material Lot Guarantee</span>
            </div>
            <p className="leading-relaxed">
              Every shipment is packaged and sealed under supervision in Chittagong, adhering strictly to agreed B2B assay expectations and international logistics requirements.
            </p>
          </div>
        </div>

        {/* Right: Specifications & Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {categoryName}
              </span>
              {product.grade && (
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {product.grade}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {title}
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {shortDesc}
            </p>
          </div>

          {/* Technical Specifications Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Commercial & Technical Specifications
            </div>
            <dl className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="px-4 py-3 grid grid-cols-3 gap-2">
                <dt className="text-slate-400 font-medium">Material Grade</dt>
                <dd className="col-span-2 text-slate-900 dark:text-white font-semibold">
                  {product.grade || "Standard Industrial Recycled Grade"}
                </dd>
              </div>
              <div className="px-4 py-3 grid grid-cols-3 gap-2">
                <dt className="text-slate-400 font-medium">Origin Port</dt>
                <dd className="col-span-2 text-slate-900 dark:text-white font-semibold">
                  {product.origin || "Chittagong, Bangladesh"}
                </dd>
              </div>
              <div className="px-4 py-3 grid grid-cols-3 gap-2">
                <dt className="text-slate-400 font-medium">Packaging</dt>
                <dd className="col-span-2 text-slate-900 dark:text-white font-semibold">
                  {product.packaging || "Jumbo Sacks / Steel Drums / Palletized"}
                </dd>
              </div>
              <div className="px-4 py-3 grid grid-cols-3 gap-2">
                <dt className="text-slate-400 font-medium">Minimum Order (MOQ)</dt>
                <dd className="col-span-2 text-slate-900 dark:text-white font-semibold">
                  {product.minOrderQuantity || "1 Metric Ton (Trial Available)"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Full Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Full Description & Dismantling Protocol</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {fullDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Embedded Request Quotation Form */}
      <section className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Request Quotation for: <span className="text-emerald-600 dark:text-emerald-400">{title}</span>
          </h2>
          <p className="text-xs text-slate-500">
            Submit your inquiry directly. Our commercial export desk will respond with FOB/CIF pricing, trial shipping schedule, and full documentation.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-4xl">
          <InquiryForm defaultProductSlug={product.slug} />
        </div>
      </section>
    </div>
  );
}
