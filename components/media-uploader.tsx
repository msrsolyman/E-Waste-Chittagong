"use client";

import * as React from "react";
import Image from "next/image";
import {
  UploadCloud,
  X,
  CheckCircle,
  AlertCircle,
  FileVideo,
  Link as LinkIcon,
  Copy,
  ExternalLink,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface MediaUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: "products" | "categories" | "gallery" | "general";
  label?: string;
  acceptVideo?: boolean;
  required?: boolean;
  helperText?: string;
}

export function MediaUploader({
  value,
  onChange,
  folder = "general",
  label = "Upload Image or Video",
  acceptVideo = true,
  required = false,
  helperText = "Photos up to 10MB (JPG, PNG, WebP) or Videos up to 50MB (MP4, WebM)",
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showManualInput, setShowManualInput] = React.useState(!value);
  const [copied, setCopied] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isVideoUrl = (url: string) => {
    return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url) || url.includes("/video/upload/");
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url);
      setShowManualInput(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const copyUrl = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <label className="font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showManualInput ? "Hide Direct URL" : "Enter URL Manually"}</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Current Preview Card */}
      {value ? (
        <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                {isVideoUrl(value) ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-emerald-400">
                    <FileVideo className="w-6 h-6" />
                    <span className="text-[9px] font-bold mt-0.5">VIDEO</span>
                  </div>
                ) : (
                  <Image
                    src={value}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="80px"
                    unoptimized={value.startsWith("http")}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {isVideoUrl(value) ? "Cloud Video" : "Cloud Image"}
                  </span>
                  {value.includes("cloudinary.com") && (
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                      Cloudinary CDN
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 truncate font-mono mt-0.5" title={value}>
                  {value}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={copyUrl}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition"
                title="Copy Media URL"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition"
                title="Open in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 font-semibold transition"
              >
                <RefreshCw className={`w-3 h-3 ${isUploading ? "animate-spin text-emerald-600" : ""}`} />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900 transition"
                title="Remove media"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Drag & Drop Upload Zone */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative p-6 rounded-2xl border-2 border-dashed transition cursor-pointer text-center ${
            dragActive
              ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
              : "border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-white dark:bg-slate-900"
          }`}
        >
          {isUploading ? (
            <div className="py-4 space-y-2">
              <Loader2 className="w-8 h-8 mx-auto text-emerald-600 animate-spin" />
              <div className="font-bold text-slate-800 dark:text-slate-200">
                Uploading to Cloudinary CDN...
              </div>
              <div className="text-[11px] text-slate-400">
                Optimizing format and generating high-speed delivery URLs
              </div>
            </div>
          ) : (
            <div className="py-2 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Click to upload or drag & drop
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">{helperText}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={
          acceptVideo
            ? "image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/webm,video/quicktime"
            : "image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        }
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Manual Input Fallback */}
      {showManualInput && (
        <div className="pt-1 animate-in fade-in">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://res.cloudinary.com/... or paste image/video URL"
            className="w-full p-2.5 font-mono text-[11px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
        </div>
      )}
    </div>
  );
}
