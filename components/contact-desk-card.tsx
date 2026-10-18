"use client";

import * as React from "react";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  MessageSquare,
  Copy,
  Check,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Truck,
  ArrowUpRight,
  Headphones,
} from "lucide-react";

interface ContactDeskCardProps {
  addressTitle: string;
  address: string;
  emailTitle: string;
  email: string;
  phoneTitle: string;
  phone: string;
  hoursTitle: string;
  hours: string;
  copyAddressText: string;
  copiedAddressText: string;
  getDirectionsText: string;
  facilityGateTitle: string;
  facilityGateDesc: string;
  portDistanceTag: string;
  callDirectText: string;
  chatWhatsappText: string;
  sendEmailText: string;
  dispatchDeskTitle: string;
  quickActionsTitle: string;
  quickActionsDesc: string;
}

export function ContactDeskCard({
  addressTitle,
  address,
  emailTitle,
  email,
  phoneTitle,
  phone,
  hoursTitle,
  hours,
  copyAddressText,
  copiedAddressText,
  getDirectionsText,
  facilityGateTitle,
  facilityGateDesc,
  portDistanceTag,
  callDirectText,
  chatWhatsappText,
  sendEmailText,
  dispatchDeskTitle,
  quickActionsTitle,
  quickActionsDesc,
}: ContactDeskCardProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => {
      setCopiedField(null);
    }, 2500);
  };

  const whatsappMessage = encodeURIComponent(
    "Hello E-Waste Chittagong, I would like to inquire about B2B electronic scrap procurement, material grading, and facility inspections."
  );
  const whatsappUrl = `https://wa.me/8801352328093?text=${whatsappMessage}`;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    "Mir Aulia Road, Akbarshah, Chittagong, Bangladesh"
  )}`;

  return (
    <div className="space-y-6">
      {/* 1. Quick Action Direct Connectors */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{quickActionsTitle}</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-400/80 font-semibold">
              Live Response
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {quickActionsDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/40 hover:shadow-emerald-400/20 transition-all duration-200 group"
            >
              <MessageSquare className="w-4 h-4 fill-slate-950 group-hover:scale-110 transition-transform" />
              <span>{chatWhatsappText}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </a>

            <a
              href="tel:+8801352328093"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all duration-200 group"
            >
              <Phone className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>{callDirectText}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Commercial Desk & Detailed Verified Parameters */}
      <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-0.5">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Chittagong Material Registry
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              {dispatchDeskTitle}
            </h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="space-y-5 text-xs">
          {/* Physical Address */}
          <div className="flex items-start gap-3.5 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800/60 shadow-sm mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <span>{addressTitle}</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Confirmed
                </span>
              </div>
              <div className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {address}
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => copyToClipboard(address, "address")}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
                >
                  {copiedField === "address" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">{copiedAddressText}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>{copyAddressText}</span>
                    </>
                  )}
                </button>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 transition"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{getDirectionsText}</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>

          {/* Email Channel */}
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800/60 shadow-sm mt-0.5">
              <Mail className="w-4 h-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                {emailTitle}
              </div>
              <div className="flex items-center justify-between gap-2">
                <a
                  href={`mailto:${email}`}
                  className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline break-all"
                >
                  {email}
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard(email, "email")}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                  title="Copy email"
                >
                  {copiedField === "email" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Phone & WhatsApp */}
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800/60 shadow-sm mt-0.5">
              <Phone className="w-4 h-4" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                {phoneTitle}
              </div>
              <div className="flex items-center justify-between gap-2">
                <a
                  href="tel:+8801352328093"
                  className="text-slate-800 dark:text-slate-200 font-mono font-bold hover:text-emerald-600 dark:hover:text-emerald-400 text-sm"
                >
                  {phone}
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard("+8801352328093", "phone")}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                  title="Copy phone"
                >
                  {copiedField === "phone" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>{chatWhatsappText}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800/60 shadow-sm mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                {hoursTitle}
              </div>
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {hours}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Port & Highway Corridor Card */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-3 relative overflow-hidden shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Truck className="w-4 h-4" />
            <span>{facilityGateTitle}</span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/60">
            {portDistanceTag}
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {facilityGateDesc}
        </p>

        {/* Mini Route Map Preview Card */}
        <div className="mt-3 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300 font-mono text-[11px]">
              Akbarshah Corridor ⇄ Port of Chittagong
            </span>
          </div>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition"
          >
            <span>Live Map</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
