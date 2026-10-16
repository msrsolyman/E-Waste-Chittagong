import * as React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { FileClock, ShieldCheck } from "lucide-react";

export default async function AdminAuditLogsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const logs = await prisma.auditLog.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true, role: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileClock className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            <span>Audit Trail & Security Logs</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Immutable log of administrative operations, catalog changes, inquiry status updates, and authenticated logins.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {formatDate(log.createdAt)} {new Date(log.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {log.user ? (
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {log.user.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {log.user.email} ({log.user.role})
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Public Visitor / System</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono text-[11px] max-w-xs truncate">
                    {log.details || "-"}
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {log.ipAddress || "local"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
