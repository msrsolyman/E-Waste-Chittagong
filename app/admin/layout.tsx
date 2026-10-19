import * as React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { BrandLogo } from "@/components/brand-logo";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { AdminMobileNav } from "@/components/admin-mobile-nav";
import {
  LayoutDashboard,
  Inbox,
  Package,
  Layers,
  FileClock,
  ExternalLink,
  ShieldAlert,
  User,
  Sliders,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const headerList = await headers();
  const adminPathname = headerList.get("x-admin-pathname") || "";

  // If user is unauthenticated or on /admin/login, don't show the dashboard shell
  if (!user || adminPathname.startsWith("/admin/login")) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        {children}
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-100 dark:bg-slate-950 flex flex-col md:flex-row text-slate-900 dark:text-slate-100">
      {/* Mobile Sticky Top Header, Drawer, and Bottom Bar */}
      <AdminMobileNav user={user} />

      {/* Desktop Sidebar (100% Fixed at full viewport height on the left) */}
      <aside className="hidden md:flex md:w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col shrink-0 overflow-y-auto z-30 select-none">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <BrandLogo size="sm" href="/admin" />
        </div>

        {/* User Badge */}
        {user && (
          <div className="p-4 mx-3 my-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold truncate">{user.name}</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider uppercase">
                {user.role === "SUPER_ADMIN" ? "Super Admin" : "Content Manager"}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 text-xs font-medium">
          <Link
            href="/admin"
            prefetch={true}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-600" />
            <span>Dashboard Overview</span>
          </Link>

          <Link
            href="/admin/inquiries"
            prefetch={true}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <div className="flex items-center gap-2.5">
              <Inbox className="w-4 h-4 text-blue-600" />
              <span>Inquiry Pipeline</span>
            </div>
          </Link>

          <Link
            href="/admin/products"
            prefetch={true}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Package className="w-4 h-4 text-amber-600" />
            <span>Products & Catalogue</span>
          </Link>

          <Link
            href="/admin/categories"
            prefetch={true}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Layers className="w-4 h-4 text-purple-600" />
            <span>Category Taxonomy</span>
          </Link>

          <Link
            href="/admin/gallery"
            prefetch={true}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ExternalLink className="w-4 h-4 text-emerald-600" />
            <span>Media & Gallery</span>
          </Link>

          <Link
            href="/admin/settings"
            prefetch={true}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Sliders className="w-4 h-4 text-cyan-600" />
            <span>Site Banners & Settings</span>
          </Link>

          {user?.role === "SUPER_ADMIN" && (
            <Link
              href="/admin/users"
              prefetch={true}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <User className="w-4 h-4 text-indigo-600" />
              <span>Admin Users & Roles</span>
            </Link>
          )}

          <Link
            href="/admin/audit-logs"
            prefetch={true}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <FileClock className="w-4 h-4 text-slate-500" />
            <span>Audit Trail & Security</span>
          </Link>
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2 shrink-0">
          <Link
            href="/en"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Website</span>
            </span>
          </Link>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Content Area (Independently scrollable) */}
      <main className="flex-1 h-screen overflow-y-auto p-3.5 sm:p-6 md:p-8 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto space-y-6">{children}</div>
      </main>
    </div>
  );
}
