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
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-md group">
        <Image
          src={selectedImage}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-600/90 text-white backdrop-blur-md shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
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
                className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                  isSelected
                    ? "border-emerald-600 ring-2 ring-emerald-600/30 scale-105"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-400 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
