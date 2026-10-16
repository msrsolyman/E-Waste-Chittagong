import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "Reference No",
      "Created Date",
      "Status",
      "Company Name",
      "Contact Person",
      "Business Email",
      "Phone / WhatsApp",
      "Country",
      "Interested Category",
      "Estimated Quantity",
      "Message",
      "Internal Notes",
    ];

    const escapeCsv = (str: string | null | undefined) => {
      if (!str) return '""';
      let clean = str.replace(/"/g, '""').replace(/\r?\n/g, " ");
      // Prevent spreadsheet formula injection (=, +, -, @, \t, \r)
      if (/^[=+\-@\t\r]/.test(clean)) {
        clean = `'${clean}`;
      }
      return `"${clean}"`;
    };

    const rows = inquiries.map((i) => [
      escapeCsv(i.referenceNo),
      escapeCsv(i.createdAt.toISOString()),
      escapeCsv(i.status),
      escapeCsv(i.companyName),
      escapeCsv(i.name),
      escapeCsv(i.email),
      escapeCsv(i.phoneOrWhatsApp),
      escapeCsv(i.country),
      escapeCsv(i.interestedCategory),
      escapeCsv(i.estimatedQty),
      escapeCsv(i.message),
      escapeCsv(i.adminNotes),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "INQUIRIES_CSV_EXPORTED",
        details: JSON.stringify({ count: inquiries.length }),
      },
    });

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="ewaste-chittagong-inquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
