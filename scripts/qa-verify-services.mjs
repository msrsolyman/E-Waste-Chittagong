import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ARTIFACT_DIR = "C:\\Users\\msr88\\.gemini\\antigravity\\brain\\4680ae22-2d07-4173-9d1a-5203c8974a5e";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // 1. Desktop Services English (1440x900)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/en/services", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1500));

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "services_desktop_hero_banner_1440.png"),
    fullPage: false,
  });
  console.log("Captured: services_desktop_hero_banner_1440.png");

  // 2. Desktop Services Bengali (1440x900)
  await page.goto("http://localhost:3000/bn/services", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1500));

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "services_bengali_hero_banner_1440.png"),
    fullPage: false,
  });
  console.log("Captured: services_bengali_hero_banner_1440.png");

  // Scroll down to capture full cards and SLA section in Bengali
  await page.evaluate(() => window.scrollBy(0, 600));
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "services_bengali_cards_sla_1440.png"),
    fullPage: false,
  });
  console.log("Captured: services_bengali_cards_sla_1440.png");

  // 3. Mobile Services English (390x844)
  await page.setViewport({ width: 390, height: 844 });
  await page.goto("http://localhost:3000/en/services", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1500));

  const mobileMetrics = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  console.log("Mobile Metrics:", mobileMetrics);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "services_mobile_hero_banner_390.png"),
    fullPage: false,
  });
  console.log("Captured: services_mobile_hero_banner_390.png");

  // 4. Admin Settings with Services Banner Tab
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/admin/login", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 800));

  await page.type('input[type="email"]', "admin@ewastechittagong.com");
  await page.type('input[type="password"]', "Admin@EWC2026!");
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: "networkidle2" });

  await page.goto("http://localhost:3000/admin/settings", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1500));

  // The Services tab is first by default, but let's confirm and take screenshot
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "admin_settings_services_tab.png"),
    fullPage: false,
  });
  console.log("Captured: admin_settings_services_tab.png");

  await browser.close();
  console.log("Services QA Verification Completed Successfully!");
}

run().catch((err) => {
  console.error("QA Verification Failed:", err);
  process.exit(1);
});
