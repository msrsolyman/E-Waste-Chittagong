import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/section-heading";
import { ShieldCheck, Target, Globe, Anchor, Award } from "lucide-react";

export default function AboutPage() {
  const tNav = useTranslations("nav");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Title */}
      <SectionHeading
        badge="Company Overview"
        title="About E-Waste Chittagong"
        subtitle="Dedicated to responsible e-waste aggregation, systematic material separation, and international circular economy trade."
      />

      {/* Main Narrative with Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            <strong className="text-slate-900 dark:text-white">E-Waste Chittagong</strong> operates at the vital intersection of regional electronic asset retirement and global resource recovery. Based in Bangladesh’s foremost maritime gateway city, our organization collects discarded computer equipment, server infrastructure, telecommunication boards, and industrial electronics from corporate enterprises.
          </p>
          <p>
            Our core mission is to replace informal, hazardous e-waste handling with structured, transparent B2B procedures. We prioritize the safe separation of dangerous substances—such as lead solder and lithium accumulators—while maximizing the extraction yield of high-value non-ferrous and precious metal-bearing components.
          </p>
          <p>
            All materials prepared for export or domestic industrial supply undergo systematic grading and packaging according to international industry specifications, allowing certified global smelters and refiners to process them efficiently.
          </p>

          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600" />
            <div>
              <div className="font-bold">Verified Operational Policy</div>
              <div>
                E-Waste Chittagong upholds strict factual transparency. All facility specifications, material lots, and business details are verified prior to formal commercial execution.
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg bg-slate-900">
            <Image
              src="/images/products/facility-dismantling.jpg"
              alt="E-Waste Chittagong Organized Sorting Workstation"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Strategic Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Our Mission</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            To provide safe, ethical, and economically viable electronic waste recovery solutions that divert hazardous electronics from local landfills into the global circular supply chain.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center">
            <Anchor className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Chittagong Port Proximity</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Our strategic position near Chittagong’s seaport reduces inland transportation overhead, facilitating prompt container stuffing, customs clearance, and global ocean freight dispatch.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">International Business Readiness</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            We cater to overseas refiners and recyclers with multilingual communication, formal Proforma Invoices, clear assay test terms, and FOB / CIF shipping arrangements.
          </p>
        </div>
      </div>
    </div>
  );
}
