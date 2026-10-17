import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  console.log("=== 1. CATEGORIES INSPECTION ===");
  const categories = await prisma.category.findMany({
    include: {
      products: { select: { id: true, titleEn: true, status: true } },
    },
    orderBy: { displayOrder: "asc" },
  });

  for (const c of categories) {
    console.log(`\nCategory: [${c.id}] ${c.nameEn}`);
    console.log(`- Slug: ${c.slug}`);
    console.log(`- Published: ${c.isPublished}`);
    console.log(`- Assigned Products: ${c.products.length}`);
    for (const p of c.products) {
      console.log(`  * ${p.titleEn} (Status: ${p.status})`);
    }
  }

  console.log("\n=== 2. PRODUCTS INSPECTION ===");
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "asc" },
  });

  for (const p of products) {
    console.log(`\nProduct: [${p.id}] ${p.titleEn}`);
    console.log(`- Slug: ${p.slug}`);
    console.log(`- Category: ${p.category?.nameEn}`);
    console.log(`- Status: ${p.status}`);
    console.log(`- Featured: ${p.isFeatured}`);
    console.log(`- Grade: ${p.grade}`);
    console.log(`- Origin: ${p.origin}`);
    console.log(`- Packaging: ${p.packaging}`);
    console.log(`- MOQ: ${p.minOrderQuantity}`);
    console.log(`- Supply Capacity: ${p.supplyCapacity || "N/A"}`);
    console.log(`- Price Info: ${p.priceInfo || "Inquire for quote"}`);
    console.log(`- Images count: ${(p.images || []).length}`);
    console.log(`- First Image: ${(p.images || [])[0] || "None"}`);
  }

  console.log("\n=== 3. GALLERY ASSETS INSPECTION ===");
  const gallery = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "asc" },
  });
  console.log(`Total Gallery Items: ${gallery.length}`);
  const verified = gallery.filter((g) => g.isVerified);
  const illustrative = gallery.filter((g) => !g.isVerified);
  console.log(`Verified Assets: ${verified.length}`);
  console.log(`Illustrative Assets: ${illustrative.length}`);

  console.log("\nVerified Asset Samples (first 5):");
  for (const g of verified.slice(0, 5)) {
    console.log(`- [${g.id}] ${g.titleEn} | Type: ${g.mediaType} | Cat: ${g.category} | Verified: ${g.isVerified}`);
    console.log(`  URL: ${g.imageUrl.slice(0, 60)}...`);
  }

  console.log("\nIllustrative Asset Samples:");
  for (const g of illustrative) {
    console.log(`- [${g.id}] ${g.titleEn} | Type: ${g.mediaType} | Cat: ${g.category} | Verified: ${g.isVerified}`);
    console.log(`  URL: ${g.imageUrl.slice(0, 60)}...`);
  }

  console.log("\n=== 4. INQUIRIES BREAKDOWN ===");
  const totalInquiries = await prisma.inquiry.count();
  const testInquiries = await prisma.inquiry.count({
    where: {
      OR: [
        { email: { contains: "auditor" } },
        { email: { contains: "test" } },
        { companyName: { contains: "Auditor" } },
        { companyName: { contains: "Test" } },
        { companyName: { contains: "Tokyo Precious Refining KK" } },
        { companyName: { contains: "Singapore Metallurgy Pte Ltd" } },
      ],
    },
  });
  const customerInquiries = totalInquiries - testInquiries;
  console.log(`Total Inquiries: ${totalInquiries}`);
  console.log(`QA/Test Inquiries: ${testInquiries}`);
  console.log(`Genuine/Client Inquiries: ${customerInquiries}`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
