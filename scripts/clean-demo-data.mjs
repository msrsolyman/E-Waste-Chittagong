import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== STEP 1: Current Database Status ===");
  const products = await prisma.product.findMany({
    select: { id: true, titleEn: true, titleBn: true, slug: true, categoryId: true },
  });
  console.log("Products found:", products.length);
  for (const p of products) {
    console.log(` - ID: ${p.id} | Slug: ${p.slug} | Title: ${p.titleEn}`);
  }

  const inquiriesCount = await prisma.inquiry.count();
  console.log("Current inquiries count:", inquiriesCount);

  const auditLogsCount = await prisma.auditLog.count();
  console.log("Current audit logs count:", auditLogsCount);

  const categoriesCount = await prisma.category.count();
  console.log("Categories count:", categoriesCount);

  const galleryCount = await prisma.galleryItem.count();
  console.log("Gallery items count:", galleryCount);

  const usersCount = await prisma.user.count();
  console.log("Users count:", usersCount);

  console.log("\n=== STEP 2: Cleaning Demo Inquiries & Audit Logs ===");
  const deletedInquiries = await prisma.inquiry.deleteMany({});
  console.log(`Deleted ${deletedInquiries.count} demo inquiries.`);

  const deletedLogs = await prisma.auditLog.deleteMany({});
  console.log(`Deleted ${deletedLogs.count} dev audit logs.`);

  console.log("\n=== STEP 3: Fixing Demo Product Slugs / Titles ===");
  const dirtyProduct = products.find((p) => p.slug.includes("test"));
  if (dirtyProduct) {
    console.log(`Found dirty product slug: ${dirtyProduct.slug}`);
    const updated = await prisma.product.update({
      where: { id: dirtyProduct.id },
      data: {
        slug: "server-ddr3-ddr4-ram-memory-scrap",
        titleEn: dirtyProduct.titleEn.replace(/^TEST:\s*/i, "").replace(/^Test\s*/i, ""),
      },
    });
    console.log(`Updated product: ID: ${updated.id} | New Slug: ${updated.slug} | Title: ${updated.titleEn}`);
  } else {
    console.log("No dirty product slugs found.");
  }

  console.log("\n=== STEP 4: Creating Launch Audit Record ===");
  const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (adminUser) {
    await prisma.auditLog.create({
      data: {
        userId: adminUser.id,
        action: "SYSTEM_LAUNCH_INITIALIZE",
        details: JSON.stringify({
          domain: "https://www.ewastechittagong.com",
          message: "Production launch state prepared. Demo inquiries cleaned, canonical URLs set.",
          timestamp: new Date().toISOString(),
        }),
        ipAddress: "127.0.0.1",
      },
    });
    console.log("Created launch audit record for admin user:", adminUser.email);
  }

  console.log("\n=== STEP 5: Verification of Clean State ===");
  const finalInquiries = await prisma.inquiry.count();
  const finalLogs = await prisma.auditLog.count();
  const finalProducts = await prisma.product.findMany({ select: { slug: true, titleEn: true } });

  console.log("Final Inquiries Count:", finalInquiries);
  console.log("Final Audit Logs Count:", finalLogs);
  console.log("Final Products:", finalProducts);
}

main()
  .catch((e) => {
    console.error("Error executing clean script:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
