"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Globe, Check } from "lucide-react";

const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "zh-CN", label: "Chinese", native: "简体中文" },
  { code: "ja", label: "Japanese", native: "日本語" },
];

export function LanguageSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (localeCode: string) => {
    setIsOpen(false);
    // Preserves the current subpath in the new language
    router.replace(pathname, { locale: localeCode });
  };

  const activeLang = languages.find((l) => l.code === currentLocale) || languages[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>{activeLang.native}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Select Language
          </div>
          {languages.map((lang) => {
            const isSelected = lang.code === currentLocale;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-left ${
                  isSelected
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div>
                  <div className="font-medium">{lang.native}</div>
                  <div className="text-[10px] text-slate-400">{lang.label}</div>
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
