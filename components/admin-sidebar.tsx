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
  ImageIcon,
} from "lucide-react";

interface AdminSidebarProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const { t } = useAdminLocale();

  const isExactActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const navLinks = [
    {
      href: "/admin",
      label: t("nav.dashboard"),
      icon: LayoutDashboard,
      color: "text-emerald-600",
    },
    {
      href: "/admin/inquiries",
      label: t("nav.inquiries"),
      icon: Inbox,
      color: "text-blue-600",
    },
    {
      href: "/admin/products",
      label: t("nav.products"),
      icon: Package,
      color: "text-amber-600",
    },
    {
      href: "/admin/categories",
      label: t("nav.categories"),
      icon: Layers,
      color: "text-purple-600",
    },
    {
      href: "/admin/gallery",
      label: t("nav.gallery"),
      icon: ImageIcon,
      color: "text-emerald-600",
    },
    {
      href: "/admin/settings",
      label: t("nav.settings"),
      icon: Sliders,
      color: "text-cyan-600",
    },
    ...(user.role === "SUPER_ADMIN"
      ? [
          {
            href: "/admin/users",
            label: t("nav.users"),
            icon: User,
            color: "text-indigo-600",
          },
        ]
      : []),
    {
      href: "/admin/audit-logs",
      label: t("nav.audit"),
      icon: FileClock,
      color: "text-slate-500",
    },
  ];

  return (
    <aside className="hidden md:flex md:w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col shrink-0 overflow-y-auto z-30 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <BrandLogo size="sm" href="/admin" />
      </div>

      {/* Language Switcher Pill in Sidebar */}
      <div className="px-3 pt-3 pb-1 shrink-0">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            {t("switcher.language")}:
          </span>
          <AdminLanguageSwitcher compact={false} />
        </div>
      </div>

      {/* User Badge */}
      <div className="p-3 mx-3 my-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
          {user.name.charAt(0)}
        </div>
        <div className="overflow-hidden">
          <div className="text-xs font-bold truncate">{user.name}</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider uppercase">
            {user.role === "SUPER_ADMIN" ? t("nav.super_admin") : t("nav.content_manager")}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 text-xs font-medium overflow-y-auto">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const active = isExactActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all ${
                active
                  ? "bg-emerald-600 text-white shadow-xs font-bold"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? "text-white" : item.color}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
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
            <span>{t("nav.public_site")}</span>
          </span>
        </Link>
        <AdminLogoutButton />
      </div>
    </aside>
  );
}
