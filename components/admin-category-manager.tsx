"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  Layers,
  AlertCircle,
  Check,
  X,
  Search,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Package,
  Globe,
  Clock,
  CheckCircle,
  Image as ImageIcon,
  Sliders,
} from "lucide-react";
import { MediaUploader } from "@/components/media-uploader";
import { useAdminLocale } from "@/lib/admin-i18n";

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

export function AdminCategoryManager({
  initialCategories,
}: {
  initialCategories: CategoryData[];
}) {
  const { t, locale } = useAdminLocale();
  const [categories, setCategories] = React.useState<CategoryData[]>(
    [...initialCategories].sort((a, b) => a.displayOrder - b.displayOrder)
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isNewMode, setIsNewMode] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<"en" | "bn" | "zh" | "ja" | "media">("en");
  const [modalLoading, setModalLoading] = React.useState(false);
  const [modalError, setModalError] = React.useState<string | null>(null);

  // Reorder Loading State
  const [reorderingId, setReorderingId] = React.useState<string | null>(null);

  // Delete Dialog State
  const [deleteCategory, setDeleteCategory] = React.useState<CategoryData | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  // Toast Notice
  const [notice, setNotice] = React.useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const showNotice = (text: string, type: "success" | "error" | "info" = "success") => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 4000);
  };

  const [formState, setFormState] = React.useState({
    nameEn: "",
    nameBn: "",
    nameZh: "",
    nameJa: "",
    descriptionEn: "",
    descriptionBn: "",
    descriptionZh: "",
    descriptionJa: "",
    imageUrl: "",
    displayOrder: 1,
  });

  // Open Create Modal
  const openCreateModal = () => {
    setIsNewMode(true);
    setEditingId(null);
    setFormState({
      nameEn: "",
      nameBn: "",
      nameZh: "",
      nameJa: "",
      descriptionEn: "",
      descriptionBn: "",
      descriptionZh: "",
      descriptionJa: "",
      imageUrl: "",
      displayOrder: categories.length + 1,
    });
    setModalError(null);
    setActiveTab("en");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (cat: CategoryData) => {
    setIsNewMode(false);
    setEditingId(cat.id);
    setFormState({
      nameEn: cat.nameEn || "",
      nameBn: cat.nameBn || "",
      nameZh: cat.nameZh || "",
      nameJa: cat.nameJa || "",
      descriptionEn: cat.descriptionEn || "",
      descriptionBn: cat.descriptionBn || "",
      descriptionZh: cat.descriptionZh || "",
      descriptionJa: cat.descriptionJa || "",
      imageUrl: cat.imageUrl || "",
      displayOrder: cat.displayOrder || 1,
    });
    setModalError(null);
    setActiveTab("en");
    setIsModalOpen(true);
  };

  // Save changes (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.nameEn.trim()) {
      setModalError("English category name is required");
      setActiveTab("en");
      return;
    }

    setModalLoading(true);
    setModalError(null);

    try {
      if (!isNewMode && editingId) {
        // Edit existing
        const res = await fetch("/api/admin/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...formState }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update category");

        setCategories((prev) =>
          prev
            .map((c) => (c.id === editingId ? { ...c, ...data.category } : c))
            .sort((a, b) => a.displayOrder - b.displayOrder)
        );
        showNotice(`Category "${formState.nameEn}" updated successfully!`);
      } else {
        // Create new
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formState),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create category");

        setCategories((prev) =>
          [...prev, data.category].sort((a, b) => a.displayOrder - b.displayOrder)
        );
        showNotice(`New category "${formState.nameEn}" registered successfully!`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setModalError(err.message || "An error occurred");
    } finally {
      setModalLoading(false);
    }
  };

  // Move Order Up or Down
  const handleMoveOrder = async (cat: CategoryData, direction: "up" | "down") => {
    const currentIndex = categories.findIndex((c) => c.id === cat.id);
    if (currentIndex < 0) return;
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === categories.length - 1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const targetCat = categories[targetIndex];

    setReorderingId(cat.id);

    // Swap displayOrder values
    const newOrderForCurrent = targetCat.displayOrder;
    const newOrderForTarget = cat.displayOrder;

    try {
      await Promise.all([
        fetch("/api/admin/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: cat.id, displayOrder: newOrderForCurrent }),
        }),
        fetch("/api/admin/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: targetCat.id, displayOrder: newOrderForTarget }),
        }),
      ]);

      setCategories((prev) =>
        prev
          .map((c) => {
            if (c.id === cat.id) return { ...c, displayOrder: newOrderForCurrent };
            if (c.id === targetCat.id) return { ...c, displayOrder: newOrderForTarget };
            return c;
          })
          .sort((a, b) => a.displayOrder - b.displayOrder)
      );

      showNotice(`Reordered "${cat.nameEn}" display position.`);
    } catch {
      showNotice("Failed to reorder categories", "error");
    } finally {
      setReorderingId(null);
    }
  };

  // Delete Category handler
  const confirmDeleteCategory = async () => {
    if (!deleteCategory) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/categories?id=${deleteCategory.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete category");

      setCategories((prev) => prev.filter((c) => c.id !== deleteCategory.id));
      showNotice(`Category "${deleteCategory.nameEn}" removed successfully.`);
      setDeleteCategory(null);
    } catch (err: any) {
      showNotice(err.message, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtered Categories
  const filtered = categories.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.nameEn.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      (c.nameBn && c.nameBn.toLowerCase().includes(q)) ||
      (c.nameZh && c.nameZh.toLowerCase().includes(q)) ||
      (c.nameJa && c.nameJa.toLowerCase().includes(q)) ||
      (c.descriptionEn && c.descriptionEn.toLowerCase().includes(q))
    );
  });

  const totalAssignedProducts = categories.reduce((sum, c) => sum + (c._count?.products || 0), 0);

  return (
    <div className="space-y-5">
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

      {/* Control Bar: Search & Add Category */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("cat.search_placeholder", "Search categories by name, slug, or translation...")}
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

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <Package className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {locale === "bn"
                ? `পণ্য পরিচালনা (${totalAssignedProducts})`
                : `Manage Products (${totalAssignedProducts})`}
            </span>
          </Link>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t("cat.add_category", "Add New Category")}</span>
          </button>
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          {locale === "bn" ? (
            <>
              মোট <b>{categories.length}</b> টির মধ্যে <b>{filtered.length}</b> টি ক্যাটাগরি প্রদর্শিত হচ্ছে (<b>{totalAssignedProducts}</b> টি পণ্য সংযুক্ত)
            </>
          ) : (
            <>
              Showing <b>{filtered.length}</b> of <b>{categories.length}</b> registered material categories (
              <b>{totalAssignedProducts}</b> active products linked)
            </>
          )}
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-emerald-600 dark:text-emerald-400 hover:underline text-[11px] cursor-pointer"
          >
            {t("inq.reset_filters", "Reset Search")}
          </button>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            <Layers className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
            <div>No categories found matching &ldquo;{searchQuery}&rdquo;.</div>
          </div>
        ) : (
          filtered.map((cat, idx) => {
            const hasProducts = cat._count.products > 0;
            const isFirst = idx === 0;
            const isLast = idx === filtered.length - 1;

            return (
              <div
                key={cat.id}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between group"
              >
                <div>
                  {/* Card Image Banner */}
                  <div className="relative aspect-[16/9] w-full bg-slate-100 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800">
                    <Image
                      src={cat.imageUrl || "/images/products/pcb-motherboards.jpg"}
                      alt={cat.nameEn}
                      fill
                      className="object-cover"
                    />

                    {/* Top Left: Order Badge with Reorder Controls */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-slate-900/85 backdrop-blur-xs text-white px-2 py-1 rounded-lg text-[11px] font-mono shadow-sm">
                      <span className="text-emerald-400 font-bold">Order: {cat.displayOrder}</span>
                      <div className="flex items-center ml-1 border-l border-slate-700 pl-1">
                        <button
                          type="button"
                          disabled={isFirst || reorderingId === cat.id}
                          onClick={() => handleMoveOrder(cat, "up")}
                          className="p-0.5 hover:text-emerald-400 disabled:opacity-30 transition"
                          title="Move Display Order Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={isLast || reorderingId === cat.id}
                          onClick={() => handleMoveOrder(cat, "down")}
                          className="p-0.5 hover:text-emerald-400 disabled:opacity-30 transition"
                          title="Move Display Order Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Top Right: Public Preview Link */}
                    <Link
                      href="/en/categories"
                      target="_blank"
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-xs transition shadow-sm"
                      title="Preview Category on Public Website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    {/* Bottom Right: Interactive Products Deep-link */}
                    <div className="absolute bottom-2.5 right-2.5">
                      <Link
                        href={`/admin/products`}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold backdrop-blur-xs shadow-sm transition ${
                          hasProducts
                            ? "bg-emerald-600/90 hover:bg-emerald-600 text-white"
                            : "bg-slate-900/80 text-slate-300"
                        }`}
                        title="Click to view and manage products in this category"
                      >
                        <Package className="w-3 h-3" />
                        <span>
                          {cat._count.products}{" "}
                          {locale === "bn" ? "টি পণ্য" : "Products"}
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {locale === "bn" && cat.nameBn ? cat.nameBn : cat.nameEn}
                        </h3>
                        <div className="text-[11px] font-mono text-slate-400">/{cat.slug}</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {locale === "bn" && cat.descriptionBn
                        ? cat.descriptionBn
                        : cat.descriptionEn || "No English description provided."}
                    </p>

                    {/* Multilingual Coverage Badges */}
                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider">
                        {locale === "bn" ? "অনুবাদসমূহ" : "Translations"}
                      </span>
                      <div className="flex items-center gap-1 font-mono">
                        <span
                          className="px-1.5 py-0.5 rounded font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                          title="English (Primary): Active"
                        >
                          EN
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            cat.nameBn
                              ? "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-50"
                          }`}
                          title={cat.nameBn ? `বাংলা: ${cat.nameBn}` : "বাংলা: Not translated"}
                        >
                          BN
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            cat.nameZh
                              ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-50"
                          }`}
                          title={cat.nameZh ? `中文: ${cat.nameZh}` : "中文: Not translated"}
                        >
                          ZH
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            cat.nameJa
                              ? "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-50"
                          }`}
                          title={cat.nameJa ? `日本語: ${cat.nameJa}` : "日本語: Not translated"}
                        >
                          JA
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-3 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => openEditModal(cat)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-800 font-semibold transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{locale === "bn" ? "ক্যাটাগরি সম্পাদনা" : "Edit Category"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteCategory(cat)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                    title={
                      hasProducts
                        ? (locale === "bn" ? "সুরক্ষিত: সংশ্লিষ্ট পণ্য বিদ্যমান" : "Protected: Assigned products exist")
                        : (locale === "bn" ? "খালি ক্যাটাগরি মুছে ফেলুন" : "Delete empty category")
                    }
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{locale === "bn" ? "মুছে ফেলুন" : "Delete"}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4-LANGUAGE TABBED EDIT & CREATE MODAL                         */}
      {/* ------------------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 my-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {isNewMode ? "Create New Category Taxonomy" : "Edit Material Taxonomy"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Define localized titles, descriptions in 4 languages, and representative image.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
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

            {/* Language Navigation Tabs */}
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
                onClick={() => setActiveTab("media")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "media"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Order & Image
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* TAB 1: ENGLISH */}
              {activeTab === "en" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Category Name (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.nameEn}
                      onChange={(e) => setFormState({ ...formState, nameEn: e.target.value })}
                      placeholder="e.g. Printed Circuit Boards (PCBs)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Overview Description (English)
                    </label>
                    <textarea
                      rows={4}
                      value={formState.descriptionEn}
                      onChange={(e) =>
                        setFormState({ ...formState, descriptionEn: e.target.value })
                      }
                      placeholder="Brief overview of scrap material types included in this stream."
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
                      ক্যাটাগরির নাম (বাংলা)
                    </label>
                    <input
                      type="text"
                      value={formState.nameBn}
                      onChange={(e) => setFormState({ ...formState, nameBn: e.target.value })}
                      placeholder="যেমন: প্রিন্টেড সার্কিট বোর্ড (PCBs)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      বিবরণ (বাংলা)
                    </label>
                    <textarea
                      rows={4}
                      value={formState.descriptionBn}
                      onChange={(e) =>
                        setFormState({ ...formState, descriptionBn: e.target.value })
                      }
                      placeholder="ক্যাটাগরির সংক্ষিপ্ত বিবরণ..."
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
                      类别名称 (中文)
                    </label>
                    <input
                      type="text"
                      value={formState.nameZh}
                      onChange={(e) => setFormState({ ...formState, nameZh: e.target.value })}
                      placeholder="例如: 印刷电路板废料 (PCBs)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      类别描述 (中文)
                    </label>
                    <textarea
                      rows={4}
                      value={formState.descriptionZh}
                      onChange={(e) =>
                        setFormState({ ...formState, descriptionZh: e.target.value })
                      }
                      placeholder="类别详细说明..."
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
                      カテゴリ名 (日本語)
                    </label>
                    <input
                      type="text"
                      value={formState.nameJa}
                      onChange={(e) => setFormState({ ...formState, nameJa: e.target.value })}
                      placeholder="例: プリント基板スクラップ (PCBs)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      カテゴリ説明 (日本語)
                    </label>
                    <textarea
                      rows={4}
                      value={formState.descriptionJa}
                      onChange={(e) =>
                        setFormState({ ...formState, descriptionJa: e.target.value })
                      }
                      placeholder="カテゴリの詳細説明..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: ORDER & MEDIA */}
              {activeTab === "media" && (
                <div className="space-y-4">
                  {/* Display Order Number */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Display Priority Order (1, 2, 3...)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formState.displayOrder}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          displayOrder: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Lower numbers appear first on the public website and catalogue filters.
                    </p>
                  </div>

                  {/* Category Image via Cloudinary */}
                  <div>
                    <MediaUploader
                      value={formState.imageUrl}
                      onChange={(url) => setFormState({ ...formState, imageUrl: url })}
                      folder="categories"
                      label="Category Showcase Photography"
                      acceptVideo={false}
                      helperText="Upload category thumbnail or banner (JPG, PNG, WebP)"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
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
                  <span>{isNewMode ? "Create Category" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DELETE CONFIRMATION DIALOG WITH PRODUCT SAFEGUARD             */}
      {/* ------------------------------------------------------------- */}
      {deleteCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete Category Taxonomy?
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to permanently remove category{" "}
              <b>&ldquo;{deleteCategory.nameEn}&rdquo;</b>?
            </p>

            {deleteCategory._count.products > 0 ? (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Cannot Delete: Active Products Assigned</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  This category is currently assigned to <b>{deleteCategory._count.products} product(s)</b>.
                  To protect catalogue integrity and buyer inquiries, please reassign or remove those
                  products first.
                </p>
                <div className="pt-1">
                  <Link
                    href={`/admin/products`}
                    onClick={() => setDeleteCategory(null)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 dark:text-amber-200 hover:underline"
                  >
                    <span>Manage Assigned Products &rarr;</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                This category contains 0 assigned products and can be safely deleted. This action will be logged in the immutable audit trail.
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => setDeleteCategory(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              {deleteCategory._count.products === 0 && (
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={confirmDeleteCategory}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition shadow-sm flex items-center gap-1.5"
                >
                  {deleteLoading && <Clock className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Delete</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
