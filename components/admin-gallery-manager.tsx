"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Trash2,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Search,
  ExternalLink,
  Copy,
  Edit2,
  Maximize2,
  X,
  CheckCircle,
  Clock,
  Layers,
  Check,
  Play,
  Film,
  Camera,
} from "lucide-react";
import { MediaUploader } from "@/components/media-uploader";

export interface GalleryItemData {
  id: string;
  titleEn: string;
  titleBn: string | null;
  titleZh?: string | null;
  titleJa?: string | null;
  imageUrl: string;
  category: string;
  isVerified: boolean;
  caption: string | null;
  createdAt: string | Date;
}

const CATEGORIES = ["ALL", "VIDEOS", "PHOTOS", "MATERIAL", "FACILITY", "DISMANTLING", "PROCESSING"];

export const isVideoUrl = (url: string) => {
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url) || url.includes("/video/upload/");
};

export const getVideoPoster = (url: string) => {
  if (url.includes("/video/upload/")) {
    return url.replace(/\.mp4$/i, ".jpg");
  }
  return url;
};

export function AdminGalleryManager({ initialItems }: { initialItems: GalleryItemData[] }) {
  const [items, setItems] = React.useState<GalleryItemData[]>(initialItems);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("ALL");

  // Notifications
  const [notice, setNotice] = React.useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Modal State (Create / Edit)
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isNewMode, setIsNewMode] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<"en" | "bn" | "zh" | "ja" | "media">("en");
  const [modalLoading, setModalLoading] = React.useState(false);
  const [modalError, setModalError] = React.useState<string | null>(null);

  // Lightbox Modal
  const [lightboxItem, setLightboxItem] = React.useState<GalleryItemData | null>(null);

  // Delete Dialog State
  const [deleteItem, setDeleteItem] = React.useState<GalleryItemData | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  // Toggling badge loading
  const [togglingId, setTogglingId] = React.useState<string | null>(null);

  const showNotice = (text: string, type: "success" | "error" | "info" = "success") => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 4000);
  };

  const [formData, setFormData] = React.useState({
    titleEn: "",
    titleBn: "",
    titleZh: "",
    titleJa: "",
    category: "MATERIAL",
    imageUrl: "",
    isVerified: false,
    caption: "",
  });

  // Category counts
  const counts = React.useMemo(() => {
    const videoCount = items.filter((i) => isVideoUrl(i.imageUrl)).length;
    const photoCount = items.length - videoCount;
    const res: Record<string, number> = {
      ALL: items.length,
      VIDEOS: videoCount,
      PHOTOS: photoCount,
    };
    ["MATERIAL", "FACILITY", "DISMANTLING", "PROCESSING"].forEach((cat) => {
      res[cat] = items.filter((i) => i.category.toUpperCase() === cat).length;
    });
    return res;
  }, [items]);

  // Direct Toggle Authenticity Badge
  const handleToggleVerified = async (item: GalleryItemData) => {
    setTogglingId(item.id);
    const newVerified = !item.isVerified;
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, isVerified: newVerified }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update badge");

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isVerified: newVerified } : i))
      );
      showNotice(
        newVerified
          ? "Marked as Confirmed Operation Photo"
          : "Marked as Illustrative Concept (Buyer transparency)"
      );
    } catch (err: any) {
      showNotice(err.message, "error");
    } finally {
      setTogglingId(null);
    }
  };

  // Open Create Modal
  const openCreateModal = () => {
    setIsNewMode(true);
    setEditingId(null);
    setFormData({
      titleEn: "",
      titleBn: "",
      titleZh: "",
      titleJa: "",
      category: "MATERIAL",
      imageUrl: "",
      isVerified: false,
      caption: "",
    });
    setModalError(null);
    setActiveTab("en");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (item: GalleryItemData) => {
    setIsNewMode(false);
    setEditingId(item.id);
    setFormData({
      titleEn: item.titleEn || "",
      titleBn: item.titleBn || "",
      titleZh: item.titleZh || "",
      titleJa: item.titleJa || "",
      category: item.category || "MATERIAL",
      imageUrl: item.imageUrl || "",
      isVerified: Boolean(item.isVerified),
      caption: item.caption || "",
    });
    setModalError(null);
    setActiveTab("en");
    setIsModalOpen(true);
  };

  // Save Modal Handler (Create or Update)
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleEn.trim()) {
      setModalError("English title is required");
      setActiveTab("en");
      return;
    }
    if (!formData.imageUrl.trim()) {
      setModalError("Image URL is required");
      setActiveTab("media");
      return;
    }

    setModalLoading(true);
    setModalError(null);

    try {
      if (isNewMode) {
        // Create
        const res = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create media item");

        setItems((prev) => [data.item, ...prev]);
        showNotice(`Registered media asset "${formData.titleEn}" successfully!`);
      } else {
        // Update
        const res = await fetch("/api/admin/gallery", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...formData }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update media item");

        setItems((prev) =>
          prev.map((i) => (i.id === editingId ? { ...i, ...data.item } : i))
        );
        showNotice(`Updated media asset "${formData.titleEn}"!`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setModalError(err.message || "An error occurred");
    } finally {
      setModalLoading(false);
    }
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!deleteItem) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/gallery?id=${deleteItem.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete media asset");

      setItems((prev) => prev.filter((i) => i.id !== deleteItem.id));
      showNotice(`Media asset "${deleteItem.titleEn}" deleted.`);
      setDeleteItem(null);
    } catch (err: any) {
      showNotice(err.message, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Copy Image Link
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    showNotice("Image URL copied to clipboard!", "info");
  };

  // Filtered Items
  const filtered = items.filter((item) => {
    let matchesCat = true;
    if (selectedCategory === "VIDEOS") {
      matchesCat = isVideoUrl(item.imageUrl);
    } else if (selectedCategory === "PHOTOS") {
      matchesCat = !isVideoUrl(item.imageUrl);
    } else if (selectedCategory !== "ALL") {
      matchesCat = item.category.toUpperCase() === selectedCategory.toUpperCase();
    }

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.titleEn.toLowerCase().includes(q) ||
      (item.titleBn && item.titleBn.toLowerCase().includes(q)) ||
      (item.caption && item.caption.toLowerCase().includes(q)) ||
      item.imageUrl.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

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

      {/* Top Filter & Search Bar */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gallery assets by title, caption, or path..."
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

        {/* Right Tools: Category Filter Pills, Public Link & Add */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
            {CATEGORIES.map((cat) => {
              const count = counts[cat] ?? 0;
              const isActive = selectedCategory === cat;
              const label =
                cat === "ALL"
                  ? "All"
                  : cat.charAt(0) + cat.slice(1).toLowerCase();

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
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

          {/* Public Gallery Link */}
          <Link
            href="/en/gallery"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            title="Preview Public Gallery"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Public Gallery</span>
          </Link>

          {/* Add Media Asset Button */}
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Media Asset</span>
          </button>
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <b>{filtered.length}</b> of <b>{items.length}</b> registered media assets ({counts.VIDEOS ?? 0} videos, {counts.PHOTOS ?? 0} photos)
        </span>
        {(searchQuery || selectedCategory !== "ALL") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("ALL");
            }}
            className="text-emerald-600 dark:text-emerald-400 hover:underline text-[11px]"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Media Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            <Layers className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
            <div>No media assets found matching &ldquo;{searchQuery}&rdquo;.</div>
          </div>
        ) : (
          filtered.map((item) => {
            const isVerified = Boolean(item.isVerified);
            const isVideo = isVideoUrl(item.imageUrl);
            const posterSrc = isVideo ? getVideoPoster(item.imageUrl) : item.imageUrl;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between group"
              >
                <div>
                  {/* Image / Video Thumbnail Banner */}
                  <div
                    className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden cursor-pointer"
                    onClick={() => setLightboxItem(item)}
                  >
                    {isVideo ? (
                      <div className="relative w-full h-full">
                        <img
                          src={posterSrc}
                          alt={item.titleEn}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = "/images/products/pcb-motherboards.jpg";
                          }}
                        />
                        {/* Video Play Overlay */}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
                          <div className="w-11 h-11 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-5 h-5 ml-0.5 fill-white" />
                          </div>
                        </div>
                        {/* Video Badge */}
                        <div className="absolute bottom-2.5 right-2.5 pointer-events-none">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider bg-slate-950/80 border border-white/10 text-slate-200 backdrop-blur-md">
                            <Film className="w-3 h-3 text-emerald-400" />
                            <span>VIDEO</span>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        <img
                          src={item.imageUrl}
                          alt={item.titleEn}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = "/images/products/pcb-motherboards.jpg";
                          }}
                        />
                        {/* Photo Badge */}
                        <div className="absolute bottom-2.5 right-2.5 pointer-events-none">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider bg-slate-950/80 border border-white/10 text-slate-200 backdrop-blur-md">
                            <Camera className="w-3 h-3 text-emerald-400" />
                            <span>PHOTO</span>
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Top-Left: Interactive Authenticity Badge */}
                    <div
                      className="absolute top-2.5 left-2.5 z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        disabled={togglingId === item.id}
                        onClick={() => handleToggleVerified(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs transition hover:scale-105 cursor-pointer ${
                          isVerified
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-slate-900/85 text-amber-300 border border-amber-500/40 hover:bg-slate-900"
                        }`}
                        title="Click to toggle: Confirmed Facility Operation vs Illustrative Concept"
                      >
                        {isVerified ? (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-white" />
                            <span>Confirmed</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Illustrative</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Top-Right: Zoom / Lightbox Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxItem(item);
                      }}
                      className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-xs transition shadow-sm opacity-90 hover:opacity-100 cursor-pointer"
                      title={isVideo ? "Play Full Video" : "View Full Resolution"}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-mono font-medium text-slate-400">
                        {isVideo ? "Video" : "Photo"}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 min-h-[32px] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.titleEn}
                    </h4>

                    {item.caption && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-3 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {/* Copy Link Button */}
                    <button
                      type="button"
                      onClick={() => handleCopyLink(item.imageUrl)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-800 font-medium transition"
                      title="Copy Image URL to use in products"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Link</span>
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 font-medium transition"
                      title="Edit Titles and Category"
                    >
                      <Edit2 className="w-3 h-3 text-blue-600" />
                      <span>Edit</span>
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => setDeleteItem(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                    title="Delete Media Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FULL-SCREEN IMAGE / VIDEO LIGHTBOX MODAL                      */}
      {/* ------------------------------------------------------------- */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Media Container with Ambient Glow */}
            <div className="relative w-full bg-slate-950 flex items-center justify-center overflow-hidden min-h-[300px] max-h-[68vh] p-2 sm:p-4">
              {/* Soft ambient blur from image */}
              <div
                className="absolute inset-0 bg-cover bg-center blur-3xl opacity-25 scale-125 pointer-events-none select-none transition-all duration-700"
                style={{
                  backgroundImage: `url(${isVideoUrl(lightboxItem.imageUrl) ? getVideoPoster(lightboxItem.imageUrl) : lightboxItem.imageUrl})`,
                }}
              />
              <div className="absolute inset-0 bg-radial from-transparent via-slate-950/50 to-slate-950/90 pointer-events-none" />

              {isVideoUrl(lightboxItem.imageUrl) ? (
                <video
                  controls
                  autoPlay
                  playsInline
                  src={lightboxItem.imageUrl}
                  className="relative z-10 max-h-[64vh] max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl"
                />
              ) : (
                <img
                  src={lightboxItem.imageUrl}
                  alt={lightboxItem.titleEn}
                  className="relative z-10 max-h-[64vh] max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl transition-all duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "/images/products/pcb-motherboards.jpg";
                  }}
                />
              )}
            </div>

            {/* Lightbox Footer */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 text-white border-t border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-emerald-400">
                    {lightboxItem.category}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {isVideoUrl(lightboxItem.imageUrl) ? "Video Asset" : "High-Res Photo"}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      lightboxItem.isVerified
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-950 text-amber-300 border border-amber-800"
                    }`}
                  >
                    {lightboxItem.isVerified ? "Confirmed Operation" : "Illustrative Concept"}
                  </span>
                </div>
                <h3 className="font-bold text-sm">{lightboxItem.titleEn}</h3>
                {lightboxItem.caption && (
                  <p className="text-xs text-slate-400">{lightboxItem.caption}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyLink(lightboxItem.imageUrl)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 transition"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Close Cross */}
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur-md transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TABBED CREATE & EDIT MODAL                                    */}
      {/* ------------------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 my-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                  {isNewMode ? <Plus className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {isNewMode ? "Register New Media Asset" : "Edit Media Asset"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Define titles, authenticity badge, scrap classification, and image path.
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
                Category & Image
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              {/* TAB 1: ENGLISH */}
              {activeTab === "en" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Title (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder="e.g. Server Motherboard Sorting Line"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Caption & Handling Details (English)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.caption}
                      onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                      placeholder="Brief description of the handling, metal segregation, or lot preparation..."
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
                      ছবির শিরোনাম (বাংলা)
                    </label>
                    <input
                      type="text"
                      value={formData.titleBn}
                      onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                      placeholder="যেমন: সার্ভার মাদারবোর্ড বাছাইকরণ লাইন"
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
                      图片标题 (中文)
                    </label>
                    <input
                      type="text"
                      value={formData.titleZh}
                      onChange={(e) => setFormData({ ...formData, titleZh: e.target.value })}
                      placeholder="例如: 服务器主板分选线"
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
                      画像タイトル (日本語)
                    </label>
                    <input
                      type="text"
                      value={formData.titleJa}
                      onChange={(e) => setFormData({ ...formData, titleJa: e.target.value })}
                      placeholder="例: サーバーマザーボード選別ライン"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: CATEGORY & MEDIA */}
              {activeTab === "media" && (
                <div className="space-y-4">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Scrap Activity Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="MATERIAL">MATERIAL (Electronic Scrap Lots)</option>
                      <option value="FACILITY">FACILITY (Storage & Workstation)</option>
                      <option value="DISMANTLING">DISMANTLING (Manual Component Separation)</option>
                      <option value="PROCESSING">PROCESSING (Assaying, Sorting & Baling)</option>
                    </select>
                  </div>

                  {/* Authenticity Checkbox */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.isVerified}
                        onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Confirmed Facility Operation (Genuine Company Photo)</span>
                      </span>
                    </label>
                    <p className="text-[10px] text-slate-500 pl-6">
                      Leave unchecked if this is an illustrative representation (for international compliance).
                    </p>
                  </div>

                  {/* Image / Video Media Upload via Cloudinary */}
                  <div>
                    <MediaUploader
                      value={formData.imageUrl}
                      onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                      folder="gallery"
                      label="Facility Photograph / Video Asset *"
                      acceptVideo
                      helperText="Upload authentic facility photos (JPG, PNG, WebP) or video (MP4, WebM)"
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
                  <span>{isNewMode ? "Register Asset" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DELETE CONFIRMATION DIALOG                                    */}
      {/* ------------------------------------------------------------- */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete Media Asset?
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to permanently delete <b>&ldquo;{deleteItem.titleEn}&rdquo;</b>?
            </p>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
              This action will permanently remove this photograph from the media gallery. It is recorded in the immutable audit trail.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => setDeleteItem(null)}
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
    </div>
  );
}
