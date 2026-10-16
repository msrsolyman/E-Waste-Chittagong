"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Trash2, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";

interface GalleryItemData {
  id: string;
  titleEn: string;
  titleBn: string | null;
  imageUrl: string;
  category: string;
  isVerified: boolean;
  caption: string | null;
  createdAt: string | Date;
}

const photoPresets = [
  { url: "/images/products/pcb-motherboards.jpg", label: "Server Motherboard PCBs" },
  { url: "/images/products/cpu-scrap.jpg", label: "CPU & IC Processor Scrap" },
  { url: "/images/products/telecom-boards.jpg", label: "Telecom Network Boards" },
  { url: "/images/products/facility-dismantling.jpg", label: "Facility Dismantling Workstation" },
  { url: "/images/concepts/circular-hero.jpg", label: "Circular Electronics Concept" },
];

export function AdminGalleryManager({ initialItems }: { initialItems: GalleryItemData[] }) {
  const [items, setItems] = React.useState<GalleryItemData[]>(initialItems);
  const [isAdding, setIsAdding] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    titleEn: "",
    titleBn: "",
    category: "MATERIAL",
    imageUrl: photoPresets[0].url,
    isVerified: true,
    caption: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create item");

      setItems([data.item, ...items]);
      setIsAdding(false);
      setFormData({
        titleEn: "",
        titleBn: "",
        category: "MATERIAL",
        imageUrl: photoPresets[0].url,
        isVerified: true,
        caption: "",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error creating item";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media item?")) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(items.filter((i) => i.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">
          Total gallery items: {items.length}
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? "Cancel" : "Add Media Asset"}</span>
        </button>
      </div>

      {/* Add New Item Form */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 text-xs animate-in fade-in"
        >
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
            Register Media Asset
          </h3>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Title (English) *
              </label>
              <input
                type="text"
                required
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                placeholder="e.g. Server Motherboard Sorting Line"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="MATERIAL">MATERIAL (Scrap Batches)</option>
                <option value="FACILITY">FACILITY (Storage & Workstation)</option>
                <option value="DISMANTLING">DISMANTLING (Component Separation)</option>
                <option value="PROCESSING">PROCESSING (Sorting & Packaging)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Caption & Details
              </label>
              <input
                type="text"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder="Brief description of the handling stage..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Verification Switch */}
            <div className="md:col-span-2 flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <input
                type="checkbox"
                id="isVerifiedCheck"
                checked={formData.isVerified}
                onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <label htmlFor="isVerifiedCheck" className="cursor-pointer">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Authentic Facility Operation Badge
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  When checked, marked as &quot;Confirmed Operation&quot;. If unchecked, marked as &quot;Illustrative Concept&quot; for buyer transparency.
                </span>
              </label>
            </div>

            {/* Photography preset selector */}
            <div className="md:col-span-2 space-y-2">
              <label className="block font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Select Photo
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {photoPresets.map((p) => (
                  <button
                    key={p.url}
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: p.url })}
                    className={`relative rounded-xl overflow-hidden border-2 text-left transition aspect-[16/10] ${
                      formData.imageUrl === p.url
                        ? "border-emerald-600 ring-2 ring-emerald-500/30"
                        : "border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={p.url} alt={p.label} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "Save Asset"}
            </button>
          </div>
        </form>
      )}

      {/* Grid of existing gallery items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm space-y-3"
          >
            <div className="relative aspect-[16/10] w-full bg-slate-100 dark:bg-slate-800">
              <Image src={item.imageUrl} alt={item.titleEn} fill className="object-cover" />
              <div className="absolute top-2 left-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                    item.isVerified
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-900/80 text-slate-200"
                  }`}
                >
                  {item.isVerified ? (
                    <>
                      <ShieldCheck className="w-3 h-3" />
                      <span>Confirmed</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Illustrative</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {item.category}
                  </span>
                  <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                    {item.titleEn}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-600 transition"
                  title="Delete media asset"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {item.caption && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {item.caption}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
