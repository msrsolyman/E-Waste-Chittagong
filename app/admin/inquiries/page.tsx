import * as React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminInquiryPipeline } from "@/components/admin-inquiry-pipeline";
import { AdminPageHeader } from "@/components/admin-page-header";
import { Inbox } from "lucide-react";

export default async function AdminInquiriesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={<Inbox className="w-6 h-6 text-emerald-600" />}
        titleKey="page.inquiries.title"
        defaultTitle="Buyer Inquiry & RFQ Pipeline"
        subtitleKey="page.inquiries.subtitle"
        defaultSubtitle="Manage incoming international procurement inquiries, update statuses, and log internal quotation progress."
      />

      <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading inquiry pipeline...</div>}>
        <AdminInquiryPipeline initialInquiries={inquiries} />
      </React.Suspense>
    </div>
  );
}
