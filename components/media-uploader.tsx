"use client";

import * as React from "react";
import Image from "next/image";
import {
  UploadCloud,
  X,
  CheckCircle,
  AlertCircle,
  FileVideo,
  Copy,
  ExternalLink,
  Loader2,
  RefreshCw,
  FolderOpen,
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
  label = "Upload Image",
  acceptVideo = false,
  required = false,
  helperText = "Direct file upload to Cloudinary. JPG, PNG, WebP up to 10MB.",
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
  const [localPreview, setLocalPreview] = React.useState<string | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isVideoUrl = (url: string) => {
    return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url) || url.includes("/video/upload/");
  };

  const handleUpload = async (file: File) => {
    // 1. Instant local preview
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
    setIsUploading(true);
    setUploadProgress(15);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      setUploadProgress(40);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(85);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadProgress(100);
      onChange(data.url);
      setLocalPreview(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
      setLocalPreview(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    // reset input so same file can be chosen if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

  const activeMedia = localPreview || value;

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <label className="font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
        </label>
        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          Cloudinary Direct Upload
        </span>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptVideo ? "image/*,video/mp4,video/webm,video/quicktime" : "image/*"}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Active Preview Card */}
      {activeMedia ? (
        <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden flex-1">
              <div className="relative w-24 h-20 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs">
                {isVideoUrl(activeMedia) ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-emerald-400">
                    <FileVideo className="w-7 h-7" />
                    <span className="text-[9px] font-bold mt-0.5">VIDEO</span>
                  </div>
                ) : (
                  <Image
                    src={activeMedia}
                    alt="Uploaded Media"
                    fill
                    className="object-cover"
                    sizes="96px"
                    unoptimized={activeMedia.startsWith("http") || activeMedia.startsWith("blob:")}
                  />
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-1">
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                    <span className="text-[9px] font-mono font-bold">Uploading...</span>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {isVideoUrl(activeMedia) ? "Cloud Video" : "Cloud Photo"}
                  </span>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    Cloudinary Verified
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 truncate font-mono" title={activeMedia}>
                  {activeMedia}
                </div>
                {uploadProgress !== null && (
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {value && (
                <>
                  <button
                    type="button"
                    onClick={copyUrl}
                    className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition"
                    title="Copy Media URL"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition"
                    title="Open Full Resolution"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 font-semibold transition shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isUploading ? "animate-spin text-emerald-600" : ""}`} />
                <span>Replace</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setLocalPreview(null);
                }}
                disabled={isUploading}
                className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/60 transition"
                title="Remove media"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Pure Drag & Drop File Upload Zone */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative p-8 rounded-2xl border-2 border-dashed transition cursor-pointer text-center group ${
            dragActive
              ? "border-emerald-500 bg-emerald-500/10 scale-[1.01]"
              : "border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-emerald-500/5"
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:scale-110 transition-transform">
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>

            <div className="space-y-1">
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                <span>Drag & drop file here, or</span>
                <span className="text-emerald-600 dark:text-emerald-400 underline decoration-2 underline-offset-2">
                  Browse Device
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {helperText}
              </p>
            </div>

            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-colors">
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Select File from Computer / Phone</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
