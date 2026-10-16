import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding E-Waste Chittagong database...");

  // 1. Create Admins (Guarded for Development Only)
  if (process.env.NODE_ENV === "production" && !process.env.SEED_ADMIN_PASSWORD) {
    console.log("🔒 [SECURITY NOTICE] Production mode detected. Hardcoded default admin seeding bypassed.");
    console.log("   To provision your production Super Admin, execute: node scripts/create-admin.mjs");
  } else {
    const adminPass = process.env.SEED_ADMIN_PASSWORD || "Admin@EWC2026!";
    const managerPass = process.env.SEED_MANAGER_PASSWORD || "Manager@EWC2026!";

    const superAdminPassword = await bcrypt.hash(adminPass, 12);
    const managerPassword = await bcrypt.hash(managerPass, 12);

    const superAdmin = await prisma.user.upsert({
      where: { email: "admin@ewastechittagong.com" },
      update: {},
      create: {
        email: "admin@ewastechittagong.com",
        name: "Chittagong Operations Executive",
        passwordHash: superAdminPassword,
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });

    const contentManager = await prisma.user.upsert({
      where: { email: "manager@ewastechittagong.com" },
      update: {},
      create: {
        email: "manager@ewastechittagong.com",
        name: "Catalogue Content Officer",
        passwordHash: managerPassword,
        role: "CONTENT_MANAGER",
        isActive: true,
      },
    });

    console.log("Users configured:", superAdmin.email, contentManager.email);
  }

  // 2. Categories
  const catPCBs = await prisma.category.upsert({
    where: { slug: "printed-circuit-boards" },
    update: {},
    create: {
      slug: "printed-circuit-boards",
      nameEn: "Printed Circuit Boards (PCBs)",
      nameBn: "প্রিন্টেড সার্কিট বোর্ড (পিসিবি)",
      nameZh: "印刷电路板 (PCB)",
      nameJa: "プリント基板 (PCB)",
      descriptionEn: "High-grade and mid-grade populated and depopulated circuit boards.",
      descriptionBn: "উচ্চ ও মাঝারি মানের বিভিন্ন ধরনের সার্কিট বোর্ড।",
      descriptionZh: "包含高品位服务器主板、通信背板及工业控制板。",
      descriptionJa: "サーバーマザーボード、産業用制御基板、高品質通信基板。",
      imageUrl: "/images/products/pcb-motherboards.jpg",
      displayOrder: 1,
    },
  });

  const catCPUs = await prisma.category.upsert({
    where: { slug: "cpu-processors-ic-scrap" },
    update: {},
    create: {
      slug: "cpu-processors-ic-scrap",
      nameEn: "CPU Processors & IC Scrap",
      nameBn: "সিপিইউ প্রসেসর ও আইসি স্ক্র্যাপ",
      nameZh: "CPU 处理器与芯片集成电路废料",
      nameJa: "CPUプロセッサおよびICスクラップ",
      descriptionEn: "Ceramic and plastic package microprocessors, memory chips, and IC components.",
      descriptionBn: "সিরামিক ও প্লাস্টিক প্যাকেজ মাইক্রোপ্রসেসর ও মেমোরি চিপ।",
      descriptionZh: "陶瓷与树脂封装微处理器、内存颗粒与集成电路芯片。",
      descriptionJa: "セラミック・樹脂パッケージCPU、メモリーチップ、半導体部品。",
      imageUrl: "/images/products/cpu-scrap.jpg",
      displayOrder: 2,
    },
  });

  const catTelecom = await prisma.category.upsert({
    where: { slug: "telecom-networking-scrap" },
    update: {},
    create: {
      slug: "telecom-networking-scrap",
      nameEn: "Telecom & Networking Equipment",
      nameBn: "টেলিকম ও নেটওয়ার্কিং স্ক্র্যাপ",
      nameZh: "通信与网络交换机设备废料",
      nameJa: "通信機器・ネットワーク機器スクラップ",
      descriptionEn: "Telecom transmission boards, server blades, and high-frequency RF components.",
      descriptionBn: "টেলিকম ট্রান্সমিশন বোর্ড এবং সার্ভার ব্লেড।",
      descriptionZh: "基站传输板卡、刀片服务器与高频射频组件。",
      descriptionJa: "通信基地局伝送基板、ブレードサーバー、高周波部品。",
      imageUrl: "/images/products/telecom-boards.jpg",
      displayOrder: 3,
    },
  });

  // 3. Products
  await prisma.product.upsert({
    where: { slug: "server-motherboard-grade-a" },
    update: {},
    create: {
      slug: "server-motherboard-grade-a",
      status: "PUBLISHED",
      isFeatured: true,
      categoryId: catPCBs.id,
      titleEn: "High-Grade Server Motherboard Scrap (Grade A)",
      titleBn: "উচ্চ মানের সার্ভার মাদারবোর্ড স্ক্র্যাপ (গ্রেড এ)",
      titleZh: "高品位企业级服务器主板废料 (A级)",
      titleJa: "高品質サーバーマザーボードスクラップ (グレードA)",
      shortDescEn: "Sorted enterprise dual-socket server boards with multi-layer gold-plated contacts.",
      shortDescBn: "এন্টারপ্রাইজ ডুয়াল-সকেট সার্ভার বোর্ড, বহুস্তর গোল্ড-প্লেটেড সংযোগ সহ।",
      shortDescZh: "严格分选的企业级双路服务器主板，高密度多层镀金引脚。",
      shortDescJa: "厳選されたエンタープライズ向けデュアルソケットサーバー基板。",
      fullDescEn: "Clean, non-shredded dual-socket server motherboards sourced from retired data center equipment. All peripheral brackets, heavy heat sinks, and batteries are carefully removed. High gold and palladium trace content suited for certified hydrometallurgical or pyrometallurgical refiners.",
      fullDescBn: "ডাটা সেন্টার থেকে সংগৃহীত পরিচ্ছন্ন সার্ভার মাদারবোর্ড। ভারী হিটসিংক এবং ব্যাটারি নিরাপদভাবে সরানো হয়েছে। আন্তর্জাতিক ধাতব পরিশোধনকারী প্রতিষ্ঠানের জন্য উপযুক্ত।",
      fullDescZh: "源自数据中心退役机柜的高品位整板。已彻底去除散热器、电池与铁质固定支架。适合有资质的湿法或火法冶炼企业进行贵金属提炼。",
      fullDescJa: "データセンターから回収された高品質サーバー基板。大型ヒートシンクやバッテリーは安全に取り外し済み。公認精錬所向けの貴金属含有原料。",
      grade: "Grade A Industrial",
      origin: "Chittagong, Bangladesh",
      packaging: "1 Metric Ton Super Sacks / Wooden Pallets",
      minOrderQuantity: "1 Metric Ton (20ft Container Available)",
      images: JSON.stringify(["/images/products/pcb-motherboards.jpg"]),
    },
  });

  await prisma.product.upsert({
    where: { slug: "sorted-cpu-ceramic-fiber" },
    update: {},
    create: {
      slug: "sorted-cpu-ceramic-fiber",
      status: "PUBLISHED",
      isFeatured: true,
      categoryId: catCPUs.id,
      titleEn: "Sorted Ceramic & Fiber CPU Processors",
      titleBn: "বাছাইকৃত সিরামিক ও ফাইবার সিপিইউ প্রসেসর",
      titleZh: "精选陶瓷与纤维封装 CPU 处理器",
      titleJa: "選別済みセラミック＆ファイバーCPUプロセッサ",
      shortDescEn: "Clean sorted desktop and server CPUs with intact gold-plated pins.",
      shortDescBn: "ডেস্কটপ এবং সার্ভার থেকে সংগৃহীত অক্ষত পিনযুক্ত সিপিইউ প্রসেসর।",
      shortDescZh: "针脚完好无损的台式机与服务器中央处理器，金引脚完整。",
      shortDescJa: "ピン曲がりの少ないデスクトップおよびサーバー用CPU。",
      fullDescEn: "Sorted mixed processors including legacy ceramic packages and modern fiber PGA/LGA packages. Inspected for pin integrity and free from thermal paste contamination. Export packaged in moisture-resistant drums.",
      fullDescBn: "লেগ্যাসি সিরামিক এবং আধুনিক ফাইবার প্রসেসরের সমন্বয়। পিন অক্ষত এবং আর্দ্রতারোধী ড্রামে প্যাকেজ করা।",
      fullDescZh: "包括经典陶瓷封装及现代纤维PGA/LGA封装处理器。无硅脂污染，采用密封防潮塑料桶包装便于海运。",
      fullDescJa: "クラシックなセラミックおよび近年のファイバーPGA/LGAプロセッサ。防湿ドラム缶にて輸出梱包。",
      grade: "High Precious Metal Yield",
      origin: "Chittagong, Bangladesh",
      packaging: "Sealed Steel / Plastic Drums (50kg net)",
      minOrderQuantity: "100 kg Trial / 1 MT Bulk",
      images: JSON.stringify(["/images/products/cpu-scrap.jpg"]),
    },
  });

  await prisma.product.upsert({
    where: { slug: "telecom-base-station-boards" },
    update: {},
    create: {
      slug: "telecom-base-station-boards",
      status: "PUBLISHED",
      isFeatured: true,
      categoryId: catTelecom.id,
      titleEn: "Telecommunication Base Station Transceiver Boards",
      titleBn: "টেলিযোগাযোগ বেস স্টেশন ট্রান্সসিভার বোর্ড",
      titleZh: "电信通信基站射频收发板卡",
      titleJa: "通信基地局トランシーバー基板スクラップ",
      shortDescEn: "Heavy gold-plated RF power boards and network transmission line modules.",
      shortDescBn: "টেলিকম নেটওয়ার্ক ট্রান্সমিশন এবং আরএফ পাওয়ার মডিউল।",
      shortDescZh: "高厚度镀金射频功率板卡与网络交换中继背板。",
      shortDescJa: "高周波金メッキRF基板およびネットワーク伝送モジュール。",
      fullDescEn: "Sourced from decommissioned cellular base stations and fiber optic exchange units. Features prominent gold-plated connector tabs and RF filters. Segregated and verified under client supervision.",
      fullDescBn: "সেলুলার বেস স্টেশন এবং ফাইবার এক্সচেঞ্জ থেকে প্রাপ্ত। গোল্ড-প্লেটেড ট্যাব সমৃদ্ধ।",
      fullDescZh: "来自退役移动通信基站与光纤交换系统。带有高品质插头镀金指及高频滤波器。",
      fullDescJa: "基地局アンテナ塔および光通信交換機から解体された基板。",
      grade: "Telephony Grade Superior",
      origin: "Chittagong, Bangladesh",
      packaging: "Banded Wooden Crates / Shrink-wrapped Pallets",
      minOrderQuantity: "2 Metric Tons",
      images: JSON.stringify(["/images/products/telecom-boards.jpg"]),
    },
  });

  // 4. Services
  await prisma.service.upsert({
    where: { slug: "enterprise-e-waste-collection" },
    update: {},
    create: {
      slug: "enterprise-e-waste-collection",
      titleEn: "Enterprise E-Waste Intake & Aggregation",
      titleBn: "কর্পোরেট ই-বর্জ্য সংগ্রহ ও একত্রীকরণ",
      titleZh: "企业级退役电子资产合规收集",
      titleJa: "企業向け電子機器廃棄物の適正回収",
      descriptionEn: "Structured bulk collection and traceability documentation for telecom providers, corporations, and technology institutions.",
      descriptionBn: "টেলিকম এবং কর্পোরেট প্রতিষ্ঠানের জন্য স্বচ্ছ নথিযুক্ত বাল্ক সংগ্রহ সেবা।",
      descriptionZh: "为电信运营商、大型金融机构与科技企业提供规范的退役IT资产批量接收与追溯服务。",
      descriptionJa: "通信キャリアや大手企業向けに、トレーサビリティを確保した電子機器の一括引取を実施。",
      iconName: "Truck",
      displayOrder: 1,
      isPublished: true,
    },
  });

  await prisma.service.upsert({
    where: { slug: "manual-grading-segregation" },
    update: {},
    create: {
      slug: "manual-grading-segregation",
      titleEn: "Trained Component Sorting & Grading",
      titleBn: "দক্ষ উপাদানের শ্রেণীবিন্যাস ও গ্রেডিং",
      titleZh: "人工高精度分拣与多级品位鉴定",
      titleJa: "高精度な手作業分別とグレーディング",
      descriptionEn: "Meticulous separation of motherboard grades, IC packages, connectors, copper coils, and aluminum heat dissipators.",
      descriptionBn: "মাদারবোর্ড, আইসি প্যাকেজ, কপার এবং অ্যালুমিনিয়ামের সূক্ষ্ম ও দক্ষ পৃথকীকরণ।",
      descriptionZh: "经验丰富的人工作业，精准区分服务器板、普通PC板、芯片引脚及铜铝散热器。",
      descriptionJa: "マザーボード、ICパッケージ、コネクタ端子、銅・アルミを高い基準で分類。",
      iconName: "Cpu",
      displayOrder: 2,
      isPublished: true,
    },
  });

  await prisma.service.upsert({
    where: { slug: "b2b-export-material-supply" },
    update: {},
    create: {
      slug: "b2b-export-material-supply",
      titleEn: "International B2B Supply & Logistics",
      titleBn: "আন্তর্জাতিক B2B সরবরাহ ও লজিস্টিকস",
      titleZh: "国际大宗 B2B 循环原料直供",
      titleJa: "国際B2B原料供給・港湾ロジスティクス",
      descriptionEn: "Reliable bulk container preparation, export documentation, and maritime dispatch via Chittagong Port.",
      descriptionBn: "চট্টগ্রাম বন্দরের মাধ্যমে কন্টেইনার প্রস্তুতি, রপ্তানি কাগজপত্র ও নিরাপদ চালান।",
      descriptionZh: "依托吉大港出海口天然优势，提供正规集装箱装箱、海运提单及报关支持。",
      descriptionJa: "チッタゴン港の地の利を活かしたコンテナ手配、輸出書類作成、確実な海上輸送。",
      iconName: "Ship",
      displayOrder: 3,
      isPublished: true,
    },
  });

  // 5. Initial Sample Inquiry to demonstrate the Pipeline in Admin
  const sampleInquiry = await prisma.inquiry.upsert({
    where: { referenceNo: "EWC-2026-1001" },
    update: {},
    create: {
      referenceNo: "EWC-2026-1001",
      status: "NEW",
      name: "Tatsuya Takahashi",
      companyName: "Nippon Eco Metals Ltd.",
      email: "procurement@nipponecometals.jp",
      phoneOrWhatsApp: "+81 3 5555 0192",
      country: "Japan",
      interestedCategory: "Printed Circuit Boards (PCBs)",
      estimatedQty: "5 Metric Tons (Trial)",
      message: "We are an authorized precious metal refiner in Osaka. We wish to inquire about regular monthly supply terms for Grade A server motherboard scrap and trial shipment packaging options.",
      adminNotes: "Initial buyer inquiry received. Verified business domain. Preparing standard technical specification sheet and Chittagong FOB terms.",
    },
  });

  console.log("Database seeded successfully with verified categories, products, and sample pipeline inquiry!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
