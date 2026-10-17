import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("=== DATABASE TARGET AUDIT ===");
  const dbUrl = process.env.DATABASE_URL || "";
  try {
    const u = new URL(dbUrl);
    console.log(`Database Protocol: ${u.protocol}`);
    console.log(`Database Host:     ${u.host}`);
    console.log(`Database Name:     ${u.pathname}`);
    console.log(`SSL Mode:          ${u.searchParams.get("sslmode")}`);
    console.log(`Pooler Endpoint:   ${u.host.includes("pooler") ? "Yes (PgBouncer/Neon)" : "Direct"}`);
  } catch (err) {
    console.log("Could not parse URL format safely:", err.message);
  }

  // Check what Vercel has for production vs preview:
  // In vercel, environment variables are typically set per project. Let's inspect git tracked env files.
  console.log("\n=== CHECKING TRACKED / LOCAL ENV FILES ===");
  for (const f of [".env", ".env.local", ".env.example", ".env.production", ".env.staging"]) {
    if (fs.existsSync(f)) {
      console.log(`File exists: ${f}`);
    }
  }

  // Inspect records created in recent QA runs:
  console.log("\n=== INSPECTING INQUIRIES FOR TEST ARTIFACTS ===");
  const testInquiries = await prisma.inquiry.findMany({
    where: {
      OR: [
        { referenceNo: { startsWith: "EWC-2026-" } },
        { email: { contains: "auditor" } },
        { email: { contains: "test" } },
        { companyName: { contains: "Auditor" } },
        { companyName: { contains: "Test" } },
        { message: { contains: "QA" } },
        { message: { contains: "audit" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      referenceNo: true,
      name: true,
      companyName: true,
      email: true,
      country: true,
      status: true,
      createdAt: true,
      adminNotes: true,
      message: true,
    },
  });

  console.log(`Found ${testInquiries.length} inquiries matching audit/test patterns:`);
  for (const inq of testInquiries) {
    console.log(`- ID: ${inq.id} | Ref: ${inq.referenceNo} | Company: ${inq.companyName} | Email: ${inq.email} | Status: ${inq.status} | Created: ${inq.createdAt.toISOString()}`);
    console.log(`  Notes: ${inq.adminNotes || "none"}`);
    console.log(`  Msg: ${inq.message.slice(0, 80)}...`);
  }

  // Inspect Products:
  console.log("\n=== INSPECTING PRODUCTS FOR TEST ARTIFACTS ===");
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      titleEn: true,
      slug: true,
      status: true,
      isFeatured: true,
      grade: true,
      minOrderQuantity: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  console.log(`Total Products: ${products.length}`);
  for (const p of products) {
    console.log(`- ID: ${p.id} | Title: ${p.titleEn} | Status: ${p.status} | Featured: ${p.isFeatured} | MOQ: ${p.minOrderQuantity} | Slug: ${p.slug} | Created: ${p.createdAt.toISOString()}`);
  }

  // Inspect Categories:
  console.log("\n=== INSPECTING CATEGORIES ===");
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { displayOrder: "asc" },
  });
  console.log(`Total Categories: ${categories.length}`);
  for (const c of categories) {
    console.log(`- ID: ${c.id} | NameEn: ${c.nameEn} | Slug: ${c.slug} | Products Count: ${c._count.products}`);
  }

  // Inspect Audit Logs for test entries:
  console.log("\n=== INSPECTING RECENT AUDIT LOGS ===");
  const recentLogs = await prisma.auditLog.findMany({
    take: 15,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true, role: true } },
    },
  });
  console.log(`Recent 15 Audit Logs:`);
  for (const log of recentLogs) {
    console.log(`- ID: ${log.id} | Action: ${log.action} | Actor: ${log.user?.email || "anonymous"} | Time: ${log.createdAt.toISOString()} | Details: ${log.details.slice(0, 70)}...`);
  }
}

main()
  .catch((e) => {
    console.error("Audit error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
