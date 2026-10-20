import * as React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminProductsTable } from "@/components/admin-products-table";
import { AdminPageHeader } from "@/components/admin-page-header";
import { Package } from "lucide-react";

export default async function AdminProductsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: {
          select: { id: true, nameEn: true },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
      select: { id: true, nameEn: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={<Package className="w-6 h-6 text-emerald-600" />}
        titleKey="page.products.title"
        defaultTitle="Product Catalogue Management"
        subtitleKey="page.products.subtitle"
        defaultSubtitle="Manage electronic scrap listings, update 4-language technical descriptions, toggle draft/published/featured status, and clone listings."
      />

      <AdminProductsTable initialProducts={products} categories={categories} />
    </div>
  );
}
