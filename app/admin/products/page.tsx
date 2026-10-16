import * as React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminProductsTable } from "@/components/admin-products-table";
import { Package } from "lucide-react";

export default async function AdminProductsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: {
        select: { nameEn: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Package className="w-6 h-6 text-emerald-600" />
            <span>Product Catalogue Management</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage electronic scrap listings, update 4-language technical descriptions, and toggle draft/published status.
          </p>
        </div>
      </div>

      <AdminProductsTable initialProducts={products} />
    </div>
  );
}
