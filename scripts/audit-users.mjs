import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
  console.log("Current Database Users:", JSON.stringify(users, null, 2));

  const inquiriesCount = await prisma.inquiry.count();
  const productsCount = await prisma.product.count();
  const categoriesCount = await prisma.category.count();
  const galleryCount = await prisma.galleryItem.count();
  console.log(`Data count - Inquiries: ${inquiriesCount}, Products: ${productsCount}, Categories: ${categoriesCount}, Gallery: ${galleryCount}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
