import * as React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminGalleryManager } from "@/components/admin-gallery-manager";
import { Image as ImageIcon } from "lucide-react";

export default async function AdminGalleryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const items = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-emerald-600" />
            <span>Media & Facility Gallery Management</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Organize activity photos, assign scrap categories, and toggle authentic vs illustrative badges for buyer transparency.
          </p>
        </div>
      </div>

      <AdminGalleryManager initialItems={items} />
    </div>
  );
}
