import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden: Super Admin only" }, { status: 403 });
    }

    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true, role: true },
        },
      },
    });

    const headers = [
      "Log ID",
      "Timestamp (UTC)",
      "Action Code",
      "Operator Name",
      "Operator Email",
      "Operator Role",
      "IP Address",
      "Details",
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

    const rows = logs.map((log) => [
      escapeCsv(log.id),
      escapeCsv(log.createdAt.toISOString()),
      escapeCsv(log.action),
      escapeCsv(log.user?.name || "System/Visitor"),
      escapeCsv(log.user?.email || "N/A"),
      escapeCsv(log.user?.role || "N/A"),
      escapeCsv(log.ipAddress || "local"),
      escapeCsv(log.details || ""),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "AUDIT_LOGS_CSV_EXPORTED",
        details: JSON.stringify({ exportedCount: logs.length }),
      },
    });

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="ewaste-chittagong-audit-logs-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error("Audit log CSV export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
