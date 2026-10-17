import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  const all = (await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  })).slice(0, 4);

  console.log(`Total Inquiries: ${all.length}`);
  for (const [idx, inq] of all.entries()) {
    console.log(`\n[#${idx + 1}] ID: ${inq.id} | Ref: ${inq.referenceNo}`);
    console.log(`  Name: ${inq.name} | Company: ${inq.companyName} | Email: ${inq.email}`);
    console.log(`  Country: ${inq.country} | Category: ${inq.interestedCategory} | Qty: ${inq.estimatedQty}`);
    console.log(`  Status: ${inq.status} | Created: ${inq.createdAt.toISOString()}`);
    console.log(`  Admin Notes: ${inq.adminNotes || "none"}`);
    console.log(`  Items Count: ${inq.items.length}`);
    console.log(`  Message: ${inq.message}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
