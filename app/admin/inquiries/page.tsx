import * as React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminInquiryPipeline } from "@/components/admin-inquiry-pipeline";
import { Inbox } from "lucide-react";

export default async function AdminInquiriesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Inbox className="w-6 h-6 text-emerald-600" />
            <span>Buyer Inquiry & RFQ Pipeline</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage incoming international procurement inquiries, update statuses, and log internal quotation progress.
          </p>
        </div>
      </div>

      <AdminInquiryPipeline initialInquiries={inquiries} />
    </div>
  );
}
