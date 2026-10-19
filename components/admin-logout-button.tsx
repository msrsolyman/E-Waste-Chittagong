"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAdminLocale } from "@/lib/admin-i18n";

export function AdminLogoutButton() {
  const router = useRouter();
  const { locale, t } = useAdminLocale();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition text-left"
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>
        {loading
          ? locale === "bn"
            ? "সাইন আউট হচ্ছে..."
            : "Signing out..."
          : t("nav.logout")}
      </span>
    </button>
  );
}
