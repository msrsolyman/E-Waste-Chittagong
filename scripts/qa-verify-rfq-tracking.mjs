import puppeteer from "puppeteer-core";
import path from "path";
import { PrismaClient } from "@prisma/client";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ARTIFACT_DIR = "C:\\Users\\msr88\\.gemini\\antigravity\\brain\\4680ae22-2d07-4173-9d1a-5203c8974a5e";

const prisma = new PrismaClient();

async function run() {
  const sampleInquiry = await prisma.inquiry.findFirst({
    orderBy: { createdAt: "desc" },
  });

  const refNo = sampleInquiry ? sampleInquiry.referenceNo : "EWC-2026-1001";
  console.log(`Testing with Reference Number: ${refNo}`);

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // 1. Desktop English Tracking (1440x900)
  console.log("\n--- 1. Testing Desktop English Tracking (1440x900) ---");
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:3000/en/track?ref=${encodeURIComponent(refNo)}`, {
    waitUntil: "networkidle2",
  });
  await new Promise((r) => setTimeout(r, 1800));

  const desktopShotPath = path.join(ARTIFACT_DIR, "rfq_tracking_desktop_en_1440.png");
  await page.screenshot({ path: desktopShotPath, fullPage: false });
  console.log("Captured:", path.basename(desktopShotPath));

  // 2. Desktop Bengali Tracking (1440x900)
  console.log("\n--- 2. Testing Desktop Bengali Tracking (1440x900) ---");
  await page.goto(`http://localhost:3000/bn/track?ref=${encodeURIComponent(refNo)}`, {
    waitUntil: "networkidle2",
  });
  await new Promise((r) => setTimeout(r, 1800));

  const desktopBnShotPath = path.join(ARTIFACT_DIR, "rfq_tracking_desktop_bn_1440.png");
  await page.screenshot({ path: desktopBnShotPath, fullPage: false });
  console.log("Captured:", path.basename(desktopBnShotPath));

  // 3. Mobile Bengali Tracking (390x844) & Overflow Check
  console.log("\n--- 3. Testing Mobile Bengali Tracking (390x844) ---");
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(`http://localhost:3000/bn/track?ref=${encodeURIComponent(refNo)}`, {
    waitUntil: "networkidle2",
  });
  await new Promise((r) => setTimeout(r, 1800));

  const mobileMetrics = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  console.log("Mobile Metrics:", mobileMetrics);

  const mobileShotPath = path.join(ARTIFACT_DIR, "rfq_tracking_mobile_bn_390.png");
  await page.screenshot({ path: mobileShotPath, fullPage: false });
  console.log("Captured:", path.basename(mobileShotPath));

  // 4. Mobile Menu Drawer Navigation Check
  console.log("\n--- 4. Testing Mobile Menu Drawer ---");
  const menuButton = await page.$('button[aria-label="Toggle navigation menu"]');
  if (menuButton) {
    await menuButton.click();
    await new Promise((r) => setTimeout(r, 500));
    const drawerShotPath = path.join(ARTIFACT_DIR, "rfq_tracking_mobile_drawer_390.png");
    await page.screenshot({ path: drawerShotPath, fullPage: false });
    console.log("Captured:", path.basename(drawerShotPath));
  }

  // 5. Invalid Reference Search Error State
  console.log("\n--- 5. Testing Invalid Reference Error State ---");
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/en/track", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1000));

  await page.type('input[type="text"]', "EWC-9999-INVALID");
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 1500));

  const errorShotPath = path.join(ARTIFACT_DIR, "rfq_tracking_error_state_1440.png");
  await page.screenshot({ path: errorShotPath, fullPage: false });
  console.log("Captured:", path.basename(errorShotPath));

  await browser.close();
  await prisma.$disconnect();
  console.log("\nAll RFQ Tracking QA tests completed successfully!");
}

run().catch((err) => {
  console.error("QA error:", err);
  process.exit(1);
});
