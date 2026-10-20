import * as React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminProductForm } from "@/components/admin-product-form";
import { AdminPageHeader } from "@/components/admin-page-header";
import { PlusCircle } from "lucide-react";

export default async function AdminNewProductPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={<PlusCircle className="w-6 h-6 text-emerald-600" />}
        titleKey="page.new_product.title"
        defaultTitle="Add New B2B Product Listing"
        subtitleKey="page.new_product.subtitle"
        defaultSubtitle="Specify technical details and localized titles for English, Bengali, Chinese, and Japanese."
      />

      <AdminProductForm categories={categories} />
    </div>
  );
}
