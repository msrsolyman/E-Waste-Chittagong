import * as React from "react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Layers, PlusCircle } from "lucide-react";

export default async function AdminCategoriesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-purple-600" />
            <span>Category Taxonomy Management</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Material streams, sorting categories, and catalogue organization.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm space-y-3"
          >
            {cat.imageUrl && (
              <div className="relative aspect-[16/9] w-full bg-slate-100 dark:bg-slate-800">
                <Image src={cat.imageUrl} alt={cat.nameEn} fill className="object-cover" />
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur-sm">
                  {cat._count.products} Products
                </div>
              </div>
            )}
            <div className="p-4 space-y-2">
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                {cat.nameEn}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                slug: {cat.slug}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                {cat.descriptionEn}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                <span>Translations:</span>
                <span className={cat.nameBn ? "text-emerald-600 font-bold" : "text-slate-300"}>BN</span>
                <span>·</span>
                <span className={cat.nameZh ? "text-emerald-600 font-bold" : "text-slate-300"}>ZH</span>
                <span>·</span>
                <span className={cat.nameJa ? "text-emerald-600 font-bold" : "text-slate-300"}>JA</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
