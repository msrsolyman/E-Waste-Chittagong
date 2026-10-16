"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { PlusCircle, ExternalLink, Check, Clock } from "lucide-react";

interface ProductRow {
  id: string;
  slug: string;
  titleEn: string;
  titleBn: string | null;
  titleZh: string | null;
  titleJa: string | null;
  category: { nameEn: string };
  grade: string | null;
  minOrderQuantity: string | null;
  status: string;
  images: string;
}

export function AdminProductsTable({ initialProducts }: { initialProducts: ProductRow[] }) {
  const [products, setProducts] = React.useState<ProductRow[]>(initialProducts);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">
          Showing {products.length} registered products
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
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
              {products.map((p) => {
                let imgUrl = "/images/products/pcb-motherboards.jpg";
                try {
                  const parsed = JSON.parse(p.images);
                  if (Array.isArray(parsed) && parsed[0]) imgUrl = parsed[0];
                } catch {}

                const isPublished = p.status === "PUBLISHED";

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

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {p.category.nameEn}
                    </td>

                    {/* Language coverage badges */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-mono text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          EN
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            p.titleBn ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          BN
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            p.titleZh ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          ZH
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            p.titleJa ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-400"
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

                    {/* Status Pill & Toggle */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        disabled={updatingId === p.id}
                        onClick={() => toggleStatus(p.id, p.status)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition ${
                          isPublished
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 hover:bg-amber-200"
                        }`}
                      >
                        {isPublished ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{isPublished ? "Published" : "Draft"}</span>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/en/products/${p.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
