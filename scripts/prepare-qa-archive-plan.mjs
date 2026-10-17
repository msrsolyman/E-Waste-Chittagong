import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  console.log("=== EXACT QA TEST INQUIRY IDENTIFICATION ===");

  const testInquiries = await prisma.inquiry.findMany({
    where: {
      OR: [
        { email: "auditor@tokyorefining.jp" },
        { email: "auditor@sgmetal.com" },
        { email: "audit@globalrecyclers.jp" },
        { referenceNo: "EWC-2026-8864" },
        { referenceNo: "EWC-2026-1012" },
      ],
    },
    include: {
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  console.log(`Identified ${testInquiries.length} test inquiries:`);
  for (const inq of testInquiries) {
    console.log(`- ID: ${inq.id} | Ref: ${inq.referenceNo} | Company: ${inq.companyName} | Status: ${inq.status} | Items: ${inq.items.length}`);
  }

  const legitimateInquiries = await prisma.inquiry.findMany({
    where: {
      NOT: {
        id: { in: testInquiries.map((t) => t.id) },
      },
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  console.log(`\nIdentified ${legitimateInquiries.length} legitimate/baseline inquiries:`);
  for (const inq of legitimateInquiries) {
    console.log(`- ID: ${inq.id} | Ref: ${inq.referenceNo} | Company: ${inq.companyName} | Email: ${inq.email} | Status: ${inq.status} | Items: ${inq.items.length}`);
  }

  // Safe Archive Plan:
  // Instead of destructive deletion, we can safely transition test inquiries to status 'ARCHIVED'
  // with adminNotes: 'Archived QA Test Artifact (Safety Audit)'
  // so that:
  // 1. They are removed from active pipeline views (status != 'ALL')
  // 2. All audit logs and foreign keys remain 100% intact (zero integrity violation)
  // 3. Legitimate inquiries remain pristine.
}

main().catch(console.error).finally(() => prisma.$disconnect());
