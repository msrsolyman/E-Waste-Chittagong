"use client";

import * as React from "react";
import { formatDate } from "@/lib/utils";
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  Send,
  MessageSquare,
  Building2,
  Mail,
  Phone,
  Globe,
  Package,
  Layers,
  ChevronDown,
  Save,
  Download,
} from "lucide-react";

interface InquiryData {
  id: string;
  referenceNo: string;
  status: string;
  name: string;
  companyName: string;
  email: string;
  phoneOrWhatsApp: string | null;
  country: string;
  interestedCategory: string | null;
  estimatedQty: string | null;
  message: string;
  adminNotes: string | null;
  createdAt: string | Date;
}

const statusOptions = [
  { value: "NEW", label: "New Lead", color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  { value: "CONTACTED", label: "Contacted", color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
  { value: "IN_PROGRESS", label: "In Progress", color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  { value: "QUOTED", label: "Quoted", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  { value: "CLOSED", label: "Closed / Archived", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
];

export function AdminInquiryPipeline({ initialInquiries }: { initialInquiries: InquiryData[] }) {
  const [inquiries, setInquiries] = React.useState<InquiryData[]>(initialInquiries);
  const [filterStatus, setFilterStatus] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [notesState, setNotesState] = React.useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/inquiries/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async (id: string) => {
    setUpdatingId(id);
    try {
      const notes = notesState[id];
      const res = await fetch("/api/admin/inquiries/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: inquiries.find((i) => i.id === id)?.status,
          adminNotes: notes,
        }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, adminNotes: notes } : inq))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = inquiries.filter((inq) => {
    const matchesFilter = filterStatus === "ALL" || inq.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      inq.referenceNo.toLowerCase().includes(q) ||
      inq.companyName.toLowerCase().includes(q) ||
      inq.name.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      inq.country.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reference, company, country, or email..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "NEW", "CONTACTED", "IN_PROGRESS", "QUOTED", "CLOSED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterStatus === st
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
              }`}
            >
              {st === "ALL" ? "All Inquiries" : st}
            </button>
          ))}

          <a
            href="/api/admin/inquiries/export"
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition whitespace-nowrap"
            title="Download Inquiries Spreadsheet"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Inquiry Cards List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            No inquiries match your current filters.
          </div>
        ) : (
          filtered.map((inq) => {
            const isExpanded = expandedId === inq.id;
            const currentStatusObj = statusOptions.find((s) => s.value === inq.status) || statusOptions[0];

            return (
              <div
                key={inq.id}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition"
              >
                {/* Header Row */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="px-2.5 py-1 rounded-md font-mono text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {inq.referenceNo}
                    </div>

                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{inq.companyName}</span>
                        <span className="text-slate-400 font-normal text-xs">({inq.country})</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {inq.name} · {inq.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status Dropdown */}
                    <select
                      value={inq.status}
                      disabled={updatingId === inq.id}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${currentStatusObj.color}`}
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : inq.id)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1"
                    >
                      <span>{isExpanded ? "Collapse" : "Details"}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                        <span className="text-slate-400 uppercase tracking-wider text-[10px] block font-semibold">
                          Phone / WhatsApp
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {inq.phoneOrWhatsApp || "Not provided"}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                        <span className="text-slate-400 uppercase tracking-wider text-[10px] block font-semibold">
                          Category / Interest
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {inq.interestedCategory || "General"}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                        <span className="text-slate-400 uppercase tracking-wider text-[10px] block font-semibold">
                          Estimated Volume
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {inq.estimatedQty || "Not specified"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                      <span className="text-slate-400 uppercase tracking-wider text-[10px] block font-semibold">
                        Buyer Requirements & Message
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {inq.message}
                      </p>
                    </div>

                    {/* Internal Admin Notes */}
                    <div className="space-y-2">
                      <label className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Internal Processing Notes</span>
                      </label>
                      <div className="flex gap-2">
                        <textarea
                          rows={2}
                          value={notesState[inq.id] !== undefined ? notesState[inq.id] : (inq.adminNotes || "")}
                          onChange={(e) =>
                            setNotesState({ ...notesState, [inq.id]: e.target.value })
                          }
                          placeholder="Add internal notes about buyer communication, quotation details, FOB freight quotes..."
                          className="flex-1 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          disabled={updatingId === inq.id}
                          onClick={() => handleSaveNotes(inq.id)}
                          className="px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
