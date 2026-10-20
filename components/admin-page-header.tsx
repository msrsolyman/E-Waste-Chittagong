"use client";

import * as React from "react";
import { useAdminLocale } from "@/lib/admin-i18n";

interface AdminPageHeaderProps {
  icon?: React.ReactNode;
  titleKey?: string;
  defaultTitle?: string;
  subtitleKey?: string;
  defaultSubtitle?: string;
  actions?: React.ReactNode;
}

export function AdminPageHeader({
  icon,
  titleKey,
  defaultTitle = "",
  subtitleKey,
  defaultSubtitle = "",
  actions,
}: AdminPageHeaderProps) {
  const { t } = useAdminLocale();

  const title = titleKey ? t(titleKey, defaultTitle) : defaultTitle;
  const subtitle = subtitleKey ? t(subtitleKey, defaultSubtitle) : defaultSubtitle;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          {icon}
          <span>{title}</span>
        </h1>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
