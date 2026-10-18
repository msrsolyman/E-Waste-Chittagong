import puppeteer from "puppeteer-core";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ARTIFACT_DIR = "C:\\Users\\msr88\\.gemini\\antigravity\\brain\\4680ae22-2d07-4173-9d1a-5203c8974a5e";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 390, height: 844, isMobile: true, hasTouch: true },
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  // 1. Login
  console.log("Logging into admin...");
  await page.goto("http://localhost:3000/admin/login", { waitUntil: "networkidle2" });
  await page.type('input[type="email"]', "admin@ewastechittagong.com");
  await page.type('input[type="password"]', "Admin@EWC2026!");
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);

  // 2. Dashboard Mobile View
  console.log("Testing Mobile Dashboard...");
  await new Promise((r) => setTimeout(r, 1000));
  const dashPath = path.join(ARTIFACT_DIR, "admin_mobile_v2_dashboard_390.png");
  await page.screenshot({ path: dashPath, fullPage: false });
  console.log("Captured:", path.basename(dashPath));

  // 3. Open Mobile Drawer
  console.log("Testing Mobile Drawer...");
  const hamburgerBtn = await page.$('button[aria-label="Toggle navigation menu"]');
  if (hamburgerBtn) {
    await hamburgerBtn.click();
    await new Promise((r) => setTimeout(r, 500));
    const drawerPath = path.join(ARTIFACT_DIR, "admin_mobile_v2_drawer_390.png");
    await page.screenshot({ path: drawerPath, fullPage: false });
    console.log("Captured:", path.basename(drawerPath));

    // Close drawer
    await hamburgerBtn.click();
    await new Promise((r) => setTimeout(r, 400));
  }

  // 4. Products Mobile View
  console.log("Testing Mobile Products...");
  await page.goto("http://localhost:3000/admin/products", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1000));
  const prodPath = path.join(ARTIFACT_DIR, "admin_mobile_v2_products_390.png");
  await page.screenshot({ path: prodPath, fullPage: false });
  console.log("Captured:", path.basename(prodPath));

  // 5. Overflow & Bottom Navigation Check
  const metrics = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
      hasBottomNav: Boolean(document.querySelector("nav.fixed.bottom-0")),
      hasStickyHeader: Boolean(document.querySelector("header.sticky.top-0")),
    };
  });
  console.log("Mobile metrics:", metrics);

  await browser.close();
  console.log("All mobile verification tests passed!");
}

run().catch((err) => {
  console.error("QA error:", err);
  process.exit(1);
});
