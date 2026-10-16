import * as React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import {
  Inbox,
  Package,
  Layers,
  FileClock,
  ArrowRight,
  Clock,
  CheckCircle,
  FileText,
  AlertCircle,
  PlusCircle,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  // Fetch real database metrics
  const [
    totalInquiries,
    newInquiries,
    quotedInquiries,
    totalProducts,
    publishedProducts,
    totalCategories,
    recentInquiries,
    recentAuditLogs,
  ] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.inquiry.count({ where: { status: "QUOTED" } }),
    prisma.product.count(),
    prisma.product.count({ where: { status: "PUBLISHED" } }),
    prisma.category.count(),
    prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Operations & Executive Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, <span className="font-semibold text-emerald-600 dark:text-emerald-400">{user.name}</span> ({user.role === "SUPER_ADMIN" ? "Super Admin" : "Content Manager"})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            <Inbox className="w-4 h-4 text-blue-600" />
            <span>Inquiry Pipeline</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid - Clickable Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* New Leads */}
        <Link
          href="/admin/inquiries?status=NEW"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 hover:border-blue-500/50 hover:shadow-md transition-all group block"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">New RFQ Inquiries</span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 group-hover:scale-105 transition-transform">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {newInquiries}
          </div>
          <div className="text-[11px] text-slate-400">
            Out of {totalInquiries} total buyer submissions
          </div>
        </Link>

        {/* Quoted Deals */}
        <Link
          href="/admin/inquiries?status=QUOTED"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-500/50 hover:shadow-md transition-all group block"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Quoted / In Negotiation</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 group-hover:scale-105 transition-transform">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {quotedInquiries}
          </div>
          <div className="text-[11px] text-slate-400">
            Active commercial quotations
          </div>
        </Link>

        {/* Active Products */}
        <Link
          href="/admin/products"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 hover:border-amber-500/50 hover:shadow-md transition-all group block"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Catalogue Items</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 group-hover:scale-105 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {publishedProducts}
          </div>
          <div className="text-[11px] text-slate-400">
            {totalProducts - publishedProducts} draft items awaiting confirmation
          </div>
        </Link>

        {/* Categories */}
        <Link
          href="/admin/categories"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 hover:border-purple-500/50 hover:shadow-md transition-all group block"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Material Taxonomies</span>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalCategories}
          </div>
          <div className="text-[11px] text-slate-400">
            Configured recycling streams
          </div>
        </Link>
      </div>

      {/* Two-Column Section: Recent Inquiries & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Inquiries (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Inbox className="w-4 h-4 text-emerald-600" />
              <span>Latest Inquiries (RFQ Pipeline)</span>
            </h3>
            <Link
              href="/admin/inquiries"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-400">
              No buyer inquiries recorded yet. Submissions from the public inquiry form will appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200/60 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Reference</th>
                    <th className="py-2.5 px-3">Company / Contact</th>
                    <th className="py-2.5 px-3">Country</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentInquiries.map((inq) => {
                    const statusColors: Record<string, string> = {
                      NEW: "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300",
                      CONTACTED: "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300",
                      IN_PROGRESS: "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300",
                      QUOTED: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300",
                      CLOSED: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
                    };
                    return (
                      <tr key={inq.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {inq.referenceNo}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {inq.companyName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {inq.name} ({inq.email})
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                          {inq.country}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${statusColors[inq.status] || "bg-slate-100 text-slate-700"}`}>
                            {inq.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-400 text-[11px]">
                          {formatDate(inq.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Audit Log (1 Col) */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <FileClock className="w-4 h-4 text-slate-500" />
              <span>Recent Activity Logs</span>
            </h3>
            <Link
              href="/admin/audit-logs"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Full Log
            </Link>
          </div>

          {recentAuditLogs.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-400">
              No security or audit events recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentAuditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {log.action}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      {formatDate(log.createdAt)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                    {log.user ? `${log.user.name} (${log.user.email})` : "System / Visitor"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
