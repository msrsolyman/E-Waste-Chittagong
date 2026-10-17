import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

const TEST_INQUIRY_IDS = [
  "cmvctrryt000exi2giu52a2fw", // EWC-2026-8864
  "cmvctqjgo0002xi2gttc8crs7", // EWC-2026-1012
  "cmvct1334000hxid0mibxvspr", // EWC-2026-4528
  "cmvcsapny000hxi18060d0rfc", // EWC-2026-1962
  "cmvcpac6b000hxi0cfhid1xug", // EWC-2026-4593
  "cmvc9pmsr000hxiu0uwgmnkxt", // EWC-2026-3713
  "cmvbdys12000hxia03ubtz3ft", // EWC-2026-1427
  "cmvbcwzsw000hxi38vpqvuezn", // EWC-2026-9852
  "cmvbctmbh000hxi5op72n4t8s", // EWC-2026-8618
  "cmvbclrqi000hxiqczvqf0c25", // EWC-2026-3557
  "cmvbcfm8z000hxi2wvfq117ku", // EWC-2026-2793
  "cmvbc4za2000hxijw4lgdyz41", // EWC-2026-9181
  "cmvbbqakz000hxi642u5b078r", // EWC-2026-7113
  "cmvbb42cs000hxim0frg9f58m", // EWC-2026-1902
  "cmvb8uz3h000hxii0lxpy4n31", // EWC-2026-2937
  "cmvb7koai001pxi88wz0q8gw1", // EWC-2026-6732
  "cmvb7jyc6000uxi88d0u4o046", // EWC-2026-8637
  "cmvb7ik90000cxi88garno14z", // EWC-2026-6973
  "cmvb527x70000l207n8e8vc45", // EWC-2026-1442
];

async function main() {
  console.log("=== BEFORE CLEANUP SUMMARY ===");
  const beforeCounts = {
    total: await prisma.inquiry.count(),
    new: await prisma.inquiry.count({ where: { status: "NEW" } }),
    contacted: await prisma.inquiry.count({ where: { status: "CONTACTED" } }),
    archived: await prisma.inquiry.count({ where: { status: "ARCHIVED" } }),
  };
  console.log("Before Counts:", beforeCounts);

  console.log("\nSafely updating status to ARCHIVED for 19 identified QA test inquiries...");
  for (const id of TEST_INQUIRY_IDS) {
    await prisma.inquiry.update({
      where: { id },
      data: {
        status: "ARCHIVED",
        adminNotes: "Archived QA test artifact (audit run)",
      },
    });
  }

  console.log("\n=== AFTER CLEANUP SUMMARY ===");
  const afterCounts = {
    total: await prisma.inquiry.count(),
    new: await prisma.inquiry.count({ where: { status: "NEW" } }),
    contacted: await prisma.inquiry.count({ where: { status: "CONTACTED" } }),
    archived: await prisma.inquiry.count({ where: { status: "ARCHIVED" } }),
  };
  console.log("After Counts:", afterCounts);

  const activeInquiries = await prisma.inquiry.findMany({
    where: { status: { not: "ARCHIVED" } },
    select: { id: true, referenceNo: true, companyName: true, status: true },
  });
  console.log(`\nRemaining Active Pipeline Inquiries (${activeInquiries.length}):`);
  for (const a of activeInquiries) {
    console.log(`- Ref: ${a.referenceNo} | Company: ${a.companyName} | Status: ${a.status}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
