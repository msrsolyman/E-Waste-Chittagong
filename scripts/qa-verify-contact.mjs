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

  // 1. Desktop Contact English (1440x900)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/en/contact", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1500));

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "contact_desktop_hero_banner_1440.png"),
    fullPage: false,
  });
  console.log("Captured: contact_desktop_hero_banner_1440.png");

  // 2. Desktop Contact Bengali (1440x900)
  await page.goto("http://localhost:3000/bn/contact", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1500));

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "contact_bengali_hero_banner_1440.png"),
    fullPage: false,
  });
  console.log("Captured: contact_bengali_hero_banner_1440.png");

  // Scroll down to capture Akbarshah address desk & inquiry form
  await page.evaluate(() => window.scrollBy(0, 500));
  await new Promise((r) => setTimeout(r, 800));

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "contact_bengali_desk_form_1440.png"),
    fullPage: false,
  });
  console.log("Captured: contact_bengali_desk_form_1440.png");

  // 3. Mobile Contact English (390x844)
  await page.setViewport({ width: 390, height: 844 });
  await page.goto("http://localhost:3000/en/contact", { waitUntil: "networkidle2" });
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
    path: path.join(ARTIFACT_DIR, "contact_mobile_hero_banner_390.png"),
    fullPage: false,
  });
  console.log("Captured: contact_mobile_hero_banner_390.png");

  // 4. Admin Settings Contact Tab (1440x900)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/admin/login", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 800));

  await page.type('input[type="email"]', "admin@ewastechittagong.com");
  await page.type('input[type="password"]', "Admin@EWC2026!");
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: "networkidle2" });

  await page.goto("http://localhost:3000/admin/settings", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1500));

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "admin_settings_contact_tab.png"),
    fullPage: false,
  });
  console.log("Captured: admin_settings_contact_tab.png");

  await browser.close();
  console.log("All contact QA screenshots captured successfully!");
}

run().catch((err) => {
  console.error("QA error:", err);
  process.exit(1);
});
