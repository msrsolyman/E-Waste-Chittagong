import * as React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminAuditLogViewer } from "@/components/admin-audit-log-viewer";
import { AdminPageHeader } from "@/components/admin-page-header";
import { FileClock, ShieldAlert } from "lucide-react";

export default async function AdminAuditLogsPage() {
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
          Security audit logs contain sensitive operational tracking data and are accessible exclusively to Super Administrators.
        </p>
      </div>
    );
  }

  const logs = await prisma.auditLog.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true, role: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={<FileClock className="w-6 h-6 text-slate-600 dark:text-slate-400" />}
        titleKey="page.audit.title"
        defaultTitle="Audit Trail & Security Logs"
        subtitleKey="page.audit.subtitle"
        defaultSubtitle="Immutable log of administrative operations, catalog changes, inquiry status updates, and authenticated logins."
      />

      <AdminAuditLogViewer initialLogs={logs} />
    </div>
  );
}
