"use client";

import * as React from "react";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

export function ProductImageGallery({
  images,
  title,
  verifiedText = "Verified Material Lot",
}: {
  images: string[];
  title: string;
  verifiedText?: string;
}) {
  const [selectedImage, setSelectedImage] = React.useState<string>(images[0] || "/images/products/pcb-motherboards.jpg");

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300 group">
        <Image
          src={selectedImage}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide bg-slate-950/80 border border-emerald-500/40 text-emerald-300 backdrop-blur-md shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{verifiedText}</span>
          </span>
        </div>
      </div>

      {/* Thumbnails Row if more than 1 image */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => {
            const isSelected = selectedImage === img;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 active:scale-95 transition-all duration-200 shrink-0 ${
                  isSelected
                    ? "border-emerald-600 ring-2 ring-emerald-600/30 scale-105 opacity-100"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-400 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
