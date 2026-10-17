import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { category: true, inquiries: true },
  });
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  });
  const inquiries = await prisma.inquiry.findMany();
  const gallery = await prisma.galleryItem.findMany();
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true },
  });
  const auditLogs = await prisma.auditLog.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
  });
  const settings = await prisma.companySetting.findMany();

  console.log("=== DATABASE AUDIT SUMMARY ===");
  console.log(`Products: ${products.length}`);
  console.log(`Categories: ${categories.length}`);
  console.log(`Inquiries: ${inquiries.length}`);
  console.log(`Gallery Items: ${gallery.length}`);
  console.log(`Users: ${users.length}`);
  console.log(`Audit Logs: ${auditLogs.length}`);
  console.log(`Company Settings: ${settings.length}`);

  console.log("\n--- PRODUCTS DETAIL ---");
  products.forEach((p) => {
    console.log(`- [${p.status}] ${p.titleEn} (Slug: ${p.slug}, Grade: ${p.grade}, MOQ: ${p.minOrderQuantity}, Inquiries linked: ${p.inquiries.length})`);
  });

  console.log("\n--- CATEGORIES DETAIL ---");
  categories.forEach((c) => {
    console.log(`- ${c.nameEn} (Slug: ${c.slug}, Products count: ${c._count.products})`);
  });

  console.log("\n--- USERS DETAIL ---");
  users.forEach((u) => {
    console.log(`- ${u.name} <${u.email}> | Role: ${u.role} | Active: ${u.isActive}`);
  });

  console.log("\n--- INQUIRIES DETAIL ---");
  inquiries.forEach((i) => {
    console.log(`- ${i.referenceNumber} | Status: ${i.status} | Company: ${i.companyName} | From: ${i.fullName} <${i.email}>`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
