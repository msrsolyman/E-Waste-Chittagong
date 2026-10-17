import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const EXECUTABLE_PATH = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;

const BASE_URL = "http://localhost:3000";

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];

const PAGES = [
  { path: "/en", label: "homepage-en" },
  { path: "/bn", label: "homepage-bn" },
  { path: "/en/gallery", label: "gallery-en" },
  { path: "/bn/gallery", label: "gallery-bn" },
  { path: "/en/products/server-motherboard-grade-a", label: "product-detail-en" },
  { path: "/en/inquiry", label: "inquiry-en" },
];

async function main() {
  console.log("=== BROWSER RESPONSIVENESS & OVERFLOW AUDIT ===");
  console.log(`Using browser: ${EXECUTABLE_PATH}`);

  const outputDir = path.join(process.cwd(), "screenshots", "audit");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: EXECUTABLE_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  const issues = [];

  // Listen for console errors
  page.on("pageerror", (err) => {
    issues.push({ type: "pageerror", message: err.message });
  });

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Auditing Viewport: ${vp.name.toUpperCase()} (${vp.width}x${vp.height}) ---`);
    await page.setViewport({ width: vp.width, height: vp.height });

    for (const p of PAGES) {
      const url = `${BASE_URL}${p.path}`;
      await page.goto(url, { waitUntil: "networkidle0", timeout: 25000 });

      // Auto-scroll to trigger lazy-loaded images below the fold
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 400;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              window.scrollTo(0, 0);
              resolve();
            }
          }, 100);
        });
      });
      await new Promise((r) => setTimeout(r, 800));

      // Check horizontal overflow
      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        return {
          hasOverflow: docWidth > winWidth,
          docWidth,
          winWidth,
          diff: docWidth - winWidth,
        };
      });

      if (overflow.hasOverflow) {
        console.warn(`⚠️ [OVERFLOW] ${p.label} at ${vp.name}: doc=${overflow.docWidth}px, win=${overflow.winWidth}px (+${overflow.diff}px)`);
        issues.push({
          type: "overflow",
          page: p.label,
          viewport: vp.name,
          diff: overflow.diff,
        });
      } else {
        console.log(`✅ [NO OVERFLOW] ${p.label} at ${vp.name} (${overflow.winWidth}px)`);
      }

      // Check for broken images
      const brokenImages = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll("img"));
        return images
          .filter((img) => !img.complete || img.naturalWidth === 0)
          .map((img) => img.src);
      });

      if (brokenImages.length > 0) {
        console.warn(`⚠️ [BROKEN IMAGES] ${p.label} at ${vp.name}:`, brokenImages);
        issues.push({
          type: "broken-images",
          page: p.label,
          viewport: vp.name,
          count: brokenImages.length,
          urls: brokenImages,
        });
      } else {
        console.log(`✅ [IMAGES LOADED] ${p.label} at ${vp.name}`);
      }

      // Capture screenshot
      const shotPath = path.join(outputDir, `${p.label}-${vp.name}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });
    }
  }

  // Test Theme Toggle (Dark Mode & Light Mode)
  console.log("\n--- Testing Theme Toggle (Dark Mode) ---");
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle0" });

  const isHtmlDarkBefore = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  console.log(`Initial theme dark: ${isHtmlDarkBefore}`);

  // Find and click theme toggle button
  const toggleBtn = await page.$("button[aria-label*='theme' i], button[aria-label*='mode' i], button[title*='theme' i]");
  if (toggleBtn) {
    await toggleBtn.click();
    await new Promise((r) => setTimeout(r, 600));
    const isHtmlDarkAfter = await page.evaluate(() => document.documentElement.classList.contains("dark"));
    console.log(`Theme after click dark: ${isHtmlDarkAfter}`);
    const shotPath = path.join(outputDir, "theme-toggle-check.png");
    await page.screenshot({ path: shotPath });
  }

  await browser.close();

  console.log("\n=== AUDIT SUMMARY ===");
  if (issues.length === 0) {
    console.log("🎯 PERFECT RESPONSIVENESS: 0 horizontal overflow defects, 0 broken images, 0 console errors!");
  } else {
    console.warn(`Found ${issues.length} potential issues:`, issues);
  }
}

main().catch(console.error);
