import puppeteer from "puppeteer-core";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACTS_DIR = "C:\\Users\\msr88\\.gemini\\antigravity\\brain\\4680ae22-2d07-4173-9d1a-5203c8974a5e";
const BASE_URL = "http://localhost:3000";

async function captureCleanMap() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log("1. Logging into Admin Panel...");
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "networkidle2", timeout: 30000 });
  await page.type('input[type="email"]', "admin@ewastechittagong.com");
  await page.type('input[type="password"]', "admin123456");
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 2500));

  console.log("2. Visiting Admin Dashboard Overview...");
  await page.goto(`${BASE_URL}/admin`, { waitUntil: "networkidle2", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));

  // Scroll to map section
  await page.evaluate(() => {
    window.scrollTo({ top: 450, behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "clean_map_only_chittagong_1440.png") });
  console.log("Saved: clean_map_only_chittagong_1440.png");

  await browser.close();
  console.log("Map capture finished successfully!");
}

captureCleanMap().catch((err) => {
  console.error("Capture error:", err);
  process.exit(1);
});
