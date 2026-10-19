"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { AdminLanguageSwitcher } from "@/components/admin-language-switcher";
import { useAdminLocale } from "@/lib/admin-i18n";
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
  const { t } = useAdminLocale();
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
    { href: "/admin", label: t("nav.dashboard"), icon: LayoutDashboard, color: "text-emerald-600" },
    { href: "/admin/inquiries", label: t("nav.inquiries"), icon: Inbox, color: "text-blue-600" },
    { href: "/admin/products", label: t("nav.products"), icon: Package, color: "text-amber-600" },
    { href: "/admin/categories", label: t("nav.categories"), icon: Layers, color: "text-purple-600" },
    { href: "/admin/gallery", label: t("nav.gallery"), icon: ImageIcon, color: "text-emerald-600" },
    { href: "/admin/settings", label: t("nav.settings"), icon: Sliders, color: "text-cyan-600" },
    ...(user.role === "SUPER_ADMIN"
      ? [{ href: "/admin/users", label: t("nav.users"), icon: User, color: "text-indigo-600" }]
      : []),
    { href: "/admin/audit-logs", label: t("nav.audit"), icon: FileClock, color: "text-slate-500" },
  ];

  const bottomItems = [
    { href: "/admin", label: t("nav.dashboard").split(" ")[0], icon: LayoutDashboard },
    { href: "/admin/inquiries", label: t("nav.inquiries").split(" ")[0], icon: Inbox },
    { href: "/admin/products", label: t("nav.products").split(" ")[0], icon: Package },
    { href: "/admin/settings", label: t("nav.settings").split(" ")[0], icon: Sliders },
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
          {/* Mobile Language Switcher */}
          <AdminLanguageSwitcher compact={true} />

          {/* User Avatar Pill */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
              {user.name.charAt(0)}
            </span>
          </div>

          {/* Hamburger Trigger */}
          <button
            type="button"
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label="Toggle navigation menu"
            className="p-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
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

              {/* Language Switcher in Drawer */}
              <div className="p-3 mx-3 mt-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {t("switcher.language")}:
                </span>
                <AdminLanguageSwitcher compact={false} />
              </div>

              {/* User Profile Card */}
              <div className="p-3.5 mx-3 mt-2 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-slate-50 to-slate-100 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider uppercase">
                      {user.role === "SUPER_ADMIN" ? t("nav.super_admin") : t("nav.content_manager")}
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
                  <span>{t("nav.public_site")}</span>
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
      {/* 3. MOBILE BOTTOM NAVIGATION DOCK (iOS/Android Native Feel)    */}
      {/* ------------------------------------------------------------- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 flex items-center justify-around shadow-lg">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isExactActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
                active
                  ? "text-emerald-600 dark:text-emerald-400 font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] leading-tight truncate">{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">{t("nav.settings").split(" ")[0]}</span>
        </button>
      </nav>
    </>
  );
}
