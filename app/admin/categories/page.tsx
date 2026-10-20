import * as React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminCategoryManager } from "@/components/admin-category-manager";
import { AdminPageHeader } from "@/components/admin-page-header";
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
      <AdminPageHeader
        icon={<Layers className="w-6 h-6 text-purple-600" />}
        titleKey="page.categories.title"
        defaultTitle="Category Taxonomy Management"
        subtitleKey="page.categories.subtitle"
        defaultSubtitle="Material streams, sorting categories, and catalogue organization with live CRUD operations."
      />

      <AdminCategoryManager initialCategories={categories} />
    </div>
  );
}
