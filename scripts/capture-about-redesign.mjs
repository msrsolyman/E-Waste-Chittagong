import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const EXECUTABLE_PATH = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;

const BASE_URL = "http://localhost:3000";
const BRAIN_DIR = "C:\\Users\\msr88\\.gemini\\antigravity\\brain\\4680ae22-2d07-4173-9d1a-5203c8974a5e";

async function run() {
  console.log("=== CAPTURING ABOUT US REDESIGN SCREENSHOTS ===");
  const browser = await puppeteer.launch({
    executablePath: EXECUTABLE_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // 1. Desktop Viewport 1440x900
  console.log("Capturing Desktop 1440x900 /en/about...");
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(`${BASE_URL}/en/about`, { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 800));

  const deskTopHero = path.join(BRAIN_DIR, "about_desktop_hero_1440.png");
  await page.screenshot({ path: deskTopHero, clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log(`  Saved: ${deskTopHero}`);

  // Scroll down to showcase narrative, dual media and metrics
  await page.evaluate(() => window.scrollTo(0, 500));
  await new Promise(r => setTimeout(r, 600));

  const deskNarrative = path.join(BRAIN_DIR, "about_desktop_narrative_and_metrics_1440.png");
  await page.screenshot({ path: deskNarrative, clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log(`  Saved: ${deskNarrative}`);

  // Scroll down to pillars and CTA banner
  await page.evaluate(() => window.scrollTo(0, 1100));
  await new Promise(r => setTimeout(r, 600));

  const deskCTA = path.join(BRAIN_DIR, "about_desktop_cta_banner_1440.png");
  await page.screenshot({ path: deskCTA, clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log(`  Saved: ${deskCTA}`);

  // 2. Mobile Viewport 390x844
  console.log("Capturing Mobile 390x844 /en/about...");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(`${BASE_URL}/en/about`, { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 800));

  const mobHero = path.join(BRAIN_DIR, "about_mobile_hero_390.png");
  await page.screenshot({ path: mobHero, clip: { x: 0, y: 0, width: 390, height: 844 } });
  console.log(`  Saved: ${mobHero}`);

  // Check mobile overflow on /about
  const mobMetrics = await page.evaluate(() => {
    return {
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth
    };
  });
  console.log(`  About Mobile scrollWidth: ${mobMetrics.scrollW}px | innerWidth: ${mobMetrics.innerW}px | overflow: ${mobMetrics.hasOverflow}`);

  // 3. Bengali Locale /bn/about
  console.log("Capturing Bengali Desktop 1440x900 /bn/about...");
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(`${BASE_URL}/bn/about`, { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 800));

  const bnDesktop = path.join(BRAIN_DIR, "about_bengali_desktop_1440.png");
  await page.screenshot({ path: bnDesktop, clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log(`  Saved: ${bnDesktop}`);

  await browser.close();
  console.log("=== CAPTURES FINISHED ===");
}

run().catch((err) => {
  console.error("Capture error:", err);
  process.exit(1);
});
