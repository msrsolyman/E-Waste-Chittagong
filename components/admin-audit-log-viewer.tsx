"use client";

import * as React from "react";
import { formatDate } from "@/lib/utils";
import {
  Search,
  Download,
  FileClock,
  User,
  Shield,
  Eye,
  X,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

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
  const [inspectingLog, setInspectingLog] = React.useState<AuditLogRow | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("search");
      if (q) setSearchQuery(q);
    }
  }, []);

  const counts = React.useMemo(() => {
    return {
      ALL: logs.length,
      LOGIN: logs.filter((l) => l.action.includes("LOGIN")).length,
      PRODUCT: logs.filter((l) => l.action.includes("PRODUCT")).length,
      INQUIRY: logs.filter((l) => l.action.includes("INQUIR")).length,
      CATEGORY: logs.filter((l) => l.action.includes("CATEGORY")).length,
      USER: logs.filter((l) => l.action.includes("USER")).length,
      GALLERY: logs.filter((l) => l.action.includes("GALLERY")).length,
    };
  }, [logs]);

  const filtered = logs.filter((log) => {
    const matchesAction =
      actionFilter === "ALL" ||
      (actionFilter === "INQUIRY"
        ? log.action.includes("INQUIR")
        : log.action.includes(actionFilter));
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesAction;

    const matchesSearch =
      log.action.toLowerCase().includes(q) ||
      (log.details && log.details.toLowerCase().includes(q)) ||
      (log.user && log.user.email.toLowerCase().includes(q)) ||
      (log.user && log.user.name.toLowerCase().includes(q)) ||
      (log.ipAddress && log.ipAddress.toLowerCase().includes(q));

    return matchesAction && matchesSearch;
  });

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const res = await fetch("/api/admin/audit-logs/export");
      if (!res.ok) throw new Error("Failed to export audit logs");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ewaste-chittagong-audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "CSV export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const copyDetailsToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatJson = (str: string | null) => {
    if (!str) return null;
    try {
      const parsed = JSON.parse(str);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return str;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Bar: Search, Filters & CSV Export */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by action, email, name, IP or details..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Filter Pills with Badges */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl text-xs">
            {(
              [
                { id: "ALL", label: "All Events", count: counts.ALL },
                { id: "LOGIN", label: "Login", count: counts.LOGIN },
                { id: "PRODUCT", label: "Product", count: counts.PRODUCT },
                { id: "INQUIRY", label: "Inquiry", count: counts.INQUIRY },
                { id: "CATEGORY", label: "Category", count: counts.CATEGORY },
                { id: "USER", label: "User", count: counts.USER },
                { id: "GALLERY", label: "Gallery", count: counts.GALLERY },
              ] as const
            ).map((pfx) => (
              <button
                key={pfx.id}
                onClick={() => setActionFilter(pfx.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  actionFilter === pfx.id
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>{pfx.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    actionFilter === pfx.id
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200"
                      : "bg-slate-200/70 dark:bg-slate-700/60 text-slate-500"
                  }`}
                >
                  {pfx.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* CSV Export Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-xs transition active:scale-[0.98] disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isExporting ? "Exporting CSV..." : "Export Audit CSV"}</span>
          </button>
        </div>
      </div>

      {/* Counter bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Displaying <strong>{filtered.length}</strong> of <strong>{logs.length}</strong> recorded security events
        </span>
        {(searchQuery || actionFilter !== "ALL") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setActionFilter("ALL");
            }}
            className="text-emerald-600 hover:underline text-[11px] font-medium"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action Code</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Event Details</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <FileClock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-medium">No audit records match your current filter.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((log) => {
                  const isLogin = log.action.includes("LOGIN");
                  const isUser = log.action.includes("USER");
                  const isProduct = log.action.includes("PRODUCT");
                  const isInquiry = log.action.includes("INQUIR");

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition cursor-pointer"
                      onClick={() => setInspectingLog(log)}
                    >
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        <div>{formatDate(log.createdAt)}</div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(log.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border ${
                            isLogin
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900"
                              : isUser
                              ? "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-900"
                              : isProduct
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900"
                              : isInquiry
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900"
                              : "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {log.user ? (
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                              <span>{log.user.name}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {log.user.email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic font-mono text-[11px]">System / Automated</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono text-[11px] max-w-xs truncate">
                        {log.details || "-"}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {log.ipAddress || "local"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectingLog(log);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition"
                          title="Inspect full event details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Event Modal */}
      {inspectingLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileClock className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Event Inspection
                </h3>
              </div>
              <button
                onClick={() => setInspectingLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Action Code
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {inspectingLog.action}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Timestamp
                  </span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {formatDate(inspectingLog.createdAt)} {new Date(inspectingLog.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Operator
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">
                    {inspectingLog.user ? inspectingLog.user.name : "System / Automated"}
                  </span>
                  {inspectingLog.user && (
                    <div className="text-[10px] text-slate-400 font-mono">
                      {inspectingLog.user.email} ({inspectingLog.user.role})
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    IP Address
                  </span>
                  <span className="font-mono text-slate-600 dark:text-slate-400">
                    {inspectingLog.ipAddress || "local"}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Raw Event Details / JSON Payload
                  </span>
                  {inspectingLog.details && (
                    <button
                      type="button"
                      onClick={() => copyDetailsToClipboard(inspectingLog.details || "")}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? "Copied!" : "Copy Payload"}</span>
                    </button>
                  )}
                </div>
                <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto max-h-48 whitespace-pre-wrap border border-slate-800">
                  {formatJson(inspectingLog.details) || "No extra metadata captured."}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setInspectingLog(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
