import * as React from "react";

export default function AdminGalleryLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <div className="h-7 w-56 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-4 w-72 bg-slate-100 dark:bg-slate-850 rounded-lg" />
        </div>
        <div className="h-9 w-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>

      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 dark:border-slate-850 overflow-hidden bg-white dark:bg-slate-900 space-y-2 pb-3"
          >
            <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800" />
            <div className="px-3 space-y-1">
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-md" />
              <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-800 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
