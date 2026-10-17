import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe("CREATE SCHEMA IF NOT EXISTS test_isolated_qa");
    console.log("SUCCESS: Created isolated schema test_isolated_qa!");
    await prisma.$executeRawUnsafe("DROP SCHEMA IF EXISTS test_isolated_qa CASCADE");
    console.log("SUCCESS: Cleaned up test_isolated_qa schema!");
  } catch (err) {
    console.error("Schema test error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
