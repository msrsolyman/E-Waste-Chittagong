import * as React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminCategoryManager } from "@/components/admin-category-manager";
import { Layers } from "lucide-react";

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
            Material streams, sorting categories, and catalogue organization with live CRUD operations.
          </p>
        </div>
      </div>

      <AdminCategoryManager initialCategories={categories} />
    </div>
  );
}
