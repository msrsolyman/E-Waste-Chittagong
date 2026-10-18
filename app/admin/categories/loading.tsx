import * as React from "react";

export default function AdminCategoriesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <div className="h-7 w-56 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-4 w-80 bg-slate-100 dark:bg-slate-850 rounded-lg" />
        </div>
        <div className="h-9 w-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
          >
            <div className="h-32 w-full bg-slate-100 dark:bg-slate-800 rounded-xl" />
            <div className="h-5 w-36 bg-slate-200 dark:bg-slate-700 rounded-md" />
            <div className="h-3 w-48 bg-slate-100 dark:bg-slate-850 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
