import * as React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { InquiryForm } from "@/components/inquiry-form";
import { ArrowLeft, ShieldCheck, FileText } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ProductImageGallery } from "@/components/product-image-gallery";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "productDetail" });

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

  let imagesList: string[] = ["/images/products/pcb-motherboards.jpg"];
  try {
    const parsed = JSON.parse(product.images);
    if (Array.isArray(parsed) && parsed.length > 0) imagesList = parsed;
  } catch {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb & Back */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/products" className="hover:text-emerald-600 transition flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t("backToCatalogue")}</span>
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs">{title}</span>
      </div>

      {/* Main Product Showcase (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Image Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <ProductImageGallery
            images={imagesList}
            title={title}
            verifiedText={t("verifiedGuaranteeTitle")}
          />

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t("verifiedGuaranteeTitle")}</span>
            </div>
            <p className="leading-relaxed">
              {t("verifiedGuaranteeDesc")}
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
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>{t("specsTitle")}</span>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                Commercial Parameters
              </span>
            </div>
            <dl className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="px-5 py-3.5 grid grid-cols-3 gap-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                <dt className="text-slate-400 font-medium">{t("gradeLabel")}</dt>
                <dd className="col-span-2 text-slate-900 dark:text-white font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>{product.grade || "Standard Industrial Recycled Grade"}</span>
                </dd>
              </div>
              <div className="px-5 py-3.5 grid grid-cols-3 gap-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                <dt className="text-slate-400 font-medium">{t("originLabel")}</dt>
                <dd className="col-span-2 text-slate-900 dark:text-white font-semibold">
                  {product.origin || "Chittagong, Bangladesh"}
                </dd>
              </div>
              <div className="px-5 py-3.5 grid grid-cols-3 gap-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                <dt className="text-slate-400 font-medium">{t("packagingLabel")}</dt>
                <dd className="col-span-2 text-slate-900 dark:text-white font-semibold">
                  {product.packaging || "Jumbo Sacks / Steel Drums / Palletized"}
                </dd>
              </div>
              <div className="px-5 py-3.5 grid grid-cols-3 gap-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                <dt className="text-slate-400 font-medium">{t("moqLabel")}</dt>
                <dd className="col-span-2 text-slate-900 dark:text-white font-semibold">
                  {product.minOrderQuantity || "1 Metric Ton (Trial Available)"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Full Description */}
          <div className="space-y-2.5 p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t("descTitle")}</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {fullDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Embedded Request Quotation Form */}
      <section className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-6">
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {t("rfqTitle", { title })}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("rfqDesc")}
          </p>
        </div>

        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl max-w-4xl">
          <InquiryForm defaultProductSlug={product.slug} />
        </div>
      </section>
    </div>
  );
}
