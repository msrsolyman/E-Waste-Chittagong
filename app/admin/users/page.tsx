import * as React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminUserManager } from "@/components/admin-user-manager";
import { AdminPageHeader } from "@/components/admin-page-header";
import { Users, ShieldAlert } from "lucide-react";

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  if (user.role !== "SUPER_ADMIN") {
    return (
      <div className="p-8 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-center space-y-3">
        <ShieldAlert className="w-10 h-10 text-amber-600 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Access Restricted to Super Administrators
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Your current account role ({user.role}) does not have permission to manage administrative users. Contact the primary Chittagong operations director for role upgrades.
        </p>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={<Users className="w-6 h-6 text-purple-600" />}
        titleKey="page.users.title"
        defaultTitle="Admin Users & Role Permissions"
        subtitleKey="page.users.subtitle"
        defaultSubtitle="Manage administrative personnel, assign Content Manager or Super Admin privileges, and monitor account statuses."
      />

      <AdminUserManager initialUsers={users} currentUserId={user.id} />
    </div>
  );
}
