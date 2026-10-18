import * as React from "react";

export default function AdminSettingsLoading() {
  return (
    <div className="space-y-6 max-w-4xl animate-pulse">
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 w-fit">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-8 w-24 bg-white/70 dark:bg-slate-900/70 rounded-xl" />
        ))}
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="space-y-2 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div className="h-6 w-52 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          <div className="h-4 w-96 bg-slate-100 dark:bg-slate-800 rounded-md" />
        </div>

        <div className="h-44 w-full bg-slate-100 dark:bg-slate-850 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800" />

        <div className="h-64 w-full bg-slate-950 rounded-2xl" />
      </div>
    </div>
  );
}
