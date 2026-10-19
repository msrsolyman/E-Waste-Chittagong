import puppeteer from "puppeteer-core";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ARTIFACT_DIR = "C:\\Users\\msr88\\.gemini\\antigravity\\brain\\4680ae22-2d07-4173-9d1a-5203c8974a5e";

async function run() {
  console.log("Launching Edge browser for Leaflet Map QA Verification...");
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

  // 2. Wait for Leaflet map to load
  console.log("Step 2: Waiting for Leaflet map tiles and container...");
  await page.waitForSelector('.leaflet-container', { timeout: 25000 });
  // Wait 3 seconds for CartoDB tiles to fetch
  await new Promise((r) => setTimeout(r, 3000));

  // Scroll map into view
  await page.evaluate(() => {
    const el = document.querySelector('.leaflet-container');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 1000));

  console.log("Capturing Desktop Global Leaflet Map (1440x900)...");
  const globalPath = path.join(ARTIFACT_DIR, "leaflet_map_desktop_global_1440.png");
  await page.screenshot({ path: globalPath, fullPage: false });
  console.log("Captured:", path.basename(globalPath));

  // 3. Click Bangladesh Pill
  console.log("Step 3: Clicking Bangladesh pill...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const bdBtn = buttons.find((b) => b.textContent?.includes('বাংলাদেশ'));
    if (bdBtn) bdBtn.click();
  });
  await new Promise((r) => setTimeout(r, 2500));
  const bdPath = path.join(ARTIFACT_DIR, "leaflet_map_bangladesh_1440.png");
  await page.screenshot({ path: bdPath, fullPage: false });
  console.log("Captured:", path.basename(bdPath));

  // 4. Click Germany Pill
  console.log("Step 4: Clicking Germany pill...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const deBtn = buttons.find((b) => b.textContent?.includes('জার্মানি'));
    if (deBtn) deBtn.click();
  });
  await new Promise((r) => setTimeout(r, 2500));
  const dePath = path.join(ARTIFACT_DIR, "leaflet_map_germany_1440.png");
  await page.screenshot({ path: dePath, fullPage: false });
  console.log("Captured:", path.basename(dePath));

  // 5. Mobile Viewport (390x844)
  console.log("Step 5: Testing Mobile Viewport (390x844)...");
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3000/admin", { waitUntil: "networkidle2" });
  await page.waitForSelector('.leaflet-container', { timeout: 25000 });
  await new Promise((r) => setTimeout(r, 2500));

  await page.evaluate(() => {
    const el = document.querySelector('.leaflet-container');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 1000));

  const mobilePath = path.join(ARTIFACT_DIR, "leaflet_map_mobile_390.png");
  await page.screenshot({ path: mobilePath, fullPage: false });
  console.log("Captured:", path.basename(mobilePath));

  await browser.close();
  console.log("QA verification complete! All screenshots saved.");
}

run().catch((err) => {
  console.error("QA script failed:", err);
  process.exit(1);
});
