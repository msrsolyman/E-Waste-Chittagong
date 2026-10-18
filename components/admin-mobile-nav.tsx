"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import {
  LayoutDashboard,
  Inbox,
  Package,
  Layers,
  FileClock,
  ExternalLink,
  Sliders,
  User,
  Menu,
  X,
  ChevronRight,
  ImageIcon,
} from "lucide-react";

interface AdminMobileNavProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export function AdminMobileNav({ user }: AdminMobileNavProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Close drawer on path change
  React.useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  React.useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const navItems = [
    { href: "/admin", label: "Dashboard Overview", icon: LayoutDashboard, color: "text-emerald-600" },
    { href: "/admin/inquiries", label: "Inquiry Pipeline", icon: Inbox, color: "text-blue-600" },
    { href: "/admin/products", label: "Products & Catalogue", icon: Package, color: "text-amber-600" },
    { href: "/admin/categories", label: "Category Taxonomy", icon: Layers, color: "text-purple-600" },
    { href: "/admin/gallery", label: "Media & Gallery", icon: ImageIcon, color: "text-emerald-600" },
    { href: "/admin/settings", label: "Site Banners & Settings", icon: Sliders, color: "text-cyan-600" },
    ...(user.role === "SUPER_ADMIN"
      ? [{ href: "/admin/users", label: "Admin Users & Roles", icon: User, color: "text-indigo-600" }]
      : []),
    { href: "/admin/audit-logs", label: "Audit Trail & Security", icon: FileClock, color: "text-slate-500" },
  ];

  const bottomItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/settings", label: "Settings", icon: Sliders },
  ];

  const isExactActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* 1. STICKY TOP BAR (Mobile Only)                              */}
      {/* ------------------------------------------------------------- */}
      <header className="md:hidden sticky top-0 z-40 w-full h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <BrandLogo size="sm" href="/admin" />
        </div>

        <div className="flex items-center gap-2">
          {/* User Avatar Pill */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
              {user.name.charAt(0)}
            </span>
            <span className="max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
          </div>

          {/* Hamburger Trigger */}
          <button
            type="button"
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
          >
            {drawerOpen ? <X className="w-5 h-5 text-rose-600" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. SLIDE-OVER MOBILE DRAWER (Backdrop + Panel)               */}
      {/* ------------------------------------------------------------- */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          />

          {/* Slide Panel */}
          <aside className="relative w-full max-w-xs h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div>
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <BrandLogo size="sm" href="/admin" />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Card */}
              <div className="p-3.5 mx-3 mt-3 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-slate-50 to-slate-100 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider uppercase">
                      {user.role === "SUPER_ADMIN" ? "Super Admin" : "Content Manager"}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                  </div>
                </div>
              </div>

              {/* Drawer Navigation List */}
              <nav className="p-3 space-y-1 text-xs font-semibold">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isExactActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={true}
                      onClick={() => setDrawerOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition ${
                        active
                          ? "bg-emerald-600 text-white shadow-xs font-bold"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${active ? "text-white" : item.color}`} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 ${active ? "text-white/80" : "text-slate-400"}`} />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-950/50">
              <Link
                href="/en"
                target="_blank"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 transition shadow-2xs"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                  <span>View Public Website</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <div className="pt-1">
                <AdminLogoutButton />
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. STICKY BOTTOM QUICK ACTION BAR (Mobile App Style)          */}
      {/* ------------------------------------------------------------- */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 py-1.5 px-3 shadow-lg flex items-center justify-around">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isExactActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
                active
                  ? "text-emerald-600 dark:text-emerald-400 font-bold"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${active ? "scale-110" : ""}`} />
                {active && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* 5th Quick Item: Menu Trigger */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
            drawerOpen
              ? "text-emerald-600 dark:text-emerald-400 font-bold"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium"
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">More</span>
        </button>
      </nav>
    </>
  );
}
