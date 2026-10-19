"use client";

import * as React from "react";
import { useAdminLocale } from "@/lib/admin-i18n";
import { Globe } from "lucide-react";

interface AdminLanguageSwitcherProps {
  className?: string;
  compact?: boolean;
}

export function AdminLanguageSwitcher({
  className = "",
  compact = false,
}: AdminLanguageSwitcherProps) {
  const { locale, setLocale } = useAdminLocale();

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-inner select-none ${className}`}
      role="group"
      aria-label="Admin Language Switcher"
    >
      <button
        type="button"
        onClick={() => setLocale("bn")}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
          locale === "bn"
            ? "bg-emerald-600 text-white shadow-sm font-black scale-100"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }`}
        title="বাংলা ভাষা নির্বাচন করুন"
      >
        {!compact && <Globe className="w-3 h-3 text-emerald-300" />}
        <span>বাংলা</span>
      </button>

      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
          locale === "en"
            ? "bg-emerald-600 text-white shadow-sm font-black scale-100"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }`}
        title="Switch to English"
      >
        <span>English</span>
      </button>
    </div>
  );
}
