import * as React from "react";

export default function AdminInquiriesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-4 w-96 bg-slate-100 dark:bg-slate-850 rounded-lg" />
        </div>
        <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>

      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        ))}
      </div>

      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded-md" />
              <div className="h-3 w-72 bg-slate-100 dark:bg-slate-800 rounded-md" />
            </div>
            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
