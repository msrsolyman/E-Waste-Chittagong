"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PlusCircle,
  ExternalLink,
  Check,
  Clock,
  Search,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Archive,
  Copy,
  Star,
  Download,
  Filter,
  CheckCircle,
  Layers,
  Sparkles,
} from "lucide-react";

export interface ProductRow {
  id: string;
  slug: string;
  status: string;
  isFeatured?: boolean;
  categoryId: string;
  category: { id?: string; nameEn: string };
  titleEn: string;
  titleBn: string | null;
  titleZh: string | null;
  titleJa: string | null;
  shortDescEn: string;
  shortDescBn: string | null;
  shortDescZh: string | null;
  shortDescJa: string | null;
  fullDescEn: string;
  fullDescBn: string | null;
  fullDescZh: string | null;
  fullDescJa: string | null;
  grade: string | null;
  origin: string | null;
  packaging: string | null;
  minOrderQuantity: string | null;
  images: string;
}

export interface CategoryOption {
  id: string;
  nameEn: string;
}

const PRESET_IMAGES = [
  { label: "PCB Motherboards", url: "/images/products/pcb-motherboards.jpg" },
  { label: "CPU Processors", url: "/images/products/cpu-scrap.jpg" },
  { label: "Telecom Boards", url: "/images/products/telecom-boards.jpg" },
  { label: "Facility Dismantling", url: "/images/products/facility-dismantling.jpg" },
  { label: "Circular Concept", url: "/images/concepts/circular-hero.jpg" },
];

export function AdminProductsTable({
  initialProducts,
  categories = [],
}: {
  initialProducts: ProductRow[];
  categories?: CategoryOption[];
}) {
  const [products, setProducts] = React.useState<ProductRow[]>(initialProducts);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [categoryFilter, setCategoryFilter] = React.useState("ALL");

  // Notifications
  const [notice, setNotice] = React.useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Edit / Create Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isNewMode, setIsNewMode] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"en" | "bn" | "zh" | "ja" | "specs" | "media">("en");
  const [modalLoading, setModalLoading] = React.useState(false);
  const [modalError, setModalError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    id: "",
    categoryId: categories[0]?.id || "",
    status: "DRAFT",
    isFeatured: false,
    titleEn: "",
    titleBn: "",
    titleZh: "",
    titleJa: "",
    shortDescEn: "",
    shortDescBn: "",
    shortDescZh: "",
    shortDescJa: "",
    fullDescEn: "",
    fullDescBn: "",
    fullDescZh: "",
    fullDescJa: "",
    grade: "",
    origin: "Chittagong, Bangladesh",
    packaging: "Jumbo Bags / Palletized Crated",
    minOrderQuantity: "1 Metric Ton",
    imageUrl: "/images/products/pcb-motherboards.jpg",
  });

  // Delete Dialog State
  const [deleteProduct, setDeleteProduct] = React.useState<ProductRow | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const showNotice = (text: string, type: "success" | "error" | "info" = "success") => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 6000);
  };

  // Toggle Status directly from table row
  const toggleStatus = async (id: string, currentStatus: string) => {
    setUpdatingId(id);
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        );
        showNotice(`Status changed to ${newStatus}`);
      } else {
        showNotice("Failed to update status", "error");
      }
    } catch {
      showNotice("Network error updating status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // Toggle Featured Pin directly from table row
  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    setUpdatingId(id);
    const newFeatured = !currentFeatured;
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isFeatured: newFeatured }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isFeatured: newFeatured } : p))
        );
        showNotice(newFeatured ? "Pinned to Homepage Featured" : "Unpinned from Homepage Featured");
      } else {
        showNotice("Failed to update featured flag", "error");
      }
    } catch {
      showNotice("Network error updating featured flag", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // Open Edit Modal for existing product
  const handleEdit = (p: ProductRow) => {
    setIsNewMode(false);
    let parsedImage = "/images/products/pcb-motherboards.jpg";
    try {
      const arr = JSON.parse(p.images);
      if (Array.isArray(arr) && arr[0]) parsedImage = arr[0];
    } catch {}

    setFormData({
      id: p.id,
      categoryId: p.categoryId || p.category.id || categories[0]?.id || "",
      status: p.status,
      isFeatured: Boolean(p.isFeatured),
      titleEn: p.titleEn || "",
      titleBn: p.titleBn || "",
      titleZh: p.titleZh || "",
      titleJa: p.titleJa || "",
      shortDescEn: p.shortDescEn || "",
      shortDescBn: p.shortDescBn || "",
      shortDescZh: p.shortDescZh || "",
      shortDescJa: p.shortDescJa || "",
      fullDescEn: p.fullDescEn || "",
      fullDescBn: p.fullDescBn || "",
      fullDescZh: p.fullDescZh || "",
      fullDescJa: p.fullDescJa || "",
      grade: p.grade || "",
      origin: p.origin || "Chittagong, Bangladesh",
      packaging: p.packaging || "Jumbo Bags / Palletized Crated",
      minOrderQuantity: p.minOrderQuantity || "1 Metric Ton",
      imageUrl: parsedImage,
    });
    setModalError(null);
    setActiveTab("en");
    setIsModalOpen(true);
  };

  // Clone / Duplicate Product
  const handleClone = (p: ProductRow) => {
    setIsNewMode(true);
    let parsedImage = "/images/products/pcb-motherboards.jpg";
    try {
      const arr = JSON.parse(p.images);
      if (Array.isArray(arr) && arr[0]) parsedImage = arr[0];
    } catch {}

    setFormData({
      id: "",
      categoryId: p.categoryId || p.category.id || categories[0]?.id || "",
      status: "DRAFT",
      isFeatured: false,
      titleEn: `${p.titleEn} (Copy)`,
      titleBn: p.titleBn ? `${p.titleBn} (কপি)` : "",
      titleZh: p.titleZh ? `${p.titleZh} (副本)` : "",
      titleJa: p.titleJa ? `${p.titleJa} (コピー)` : "",
      shortDescEn: p.shortDescEn || "",
      shortDescBn: p.shortDescBn || "",
      shortDescZh: p.shortDescZh || "",
      shortDescJa: p.shortDescJa || "",
      fullDescEn: p.fullDescEn || "",
      fullDescBn: p.fullDescBn || "",
      fullDescZh: p.fullDescZh || "",
      fullDescJa: p.fullDescJa || "",
      grade: p.grade || "",
      origin: p.origin || "Chittagong, Bangladesh",
      packaging: p.packaging || "Jumbo Bags / Palletized Crated",
      minOrderQuantity: p.minOrderQuantity || "1 Metric Ton",
      imageUrl: parsedImage,
    });
    setModalError(null);
    setActiveTab("en");
    setIsModalOpen(true);
    showNotice("Product duplicated into draft mode. Review and click Save.", "info");
  };

  // Open Create Modal for new product
  const handleAddNew = () => {
    setIsNewMode(true);
    setFormData({
      id: "",
      categoryId: categories[0]?.id || "",
      status: "DRAFT",
      isFeatured: false,
      titleEn: "",
      titleBn: "",
      titleZh: "",
      titleJa: "",
      shortDescEn: "",
      shortDescBn: "",
      shortDescZh: "",
      shortDescJa: "",
      fullDescEn: "",
      fullDescBn: "",
      fullDescZh: "",
      fullDescJa: "",
      grade: "Grade A Industrial Scrap",
      origin: "Chittagong, Bangladesh",
      packaging: "Jumbo Bags / Palletized Crated",
      minOrderQuantity: "1 Metric Ton",
      imageUrl: "/images/products/pcb-motherboards.jpg",
    });
    setModalError(null);
    setActiveTab("en");
    setIsModalOpen(true);
  };

  // Save changes (Create or Update)
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleEn.trim()) {
      setModalError("English Title is required");
      setActiveTab("en");
      return;
    }
    if (!formData.shortDescEn.trim()) {
      setModalError("English Short Description is required");
      setActiveTab("en");
      return;
    }
    if (!formData.categoryId) {
      setModalError("Please select a Category under the Specifications tab");
      setActiveTab("specs");
      return;
    }

    setModalLoading(true);
    setModalError(null);

    try {
      const payload = {
        ...formData,
        fullDescEn: formData.fullDescEn.trim() || formData.shortDescEn.trim(),
      };

      if (isNewMode) {
        // POST to create
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create product");

        const catName = categories.find((c) => c.id === formData.categoryId)?.nameEn || "Category";
        const newProd: ProductRow = {
          ...data.product,
          category: { id: formData.categoryId, nameEn: catName },
        };
        setProducts((prev) => [newProd, ...prev]);
        setIsModalOpen(false);
        showNotice(`Created new product "${formData.titleEn}" successfully!`);
      } else {
        // PUT to update
        const res = await fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update product");

        const catName = categories.find((c) => c.id === formData.categoryId)?.nameEn || "Category";
        setProducts((prev) =>
          prev.map((p) =>
            p.id === formData.id
              ? {
                  ...p,
                  ...data.product,
                  category: { id: formData.categoryId, nameEn: catName },
                  images: JSON.stringify([formData.imageUrl]),
                }
              : p
          )
        );
        setIsModalOpen(false);
        showNotice(`Product "${formData.titleEn}" updated successfully!`);
      }
    } catch (err: any) {
      setModalError(err.message || "An error occurred");
    } finally {
      setModalLoading(false);
    }
  };

  // Delete or Archive confirmation handler
  const confirmDelete = async () => {
    if (!deleteProduct) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/products?id=${deleteProduct.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Delete request failed");
      }

      if (data.archived) {
        // Was archived due to existing inquiries
        setProducts((prev) =>
          prev.map((p) => (p.id === deleteProduct.id ? { ...p, status: "ARCHIVED" } : p))
        );
        showNotice(data.message, "info");
      } else {
        // Permanently deleted
        setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
        showNotice(`Product "${deleteProduct.titleEn}" permanently removed.`);
      }
      setDeleteProduct(null);
    } catch (err: any) {
      showNotice(err.message, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.grade && p.grade.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.category.nameEn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || p.status.toUpperCase() === statusFilter.toUpperCase();

    const matchesCategory =
      categoryFilter === "ALL" ||
      p.categoryId === categoryFilter ||
      p.category.nameEn === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
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
          <button
            onClick={() => setNotice(null)}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Control Bar: Search, Category Filter, Status Pills, Export & Add */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Left: Search & Category Dropdown */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by title, slug, grade, or specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* Category Dropdown */}
          <div className="relative shrink-0">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Status Filters, CSV Export & Add Product */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Badges */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {["ALL", "PUBLISHED", "DRAFT", "ARCHIVED"].map((st) => {
              const count =
                st === "ALL"
                  ? products.length
                  : products.filter((p) => p.status.toUpperCase() === st).length;
              const isActive = statusFilter === st;

              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition flex items-center gap-1.5 ${
                    isActive
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <span>{st === "ALL" ? "All" : st.charAt(0) + st.slice(1).toLowerCase()}</span>
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
            href="/api/admin/products/export"
            download
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-xs"
            title="Download CSV Catalogue"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </a>

          {/* Add Product Button */}
          <button
            type="button"
            onClick={handleAddNew}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <b>{filteredProducts.length}</b> of <b>{products.length}</b> registered products
        </span>
        {(searchQuery || statusFilter !== "ALL" || categoryFilter !== "ALL") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("ALL");
              setCategoryFilter("ALL");
            }}
            className="text-emerald-600 dark:text-emerald-400 hover:underline text-[11px]"
          >
            Reset All Filters
          </button>
        )}
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Languages</th>
                <th className="py-3 px-4">Grade / MOQ</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Layers className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                    <div>No products found matching your search or filters.</div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  let imgUrl = "/images/products/pcb-motherboards.jpg";
                  try {
                    const parsed = JSON.parse(p.images);
                    if (Array.isArray(parsed) && parsed[0]) imgUrl = parsed[0];
                  } catch {}

                  const isPublished = p.status === "PUBLISHED";
                  const isArchived = p.status === "ARCHIVED";
                  const isFeatured = Boolean(p.isFeatured);

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition group"
                    >
                      {/* Product Thumbnail & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60 dark:border-slate-800">
                            <Image src={imgUrl} alt={p.titleEn} fill className="object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {p.titleEn}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">
                              /{p.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {p.category.nameEn}
                      </td>

                      {/* Language Coverage Badges */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-mono text-[10px]">
                          <span
                            className="px-1.5 py-0.5 rounded font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                            title="English: Complete"
                          >
                            EN
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold ${
                              p.titleBn
                                ? "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-50"
                            }`}
                            title={p.titleBn ? `Bengali: ${p.titleBn}` : "Bengali: Not translated"}
                          >
                            BN
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold ${
                              p.titleZh
                                ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-50"
                            }`}
                            title={p.titleZh ? `Chinese: ${p.titleZh}` : "Chinese: Not translated"}
                          >
                            ZH
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold ${
                              p.titleJa
                                ? "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-50"
                            }`}
                            title={p.titleJa ? `Japanese: ${p.titleJa}` : "Japanese: Not translated"}
                          >
                            JA
                          </span>
                        </div>
                      </td>

                      {/* Grade & MOQ */}
                      <td className="py-3.5 px-4 text-slate-500">
                        <div className="font-medium text-slate-700 dark:text-slate-300">
                          {p.grade || "Standard Scrap"}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {p.minOrderQuantity || "Negotiable"}
                        </div>
                      </td>

                      {/* Featured Pin Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          disabled={updatingId === p.id}
                          onClick={() => toggleFeatured(p.id, isFeatured)}
                          className={`p-1.5 rounded-lg transition ${
                            isFeatured
                              ? "text-amber-500 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100"
                              : "text-slate-300 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                          title={isFeatured ? "Unpin from Homepage" : "Pin as Homepage Featured"}
                        >
                          <Star className={`w-4 h-4 ${isFeatured ? "fill-amber-400" : ""}`} />
                        </button>
                      </td>

                      {/* Status Toggle Button */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          disabled={updatingId === p.id}
                          onClick={() => toggleStatus(p.id, p.status)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition ${
                            isPublished
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200"
                              : isArchived
                              ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 hover:bg-amber-200"
                          }`}
                          title="Click to toggle status"
                        >
                          {isPublished ? (
                            <Check className="w-3 h-3" />
                          ) : isArchived ? (
                            <Archive className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          <span>{p.status}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preview Link */}
                          <Link
                            href={`/en/products/${p.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition"
                            title="Preview Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {/* Clone Button */}
                          <button
                            type="button"
                            onClick={() => handleClone(p)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition"
                            title="Duplicate / Clone Product"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleEdit(p)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition"
                            title="Edit Product Details & 4 Languages"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete / Archive Button */}
                          <button
                            type="button"
                            onClick={() => setDeleteProduct(p)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                            title="Delete or Archive Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FULL EDIT & CREATE MODAL WITH 4-LANGUAGE TABS & SPECS         */}
      {/* ------------------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 my-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                  {isNewMode ? <PlusCircle className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {isNewMode ? "Create / Clone Product" : "Edit Product Catalogue Listing"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Update titles, descriptions in 4 languages, B2B attributes, and image assignments.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("en")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "en"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                English (Primary)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("bn")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "bn"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                বাংলা (BN)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("zh")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "zh"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                中文 (ZH)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ja")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "ja"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                日本語 (JA)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("specs")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "specs"
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Specifications & Category
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("media")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "media"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Product Image
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              {/* TAB 1: ENGLISH */}
              {activeTab === "en" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Product Title (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder="e.g. High-Grade Server Motherboard Scrap"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Short Overview (English) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formData.shortDescEn}
                      onChange={(e) => setFormData({ ...formData, shortDescEn: e.target.value })}
                      placeholder="Brief 1-2 sentence commercial overview for product cards"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Full Technical Description (English)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.fullDescEn}
                      onChange={(e) => setFormData({ ...formData, fullDescEn: e.target.value })}
                      placeholder="Detailed assay estimates, dismantling parameters, contamination controls, and lot preparation."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: BENGALI */}
              {activeTab === "bn" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      পণ্যের নাম (বাংলা)
                    </label>
                    <input
                      type="text"
                      value={formData.titleBn}
                      onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                      placeholder="যেমন: উচ্চ গ্রেডের সার্ভার মাদারবোর্ড স্ক্র্যাপ"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      সংক্ষিপ্ত বিবরণ (বাংলা)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.shortDescBn}
                      onChange={(e) => setFormData({ ...formData, shortDescBn: e.target.value })}
                      placeholder="পণ্যের সংক্ষিপ্ত বিবরণ"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      বিস্তারিত প্রযুক্তিগত বিবরণ (বাংলা)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.fullDescBn}
                      onChange={(e) => setFormData({ ...formData, fullDescBn: e.target.value })}
                      placeholder="বিস্তারিত বিবরণ..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: CHINESE */}
              {activeTab === "zh" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      产品名称 (中文)
                    </label>
                    <input
                      type="text"
                      value={formData.titleZh}
                      onChange={(e) => setFormData({ ...formData, titleZh: e.target.value })}
                      placeholder="例如: 高纯度服务器主板废料"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      简要说明 (中文)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.shortDescZh}
                      onChange={(e) => setFormData({ ...formData, shortDescZh: e.target.value })}
                      placeholder="简短描述..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      详细技术说明 (中文)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.fullDescZh}
                      onChange={(e) => setFormData({ ...formData, fullDescZh: e.target.value })}
                      placeholder="详细描述..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: JAPANESE */}
              {activeTab === "ja" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      製品名 (日本語)
                    </label>
                    <input
                      type="text"
                      value={formData.titleJa}
                      onChange={(e) => setFormData({ ...formData, titleJa: e.target.value })}
                      placeholder="例: 高品位サーバーマザーボードスクラップ"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      概要説明 (日本語)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.shortDescJa}
                      onChange={(e) => setFormData({ ...formData, shortDescJa: e.target.value })}
                      placeholder="概要..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      詳細技術仕様 (日本語)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.fullDescJa}
                      onChange={(e) => setFormData({ ...formData, fullDescJa: e.target.value })}
                      placeholder="技術仕様..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: SPECS & CATEGORY */}
              {activeTab === "specs" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Listing Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="DRAFT">DRAFT (Hidden from Public)</option>
                      <option value="PUBLISHED">PUBLISHED (Visible in Catalogue)</option>
                      <option value="ARCHIVED">ARCHIVED (Discontinued)</option>
                    </select>
                  </div>

                  {/* Grade */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Quality Grade
                    </label>
                    <input
                      type="text"
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      placeholder="e.g. Grade A Industrial / Gold Fingers Clean"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* MOQ */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Min Order Quantity (MOQ)
                    </label>
                    <input
                      type="text"
                      value={formData.minOrderQuantity}
                      onChange={(e) => setFormData({ ...formData, minOrderQuantity: e.target.value })}
                      placeholder="e.g. 1 Metric Ton (20ft Container Available)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Origin */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Origin Facility / Port
                    </label>
                    <input
                      type="text"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      placeholder="e.g. Chittagong Port, Bangladesh"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Packaging */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Standard Packaging
                    </label>
                    <input
                      type="text"
                      value={formData.packaging}
                      onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
                      placeholder="e.g. Anti-static 1-Ton Jumbo Bags / Strapped Pallets"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Featured Toggle */}
                  <div className="sm:col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Star className={`w-3.5 h-3.5 ${formData.isFeatured ? "fill-amber-400 text-amber-500" : "text-slate-400"}`} />
                        <span>Pin as Featured Product on Public Homepage</span>
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 6: MEDIA & IMAGES */}
              {activeTab === "media" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Current Selected Image Preview
                    </label>
                    <div className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                      <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 dark:border-slate-700 shrink-0">
                        <Image
                          src={formData.imageUrl || "/images/products/pcb-motherboards.jpg"}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="font-mono text-[11px] text-slate-500 break-all">
                          {formData.imageUrl}
                        </div>
                        <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                          Illustrative representation badge automatically rendered on public pages.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preset Library */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Choose from Verified Media Presets
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {PRESET_IMAGES.map((preset) => {
                        const isSelected = formData.imageUrl === preset.url;
                        return (
                          <button
                            key={preset.url}
                            type="button"
                            onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                            className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500"
                                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            <div className="relative w-10 h-8 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                              <Image src={preset.url} alt={preset.label} fill className="object-cover" />
                            </div>
                            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-200 line-clamp-1">
                              {preset.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom URL Input */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Or Enter Custom Image URL / Path
                    </label>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="/images/products/my-custom-image.jpg or https://..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition disabled:opacity-60 flex items-center gap-1.5"
                >
                  {modalLoading && <Clock className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isNewMode ? "Create Product" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DELETE / ARCHIVE CONFIRMATION MODAL                           */}
      {/* ------------------------------------------------------------- */}
      {deleteProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete or Archive Product?
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to remove <b>&ldquo;{deleteProduct.titleEn}&rdquo;</b>?
            </p>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-800 dark:text-amber-300">
              <b>Smart Data Protection:</b> If this product is linked to existing buyer inquiries (RFQs), it will be safely moved to <b>ARCHIVED</b> status instead of permanently deleted to preserve historical quotation audit records.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => setDeleteProduct(null)}
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
                <span>Confirm Removal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
