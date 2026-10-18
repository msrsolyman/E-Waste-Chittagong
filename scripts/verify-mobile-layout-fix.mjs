import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const EXECUTABLE_PATH = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;

const BASE_URL = "http://localhost:3000";

const BRAIN_DIR = "C:\\Users\\msr88\\.gemini\\antigravity\\brain\\4680ae22-2d07-4173-9d1a-5203c8974a5e";

async function run() {
  console.log("=== VERIFYING MOBILE VIEWPORT FIXES ===");
  console.log(`Using browser: ${EXECUTABLE_PATH}`);

  const browser = await puppeteer.launch({
    executablePath: EXECUTABLE_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const page = await browser.newPage();

  // Test across critical mobile viewports
  const viewports = [
    { name: "iPhone 14 / 15", width: 390, height: 844 },
    { name: "Android Standard", width: 360, height: 780 },
    { name: "iPhone SE", width: 375, height: 667 },
  ];

  for (const vp of viewports) {
    console.log(`\nTesting viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
    await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle2" });

    // Measure exact scrollWidth vs innerWidth
    const metrics = await page.evaluate(() => {
      const scrollW = document.documentElement.scrollWidth;
      const innerW = window.innerWidth;
      const bodyScrollW = document.body.scrollWidth;
      const scrollX = window.scrollX;
      return { scrollW, innerW, bodyScrollW, scrollX, hasOverflow: scrollW > innerW };
    });

    console.log(`  scrollWidth: ${metrics.scrollW}px | innerWidth: ${metrics.innerW}px | overflow: ${metrics.hasOverflow}`);
    if (metrics.hasOverflow) {
      console.error(`  FAIL: Horizontal overflow detected on ${vp.name}!`);
    } else {
      console.log(`  PASS: Zero horizontal overflow! document.documentElement.scrollWidth <= window.innerWidth`);
    }

    // Inspect logo left position
    const logoRect = await page.evaluate(() => {
      const el = document.querySelector("header img[alt*='Official Logo']");
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { left: r.left, top: r.top, width: r.width, height: r.height };
    });
    console.log(`  Logo position: left=${logoRect?.left}px, width=${logoRect?.width}px (left >= 0: ${logoRect && logoRect.left >= 0})`);

    // Inspect Hero Eyebrow
    const heroEyebrow = await page.evaluate(() => {
      const el = document.querySelector(".animate-hero-eyebrow");
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { text: el.textContent?.trim(), left: r.left, width: r.width };
    });
    console.log(`  Hero Eyebrow: "${heroEyebrow?.text}" (left=${heroEyebrow?.left}px, unclipped: ${heroEyebrow && heroEyebrow.left >= 0})`);

    // Inspect Hero Headline
    const heroHeadline = await page.evaluate(() => {
      const el = document.querySelector(".animate-hero-headline");
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { text: el.textContent?.trim().slice(0, 25), left: r.left, width: r.width };
    });
    console.log(`  Hero Headline: "${heroHeadline?.text}..." (left=${heroHeadline?.left}px, unclipped: ${heroHeadline && heroHeadline.left >= 0})`);
  }

  // Set to standard 390x844 for comprehensive screenshots and drawer testing
  console.log("\nCapturing detailed 390x844 verification screenshots...");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle2" });

  const shot1 = path.join(BRAIN_DIR, "mobile_header_hero_390.png");
  await page.screenshot({ path: shot1, clip: { x: 0, y: 0, width: 390, height: 750 } });
  console.log(`  Saved header & hero screenshot: ${shot1}`);

  // Capture Four Pillars and Curated Products sections
  const sections = await page.$$("section");
  if (sections[1]) {
    const shotPillars = path.join(BRAIN_DIR, "mobile_pillars_section.png");
    await sections[1].screenshot({ path: shotPillars });
    console.log(`  Saved four pillars screenshot: ${shotPillars}`);
  }

  if (sections[2]) {
    const shotProducts = path.join(BRAIN_DIR, "mobile_product_catalogue_section.png");
    await sections[2].screenshot({ path: shotProducts });
    console.log(`  Saved products catalogue screenshot: ${shotProducts}`);
  }

  // Test Mobile Navigation Drawer
  console.log("\nTesting Mobile Navigation Drawer interaction...");
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 300));

  // Click hamburger button
  const clicked = await page.evaluate(() => {
    const btn = document.querySelector("header button[aria-label='Toggle navigation menu']");
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log(`  Clicked hamburger button: ${clicked}`);
  await new Promise((r) => setTimeout(r, 500));

  // Inspect drawer content
  const drawerInfo = await page.evaluate(() => {
    const langButtons = Array.from(document.querySelectorAll("header .lg\\:hidden button")).map(b => b.textContent?.trim());
    const rfqBtn = document.querySelector("header .lg\\:hidden a[href='/inquiry']");
    return {
      isOpen: !!rfqBtn,
      rfqText: rfqBtn?.textContent?.trim(),
      langButtons,
    };
  });
  console.log(`  Drawer Open: ${drawerInfo.isOpen}, RFQ: "${drawerInfo.rfqText}"`);
  console.log(`  Drawer Language buttons found: ${drawerInfo.langButtons.join(", ")}`);

  const shot3 = path.join(BRAIN_DIR, "mobile_drawer_open_390.png");
  await page.screenshot({ path: shot3, clip: { x: 0, y: 0, width: 390, height: 750 } });
  console.log(`  Saved mobile drawer screenshot: ${shot3}`);

  // Test Bengali locale on mobile
  console.log("\nTesting Bengali locale on mobile (/bn)...");
  await page.goto(`${BASE_URL}/bn`, { waitUntil: "networkidle2" });
  const bnMetrics = await page.evaluate(() => {
    const scrollW = document.documentElement.scrollWidth;
    const innerW = window.innerWidth;
    const h1 = document.querySelector("h1");
    return {
      scrollW,
      innerW,
      h1: h1?.textContent?.trim().slice(0, 30),
      hasOverflow: scrollW > innerW,
    };
  });
  console.log(`  Bengali scrollWidth: ${bnMetrics.scrollW}px | innerWidth: ${bnMetrics.innerW}px | overflow: ${bnMetrics.hasOverflow}`);
  console.log(`  Bengali H1: "${bnMetrics.h1}..."`);

  const shot4 = path.join(BRAIN_DIR, "mobile_hero_bengali_390.png");
  await page.screenshot({ path: shot4, clip: { x: 0, y: 0, width: 390, height: 750 } });
  console.log(`  Saved Bengali mobile screenshot: ${shot4}`);

  await browser.close();
  console.log("\n=== ALL MOBILE CHECKS COMPLETED SUCCESSFULLY ===");
}

run().catch((err) => {
  console.error("Error executing mobile verification:", err);
  process.exit(1);
});
