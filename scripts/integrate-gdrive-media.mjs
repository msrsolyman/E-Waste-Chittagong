import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const ASSETS_MAP_FILE = path.resolve("scripts/uploaded_assets_map.json");

async function main() {
  if (!fs.existsSync(ASSETS_MAP_FILE)) {
    throw new Error("uploaded_assets_map.json does not exist. Run upload-new-assets.mjs first.");
  }

  const map = JSON.parse(fs.readFileSync(ASSETS_MAP_FILE, "utf-8"));
  console.log(`Loaded ${Object.keys(map).length} uploaded assets.`);

  // 1. UPDATE CATEGORIES
  console.log("Updating Categories with authentic photography...");
  const catUpdates = [
    {
      slug: "cpu-processors-ic-scrap",
      imageUrl: map["WhatsApp Image 2026-11-01 at 12.50.39 PM.jpeg"]?.secureUrl,
    },
    {
      slug: "telecom-networking-scrap",
      imageUrl: map["WhatsApp Image 2026-11-01 at 12.50.41 PM.jpeg"]?.secureUrl,
    },
    {
      slug: "printed-circuit-boards",
      imageUrl: map["WhatsApp Image 2026-11-01 at 12.50.43 PM.jpeg"]?.secureUrl,
    },
    {
      slug: "insulated-wire-copper-cable",
      imageUrl: map["WhatsApp Image 2026-11-01 at 12.50.47 PM (1).jpeg"]?.secureUrl,
    },
  ];

  for (const cu of catUpdates) {
    if (cu.imageUrl) {
      await prisma.category.updateMany({
        where: { slug: cu.slug },
        data: { imageUrl: cu.imageUrl },
      });
      console.log(`✓ Category [${cu.slug}] updated with ${cu.imageUrl}`);
    }
  }

  // 2. UPDATE PRODUCTS
  console.log("\nUpdating Products with authentic photography...");
  const prodUpdates = [
    {
      slug: "sorted-cpu-ceramic-fiber",
      newImages: [
        map["WhatsApp Image 2026-11-01 at 12.50.39 PM.jpeg"]?.secureUrl,
      ],
    },
    {
      slug: "telecom-base-station-boards",
      newImages: [
        map["WhatsApp Image 2026-11-01 at 12.50.41 PM.jpeg"]?.secureUrl,
        map["WhatsApp Image 2026-11-01 at 12.50.42 PM.jpeg"]?.secureUrl,
      ],
    },
    {
      slug: "server-motherboard-grade-a",
      newImages: [
        map["WhatsApp Image 2026-11-01 at 12.50.43 PM.jpeg"]?.secureUrl,
        map["WhatsApp Image 2026-11-01 at 12.50.44 PM.jpeg"]?.secureUrl,
      ],
    },
    {
      slug: "server-ddr3-ddr4-ram-memory-scrap",
      newImages: [
        map["WhatsApp Image 2026-11-01 at 12.50.46 PM.jpeg"]?.secureUrl,
      ],
    },
  ];

  for (const pu of prodUpdates) {
    const existing = await prisma.product.findUnique({ where: { slug: pu.slug } });
    if (existing) {
      let currentImages = [];
      try {
        currentImages = JSON.parse(existing.images);
      } catch (e) {
        currentImages = [];
      }
      // Prepend new authentic images avoiding duplicates
      const validNew = pu.newImages.filter(Boolean);
      const combined = Array.from(new Set([...validNew, ...currentImages]));
      await prisma.product.update({
        where: { slug: pu.slug },
        data: { images: JSON.stringify(combined) },
      });
      console.log(`✓ Product [${pu.slug}] updated with ${combined.length} images.`);
    }
  }

  // 3. INSERT GALLERY ITEMS
  console.log("\nRegistering verified Gallery Items in database...");
  const galleryItems = [
    // --- 12 Images ---
    {
      file: "WhatsApp Image 2026-11-01 at 12.50.39 PM.jpeg",
      titleEn: "Sorted CPU Ceramic & Fiber Microprocessors Batch",
      titleBn: "সর্টেড সিরামিক ও ফাইবার সিপিইউ প্রসেসর ব্যাচ",
      titleZh: "高纯度分选陶瓷与树脂封装 CPU 处理器批次",
      titleJa: "選別済みセラミック・ファイバーCPUプロセッサロット",
      category: "MATERIAL",
      caption: "Sack full of sorted pin-grid array microprocessors ready for precious metal recovery assay.",
    },
    {
      file: "WhatsApp Image 2026-11-01 at 12.50.41 PM.jpeg",
      titleEn: "High-Yield Gold Plated Telecom Base Station RF Boards",
      titleBn: "উচ্চ ইল্ড গোল্ড প্লেটেড টেলিকম বেস স্টেশন আরএফ বোর্ড",
      titleZh: "高得率重度镀金通信基站射频功率放大板",
      titleJa: "高純度金メッキ通信基地局RFパワーアンプ基板",
      category: "MATERIAL",
      caption: "High-frequency telecom transceiver boards featuring gold contact shielding and high-purity copper ground planes.",
    },
    {
      file: "WhatsApp Image 2026-11-01 at 12.50.42 PM.jpeg",
      titleEn: "Multilayer Gold Contact Telecom Transmission Boards",
      titleBn: "মাল্টিলেয়ার গোল্ড কন্টাক্ট টেলিকম ট্রান্সমিশন বোর্ড",
      titleZh: "多层黄金触点通信交换与传输主板",
      titleJa: "多層金メッキ通信トランスミッション基板",
      category: "MATERIAL",
      caption: "Heavy industrial telecommunications transmission boards staged for export sorting and classification.",
    },
    {
      file: "WhatsApp Image 2026-11-01 at 12.50.43 PM.jpeg",
      titleEn: "Industrial Yard Mixed Electronic PCB Intake Lot",
      titleBn: "ইয়ার্ড মিক্সড সার্কিট বোর্ড বাল্ক ইনটেক লট",
      titleZh: "工厂车间混合工业电子电路板批量入库堆垛",
      titleJa: "工場ヤード混合電子基板・マザーボード受入ロット",
      category: "PROCESSING",
      caption: "Bulk warehouse stockpile of mixed computer and commercial circuit boards prior to manual depopulation.",
    },
    {
      file: "WhatsApp Image 2026-11-01 at 12.50.44 PM.jpeg",
      titleEn: "IC Motherboard Scrap & Ceramic DIP Component Arrays",
      titleBn: "সিরামিক ডিআইপি আইসি ও মাদারবোর্ড স্ক্র্যাপ অ্যারে",
      titleZh: "密集双列直插陶瓷芯片主板及工业总线卡废料",
      titleJa: "セラミックDIP ICチップ搭載基板スクラップ",
      category: "MATERIAL",
      caption: "Industrial boards featuring gold-pin ceramic DIP microcontrollers and premium telecommunication ICs.",
    },
    {
      file: "WhatsApp Image 2026-11-01 at 12.50.46 PM (1).jpeg",
      titleEn: "Chittagong Warehouse Staging & Bulk Consignment Pallets",
      titleBn: "চট্টগ্রাম ওয়ারহাউস স্টেজিং ও কনসাইনমেন্ট প্যালেট",
      titleZh: "吉大港仓储分选区大宗集装箱出运托盘堆存",
      titleJa: "チッタゴン倉庫パレットステージングおよび出荷準備",
      category: "FACILITY",
      caption: "Heavy duty palletized staging area for international marine container dispatch at Chittagong seaport.",
    },
    {
      file: "WhatsApp Image 2026-11-01 at 12.50.46 PM (2).jpeg",
      titleEn: "Precision Manual Component Dismantling & Depopulation Station",
      titleBn: "ম্যানুয়াল কম্পোনেন্ট ডিসম্যান্তলিং ও ডিপপুলেশন স্টেশন",
      titleZh: "精密手工电子元件拆解与贵金属部位初分工位",
      titleJa: "精密手作業解体・基板部品分別ステーション",
      category: "DISMANTLING",
      caption: "Skilled operators separating heat sinks, connectors, capacitors, and ICs cleanly according to Basel guidelines.",
    },
    {
      file: "WhatsApp Image 2026-11-01 at 12.50.46 PM.jpeg",
      titleEn: "Gold Finger RAM Memory Scrap & Server DIMM Modules",
      titleBn: "গোল্ড ফিঙ্গার র‍্যাম মেমোরি স্ক্র্যাপ ও সার্ভার ডিআইএমএম",
      titleZh: "精选手工分拣金手指服务器内存条 (RAM) 批次",
      titleJa: "金メッキ端子サーバーRAMメモリモジュールスクラップ",
      category: "MATERIAL",
      caption: "Segregated high-grade DDR3 and DDR4 server memory modules with unblemished gold contact fingers.",
    },
    {
      file: "WhatsApp Image 2026-11-01 at 12.50.47 PM (1).jpeg",
      titleEn: "Industrial Insulated Wire & Heavy Copper Cable Scrap",
      titleBn: "শিল্প ইনসুলেটেড তার ও হেভি কপার ক্যাবল স্ক্র্যাপ",
      titleZh: "工业重型绝缘铜电缆与高纯度铜导线废料",
      titleJa: "工業用被覆銅線および高純度銅ケーブルスクラップ",
      category: "MATERIAL",
      caption: "Mechanical segregation of communications wire, high voltage power lines, and wiring harnesses.",
    },
    {
      file: "WhatsApp Image 2026-11-01 at 12.50.47 PM.jpeg",
      titleEn: "Export Packaging & Seaport Container Stuffing Staging",
      titleBn: "রপ্তানি প্যাকেজিং ও কনটেইনার স্টাফিং স্টেজিং এরিয়া",
      titleZh: "出口标准吨袋封装与港口海运集装箱装箱准备",
      titleJa: "輸出用コンテナ梱包および港湾出荷ステージング",
      category: "PROCESSING",
      caption: "Jumbo bag packaging and strapping adhering to strict international maritime safety standards.",
    },
    {
      file: "WhatsApp Image 2026-11-01 at 12.50.48 PM (1).jpeg",
      titleEn: "Telecom Enclosure & Server Chassis Intake Yard",
      titleBn: "টেলিকম এনক্লোজার ও সার্ভার চেসিস ইনটেক ইয়ার্ড",
      titleZh: "通信机柜与大型服务器机箱金属拆解堆料场",
      titleJa: "通信機器エンクロージャおよびサーバー筐体解体場",
      category: "FACILITY",
      caption: "Primary dismantling yard separating ferrous enclosures and aluminum structural frames from electronics.",
    },
    {
      file: "WhatsApp Image 2026-11-01 at 12.50.48 PM.jpeg",
      titleEn: "Consignment Weighing, Grading & Quality Assurance Hub",
      titleBn: "কনসাইনমেন্ট গ্রেডিং, ওজন ও কোয়ালিটি কন্ট্রোল হাব",
      titleZh: "出口批次称重计量与品位质量复检控制中心",
      titleJa: "出荷ロット計量および品質保証グレーディング拠点",
      category: "PROCESSING",
      caption: "Certified scale weighing verifying gross and tare tonnage for commercial B2B transparency.",
    },

    // --- 15 Videos ---
    {
      file: "WhatsApp Video 2026-11-01 at 12.50.37 PM.mp4",
      titleEn: "Chittagong Facility Tour: Real Intake & High-Yield Segregation",
      titleBn: "চট্টগ্রাম ইয়ার্ড ট্যুর: বাস্তব ইনটেক ও হাই-ইল্ড সেগ্রিগেশন",
      titleZh: "吉大港工厂实地巡查：大宗入库与高得率物料精细分拣",
      titleJa: "チッタゴン工場ツアー：受入れ検査と高品質基板の分別工程",
      category: "FACILITY",
      caption: "Live 27-second continuous walkthrough of the active Chittagong facility yard.",
    },
    {
      file: "WhatsApp Video 2026-11-01 at 12.50.39 PM.mp4",
      titleEn: "High-Grade Telecom RF Amplifiers: Gold Shielding Inspection",
      titleBn: "হাই-গ্রেড টেলিকম আরএফ অ্যাম্প্লিফায়ার: গোল্ড শিল্ডিং পরিদর্শন",
      titleZh: "高端通信射频功放板：重度黄金屏蔽罩实物细部实拍",
      titleJa: "高周波通信アンプ基板：金メッキシールド詳細確認",
      category: "MATERIAL",
      caption: "Close-up examination of heavy gold-plated telecommunication base station circuitry.",
    },
    {
      file: "WhatsApp Video 2026-11-01 at 12.50.40 PM.mp4",
      titleEn: "Microprocessor Pins & Ceramic IC Component Sorting",
      titleBn: "মাইক্রোপ্রসেসর পিন ও সিরামিক আইসি কম্পোনেন্ট সর্টিং",
      titleZh: "微处理器引脚与双列直插陶瓷芯片分选作业",
      titleJa: "プロセッサピンおよびセラミックICコンポーネント選別",
      category: "DISMANTLING",
      caption: "Detailed inspection of pin-dense central processors isolated for refining.",
    },
    {
      file: "WhatsApp Video 2026-11-01 at 12.50.41 PM (1).mp4",
      titleEn: "Depopulated Telecom Backplanes: Pure Copper & Gold Traces",
      titleBn: "টেলিকম ব্যাকপ্লেন: খাঁটি কপার ও গোল্ড ট্রেস",
      titleZh: "通信背板母板：纯铜基底与超高密度镀金走线",
      titleJa: "通信バックプレーン：純銅ベースと金メッキ配線",
      category: "MATERIAL",
      caption: "Authentic footage of multilayer industrial base station backplanes.",
    },
    {
      file: "WhatsApp Video 2026-11-01 at 12.50.41 PM.mp4",
      titleEn: "Bulk Motherboard Stockpile Inspection on Floor",
      titleBn: "ফ্লোরে বাল্ক মাদারবোর্ড স্টকপাইল পরিদর্শন",
      titleZh: "车间地表大批量工业级主板堆叠实物检验",
      titleJa: "工場フロアにおける大量マザーボード受入検査",
      category: "PROCESSING",
      caption: "Continuous palletized inventory of green server boards and motherboards.",
    },
    {
      file: "WhatsApp Video 2026-11-01 at 12.50.42 PM (1).mp4",
      titleEn: "Manual Sorting Operations: Isolating Precious Metal Yields",
      titleBn: "ম্যানুয়াল সর্টিং কার্যক্রম: মূল্যবান ধাতব রিকভারি লট নির্বাচন",
      titleZh: "熟练工人手工精细分选：精准分离高品位贵金属电路板",
      titleJa: "熟練工による手選別作業：高品位貴金属基板の単離",
      category: "DISMANTLING",
      caption: "26-second reel demonstrating meticulous manual segregation by trained technicians.",
    },
    {
      file: "WhatsApp Video 2026-11-01 at 12.50.42 PM.mp4",
      titleEn: "Gold-Plated Connector Pins & Terminal Block Segregation",
      titleBn: "গোল্ড প্লেটেড কানেক্টর পিন ও টার্মিনাল ব্লক পৃথকীকরণ",
      titleZh: "高厚度镀金端子、插头与工业连接器剥离分类",
      titleJa: "金メッキ端子ピンおよび接続コネクタ分別作業",
      category: "DISMANTLING",
      caption: "Dedicated extraction of heavy gold plated connectors from communication switches.",
    },
    {
      file: "WhatsApp Video 2026-11-01 at 12.50.43 PM (1).mp4",
      titleEn: "Server Blade Depopulation & IC Stripping Station",
      titleBn: "সার্ভার ব্লেড ডিপপুলেশন ও আইসি স্ট্রিপিং স্টেশন",
      titleZh: "刀片式服务器拆解与集成芯片无损快速剥离",
      titleJa: "ブレードサーバー解体および高密度ICチップ剥離工程",
      category: "PROCESSING",
      caption: "Clean mechanical removal of electronic integrated circuits without thermal burn.",
    },
    {
      file: "WhatsApp Video 2026-11-01 at 12.50.43 PM.mp4",
      titleEn: "Industrial E-Waste Tonnage Weighing Verification",
      titleBn: "শিল্প ই-বর্জ্য টনপরিমাপ ওজন ভেরিফিকেশন",
      titleZh: "工业吨级电子废料称重过磅与毛重净重核对",
      titleJa: "産業用電子廃棄物ロットの精密計量とデータ照合",
      category: "PROCESSING",
      caption: "Documenting gross tare weights on heavy commercial yard scales.",
    },
    {
      file: "WhatsApp Video 2026-11-01 at 12.50.44 PM (1).mp4",
      titleEn: "Gold Finger RAM Module Batches Clean Inspection",
      titleBn: "গোল্ড ফিঙ্গার র‍্যাম মেমোরি ব্যাচ কোয়ালিটি স্ক্রিনিং",
      titleZh: "大批量高规格内存条 (RAM) 金手指成色检验",
      titleJa: "金端子RAMメモリモジュールロットの品質検査",
      category: "MATERIAL",
      caption: "Visual inspection confirming zero oxidation on gold contacts for wholesale delivery.",
    },
    {
      file: "WhatsApp Video 2026-11-01 at 12.50.44 PM.mp4",
      titleEn: "Warehouse Floor Overview: Segregated Material Lanes",
      titleBn: "ওয়ারহাউস ফ্লোর ওভারভিউ: ক্যাটাগরিভিত্তিক সেগ্রিগেশন লেন",
      titleZh: "库房全景俯拍：分区明确的物料暂存区与作业通道",
      titleJa: "倉庫フロア全景：カテゴリー別に整理された分別レーン",
      category: "FACILITY",
      caption: "27-second broad footage showing clean material alleys, bins, and pallet racks.",
    },
    {
      file: "WhatsApp Video 2026-11-01 at 12.50.45 PM (1).mp4",
      titleEn: "Bulk Insulated Copper Wire Coils & Cable Stripping",
      titleBn: "বাল্ক ইনসুলেটেড কপার তার কয়েল ও ক্যাবল স্ট্রিপিং",
      titleZh: "大卷通信铜缆与动力母线废料备剥状态",
      titleJa: "被覆銅線ロールおよび大口径電力ケーブル剥離前確認",
      category: "MATERIAL",
      caption: "Coiled telecommunications wire bundles ready for mechanical recovery.",
    },
    {
      file: "WhatsApp Video 2026-11-01 at 12.50.45 PM (2).mp4",
      titleEn: "Heavy Transformer & Power Supply Copper Core Segregation",
      titleBn: "হেভি ট্রান্সফরমার ও পাওয়ার সাপ্লাই কপার কোর পৃথকীকরণ",
      titleZh: "重型工业电源、变压器纯铜线圈机械剥离作业",
      titleJa: "大型トランス・電源ユニット銅コイル分別解体",
      category: "DISMANTLING",
      caption: "Separating heavy copper windings from iron cores and power transformers.",
    },
    {
      file: "WhatsApp Video 2026-11-01 at 12.50.45 PM.mp4",
      titleEn: "Export Staging: Pallet Strapping & Container Dispatch",
      titleBn: "রপ্তানি স্টেজিং: প্যালেট স্ট্র্যাপিং ও কনটেইনার লোডিং",
      titleZh: "海运出口打托、紧固带加固与集装箱装箱调度",
      titleJa: "輸出パレット緊縛固定および海上コンテナ積載準備",
      category: "PROCESSING",
      caption: "Final export strapping of jumbo parcels destined for Asian and European smelters.",
    },
    {
      file: "WhatsApp Video 2026-11-01 at 12.50.47 PM.mp4",
      titleEn: "Chittagong Maritime Terminal Consignment Final Dispatch",
      titleBn: "চট্টগ্রাম বন্দর টার্মিনাল কনসাইনমেন্ট ফাইনাল ডিসপ্যাচ",
      titleZh: "吉大港海运集装箱码头报关与大宗货物最终起运",
      titleJa: "チッタゴン港コンテナターミナル最終通関・出港準備",
      category: "FACILITY",
      caption: "27-second comprehensive footage of export-ready consignment at the seaport terminal.",
    },
  ];

  for (const item of galleryItems) {
    const asset = map[item.file];
    if (!asset || !asset.secureUrl) {
      console.warn(`Asset for file [${item.file}] not found in map, skipping.`);
      continue;
    }

    // Check if gallery item with this URL already exists
    const existing = await prisma.galleryItem.findFirst({
      where: { imageUrl: asset.secureUrl },
    });

    if (existing) {
      await prisma.galleryItem.update({
        where: { id: existing.id },
        data: {
          titleEn: item.titleEn,
          titleBn: item.titleBn,
          titleZh: item.titleZh,
          titleJa: item.titleJa,
          category: item.category,
          caption: item.caption,
          isVerified: true,
        },
      });
      console.log(`Updated GalleryItem [${item.titleEn}]`);
    } else {
      await prisma.galleryItem.create({
        data: {
          titleEn: item.titleEn,
          titleBn: item.titleBn,
          titleZh: item.titleZh,
          titleJa: item.titleJa,
          imageUrl: asset.secureUrl,
          category: item.category,
          caption: item.caption,
          isVerified: true,
        },
      });
      console.log(`Created GalleryItem [${item.titleEn}]`);
    }
  }

  const finalGalleryCount = await prisma.galleryItem.count();
  console.log(`\nAll done! Total Gallery Items in database: ${finalGalleryCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
