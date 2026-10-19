import puppeteer from "puppeteer-core";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ARTIFACT_DIR = "C:\\Users\\msr88\\.gemini\\antigravity\\brain\\4680ae22-2d07-4173-9d1a-5203c8974a5e";

async function run() {
  console.log("Launching Edge to verify Fixed Sidebar Layout...");
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Admin Login
  await page.goto("http://localhost:3000/admin/login", { waitUntil: "networkidle2" });
  await page.type('input[type="email"]', "admin@ewastechittagong.com");
  await page.type('input[type="password"]', "Admin@EWC2026!");
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);
  console.log("Login successful.");

  await page.waitForSelector('aside', { timeout: 15000 });
  await page.waitForSelector('.leaflet-container', { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 2000));

  // 2. Scroll main content down by 700px to bring the map into full view
  console.log("Scrolling main container down by 700px...");
  await page.evaluate(() => {
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTop = 700;
    }
  });
  await new Promise((r) => setTimeout(r, 1000));

  // 3. Measure aside element bounding box
  const asideBox = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    if (!aside) return null;
    const r = aside.getBoundingClientRect();
    return { top: r.top, left: r.left, width: r.width, height: r.height };
  });
  console.log("Aside bounding rect after scroll:", asideBox);

  // 4. Capture screenshot
  const screenshotPath = path.join(ARTIFACT_DIR, "admin_sidebar_fixed_scrolled_1440.png");
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log("Captured:", path.basename(screenshotPath));

  await browser.close();
  console.log("Fixed sidebar verification passed!");
}

run().catch((err) => {
  console.error("QA failed:", err);
  process.exit(1);
});
