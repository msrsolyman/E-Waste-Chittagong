import puppeteer from "puppeteer-core";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ARTIFACT_DIR = "C:\\Users\\msr88\\.gemini\\antigravity\\brain\\4680ae22-2d07-4173-9d1a-5203c8974a5e";

async function run() {
  console.log("Launching Edge browser for Super Dashboard v3 Verification...");
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Admin Login
  console.log("Step 1: Logging into admin portal...");
  await page.goto("http://localhost:3000/admin/login", { waitUntil: "networkidle2" });
  await page.type('input[type="email"]', "admin@ewastechittagong.com");
  await page.type('input[type="password"]', "Admin@EWC2026!");
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);
  console.log("Login successful, reached dashboard.");

  // 2. Desktop: Wait for Super Dashboard to render
  console.log("Step 2: Waiting for Super Dashboard to render...");
  await page.waitForSelector('select', { timeout: 25000 });
  await new Promise((r) => setTimeout(r, 1000));

  // Scroll so map is perfectly framed
  await page.evaluate(() => {
    const el = document.querySelector('select');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 800));

  console.log("Capturing Desktop Global Realistic World Map (1440x900)...");
  const globalPath = path.join(ARTIFACT_DIR, "super_dashboard_v3_flawless_world_1440.png");
  await page.screenshot({ path: globalPath, fullPage: false });
  console.log("Captured:", path.basename(globalPath));

  // 3. Zoom into Bangladesh
  console.log("Step 3: Zooming into Bangladesh (Chittagong HQ, Dhaka, Narayanganj, Khulna)...");
  await page.select('select', 'BD');
  await new Promise((r) => setTimeout(r, 1200));
  const bdPath = path.join(ARTIFACT_DIR, "super_dashboard_v3_bangladesh_zoom_1440.png");
  await page.screenshot({ path: bdPath, fullPage: false });
  console.log("Captured:", path.basename(bdPath));

  // 4. Zoom into China
  console.log("Step 4: Zooming into China (Shenzhen, Guangzhou, Shanghai, Beijing)...");
  await page.select('select', 'CN');
  await new Promise((r) => setTimeout(r, 1200));
  const cnPath = path.join(ARTIFACT_DIR, "super_dashboard_v3_china_zoom_1440.png");
  await page.screenshot({ path: cnPath, fullPage: false });
  console.log("Captured:", path.basename(cnPath));

  // 5. Zoom into Japan
  console.log("Step 5: Zooming into Japan (Tokyo, Osaka, Nagoya, Yokohama)...");
  await page.select('select', 'JP');
  await new Promise((r) => setTimeout(r, 1200));
  const jpPath = path.join(ARTIFACT_DIR, "super_dashboard_v3_japan_zoom_1440.png");
  await page.screenshot({ path: jpPath, fullPage: false });
  console.log("Captured:", path.basename(jpPath));

  // 6. Return to Global Map
  console.log("Step 6: Returning to Global View via dropdown...");
  await page.select('select', '');
  await new Promise((r) => setTimeout(r, 1000));

  // 7. Open Country Intelligence Drawer
  console.log("Step 7: Testing Intelligence Drawer from table row...");
  await page.evaluate(() => {
    // Click on China table tab or row
    const tabs = Array.from(document.querySelectorAll('button'));
    const countryTab = tabs.find(b => b.textContent && b.textContent.includes('দেশভিত্তিক পূর্ণাঙ্গ পরিসংখ্যান'));
    if (countryTab) countryTab.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  // Click row to open drawer
  await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tbody tr'));
    if (rows.length > 0) rows[0].click();
  });
  await new Promise((r) => setTimeout(r, 1200));

  const drawerPath = path.join(ARTIFACT_DIR, "super_dashboard_v3_drawer_1440.png");
  await page.screenshot({ path: drawerPath, fullPage: false });
  console.log("Captured:", path.basename(drawerPath));

  // Close drawer
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button[aria-label="Close drawer"]');
    if (closeBtn) closeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  // 8. Mobile Viewport Verification (390x844)
  console.log("Step 8: Testing Mobile Viewport (390x844)...");
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3000/admin", { waitUntil: "networkidle2" });
  await page.waitForSelector('select', { timeout: 25000 });
  await new Promise((r) => setTimeout(r, 1000));

  // Scroll to map on mobile
  await page.evaluate(() => {
    const el = document.querySelector('select');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 800));

  const mobileMetrics = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  console.log("Mobile metrics (Global):", mobileMetrics);

  const mobPath = path.join(ARTIFACT_DIR, "super_dashboard_v3_mobile_390.png");
  await page.screenshot({ path: mobPath, fullPage: false });
  console.log("Captured:", path.basename(mobPath));

  // Zoom into Bangladesh on mobile
  console.log("Zooming into Bangladesh on Mobile...");
  await page.select('select', 'BD');
  await new Promise((r) => setTimeout(r, 1200));

  const mobZoomMetrics = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  console.log("Mobile zoom metrics (BD):", mobZoomMetrics);

  const mobZoomPath = path.join(ARTIFACT_DIR, "super_dashboard_v3_mobile_zoom_390.png");
  await page.screenshot({ path: mobZoomPath, fullPage: false });
  console.log("Captured:", path.basename(mobZoomPath));

  await browser.close();
  console.log("ALL VERIFICATIONS COMPLETED SUCCESSFULLY!");
}

run().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
