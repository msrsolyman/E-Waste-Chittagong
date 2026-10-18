import * as React from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { InquiryForm } from "@/components/inquiry-form";
import { ContactDeskCard } from "@/components/contact-desk-card";
import { ScrollReveal } from "@/components/scroll-reveal";
import {
  Clock,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  let contactBannerUrl =
    "https://res.cloudinary.com/jpzhmh1r/image/upload/v1792340096/ewaste-chittagong/banners/contact-hero-banner.jpg";

  try {
    const bannerSetting = await prisma.companySetting.findUnique({
      where: { key: "contact_banner" },
    });

    if (bannerSetting?.value) {
      const parsed = JSON.parse(bannerSetting.value);
      if (parsed.url) contactBannerUrl = parsed.url;
    }
  } catch (err) {
    console.error("Failed to parse contact_banner setting:", err);
  }

  return (
    <div className="space-y-12 lg:space-y-16 py-8 sm:py-12">
      {/* 1. TOP SPLIT-HERO BANNER & LIVE LOGISTICS DESK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            <ScrollReveal delayMs={50}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t("heroBadge")}</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delayMs={100}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                {t("heroTitle")}
              </h1>
            </ScrollReveal>

            <ScrollReveal delayMs={150}>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {t("heroSubtitle")}
              </p>
            </ScrollReveal>

            {/* 3 Operational Response & Verification Badges */}
            <ScrollReveal delayMs={200}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{t("metric1Value")}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {t("metric1Desc")}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>{t("metric2Value")}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {t("metric2Desc")}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span>{t("metric3Value")}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {t("metric3Desc")}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Metallic-Framed Hero Banner (5 cols on lg) */}
          <div className="lg:col-span-5">
            <ScrollReveal delayMs={250}>
              <div className="relative group">
                {/* Ambient Glow */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-600/30 to-teal-500/30 blur-xl opacity-70 group-hover:opacity-100 transition duration-700" />

                {/* Metallic Frame */}
                <div className="relative p-2 sm:p-2.5 rounded-3xl bg-gradient-to-b from-slate-200 via-slate-100 to-emerald-200/50 dark:from-slate-800 dark:via-slate-800/90 dark:to-emerald-950/40 border border-slate-300 dark:border-slate-700 shadow-2xl overflow-hidden">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950">
                    <Image
                      src={contactBannerUrl}
                      alt="Chittagong Facility Operations & Logistics Commercial Desk"
                      fill
                      priority
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    />

                    {/* Subtle Dark Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Top Floating Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 text-white flex items-center gap-2 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold tracking-wide">
                        Akbarshah Commercial Desk
                      </span>
                    </div>

                    {/* Bottom Status Bar */}
                    <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 text-white flex items-center justify-between shadow-lg text-[11px]">
                      <span className="text-slate-300 font-medium">
                        Live Material Dispatch & Intake Desk
                      </span>
                      <span className="text-emerald-400 font-mono font-bold">
                        100% Ground Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 2. MAIN DIRECT CHANNELS & COMMERCIAL INQUIRY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Interactive Contact & Location Card (5 cols) */}
          <div className="lg:col-span-5">
            <ScrollReveal delayMs={100}>
              <ContactDeskCard
                addressTitle={t("addressTitle")}
                address={t("address")}
                emailTitle={t("emailTitle")}
                email={t("email")}
                phoneTitle={t("phoneTitle")}
                phone={t("phone")}
                hoursTitle={t("hoursTitle")}
                hours={t("hours")}
                copyAddressText={t("copyAddress")}
                copiedAddressText={t("copiedAddress")}
                getDirectionsText={t("getDirections")}
                facilityGateTitle={t("facilityGateTitle")}
                facilityGateDesc={t("facilityGateDesc")}
                portDistanceTag={t("portDistanceTag")}
                callDirectText={t("callDirect")}
                chatWhatsappText={t("chatWhatsapp")}
                sendEmailText={t("sendEmail")}
                dispatchDeskTitle={t("dispatchDeskTitle")}
                quickActionsTitle={t("quickActions")}
                quickActionsDesc={t("quickActionsDesc")}
              />
            </ScrollReveal>
          </div>

          {/* Right Column: Commercial Inquiry & RFQ Form (7 cols) */}
          <div className="lg:col-span-7">
            <ScrollReveal delayMs={150}>
              <div className="p-6 sm:p-9 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-7 relative overflow-hidden">
                <div className="space-y-2 pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Direct Commercial Channel</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {t("formTitle")}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {t("formSubtitle")}
                  </p>
                </div>

                <InquiryForm />

                {/* Privacy & Assurance Footer */}
                <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Your business communications and RFQ specifications are held in strict commercial confidentiality.
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
