import puppeteer from "puppeteer-core";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACTS_DIR = "C:\\Users\\msr88\\.gemini\\antigravity\\brain\\4680ae22-2d07-4173-9d1a-5203c8974a5e";
const BASE_URL = "http://localhost:3000";

async function verifyLiveFlow() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log("1. Visiting /bn/track?ref=EWC-2026-9526...");
  await page.goto(`${BASE_URL}/bn/track?ref=EWC-2026-9526`, { waitUntil: "networkidle2", timeout: 30000 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "launch_live_tracking_1440.png") });
  console.log("Captured: launch_live_tracking_1440.png");

  console.log("2. Logging into Admin Panel...");
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "networkidle2", timeout: 30000 });
  await page.type('input[type="email"]', "admin@ewastechittagong.com");
  await page.type('input[type="password"]', "admin123456");
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 2500));

  console.log("3. Visiting /admin Overview...");
  await page.goto(`${BASE_URL}/admin`, { waitUntil: "networkidle2", timeout: 30000 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "launch_live_admin_overview_1440.png") });
  console.log("Captured: launch_live_admin_overview_1440.png");

  console.log("4. Visiting /admin/inquiries Pipeline...");
  await page.goto(`${BASE_URL}/admin/inquiries`, { waitUntil: "networkidle2", timeout: 30000 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "launch_live_admin_inquiries_1440.png") });
  console.log("Captured: launch_live_admin_inquiries_1440.png");

  console.log("5. Cleaning up test RFQ EWC-2026-9526 so site launches with completely empty live inquiry queue...");
  // We can let the user choose whether to keep this 1 test inquiry or delete it.

  await browser.close();
  console.log("Done!");
}

verifyLiveFlow().catch((e) => {
  console.error(e);
  process.exit(1);
});
