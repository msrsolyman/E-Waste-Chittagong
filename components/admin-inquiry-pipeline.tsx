"use client";

import * as React from "react";
import { formatDate } from "@/lib/utils";
import {
  Search,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Globe,
  Package,
  Layers,
  ChevronDown,
  Save,
  Download,
  Trash2,
  Printer,
  Copy,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  X,
  DollarSign,
  FileText,
  Calendar,
  Building2,
  ArrowUpDown,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

export interface InquiryData {
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
  { value: "NEW", label: "New Lead", color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
  { value: "CONTACTED", label: "Contacted", color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800" },
  { value: "IN_PROGRESS", label: "In Progress", color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800" },
  { value: "QUOTED", label: "Quoted", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" },
  { value: "CLOSED", label: "Closed / Done", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700" },
];

export function AdminInquiryPipeline({ initialInquiries }: { initialInquiries: InquiryData[] }) {
  const searchParams = useSearchParams();
  const initialStatusParam = searchParams.get("status");

  const [inquiries, setInquiries] = React.useState<InquiryData[]>(initialInquiries);
  const [filterStatus, setFilterStatus] = React.useState<string>(initialStatusParam || "ALL");
  const [filterCountry, setFilterCountry] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [sortOrder, setSortOrder] = React.useState<"desc" | "asc">("desc");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  // Structured quotation notes state
  const [notesState, setNotesState] = React.useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Delete modal state
  const [deleteInquiry, setDeleteInquiry] = React.useState<InquiryData | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  // Printable RFQ slip state
  const [printInquiry, setPrintInquiry] = React.useState<InquiryData | null>(null);

  const showNotice = (text: string, type: "success" | "error" | "info" = "success") => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 4000);
  };

  // Distinct countries for filter
  const distinctCountries = React.useMemo(() => {
    const list = Array.from(new Set(inquiries.map((i) => i.country).filter(Boolean)));
    return list.sort();
  }, [inquiries]);

  // Status Counts
  const counts = React.useMemo(() => {
    const res: Record<string, number> = { ALL: inquiries.length };
    statusOptions.forEach((opt) => {
      res[opt.value] = inquiries.filter((i) => i.status === opt.value).length;
    });
    return res;
  }, [inquiries]);

  // Update Status handler
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
        showNotice(`Inquiry status updated to ${newStatus}`);
      } else {
        showNotice("Failed to update status", "error");
      }
    } catch {
      showNotice("Network error updating status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // Save Notes & Structured Quotation
  const handleSaveNotes = async (id: string) => {
    setUpdatingId(id);
    try {
      const notes = notesState[id];
      const targetInq = inquiries.find((i) => i.id === id);
      const res = await fetch("/api/admin/inquiries/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: targetInq?.status,
          adminNotes: notes !== undefined ? notes : targetInq?.adminNotes,
        }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, adminNotes: notes } : inq))
        );
        showNotice("Quotation notes and terms saved successfully!");
      } else {
        showNotice("Failed to save quotation notes", "error");
      }
    } catch {
      showNotice("Network error saving notes", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete Inquiry
  const confirmDelete = async () => {
    if (!deleteInquiry) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/inquiries?id=${deleteInquiry.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setInquiries((prev) => prev.filter((i) => i.id !== deleteInquiry.id));
        showNotice(`Inquiry ${deleteInquiry.referenceNo} deleted.`);
        setDeleteInquiry(null);
      } else {
        const err = await res.json();
        showNotice(err.error || "Failed to delete inquiry", "error");
      }
    } catch {
      showNotice("Network error deleting inquiry", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Copy to clipboard helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showNotice(`${label} copied to clipboard!`, "info");
  };

  // Filtered & Sorted Inquiries
  const filtered = inquiries
    .filter((inq) => {
      const matchesStatus = filterStatus === "ALL" || inq.status === filterStatus;
      const matchesCountry = filterCountry === "ALL" || inq.country === filterCountry;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        inq.referenceNo.toLowerCase().includes(q) ||
        inq.companyName.toLowerCase().includes(q) ||
        inq.name.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.country.toLowerCase().includes(q) ||
        (inq.interestedCategory && inq.interestedCategory.toLowerCase().includes(q));

      return matchesStatus && matchesCountry && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="space-y-4">
      {/* Toast Notice */}
      {notice && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center justify-between shadow-sm animate-in fade-in transition ${
            notice.type === "error"
              ? "bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300"
              : notice.type === "info"
              ? "bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300"
              : "bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === "error" ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{notice.text}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Filter and Search Bar */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Search & Country Filter */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, company, country, category, or email..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Country Filter */}
          <div className="relative shrink-0">
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Countries</option>
              {distinctCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order Toggle */}
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            title="Toggle Sort by Date"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>{sortOrder === "desc" ? "Newest First" : "Oldest First"}</span>
          </button>
        </div>

        {/* Right Tools: Status Filter Buttons & Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Badges */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
            {["ALL", "NEW", "CONTACTED", "IN_PROGRESS", "QUOTED", "CLOSED"].map((st) => {
              const count = counts[st] ?? 0;
              const isActive = filterStatus === st;
              const label =
                st === "ALL"
                  ? "All"
                  : st === "IN_PROGRESS"
                  ? "In Progress"
                  : st.charAt(0) + st.slice(1).toLowerCase();

              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] ${
                      isActive
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                        : "bg-slate-200/60 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Export CSV */}
          <a
            href="/api/admin/inquiries/export"
            download
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm whitespace-nowrap"
            title="Download Inquiries Spreadsheet with Formula Injection Defense"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <b>{filtered.length}</b> of <b>{inquiries.length}</b> buyer inquiries
        </span>
        {(searchQuery || filterStatus !== "ALL" || filterCountry !== "ALL") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterStatus("ALL");
              setFilterCountry("ALL");
            }}
            className="text-emerald-600 dark:text-emerald-400 hover:underline text-[11px]"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Inquiry Cards List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            <Layers className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
            <div>No inquiries match your current filters.</div>
          </div>
        ) : (
          filtered.map((inq) => {
            const isExpanded = expandedId === inq.id;
            const currentStatusObj =
              statusOptions.find((s) => s.value === inq.status) || statusOptions[0];

            // WhatsApp link generator with smart pre-filled template
            const rawPhone = inq.phoneOrWhatsApp || "";
            const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
            const whatsappText = encodeURIComponent(
              `Hello ${inq.name},\n\nThis is regarding your procurement inquiry (${inq.referenceNo}) for ${
                inq.interestedCategory || "electronic scrap materials"
              } sent to E-Waste Chittagong.\n\nWe would like to discuss specifications and delivery logistics CIF Chittagong.`
            );
            const whatsappUrl = cleanPhone
              ? `https://wa.me/${cleanPhone}?text=${whatsappText}`
              : null;

            // Email link generator with smart subject and body
            const emailSubject = encodeURIComponent(
              `Quotation & Assay Details — E-Waste Chittagong RFQ [${inq.referenceNo}]`
            );
            const emailBody = encodeURIComponent(
              `Dear ${inq.name},\n\nThank you for reaching out to E-Waste Chittagong regarding your interest in ${
                inq.interestedCategory || "industrial scrap lots"
              } (${inq.estimatedQty || "Commercial Volume"}).\n\nPlease find our preliminary commercial parameters below:\n\nReference: ${
                inq.referenceNo
              }\nCompany: ${inq.companyName}\nOrigin Port: Chittagong Port, Bangladesh\nIncoterms: CIF / FOB\n\nLooking forward to receiving your target destination port.\n\nBest regards,\nInternational Sales Desk\nE-Waste Chittagong`
            );
            const mailtoUrl = `mailto:${inq.email}?subject=${emailSubject}&body=${emailBody}`;

            return (
              <div
                key={inq.id}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                {/* Main Card Header */}
                <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Ref & Company Info */}
                  <div className="flex items-start gap-3.5">
                    <div className="px-2.5 py-1 rounded-lg font-mono text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 shrink-0 border border-slate-200/60 dark:border-slate-700">
                      {inq.referenceNo}
                    </div>

                    <div className="space-y-1">
                      <div className="font-bold text-sm text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
                        <span>{inq.companyName}</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          <Globe className="w-3 h-3 text-slate-400" />
                          <span>{inq.country}</span>
                        </span>
                        {inq.interestedCategory && (
                          <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-md">
                            {inq.interestedCategory}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {inq.name}
                        </span>
                        <span>·</span>
                        <span className="font-mono text-slate-600 dark:text-slate-400">{inq.email}</span>
                        {inq.phoneOrWhatsApp && (
                          <>
                            <span>·</span>
                            <span className="font-mono">{inq.phoneOrWhatsApp}</span>
                          </>
                        )}
                        <span>·</span>
                        <span className="text-slate-400 text-[11px]">
                          {formatDate(inq.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick Action Controls */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* Status Dropdown */}
                    <select
                      value={inq.status}
                      disabled={updatingId === inq.id}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition ${currentStatusObj.color}`}
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    {/* WhatsApp Action */}
                    {whatsappUrl ? (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 transition"
                        title="Open WhatsApp Chat with Pre-filled RFQ Template"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleCopy(inq.email, "Email")}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
                        title="Copy Email"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}

                    {/* Direct Email Action */}
                    <a
                      href={mailtoUrl}
                      className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/80 hover:bg-blue-100 transition"
                      title="Send Quotation Draft Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>

                    {/* Print RFQ Dossier */}
                    <button
                      type="button"
                      onClick={() => setPrintInquiry(inq)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                      title="Print Official RFQ Slip"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    {/* Delete / Spam Button */}
                    <button
                      type="button"
                      onClick={() => setDeleteInquiry(inq)}
                      className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition border border-rose-200 dark:border-rose-900/60"
                      title="Delete / Remove Spam Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Details Accordion Button */}
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : inq.id)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
                    >
                      <span>{isExpanded ? "Hide" : "Details"}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Expanded Details & Structured Quotation Tracker */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-5 animate-in fade-in">
                    {/* Buyer RFQ Request Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          Estimated Volume / Quantity
                        </div>
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{inq.estimatedQty || "Custom / Spot Batch"}</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          Target Material Category
                        </div>
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-blue-600" />
                          <span>{inq.interestedCategory || "General Scrap"}</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          Contact Info & Country
                        </div>
                        <div className="font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
                          <span>{inq.phoneOrWhatsApp || inq.email}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(inq.phoneOrWhatsApp || inq.email, "Contact")}
                            className="text-emerald-600 hover:underline text-[10px]"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Buyer Message Content */}
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs">
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        Buyer Inquiry Message
                      </div>
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {inq.message}
                      </p>
                    </div>

                    {/* Commercial Quotation & Internal Negotiation Tracker */}
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-950 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                            Commercial Quotation & Negotiation Dossier
                          </h4>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          Internal Only · Secure Audit Record
                        </span>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                          Quotation Details, Pricing ($/MT), Incoterms, and Payment Terms:
                        </label>
                        <textarea
                          rows={3}
                          value={
                            notesState[inq.id] !== undefined
                              ? notesState[inq.id]
                              : inq.adminNotes || ""
                          }
                          onChange={(e) =>
                            setNotesState({ ...notesState, [inq.id]: e.target.value })
                          }
                          placeholder="e.g. Quoted $4,850/MT CIF Yokohama Port. Terms: 30% TT deposit, 70% against BL copy. Assay sample sent via FedEx on Oct 16."
                          className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="text-[11px] text-slate-400">
                          Changes logged to the immutable security audit trail upon saving.
                        </div>
                        <button
                          type="button"
                          disabled={updatingId === inq.id}
                          onClick={() => handleSaveNotes(inq.id)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition disabled:opacity-60 flex items-center gap-1.5"
                        >
                          {updatingId === inq.id ? (
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Save className="w-3.5 h-3.5" />
                          )}
                          <span>Save Commercial Notes</span>
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

      {/* ------------------------------------------------------------- */}
      {/* DELETE / SPAM CONFIRMATION MODAL                              */}
      {/* ------------------------------------------------------------- */}
      {deleteInquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete Buyer Inquiry?
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to permanently remove inquiry{" "}
              <b>&ldquo;{deleteInquiry.referenceNo}&rdquo;</b> from{" "}
              <b>&ldquo;{deleteInquiry.companyName}&rdquo;</b>?
            </p>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-800 dark:text-amber-300">
              <b>Security Notice:</b> This action is recorded in the permanent audit trail. Only test inquiries or confirmed spam should be permanently removed.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => setDeleteInquiry(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition shadow-sm flex items-center gap-1.5"
              >
                {deleteLoading && <Clock className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PRINTABLE RFQ DOSSIER SLIP MODAL                              */}
      {/* ------------------------------------------------------------- */}
      {printInquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-8 shadow-2xl space-y-6 my-8 print:p-0 print:border-none print:shadow-none">
            {/* Print Header */}
            <div className="flex items-start justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
              <div>
                <div className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  E-Waste <span className="text-emerald-600">Chittagong</span>
                </div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  B2B Scrap Material Procurement & Quotation Slip
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                  {printInquiry.referenceNo}
                </div>
                <div className="text-[11px] text-slate-500">{formatDate(printInquiry.createdAt)}</div>
              </div>
            </div>

            {/* Dossier Body */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Client / Buyer</span>
                <div className="font-bold text-slate-900 dark:text-white">{printInquiry.companyName}</div>
                <div className="text-slate-600 dark:text-slate-300">{printInquiry.name}</div>
                <div className="font-mono text-[11px] text-slate-500">{printInquiry.country}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Communication</span>
                <div className="font-mono text-slate-700 dark:text-slate-200">{printInquiry.email}</div>
                <div className="font-mono text-slate-700 dark:text-slate-200">{printInquiry.phoneOrWhatsApp || "N/A"}</div>
                <div className="text-slate-500 font-semibold uppercase text-[10px]">Status: {printInquiry.status}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Category of Interest</span>
                <div className="font-bold text-slate-900 dark:text-white">{printInquiry.interestedCategory || "General Scrap"}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Volume</span>
                <div className="font-bold text-slate-900 dark:text-white">{printInquiry.estimatedQty || "Not specified"}</div>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Original Inquiry Message:</span>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                {printInquiry.message}
              </div>
            </div>

            {/* Internal Notes / Terms */}
            {printInquiry.adminNotes && (
              <div className="space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">Official Quotation Terms & Assay Record:</span>
                <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans">
                  {printInquiry.adminNotes}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800 print:hidden">
              <button
                type="button"
                onClick={() => setPrintInquiry(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Dossier Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
