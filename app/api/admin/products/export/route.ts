import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: {
          select: { nameEn: true },
        },
      },
    });

    const headers = [
      "ID",
      "Slug",
      "Status",
      "Featured",
      "Category",
      "Title (EN)",
      "Title (BN)",
      "Title (ZH)",
      "Title (JA)",
      "Grade",
      "Origin",
      "Packaging",
      "Min Order Quantity",
      "Short Description (EN)",
      "Short Description (BN)",
      "Created Date",
      "Updated Date",
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

    const rows = products.map((p) => [
      escapeCsv(p.id),
      escapeCsv(p.slug),
      escapeCsv(p.status),
      escapeCsv(p.isFeatured ? "YES" : "NO"),
      escapeCsv(p.category.nameEn),
      escapeCsv(p.titleEn),
      escapeCsv(p.titleBn),
      escapeCsv(p.titleZh),
      escapeCsv(p.titleJa),
      escapeCsv(p.grade),
      escapeCsv(p.origin),
      escapeCsv(p.packaging),
      escapeCsv(p.minOrderQuantity),
      escapeCsv(p.shortDescEn),
      escapeCsv(p.shortDescBn),
      escapeCsv(p.createdAt.toISOString()),
      escapeCsv(p.updatedAt.toISOString()),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "PRODUCTS_CSV_EXPORTED",
        details: JSON.stringify({ count: products.length }),
      },
    });

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="ewc-products-catalogue-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error("Products export error:", error);
    return NextResponse.json({ error: "Failed to export products" }, { status: 500 });
  }
}
