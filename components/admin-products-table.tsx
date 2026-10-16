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
} from "lucide-react";

export interface ProductRow {
  id: string;
  slug: string;
  titleEn: string;
  titleBn: string | null;
  titleZh: string | null;
  titleJa: string | null;
  shortDescEn?: string | null;
  shortDescBn?: string | null;
  shortDescZh?: string | null;
  shortDescJa?: string | null;
  fullDescEn?: string | null;
  fullDescBn?: string | null;
  fullDescZh?: string | null;
  fullDescJa?: string | null;
  categoryId?: string;
  category: { nameEn: string };
  grade: string | null;
  origin?: string | null;
  packaging?: string | null;
  minOrderQuantity: string | null;
  status: string;
  images: string;
}

export function AdminProductsTable({ initialProducts }: { initialProducts: ProductRow[] }) {
  const [products, setProducts] = React.useState<ProductRow[]>(initialProducts);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<ProductRow | null>(null);
  const [editForm, setEditForm] = React.useState({
    titleEn: "",
    titleBn: "",
    titleZh: "",
    titleJa: "",
    grade: "",
    minOrderQuantity: "",
    status: "DRAFT",
  });
  const [editLoading, setEditLoading] = React.useState(false);
  const [editError, setEditError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);

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
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const openEdit = (p: ProductRow) => {
    setEditingProduct(p);
    setEditForm({
      titleEn: p.titleEn || "",
      titleBn: p.titleBn || "",
      titleZh: p.titleZh || "",
      titleJa: p.titleJa || "",
      grade: p.grade || "",
      minOrderQuantity: p.minOrderQuantity || "",
      status: p.status || "DRAFT",
    });
    setEditError(null);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setEditLoading(true);
    setEditError(null);

    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingProduct.id,
          ...editForm,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update product");

      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...data.product } : p))
      );
      setIsEditOpen(false);
      setNotice(`"${editForm.titleEn}" updated successfully.`);
      setTimeout(() => setNotice(null), 4000);
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (p: ProductRow) => {
    if (!confirm(`Are you sure you want to remove product "${p.titleEn}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products?id=${p.id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Delete failed");

      if (data.archived) {
        // Linked to inquiries, moved to archived
        setProducts((prev) =>
          prev.map((item) => (item.id === p.id ? { ...item, status: "ARCHIVED" } : item))
        );
        alert(data.message);
      } else {
        setProducts((prev) => prev.filter((item) => item.id !== p.id));
        setNotice(`Product "${p.titleEn}" deleted successfully.`);
        setTimeout(() => setNotice(null), 4000);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting product");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.titleEn.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      (p.grade && p.grade.toLowerCase().includes(q)) ||
      p.category.nameEn.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {notice && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Control Bar: Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title, slug, grade, or category..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {["ALL", "PUBLISHED", "DRAFT", "ARCHIVED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  statusFilter === st
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                }`}
              >
                {st === "ALL" ? "All" : st}
              </button>
            ))}
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      <div className="text-xs text-slate-500">
        Showing {filteredProducts.length} of {products.length} registered products
      </div>

      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Languages</th>
                <th className="py-3 px-4">Grade / MOQ</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No products found matching your filter criteria.
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

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                            <Image src={imgUrl} alt={p.titleEn} fill className="object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                              {p.titleEn}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">
                              /{p.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {p.category.nameEn}
                      </td>

                      {/* Language coverage badges */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 font-mono text-[10px]">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                            EN
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold ${
                              p.titleBn ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                            }`}
                          >
                            BN
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold ${
                              p.titleZh ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                            }`}
                          >
                            ZH
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold ${
                              p.titleJa ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                            }`}
                          >
                            JA
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-500">
                        <div>{p.grade || "N/A"}</div>
                        <div className="text-[10px] text-slate-400">{p.minOrderQuantity || "Negotiable"}</div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-4">
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
                        >
                          {isPublished ? <Check className="w-3 h-3" /> : isArchived ? <Archive className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          <span>{p.status}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/en/products/${p.slug}`}
                            target="_blank"
                            className="p-1 text-slate-400 hover:text-emerald-600 transition"
                            title="Preview Public Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => openEdit(p)}
                            className="p-1 text-slate-400 hover:text-blue-600 transition"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p)}
                            className="p-1 text-slate-400 hover:text-red-600 transition"
                            title="Delete / Archive Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Edit Product Modal */}
      {isEditOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Quick Edit Product
              </h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Product Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.titleEn}
                  onChange={(e) => setEditForm({ ...editForm, titleEn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">Bengali (বাংলা)</label>
                  <input
                    type="text"
                    value={editForm.titleBn}
                    onChange={(e) => setEditForm({ ...editForm, titleBn: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">Chinese (中文)</label>
                  <input
                    type="text"
                    value={editForm.titleZh}
                    onChange={(e) => setEditForm({ ...editForm, titleZh: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">Japanese (日本語)</label>
                  <input
                    type="text"
                    value={editForm.titleJa}
                    onChange={(e) => setEditForm({ ...editForm, titleJa: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Grade Specification
                  </label>
                  <input
                    type="text"
                    value={editForm.grade}
                    onChange={(e) => setEditForm({ ...editForm, grade: e.target.value })}
                    placeholder="e.g. Industrial Grade A"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Minimum Order Quantity (MOQ)
                  </label>
                  <input
                    type="text"
                    value={editForm.minOrderQuantity}
                    onChange={(e) => setEditForm({ ...editForm, minOrderQuantity: e.target.value })}
                    placeholder="e.g. 1 Metric Ton"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Publication Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                >
                  <option value="DRAFT">DRAFT (Unpublished Review)</option>
                  <option value="PUBLISHED">PUBLISHED (Active on Public Website)</option>
                  <option value="ARCHIVED">ARCHIVED (Preserved for History)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-50"
                >
                  {editLoading ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
