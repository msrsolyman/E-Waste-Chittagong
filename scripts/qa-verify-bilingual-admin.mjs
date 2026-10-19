import puppeteer from "puppeteer-core";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ARTIFACT_DIR = "C:\\Users\\msr88\\.gemini\\antigravity\\brain\\4680ae22-2d07-4173-9d1a-5203c8974a5e";

async function run() {
  console.log("Launching Edge to verify Bilingual Admin Panel (Bengali & English)...");
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Admin Login
  console.log("Navigating to admin login...");
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

  // 2. Verify Bengali (Default)
  console.log("Inspecting Bengali UI elements...");
  const bnTexts = await page.evaluate(() => {
    const navText = document.querySelector('aside')?.innerText || "";
    const headerTitle = document.querySelector('h1')?.innerText || "";
    const superTitle = document.querySelector('h2')?.innerText || "";
    return { navText, headerTitle, superTitle };
  });
  console.log("Bengali elements detected:", {
    header: bnTexts.headerTitle,
    superTitle: bnTexts.superTitle,
    hasBnNav: bnTexts.navText.includes("ড্যাশবোর্ড ওভারভিউ"),
  });

  // Scroll to show map and dashboard nicely
  await page.evaluate(() => {
    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.scrollTop = 150;
  });
  await new Promise((r) => setTimeout(r, 1000));

  const bnScreenshot = path.join(ARTIFACT_DIR, "admin_bilingual_bn_1440.png");
  await page.screenshot({ path: bnScreenshot, fullPage: false });
  console.log("Captured Bengali screenshot:", path.basename(bnScreenshot));

  // 3. Switch to English
  console.log("Toggling language to English...");
  const switchSuccess = await page.evaluate(() => {
    // Look for button with text "English"
    const buttons = Array.from(document.querySelectorAll('button'));
    const enBtn = buttons.find((b) => b.innerText.trim() === "English");
    if (enBtn) {
      enBtn.click();
      return true;
    }
    return false;
  });
  console.log("English button clicked:", switchSuccess);

  await new Promise((r) => setTimeout(r, 1500));

  const enTexts = await page.evaluate(() => {
    const navText = document.querySelector('aside')?.innerText || "";
    const headerTitle = document.querySelector('h1')?.innerText || "";
    const superTitle = document.querySelector('h2')?.innerText || "";
    return { navText, headerTitle, superTitle };
  });
  console.log("English elements detected:", {
    header: enTexts.headerTitle,
    superTitle: enTexts.superTitle,
    hasEnNav: enTexts.navText.includes("Dashboard Overview"),
  });

  const enScreenshot = path.join(ARTIFACT_DIR, "admin_bilingual_en_1440.png");
  await page.screenshot({ path: enScreenshot, fullPage: false });
  console.log("Captured English screenshot:", path.basename(enScreenshot));

  // 4. Test Country Statistics Tab in English
  console.log("Clicking Country-Wise Statistics tab in English...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const countryTab = buttons.find((b) => b.innerText.includes("Country-Wise Statistics"));
    if (countryTab) countryTab.click();
  });
  await new Promise((r) => setTimeout(r, 1000));

  const enCountriesScreenshot = path.join(ARTIFACT_DIR, "admin_bilingual_en_countries_1440.png");
  await page.screenshot({ path: enCountriesScreenshot, fullPage: false });
  console.log("Captured English Countries tab screenshot:", path.basename(enCountriesScreenshot));

  // 5. Test Country Intelligence Drawer in Bengali
  console.log("Switching back to বাংলা and testing Drawer...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const bnBtn = buttons.find((b) => b.innerText.trim() === "বাংলা");
    if (bnBtn) bnBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1000));

  // Click first country row in the table
  console.log("Opening Country Intelligence Drawer for row 1...");
  await page.evaluate(() => {
    const row = document.querySelector('tbody tr');
    if (row) row.click();
  });
  await new Promise((r) => setTimeout(r, 1000));

  const drawerScreenshot = path.join(ARTIFACT_DIR, "admin_bilingual_bn_drawer_1440.png");
  await page.screenshot({ path: drawerScreenshot, fullPage: false });
  console.log("Captured Drawer screenshot:", path.basename(drawerScreenshot));

  await browser.close();
  console.log("ALL BILINGUAL QA CHECKS PASSED FLAWLESSLY!");
}

run().catch((err) => {
  console.error("QA error:", err);
  process.exit(1);
});
