import { execSync } from "child_process";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

async function main() {
  const baseDbUrl = process.env.DATABASE_URL;
  if (!baseDbUrl) throw new Error("No DATABASE_URL");

  // Construct isolated URL with schema=test_isolated_qa
  const urlObj = new URL(baseDbUrl);
  urlObj.searchParams.set("schema", "test_isolated_qa");
  const isolatedUrl = urlObj.toString();

  console.log("Setting up schema test_isolated_qa...");
  const directClient = new PrismaClient();
  await directClient.$executeRawUnsafe("CREATE SCHEMA IF NOT EXISTS test_isolated_qa");
  await directClient.$disconnect();

  console.log("Pushing prisma schema to isolated schema...");
  execSync("npx prisma db push --skip-generate --accept-data-loss", {
    env: {
      ...process.env,
      DATABASE_URL: isolatedUrl,
      DIRECT_URL: isolatedUrl,
    },
    stdio: "inherit",
  });

  console.log("Checking tables in test_isolated_qa...");
  const isolatedClient = new PrismaClient({
    datasources: {
      db: { url: isolatedUrl },
    },
  });

  const countUsers = await isolatedClient.user.count();
  console.log(`Isolated schema user count: ${countUsers}`);

  await isolatedClient.$disconnect();

  console.log("Tearing down test_isolated_qa schema...");
  const cleanupClient = new PrismaClient();
  await cleanupClient.$executeRawUnsafe("DROP SCHEMA IF EXISTS test_isolated_qa CASCADE");
  await cleanupClient.$disconnect();
  console.log("Cleaned up completely!");
}

main().catch(console.error);
