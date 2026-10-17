import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("Reading Cloudinary media manifest...");
  const manifestPath = path.join(process.cwd(), "scripts", "cloudinary-media.json");
  const mediaItems = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

  console.log(`Loaded ${mediaItems.length} media items.`);

  // 1. Curate and insert Gallery items
  const gallerySeedData = [
    // --- PHOTOS (19 ITEMS) ---
    {
      index: 0,
      category: "MATERIAL",
      titleEn: "High-Grade Server & Desktop Motherboard Scrap Lot",
      titleBn: "উচ্চ গ্রেডের সার্ভার ও ডেস্কটপ মাদারবোর্ড স্ক্র্যাপ লট",
      titleZh: "高等级服务器与台式机主板废料批次",
      titleJa: "高品位サーバー・デスクトップマザーボード基板スクラップ",
      caption: "Sorted printed circuit boards segregated by component density and gold-plated contact fingers ready for international smelt recovery.",
    },
    {
      index: 1,
      category: "DISMANTLING",
      titleEn: "Manual PCB Depopulation & Hazardous Component Removal",
      titleBn: "ম্যানুয়াল পিসিবি কম্পোনেন্ট পৃথকীকরণ ও ঝুঁকিমুক্ত নিষ্কাশন",
      titleZh: "印刷电路板手工拆解与危险元件环保分离",
      titleJa: "手解体による基板コンポーネント選別と有害物質安全除去",
      caption: "Careful manual segregation of capacitors, batteries, and heat sinks following strict mechanical safety protocols.",
    },
    {
      index: 2,
      category: "MATERIAL",
      titleEn: "Sorted Ceramic & High-Density CPU IC Chips",
      titleBn: "বাছাইকৃত সিরামিক ও হাই-ডেনসিটি সিপিইউ আইসি চিপস",
      titleZh: "精选陶瓷与高密度中央处理器IC芯片",
      titleJa: "選別済みセラミック・高密度CPU・ICチップスクラップ",
      caption: "Pre-concentrated gold-bearing processor chips organized in dedicated inspection lots for precious metal reclamation.",
    },
    {
      index: 3,
      category: "MATERIAL",
      titleEn: "Telecommunication Base Station Circuit Boards",
      titleBn: "টেলিকমিউনিকেশন বেস স্টেশন সার্কিট বোর্ড স্ক্র্যাপ",
      titleZh: "电信通信基站收发专用高规格电路板",
      titleJa: "通信基地局向け高品位送受信トランシーバー基板",
      caption: "Heavy-duty multilayer gold-finger telecom boards prepared for containerized export from Chittagong seaport.",
    },
    {
      index: 4,
      category: "FACILITY",
      titleEn: "Chittagong Staging Warehouse & Inbound Material Intake",
      titleBn: "চট্টগ্রাম ওয়্যারহাউস ও প্রাথমিক স্ক্র্যাপ উপাদান ইনটেক",
      titleZh: "吉大港仓储分选区及进场物料验收称重",
      titleJa: "チッタゴン倉庫における入荷スクラップ受入・初期計量ステージ",
      caption: "Initial visual inspection, weighbridge logging, and moisture check upon receipt of commercial e-waste batches.",
    },
    {
      index: 5,
      category: "DISMANTLING",
      titleEn: "Computer Chassis Stripping & Metal Segregation",
      titleBn: "কম্পিউটার চেসিস স্ট্রিপিং ও ধাতু পৃথকীকরণ লাইন",
      titleZh: "电脑主机机箱拆解与钢铝金属严格分类",
      titleJa: "PC筐体解体ラインおよび鉄・アルミ非鉄金属精密分別",
      caption: "Mechanical unscrewing and sorting of galvanized steel casing, aluminum side panels, and internal frames.",
    },
    {
      index: 6,
      category: "PROCESSING",
      titleEn: "Heat Sink & Clean Aluminum Extrusion Collection",
      titleBn: "হিট সিঙ্ক ও পরিষ্কার অ্যালুমিনিয়াম পৃথকীকরণ",
      titleZh: "铝制散热器及高纯度挤压铝分类收集",
      titleJa: "アルミヒートシンクおよび高純度押し出しアルミの回収",
      caption: "Pure extruded aluminum heat dissipation blocks separated without chemical solvents.",
    },
    {
      index: 7,
      category: "DISMANTLING",
      titleEn: "Power Supply Unit (PSU) Copper Recovery Workstation",
      titleBn: "পাওয়ার সাপ্লাই ইউনিট (পিএসইউ) কপার রিকভারি স্টেশন",
      titleZh: "开关电源单元(PSU)拆解与铜变压器回收工位",
      titleJa: "電源ユニット(PSU)解体および銅トランス・配線回収ライン",
      caption: "Safe dismounting of copper transformers, ferrite cores, and wiring harnesses from power supplies.",
    },
    {
      index: 8,
      category: "PROCESSING",
      titleEn: "Insulated Wire & Copper Cable Bundling",
      titleBn: "ইনসুলেটেড ওয়্যার ও কপার ক্যাবল গ্রেডিং ও বান্ডলিং",
      titleZh: "绝缘铜线与通信电缆分选捆扎",
      titleJa: "被覆銅線および通信ケーブルの品位別結束・仕分け",
      caption: "Sorting high-recovery copper cords and ribbon cables for mechanical granulation.",
    },
    {
      index: 9,
      category: "FACILITY",
      titleEn: "Primary Sorting Bins & Grade Classification Rows",
      titleBn: "প্রাইমারি বাছাই বিন ও গ্রেড অনুযায়ী পৃথকীকরণ সারি",
      titleZh: "初级分选料箱与按品级规范化陈列分类区",
      titleJa: "初期分別保管ビンおよび品位別ステージングエリア",
      caption: "Systematic compartmentalization of Grade A, B, and C electronic components for quality assurance.",
    },
    {
      index: 10,
      category: "MATERIAL",
      titleEn: "Green Soldered Memory & Server RAM Modules",
      titleBn: "সার্ভার ও ডেস্কটপ র‍্যাম (RAM) মেমোরি মডিউল স্ক্র্যাপ",
      titleZh: "服务器与桌面内存条(RAM)模组废料",
      titleJa: "サーバーおよびデスクトップ用高品位RAMメモリモジュール",
      caption: "Clean gold-contact memory sticks collected in uniform containers for smelting batches.",
    },
    {
      index: 11,
      category: "MATERIAL",
      titleEn: "Peripheral Board & Low-Grade Electronic Scrap",
      titleBn: "পেরিফেরাল বোর্ড ও স্ট্যান্ডার্ড ইলেকট্রনিক স্ক্র্যাপ",
      titleZh: "外部设备扩展卡与常规低等级电子废料",
      titleJa: "各種周辺機器基板および低品位プリント基板スクラップ",
      caption: "Sound cards, PCI cards, and power regulator circuit boards segregated from main computing units.",
    },
    {
      index: 12,
      category: "PROCESSING",
      titleEn: "Super Sack Packaging for Maritime Bulk Export",
      titleBn: "আন্তর্জাতিক সমুদ্র পরিবহনের জন্য সুপার স্যাক প্যাকেজিং",
      titleZh: "海运大宗出口专用吨袋强化包装规范",
      titleJa: "海上コンテナバルク輸出向けフレコンバッグ強化梱包",
      caption: "Reinforced 1-ton woven polypropylene bags with moisture-resistant lining sealed for container loading.",
    },
    {
      index: 13,
      category: "FACILITY",
      titleEn: "Workplace Safety & Protective Equipment Compliance",
      titleBn: "কর্মক্ষেত্রের নিরাপত্তা ও প্রতিরক্ষামূলক সরঞ্জাম নিশ্চিতকরণ",
      titleZh: "车间职业安全防范与作业劳动保护穿戴",
      titleJa: "作業員安全衛生保護具（PPE）着用および適正作業環境",
      caption: "Strict adherence to cut-resistant gloves, dust protection, and ergonomic sorting stations at Chittagong facility.",
    },
    {
      index: 14,
      category: "MATERIAL",
      titleEn: "Bulk Mixed Circuit Board Staging Area",
      titleBn: "বাল্ক মিশ্র সার্কিট বোর্ড স্টেজিং ও গ্রেডিং এরিয়া",
      titleZh: "混合电路板大宗分级暂存与质检区",
      titleJa: "混合基板バルク選別ステージングおよび目視検査エリア",
      caption: "Incoming shipment staging before robotic and manual segregation pipelines.",
    },
    {
      index: 15,
      category: "DISMANTLING",
      titleEn: "CRT & Flat Panel Display Non-Hazardous Deconstruction",
      titleBn: "মনিটর ও ডিসপ্লে স্ক্রিনের পরিবেশবান্ধব ডিসঅ্যাসেম্বলি",
      titleZh: "显示设备与液晶面板环境友好型无害化分离",
      titleJa: "ディスプレイおよびモニターの安全手解体・部材分別",
      caption: "Controlled separation of plastic bezels, backlights, and driver logic boards.",
    },
    {
      index: 16,
      category: "MATERIAL",
      titleEn: "Industrial Transformer & Heavy Copper Windings",
      titleBn: "ইন্ডাস্ট্রিয়াল ট্রান্সফরমার ও হেভি কপার উইন্ডিং স্ক্র্যাপ",
      titleZh: "工业变压器与重型高导电铜线圈线圈废料",
      titleJa: "産業用トランスおよび高純度重量銅コイルスクラップ",
      caption: "High purity heavy copper extraction from decommissioned industrial electronics.",
    },
    {
      index: 17,
      category: "FACILITY",
      titleEn: "Quality Assurance & Lot Weighing Terminal",
      titleBn: "মান নিয়ন্ত্রণ ও লট ওজন পরিমাপক টার্মিনাল",
      titleZh: "出厂质量检验与批次精准校准地磅终端",
      titleJa: "品質検査およびロット精密計量・記録ターミナル",
      caption: "Certified calibrated industrial scales ensuring 100% transparency on gross, tare, and net tonnage.",
    },
    {
      index: 18,
      category: "PROCESSING",
      titleEn: "Final Inspection & Container Load Verification",
      titleBn: "চূড়ান্ত পরিদর্শন ও কনটেইনার লোডিং প্রস্তুতি",
      titleZh: "出货终检与海运集装箱装箱合规查验",
      titleJa: "最終検品および輸出用海上コンテナ積載前監査",
      caption: "Pre-shipment photo documentation and seal inspection before dispatch to Chittagong port terminals.",
    },

    // --- VIDEOS (15 ITEMS) ---
    {
      index: 19,
      category: "FACILITY",
      titleEn: "Live Facility Tour: Sorting Floor & Material Handling (Video)",
      titleBn: "সরাসরি কারখানা পরিদর্শন: বাছাই ফ্লোর ও উপাদান পরিচালনা (ভিডিও)",
      titleZh: "实地厂区动态直击：分选车间与物料流转（视频）",
      titleJa: "現場ツアー：選別フロアと原料ハンドリング動線（動画）",
      caption: "Overview footage of our active Chittagong electronic waste disassembly workshop.",
    },
    {
      index: 20,
      category: "DISMANTLING",
      titleEn: "Precision Manual Motherboard Sorting in Action (Video)",
      titleBn: "পিসিবির সূক্ষ্ম ম্যানুয়াল গ্রেডিং ও বাছাই কার্যক্রম (ভিডিও)",
      titleZh: "高精手工主板分选与分级实况演示（视频）",
      titleJa: "高精度マザーボード手選別とグレード査定実況（動画）",
      caption: "Trained operators assessing board trace density and segregating high-grade server units.",
    },
    {
      index: 21,
      category: "MATERIAL",
      titleEn: "Bulk Electronic Scrap Inspection & Weighing (Video)",
      titleBn: "বাল্ক ইলেকট্রনিক স্ক্র্যাপের গুণমান পরীক্ষা ও ওজন (ভিডিও)",
      titleZh: "大宗电子物料质检抽样与校准称重过程（视频）",
      titleJa: "電子スクラップのバルク受入検査と計量作業（動画）",
      caption: "Transparent weighing and batch verification of sorted electronic materials.",
    },
    {
      index: 22,
      category: "PROCESSING",
      titleEn: "Comprehensive E-Waste Processing & Material Flow (Video)",
      titleBn: "সম্পূর্ণ ই-বর্জ্য প্রক্রিয়াকরণ ও মেকানিক্যাল ফ্লো (ভিডিও)",
      titleZh: "全流程电子废弃物规范化物理处理与物料动线（视频）",
      titleJa: "電子廃棄物の総合物理処理・選別オペレーション全景（動画）",
      caption: "Full overview of how decommissioned enterprise equipment transforms into segregated recyclable fractions.",
    },
    {
      index: 23,
      category: "DISMANTLING",
      titleEn: "Rapid Mechanical Casing Disassembly (Video)",
      titleBn: "দ্রুত মেকানিক্যাল কেসিং বিযুক্তি কার্যক্রম (ভিডিও)",
      titleZh: "高效机箱金属壳体物理机械解体作业（视频）",
      titleJa: "筐体金具の迅速機械手解体および素材分離作業（動画）",
      caption: "Efficient disassembly using precision pneumatic and manual hand tools.",
    },
    {
      index: 24,
      category: "FACILITY",
      titleEn: "Inbound Scrap Unloading & Floor Segregation (Video)",
      titleBn: "ইনবাউন্ড স্ক্র্যাপ আনলোডিং ও প্রাথমিক ফ্লোর বাছাই (ভিডিও)",
      titleZh: "进厂大宗散料卸运与现场定点快速初分（视频）",
      titleJa: "入荷スクラップ荷降ろし作業および初期選別プロセス（動画）",
      caption: "High-volume inbound trucks unloading corporate e-scrap lots under supervision.",
    },
    {
      index: 25,
      category: "PROCESSING",
      titleEn: "Wire Stripping & Pure Copper Recovery (Video)",
      titleBn: "ক্যাবল স্ট্রিপিং ও খাঁটি তামা নিষ্কাশন (ভিডিও)",
      titleZh: "通信绝缘线缆剥皮与纯铜导体回收作业（视频）",
      titleJa: "通信・電源線の被覆剥離および高純度銅回収作業（動画）",
      caption: "Solvent-free mechanical isolation of bare bright copper conductors.",
    },
    {
      index: 26,
      category: "MATERIAL",
      titleEn: "Gold Finger & High-Purity Connector Sorting (Video)",
      titleBn: "গোল্ড ফিঙ্গার ও উচ্চ ঘনত্বের কানেক্টর বাছাই (ভিডিও)",
      titleZh: "高价值金手指插槽与镀金端子精选实况（视频）",
      titleJa: "金メッキ端子およびエッジコネクタの高純度選別（動画）",
      caption: "Careful trimming and sorting of high-value gold connector edges.",
    },
    {
      index: 27,
      category: "FACILITY",
      titleEn: "Extensive Warehouse Operations & Inventory Review (Video)",
      titleBn: "বিস্তৃত ওয়্যারহাউস কার্যক্রম ও ইনভেন্টরি তদারকি (ভিডিও)",
      titleZh: "立体化仓储库区常态化作业与库存盘点管理（视频）",
      titleJa: "大規模倉庫における日常オペレーションと在庫点検（動画）",
      caption: "Organized staging bays with clearly labeled batch cards ready for customer audit.",
    },
    {
      index: 28,
      category: "DISMANTLING",
      titleEn: "Server Rack & Network Switch Breakdown (Video)",
      titleBn: "সার্ভার র্যাক ও নেটওয়ার্ক সুইচ ডিসঅ্যাসেম্বলি (ভিডিও)",
      titleZh: "企业级服务器机柜与交换机结构破拆分解（视频）",
      titleJa: "エンタープライズサーバーラックおよびSWハブの解体（動画）",
      caption: "Disassembling multi-gigabit enterprise communications equipment safely.",
    },
    {
      index: 29,
      category: "PROCESSING",
      titleEn: "Aluminum Heatsink Batch Cleaning & Compacting (Video)",
      titleBn: "অ্যালুমিনিয়াম হিট সিঙ্ক ব্যাচ ক্লিনিং ও কম্প্যাক্টিং (ভিডিও)",
      titleZh: "铝制散热模组整批清理与压块打包作业（视频）",
      titleJa: "アルミヒートシンクの一括クリーニングと結束圧縮（動画）",
      caption: "Packaging high-thermal conductivity extruded aluminum scrap without contamination.",
    },
    {
      index: 30,
      category: "MATERIAL",
      titleEn: "Printed Circuit Board Classification by Grade (Video)",
      titleBn: "সার্কিট বোর্ডের গ্রেড ভিত্তিক বৈজ্ঞানিক শ্রেণীকরণ (ভিডিও)",
      titleZh: "按线路板含金量与多层工艺多品级精细划分（视频）",
      titleJa: "多層基板・配線密度に基づくグレード別精密選別（動画）",
      caption: "Demonstration of our visual sorting criteria following ISRI e-scrap specifications.",
    },
    {
      index: 31,
      category: "PROCESSING",
      titleEn: "Super Bag Tying & Container Palletizing (Video)",
      titleBn: "সুপার ব্যাগ টাই ও কনটেইনার প্যালেটাইজিং (ভিডিও)",
      titleZh: "防潮吨袋加固封口与标准托盘码垛实操（视频）",
      titleJa: "フレコンバッグの堅牢封かんおよびパレット積み付け（動画）",
      caption: "Secure packaging meeting strict maritime freight compliance standards.",
    },
    {
      index: 32,
      category: "FACILITY",
      titleEn: "Daily Floor Cleanliness & Zero-Acid Compliance (Video)",
      titleBn: "দৈনিক কাজের পরিচ্ছন্নতা ও জিরো-অ্যাসিড নীতি পরিপালন (ভিডিও)",
      titleZh: "作业区清洁度维护与绝对杜绝强酸水洗安全承诺（视频）",
      titleJa: "構内クレンリネスの維持と非薬品・無酸処理の厳守（動画）",
      caption: "Dry mechanical methods only: no toxic leaching, no open burning, 100% workplace safety.",
    },
    {
      index: 33,
      category: "PROCESSING",
      titleEn: "Final Port Export Container Sealing & Dispatch (Video)",
      titleBn: "চট্টগ্রাম বন্দর কনটেইনার সিলিং ও রপ্তানি প্রেরণা (ভিডিও)",
      titleZh: "吉大港海运集装箱施加海关封条与装船发运（视频）",
      titleJa: "チッタゴン港輸出コンテナ封かんおよび出航準備（動画）",
      caption: "Completing 40-foot shipping container loading for direct sea voyage to global refineries.",
    },
  ];

  console.log("Upserting all 34 verified media items into GalleryItem database...");

  // Clear existing items or update them
  await prisma.galleryItem.deleteMany({});

  for (const item of gallerySeedData) {
    const media = mediaItems[item.index];
    if (!media) {
      console.warn(`Index ${item.index} not found in mediaItems!`);
      continue;
    }

    await prisma.galleryItem.create({
      data: {
        titleEn: item.titleEn,
        titleBn: item.titleBn,
        titleZh: item.titleZh,
        titleJa: item.titleJa,
        imageUrl: media.cloudinaryUrl,
        category: item.category,
        isVerified: true,
        caption: item.caption,
      },
    });
  }

  console.log("Successfully seeded 34 verified Gallery items!");

  // 2. Update Product Catalog with Real Cloudinary Photos
  console.log("Updating Products with real Cloudinary photos...");

  // Product 1: Server Motherboard Scrap (Grade A)
  // Use media 0 (high-res PCB) + media 1 (dismantling PCB) + media 9 (sorting bins)
  const pcbPhotos = [
    mediaItems[0].cloudinaryUrl,
    mediaItems[1].cloudinaryUrl,
    mediaItems[9].cloudinaryUrl,
  ];
  await prisma.product.updateMany({
    where: { titleEn: { contains: "Motherboard" } },
    data: {
      images: JSON.stringify(pcbPhotos),
    },
  });

  // Product 2: CPU Processors
  // Use media 2 (CPU chips) + media 10 (RAM/Chips)
  const cpuPhotos = [
    mediaItems[2].cloudinaryUrl,
    mediaItems[10].cloudinaryUrl,
  ];
  await prisma.product.updateMany({
    where: { titleEn: { contains: "CPU" } },
    data: {
      images: JSON.stringify(cpuPhotos),
    },
  });

  // Product 3: Telecom Boards
  // Use media 3 (telecom boards) + media 14 (bulk boards)
  const telecomPhotos = [
    mediaItems[3].cloudinaryUrl,
    mediaItems[14].cloudinaryUrl,
  ];
  await prisma.product.updateMany({
    where: { titleEn: { contains: "Telecommunication" } },
    data: {
      images: JSON.stringify(telecomPhotos),
    },
  });

  // Product 4: Server RAM
  const ramPhotos = [
    mediaItems[10].cloudinaryUrl,
    mediaItems[2].cloudinaryUrl,
  ];
  await prisma.product.updateMany({
    where: { titleEn: { contains: "RAM" } },
    data: {
      images: JSON.stringify(ramPhotos),
    },
  });

  console.log("Successfully updated product images with genuine Cloudinary photos!");

  const finalCount = await prisma.galleryItem.count();
  console.log(`Total gallery items in database now: ${finalCount}`);
}

main()
  .catch((e) => {
    console.error("Error seeding gallery:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
