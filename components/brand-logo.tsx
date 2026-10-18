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
    sm: { img: 32, text: "text-xs sm:text-sm", sub: "text-[10px]" },
    md: { img: 40, text: "text-sm sm:text-base", sub: "text-xs" },
    lg: { img: 52, text: "text-lg sm:text-xl", sub: "text-xs" },
  };

  const { img, text, sub } = sizeMap[size];

  const content = (
    <div className={cn("inline-flex items-center gap-2 sm:gap-3 group select-none min-w-0", className)}>
      {/* Logo container with dedicated contrast treatment in dark mode */}
      <div className="relative p-1 sm:p-1.5 rounded-xl bg-white shadow-sm ring-1 ring-slate-900/10 dark:ring-emerald-500/30 group-hover:ring-emerald-500/60 dark:group-hover:ring-emerald-400/60 group-hover:shadow-glow-subtle flex items-center justify-center transition-all duration-300 shrink-0">
        <Image
          src="/brand/logo.png"
          alt="E-Waste Chittagong Official Logo"
          width={img}
          height={img}
          priority
          className="object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left min-w-0">
          <span className={cn("font-bold tracking-tight text-slate-900 dark:text-white leading-tight whitespace-nowrap", text)}>
            E-Waste <span className="text-emerald-600 dark:text-emerald-400">Chittagong</span>
          </span>
          <span className={cn("text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase hidden sm:block whitespace-nowrap", sub)}>
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
