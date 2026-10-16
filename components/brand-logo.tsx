import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function BrandLogo({
  href = "/",
  className,
  size = "md",
  showText = true,
}: BrandLogoProps) {
  const sizeMap = {
    sm: { img: 36, text: "text-sm", sub: "text-[10px]" },
    md: { img: 44, text: "text-base", sub: "text-xs" },
    lg: { img: 56, text: "text-xl", sub: "text-xs" },
  };

  const { img, text, sub } = sizeMap[size];

  const content = (
    <div className={cn("inline-flex items-center gap-3 group select-none", className)}>
      {/* Logo container with dedicated contrast treatment in dark mode */}
      <div className="relative p-1 rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5 dark:ring-emerald-500/30 flex items-center justify-center transition-transform group-hover:scale-105">
        <Image
          src="/brand/logo.png"
          alt="E-Waste Chittagong Official Logo"
          width={img}
          height={img}
          priority
          className="object-contain"
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className={cn("font-bold tracking-tight text-slate-900 dark:text-white leading-tight", text)}>
            E-Waste <span className="text-emerald-600 dark:text-emerald-400">Chittagong</span>
          </span>
          <span className={cn("text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase", sub)}>
            B2B Material Recovery
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
