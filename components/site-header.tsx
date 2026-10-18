"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/products", label: t("products") },
    { href: "/services", label: t("services") },
    { href: "/process", label: t("process") },
    { href: "/gallery", label: t("gallery") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs"
          : "bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50"
      )}
    >
      {/* Subtle top tech accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-500/70 to-transparent" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-300 gap-4",
            isScrolled ? "h-16" : "h-20"
          )}
        >
          {/* Logo */}
          <div className="shrink-0">
            <BrandLogo size="md" />
          </div>

          {/* Desktop Navigation Capsule */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 p-1 rounded-full bg-slate-100/80 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md shadow-xs shrink-0">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 xl:px-3.5 py-1.5 text-xs xl:text-[13px] 2xl:text-sm font-medium rounded-full transition-all duration-200 relative select-none whitespace-nowrap",
                    isActive
                      ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/50"
                  )}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Tools: Lang, Theme, RFQ */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 shrink-0">
            {/* Utility cluster (Lang + Theme) */}
            <div className="flex items-center gap-1 p-1 bg-slate-100/80 dark:bg-slate-900/70 rounded-full border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md shadow-xs">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>

            {/* High-Converting CTA Button */}
            <Link
              href="/inquiry"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs xl:text-sm font-semibold rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm hover:shadow-md hover:shadow-emerald-500/20 active:scale-[0.98] transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 group/rfq"
            >
              <span>{t("rfq")}</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/rfq:translate-x-0.5 group-hover/rfq:-translate-y-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Button & Tools */}
          <div className="flex lg:hidden items-center gap-1.5">
            <div className="flex items-center gap-1 p-0.5 bg-slate-100/80 dark:bg-slate-900/70 rounded-full border border-slate-200/60 dark:border-slate-800/60">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 transition-transform duration-150 rotate-90" />
              ) : (
                <Menu className="w-5 h-5 transition-transform duration-150" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl px-5 pt-4 pb-6 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-2.5 text-sm rounded-xl transition-all duration-150 active:scale-[0.99] whitespace-nowrap",
                  isActive
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 font-medium"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/inquiry"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] text-white font-bold text-sm shadow-md transition-all duration-200 group/mrfq"
            >
              <span>{t("rfq")}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover/mrfq:translate-x-0.5 group-hover/mrfq:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
