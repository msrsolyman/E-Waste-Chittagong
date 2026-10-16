"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Layers, AlertCircle, Check, X } from "lucide-react";

export interface CategoryData {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string | null;
  nameZh: string | null;
  nameJa: string | null;
  descriptionEn: string | null;
  descriptionBn: string | null;
  descriptionZh: string | null;
  descriptionJa: string | null;
  imageUrl: string | null;
  displayOrder: number;
  _count: {
    products: number;
  };
}

const defaultImages = [
  { url: "/images/products/pcb-motherboards.jpg", label: "PCBs" },
  { url: "/images/products/cpu-scrap.jpg", label: "CPUs" },
  { url: "/images/products/telecom-boards.jpg", label: "Telecom" },
  { url: "/images/products/facility-dismantling.jpg", label: "Facility" },
];

export function AdminCategoryManager({ initialCategories }: { initialCategories: CategoryData[] }) {
  const [categories, setCategories] = React.useState<CategoryData[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<CategoryData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const [formState, setFormState] = React.useState({
    nameEn: "",
    nameBn: "",
    nameZh: "",
    nameJa: "",
    descriptionEn: "",
    descriptionBn: "",
    descriptionZh: "",
    descriptionJa: "",
    imageUrl: defaultImages[0].url,
    displayOrder: 0,
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormState({
      nameEn: "",
      nameBn: "",
      nameZh: "",
      nameJa: "",
      descriptionEn: "",
      descriptionBn: "",
      descriptionZh: "",
      descriptionJa: "",
      imageUrl: defaultImages[0].url,
      displayOrder: categories.length + 1,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryData) => {
    setEditingCategory(cat);
    setFormState({
      nameEn: cat.nameEn || "",
      nameBn: cat.nameBn || "",
      nameZh: cat.nameZh || "",
      nameJa: cat.nameJa || "",
      descriptionEn: cat.descriptionEn || "",
      descriptionBn: cat.descriptionBn || "",
      descriptionZh: cat.descriptionZh || "",
      descriptionJa: cat.descriptionJa || "",
      imageUrl: cat.imageUrl || defaultImages[0].url,
      displayOrder: cat.displayOrder || 0,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingCategory) {
        // Edit existing
        const res = await fetch("/api/admin/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingCategory.id, ...formState }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update category");

        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? { ...c, ...data.category } : c))
        );
        setSuccessMsg("Category updated successfully!");
      } else {
        // Create new
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formState),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create category");

        setCategories((prev) => [...prev, data.category]);
        setSuccessMsg("New category registered successfully!");
      }
      setIsModalOpen(false);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cat: CategoryData) => {
    if (cat._count.products > 0) {
      alert(`Cannot delete "${cat.nameEn}": it contains ${cat._count.products} products. Reassign or delete products first.`);
      return;
    }
    if (!confirm(`Are you sure you want to permanently delete "${cat.nameEn}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${cat.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      setSuccessMsg("Category removed successfully.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">
          Showing {categories.length} registered material taxonomies
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div>
              {cat.imageUrl && (
                <div className="relative aspect-[16/9] w-full bg-slate-100 dark:bg-slate-800">
                  <Image src={cat.imageUrl} alt={cat.nameEn} fill className="object-cover" />
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur-sm">
                    {cat._count.products} Products
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900/80 text-emerald-400">
                    Order: {cat.displayOrder}
                  </div>
                </div>
              )}
              <div className="p-4 space-y-2">
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {cat.nameEn}
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  slug: /{cat.slug}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {cat.descriptionEn || "No description provided."}
                </p>

                {/* Multilingual Coverage Badge */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                  <span>Languages:</span>
                  <span className="px-1 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">EN</span>
                  <span className={`px-1 py-0.5 rounded font-bold ${cat.nameBn ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>BN</span>
                  <span className={`px-1 py-0.5 rounded font-bold ${cat.nameZh ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>ZH</span>
                  <span className={`px-1 py-0.5 rounded font-bold ${cat.nameJa ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>JA</span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => openEditModal(cat)}
                className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(cat)}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-red-600 transition font-semibold"
                title="Delete category"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>{editingCategory ? "Edit Category Taxonomy" : "Create New Material Category"}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.nameEn}
                    onChange={(e) => setFormState({ ...formState, nameEn: e.target.value })}
                    placeholder="e.g. Copper Wire Scrap"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Display Order (Sorting)
                  </label>
                  <input
                    type="number"
                    value={formState.displayOrder}
                    onChange={(e) => setFormState({ ...formState, displayOrder: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Multilingual Names */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400">
                  Multilingual Taxonomy Titles
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Bengali (বাংলা)</label>
                    <input
                      type="text"
                      value={formState.nameBn}
                      onChange={(e) => setFormState({ ...formState, nameBn: e.target.value })}
                      placeholder="বাংলা নাম..."
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Chinese (中文)</label>
                    <input
                      type="text"
                      value={formState.nameZh}
                      onChange={(e) => setFormState({ ...formState, nameZh: e.target.value })}
                      placeholder="中文分类名称..."
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Japanese (日本語)</label>
                    <input
                      type="text"
                      value={formState.nameJa}
                      onChange={(e) => setFormState({ ...formState, nameJa: e.target.value })}
                      placeholder="日本語カテゴリ名..."
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description (English)
                </label>
                <textarea
                  rows={2}
                  value={formState.descriptionEn}
                  onChange={(e) => setFormState({ ...formState, descriptionEn: e.target.value })}
                  placeholder="Overview of this scrap material category..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              {/* Image selector */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category Image URL
                </label>
                <input
                  type="text"
                  value={formState.imageUrl}
                  onChange={(e) => setFormState({ ...formState, imageUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white mb-2"
                />
                <div className="flex gap-2">
                  {defaultImages.map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => setFormState({ ...formState, imageUrl: img.url })}
                      className={`text-[10px] px-2 py-1 rounded border transition ${
                        formState.imageUrl === img.url
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-bold"
                          : "border-slate-200 dark:border-slate-700 text-slate-500"
                      }`}
                    >
                      Preset: {img.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
