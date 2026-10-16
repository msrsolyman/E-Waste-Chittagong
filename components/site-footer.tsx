import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { BrandLogo } from "@/components/brand-logo";
import { MapPin, Mail, Phone, ShieldCheck, Lock } from "lucide-react";

export function SiteFooter() {
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const tContact = useTranslations("contact");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <BrandLogo size="md" />
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {tFooter("about")}
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Ethical B2B Material Recovery</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              {tFooter("quickLinks")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                >
                  {tNav("about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                >
                  {tNav("products")}
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                >
                  {tNav("services")}
                </Link>
              </li>
              <li>
                <Link
                  href="/process"
                  className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                >
                  {tNav("process")}
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                >
                  {tNav("gallery")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              {tNav("contact")}
            </h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>{tContact("address")}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <a
                  href={`mailto:${tContact("email")}`}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  {tContact("email")}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>{tContact("phone")}</span>
              </li>
            </ul>
          </div>

          {/* Commercial & Compliance */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              {tFooter("legal")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                >
                  {tFooter("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/inquiry"
                  className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                >
                  {tNav("rfq")}
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                >
                  <Lock className="w-3 h-3" />
                  <span>{tNav("admin")}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {currentYear} E-Waste Chittagong. {tFooter("allRights")}</p>
          <p className="text-[11px] text-slate-400">
            Export Logistics Proximity: Chittagong Sea Port, Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
