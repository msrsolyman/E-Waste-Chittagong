import * as React from "react";
import { SectionHeading } from "@/components/section-heading";
import { ShieldCheck, Lock } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SectionHeading
        badge="Compliance & Confidentiality"
        title="Privacy & Data Protection Policy"
        subtitle="How E-Waste Chittagong collects, handles, and protects information submitted by international buyers and corporate clients."
      />

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium text-slate-800 dark:text-slate-200">
            Strict Corporate Guarantee: We never sell, share, or disclose prospective buyer contact details or quotation specifications to third parties.
          </span>
        </div>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            1. Collection of Commercial Inquiries
          </h3>
          <p>
            When you submit a Request for Quotation (RFQ) or contact inquiry through our platform, we collect company identifiers, contact representative names, business email addresses, contact telephone numbers, and material procurement specifications.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            2. Purpose of Processing
          </h3>
          <p>
            Data gathered is utilized exclusively to formulate formal commercial offers, calculate FOB/CIF freight rates from the Port of Chittagong, confirm inventory readiness, and fulfill international trade documentation requirements.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            3. Data Security & Storage
          </h3>
          <p>
            All submitted records are encrypted in transit and stored within protected database environments with strict role-based administrative access controls.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            4. Inquiries & Data Rights
          </h3>
          <p>
            You may request the review, correction, or deletion of your company’s commercial records at any time by contacting our compliance desk at <strong>info@ewastechittagong.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
