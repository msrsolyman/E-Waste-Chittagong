import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { ArrowLeft, Home } from "lucide-react";

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-6">
      <BrandLogo size="lg" />

      <div className="space-y-2">
        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
          Error 404 · Page Not Found
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Requested Page Unavailable
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          The page or product catalogue listing you are trying to reach does not exist or has been relocated.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/en"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow transition"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
}
