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
  await page.goto("http://localhost:3000/admin/login", { waitUntil: "networkidle2" });
  await page.type('input[type="email"]', "admin@ewastechittagong.com");
  await page.type('input[type="password"]', "Admin@EWC2026!");
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);

  // 2. Dashboard on Mobile
  await new Promise((r) => setTimeout(r, 1000));
  const dashPath = path.join(ARTIFACT_DIR, "admin_current_mobile_dashboard_390.png");
  await page.screenshot({ path: dashPath, fullPage: false });
  console.log("Captured current mobile dashboard:", dashPath);

  // 3. Products on Mobile
  await page.goto("http://localhost:3000/admin/products", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1000));
  const prodPath = path.join(ARTIFACT_DIR, "admin_current_mobile_products_390.png");
  await page.screenshot({ path: prodPath, fullPage: false });
  console.log("Captured current mobile products:", prodPath);

  // Check horizontal overflow
  const overflow = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  console.log("Mobile overflow metrics:", overflow);

  await browser.close();
}

run().catch((err) => {
  console.error("QA error:", err);
  process.exit(1);
});
