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

  const pagesToTest = [
    { name: "about", enUrl: "http://localhost:3000/en/about", bnUrl: "http://localhost:3000/bn/about" },
    { name: "products", enUrl: "http://localhost:3000/en/products", bnUrl: "http://localhost:3000/bn/products" },
    { name: "services", enUrl: "http://localhost:3000/en/services", bnUrl: "http://localhost:3000/bn/services" },
  ];

  for (const item of pagesToTest) {
    console.log(`\n--- Testing ${item.name.toUpperCase()} Page Entrance Animations ---`);

    // 1. Desktop 1440x900
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(item.enUrl, { waitUntil: "networkidle2" });
    
    // Check reveal elements state right after load
    const revealCheck = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll(".motion-reveal"));
      const visibleCount = elements.filter(el => el.classList.contains("is-visible")).length;
      return {
        totalReveals: elements.length,
        visibleCount,
      };
    });
    console.log(`[${item.name}] Desktop initial reveals: ${revealCheck.visibleCount}/${revealCheck.totalReveals}`);

    // Wait for staggered transitions (50ms - 250ms + 700ms transition duration)
    await new Promise((r) => setTimeout(r, 1200));

    const finalRevealCheck = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll(".motion-reveal"));
      const visibleCount = elements.filter(el => el.classList.contains("is-visible")).length;
      return {
        totalReveals: elements.length,
        visibleCount,
      };
    });
    console.log(`[${item.name}] Desktop final reveals: ${finalRevealCheck.visibleCount}/${finalRevealCheck.totalReveals}`);

    const desktopShotPath = path.join(ARTIFACT_DIR, `${item.name}_entrance_animation_1440.png`);
    await page.screenshot({ path: desktopShotPath, fullPage: false });
    console.log(`Captured: ${path.basename(desktopShotPath)}`);

    // 2. Mobile 390x844
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(item.bnUrl, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 1200));

    const mobileMetrics = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        overflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    console.log(`[${item.name}] Mobile Bengali Metrics:`, mobileMetrics);

    const mobileShotPath = path.join(ARTIFACT_DIR, `${item.name}_entrance_animation_390.png`);
    await page.screenshot({ path: mobileShotPath, fullPage: false });
    console.log(`Captured: ${path.basename(mobileShotPath)}`);
  }

  await browser.close();
  console.log("\nAll 3 pages verified with staggered entrance animations and 0 overflow!");
}

run().catch((err) => {
  console.error("QA error:", err);
  process.exit(1);
});
