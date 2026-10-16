import * as React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminProductForm } from "@/components/admin-product-form";
import { PlusCircle } from "lucide-react";

export default async function AdminNewProductPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-emerald-600" />
          <span>Add New B2B Product Listing</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Specify technical details and localized titles for English, Bengali, Chinese, and Japanese.
        </p>
      </div>

      <AdminProductForm categories={categories} />
    </div>
  );
}
