import * as React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminGalleryManager } from "@/components/admin-gallery-manager";
import { AdminPageHeader } from "@/components/admin-page-header";
import { Image as ImageIcon } from "lucide-react";

export default async function AdminGalleryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const items = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={<ImageIcon className="w-6 h-6 text-emerald-600" />}
        titleKey="page.gallery.title"
        defaultTitle="Media & Facility Gallery Management"
        subtitleKey="page.gallery.subtitle"
        defaultSubtitle="Organize activity photos, assign scrap categories, and toggle authentic vs illustrative badges for buyer transparency."
      />

      <AdminGalleryManager initialItems={items} />
    </div>
  );
}
