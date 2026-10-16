import * as React from "react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/section-heading";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "categories" });

  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SectionHeading
        badge={t("badge")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat) => {
          let name = cat.nameEn;
          let description = cat.descriptionEn;

          if (locale === "bn") {
            if (cat.nameBn) name = cat.nameBn;
            if (cat.descriptionBn) description = cat.descriptionBn;
          } else if (locale === "zh-CN") {
            if (cat.nameZh) name = cat.nameZh;
            if (cat.descriptionZh) description = cat.descriptionZh;
          } else if (locale === "ja") {
            if (cat.nameJa) name = cat.nameJa;
            if (cat.descriptionJa) description = cat.descriptionJa;
          }

          const imgUrl = cat.imageUrl || "/images/products/pcb-motherboards.jpg";

          return (
            <div
              key={cat.id}
              className="group flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={imgUrl}
                  alt={name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md text-xs font-bold bg-black/75 text-white backdrop-blur-md">
                  {t("itemsCount", { count: cat._count.products })}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    {name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href={`/products?category=${encodeURIComponent(cat.nameEn)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition"
                  >
                    <span>{t("browse", { name })}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
