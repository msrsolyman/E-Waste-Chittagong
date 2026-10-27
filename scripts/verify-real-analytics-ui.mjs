import puppeteer from "puppeteer-core";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACTS_DIR = "C:\\Users\\msr88\\.gemini\\antigravity\\brain\\4680ae22-2d07-4173-9d1a-5203c8974a5e";
const BASE_URL = "http://localhost:3000";

async function verifyRealAnalytics() {
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

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "real_analytics_admin_30d_1440.png") });
  console.log("Saved: real_analytics_admin_30d_1440.png");

  // Scroll to geo radar section
  await page.evaluate(() => {
    window.scrollTo({ top: 400, behavior: "instant" });
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "real_analytics_radar_scrolled_1440.png") });
  console.log("Saved: real_analytics_radar_scrolled_1440.png");

  // Click "Today Live" tab
  console.log("3. Clicking 'Today Live' tab...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const todayBtn = buttons.find((b) => b.textContent.includes("Today Live") || b.textContent.includes("আজকে"));
    if (todayBtn) todayBtn.click();
  });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "real_analytics_today_1440.png") });
  console.log("Saved: real_analytics_today_1440.png");

  // Click Country-Wise Statistics tab
  console.log("4. Clicking 'Country-Wise Statistics' tab...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const countryTab = buttons.find((b) => b.textContent.includes("Country-Wise") || b.textContent.includes("দেশভিত্তিক"));
    if (countryTab) countryTab.click();
  });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "real_analytics_countries_table_1440.png") });
  console.log("Saved: real_analytics_countries_table_1440.png");

  await browser.close();
  console.log("Real analytics UI verification finished successfully!");
}

verifyRealAnalytics().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
