import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  centered = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-3",
        centered && "text-center max-w-3xl mx-auto",
        className
      )}
    >
      {badge && (
        <div className={cn("text-xs font-bold tracking-widest uppercase text-emerald-800 dark:text-emerald-400", centered && "text-center")}>
          {badge}
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.2]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
