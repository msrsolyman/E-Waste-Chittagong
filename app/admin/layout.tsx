import * as React from "react";
import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { AdminMobileNav } from "@/components/admin-mobile-nav";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminLocaleProvider } from "@/lib/admin-i18n";

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
    <AdminLocaleProvider>
      <div className="h-screen overflow-hidden bg-slate-100 dark:bg-slate-950 flex flex-col md:flex-row text-slate-900 dark:text-slate-100">
        {/* Mobile Sticky Top Header, Drawer, and Bottom Bar */}
        <AdminMobileNav user={user} />

        {/* Desktop Sidebar (100% Fixed at full viewport height on the left) */}
        <AdminSidebar user={user} />

        {/* Main Content Area (Independently scrollable) */}
        <main className="flex-1 h-screen overflow-y-auto p-3.5 sm:p-6 md:p-8 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </AdminLocaleProvider>
  );
}
