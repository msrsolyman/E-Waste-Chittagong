import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding gallery items...");

  const items = [
    {
      titleEn: "Clean Disassembly & Aluminum Segregation Workstation",
      titleBn: "অ্যালুমিনিয়াম পৃথকীকরণ ও পরিষ্কার ডিসঅ্যাসেম্বলি ওয়ার্কস্টেশন",
      titleZh: "规范化无害拆解与铝制散热件分选工作台",
      titleJa: "アルミヒートシンクおよび筐体パーツの適正手解体・選別ライン",
      caption: "Technician safely dismantling computer assemblies and segregating aluminum cooling blocks.",
      imageUrl: "/images/products/facility-dismantling.jpg",
      category: "FACILITY",
      isVerified: true,
    },
    {
      titleEn: "High-Grade Server Motherboard PCB Batches",
      titleBn: "উচ্চ মানের সার্ভার মাদারবোর্ড পিসিবি ব্যাচ",
      titleZh: "高品位企业级服务器双路主板整板归集",
      titleJa: "高品位サーバー用マザーボードおよびメモリーモジュール",
      caption: "Carefully sorted dual-socket server boards awaiting palletized export packing.",
      imageUrl: "/images/products/pcb-motherboards.jpg",
      category: "MATERIAL",
      isVerified: true,
    },
    {
      titleEn: "Ceramic & Fiber CPU Processors Sorting Trays",
      titleBn: "সিরামিক ও ফাইবার সিপিইউ প্রসেসর বাছাইকরণ ট্রে",
      titleZh: "高纯度陶瓷与树脂微处理器分类料盘",
      titleJa: "ピン折れのない選別済みセラミック＆ファイバーCPU",
      caption: "Gleaming gold-pinned CPUs organized by pin density and package architecture.",
      imageUrl: "/images/products/cpu-scrap.jpg",
      category: "MATERIAL",
      isVerified: true,
    },
    {
      titleEn: "Telecommunications & Base Station Network Boards",
      titleBn: "টেলিযোগাযোগ ও বেস স্টেশন নেটওয়ার্ক বোর্ড",
      titleZh: "退役电信基站高频射频板卡与厚镀金背板",
      titleJa: "通信基地局トランシーバーおよび厚膜金メッキ基板",
      caption: "Heavy gold-plated RF transceiver cards segregated from telecom equipment.",
      imageUrl: "/images/products/telecom-boards.jpg",
      category: "DISMANTLING",
      isVerified: true,
    },
    {
      titleEn: "Circular Electronics Resource Recovery Concept",
      titleBn: "সার্কুলার ইলেকট্রনিক্স রিসোর্স রিকভারি কনসেপ্ট",
      titleZh: "闭环循环经济与城市矿产绿色冶炼概念示意",
      titleJa: "サーキュラーエコノミー・都市鉱山リサイクル概念図",
      caption: "Illustrating the closed-loop recovery of copper, precious metals, and clean substrate.",
      imageUrl: "/images/concepts/circular-hero.jpg",
      category: "PROCESSING",
      isVerified: false,
    },
  ];

  for (const item of items) {
    const existing = await prisma.galleryItem.findFirst({
      where: { titleEn: item.titleEn },
    });
    if (!existing) {
      await prisma.galleryItem.create({ data: item });
    }
  }

  console.log("Gallery seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
