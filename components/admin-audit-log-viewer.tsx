"use client";

import * as React from "react";
import { formatDate } from "@/lib/utils";
import { Search, Filter, ShieldCheck, FileClock } from "lucide-react";

export interface AuditLogRow {
  id: string;
  action: string;
  details: string | null;
  ipAddress: string | null;
  createdAt: string | Date;
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export function AdminAuditLogViewer({ initialLogs }: { initialLogs: AuditLogRow[] }) {
  const [logs] = React.useState<AuditLogRow[]>(initialLogs);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [actionFilter, setActionFilter] = React.useState("ALL");

  const filtered = logs.filter((log) => {
    const matchesAction = actionFilter === "ALL" || log.action.includes(actionFilter);
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      log.action.toLowerCase().includes(q) ||
      (log.details && log.details.toLowerCase().includes(q)) ||
      (log.user && log.user.email.toLowerCase().includes(q)) ||
      (log.user && log.user.name.toLowerCase().includes(q)) ||
      (log.ipAddress && log.ipAddress.toLowerCase().includes(q));
    return matchesAction && matchesSearch;
  });

  const uniqueActionPrefixes = [
    "ALL",
    "LOGIN",
    "PRODUCT",
    "CATEGORY",
    "INQUIRY",
    "USER",
    "GALLERY",
  ];

  return (
    <div className="space-y-4">
      {/* Control bar: Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action, operator, IP, or details..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {uniqueActionPrefixes.map((pfx) => (
            <button
              key={pfx}
              onClick={() => setActionFilter(pfx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                actionFilter === pfx
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
              }`}
            >
              {pfx === "ALL" ? "All Events" : pfx}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-slate-500">
        Displaying {filtered.length} of {logs.length} logged events
      </div>

      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No audit records match your search filter.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {formatDate(log.createdAt)} {new Date(log.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {log.user ? (
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {log.user.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {log.user.email} ({log.user.role})
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">System / Visitor</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono text-[11px] max-w-sm break-all">
                      {log.details || "-"}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {log.ipAddress || "local"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
