import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== PHASE 2: DATABASE CONTENT & BRAND CLEANUP ===");

  // 1. Move test RAM product to DRAFT status to remove it from public catalogue
  const testRam = await prisma.product.findFirst({
    where: {
      OR: [
        { titleEn: { contains: "Test High Purity Server RAM" } },
        { slug: { contains: "test-high-purity-server-ram" } },
      ],
    },
  });

  if (testRam) {
    const updatedRam = await prisma.product.update({
      where: { id: testRam.id },
      data: {
        status: "DRAFT",
        titleEn: "Server DDR3 & DDR4 RAM Memory Scrap",
        titleBn: "সার্ভার ডিডিআর৩ ও ডিডিআর৪ র‍্যাম স্ক্র্যাপ",
        titleZh: "服务器DDR3与DDR4内存条废料",
        titleJa: "サーバー用DDR3/DDR4メモリスクラップ",
        shortDescEn: "Clean gold-contact server RAM modules sorted in anti-static packaging (Draft lot awaiting client stock verification).",
        minOrderQuantity: "500 kg (Subject to stock confirmation)",
      },
    });
    console.log(`✅ Updated test product to DRAFT status: ${updatedRam.titleEn} (ID: ${updatedRam.id})`);
  } else {
    console.log("ℹ️ No test RAM product found.");
  }

  // 2. Convert 'Test Printed Wire Scrap' category to genuine B2B category
  const testCat = await prisma.category.findFirst({
    where: {
      OR: [
        { nameEn: { contains: "Test Printed Wire Scrap" } },
        { slug: { contains: "test-printed-wire-scrap" } },
      ],
    },
  });

  if (testCat) {
    const updatedCat = await prisma.category.update({
      where: { id: testCat.id },
      data: {
        nameEn: "Insulated Wire & Copper Cable Scrap",
        nameBn: "ইনসুলেটেড তার ও কপার ক্যাবল স্ক্র্যাপ",
        nameZh: "绝缘铜线与通信电缆废料",
        nameJa: "被覆銅線および通信ケーブルスクラップ",
        slug: "insulated-wire-copper-cable",
        descriptionEn: "High-recovery insulated copper wire, communication cables, and wiring harnesses segregated mechanically.",
        descriptionBn: "উচ্চ কপার রিকভারি বিশিষ্ট ইনসুলেটেড তার, কমিউনিকেশন ক্যাবল ও তারের বান্ডেল যা পরিবেশবান্ধব যান্ত্রিক উপায়ে পৃথকীকৃত।",
        descriptionZh: "通信电缆、电源线和工业线束，通过无害化物理机械剥皮分选。",
        descriptionJa: "機械的被覆剥離により有害物質を伴わずに分別された高純度銅通信線・電力線スクラップ。",
      },
    });
    console.log(`✅ Converted test category to legitimate B2B category: ${updatedCat.nameEn} (ID: ${updatedCat.id})`);
  } else {
    console.log("ℹ️ No test category found.");
  }

  // 3. Deactivate leftover temporary QA manager user
  const tempUser = await prisma.user.findFirst({
    where: {
      email: { startsWith: "test_manager_" },
    },
  });

  if (tempUser) {
    const updatedUser = await prisma.user.update({
      where: { id: tempUser.id },
      data: { isActive: false },
    });
    console.log(`✅ Deactivated temporary test user: ${updatedUser.email}`);
  } else {
    console.log("ℹ️ No temporary test user found.");
  }

  // 4. Log audit log for Phase 2 cleanup
  await prisma.auditLog.create({
    data: {
      action: "PHASE_2_BRAND_CLEANUP",
      details: JSON.stringify({
        timestamp: new Date().toISOString(),
        productUnpublishedToDraft: testRam?.id,
        categoryConverted: testCat?.id,
        userDeactivated: tempUser?.id,
      }),
    },
  });

  console.log("=== PHASE 2 CLEANUP COMPLETE ===");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
