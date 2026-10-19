import * as React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSuperDashboardData } from "@/lib/analytics-service";
import { AdminDashboardOverview } from "@/components/admin-dashboard-overview";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const [
    totalInquiries,
    newInquiries,
    quotedInquiries,
    totalProducts,
    publishedProducts,
    totalCategories,
    totalGalleryItems,
    totalUsers,
    recentInquiries,
    recentAuditLogs,
    geoAnalyticsData,
  ] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.inquiry.count({ where: { status: "QUOTED" } }),
    prisma.product.count(),
    prisma.product.count({ where: { status: "PUBLISHED" } }),
    prisma.category.count(),
    prisma.galleryItem.count(),
    prisma.user.count(),
    prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        referenceNo: true,
        status: true,
        companyName: true,
        name: true,
        email: true,
        country: true,
        estimatedQty: true,
        createdAt: true,
      },
    }),
    prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        action: true,
        details: true,
        ipAddress: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
      },
    }),
    getSuperDashboardData("30d"),
  ]);

  const stats = {
    totalInquiries,
    newInquiries,
    quotedInquiries,
    totalProducts,
    publishedProducts,
    totalCategories,
    totalGalleryItems,
    totalUsers,
  };

  return (
    <AdminDashboardOverview
      user={user}
      stats={stats}
      recentInquiries={recentInquiries}
      recentAuditLogs={recentAuditLogs}
      geoAnalyticsData={geoAnalyticsData}
    />
  );
}
