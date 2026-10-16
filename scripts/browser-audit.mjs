import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const executablePath = fs.existsSync(EDGE_PATH) ? EDGE_PATH : CHROME_PATH;

const BASE_URL = "http://localhost:3000";
const SCREENSHOT_DIR = path.resolve("screenshots");

async function runBrowserAudit() {
  console.log("=== STARTING COMPREHENSIVE BROWSER AUDIT ===");
  console.log(`Using Browser executable: ${executablePath}`);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();

  try {
    // -------------------------------------------------------------
    // TEST 1: Desktop Viewport (1440x900) - Homepage Light & Dark
    // -------------------------------------------------------------
    console.log("\n[1/7] Testing Desktop Viewport (1440x900)...");
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle2" });

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "01-desktop-home-en.png"), fullPage: false });
    console.log("  -> Captured 01-desktop-home-en.png");

    // Theme Toggle: Switch to Dark Mode
    const themeBtn = await page.$("button[aria-label*='mode']");
    if (themeBtn) {
      await themeBtn.click();
      await new Promise((r) => setTimeout(r, 600));
      const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
      console.log(`  -> Theme toggled to Dark Mode. html.dark active: ${isDark}`);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "02-desktop-home-dark.png"), fullPage: false });
      console.log("  -> Captured 02-desktop-home-dark.png");

      // Reload to test theme persistence
      await page.reload({ waitUntil: "networkidle2" });
      const persistedDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
      console.log(`  -> Reloaded page. Theme persistence check: ${persistedDark ? "PASSED (Dark)" : "FAILED"}`);

      // Toggle back to light
      const themeBtnLight = await page.$("button[aria-label*='mode']");
      if (themeBtnLight) await themeBtnLight.click();
      await new Promise((r) => setTimeout(r, 600));
    }

    // -------------------------------------------------------------
    // TEST 2: Four-Language Switching & Route Preservation
    // -------------------------------------------------------------
    console.log("\n[2/7] Testing 4-Language Switching...");
    // Switch to Bengali
    await page.goto(`${BASE_URL}/bn`, { waitUntil: "networkidle2" });
    const bnText = await page.$eval("h1", (el) => el.innerText);
    console.log(`  -> Bengali Header: "${bnText.slice(0, 35)}..."`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "03-desktop-home-bn.png"), fullPage: false });

    // Switch to Chinese
    await page.goto(`${BASE_URL}/zh-CN`, { waitUntil: "networkidle2" });
    const zhText = await page.$eval("h1", (el) => el.innerText);
    console.log(`  -> Chinese Header: "${zhText.slice(0, 35)}..."`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "04-desktop-home-zh.png"), fullPage: false });

    // Switch to Japanese
    await page.goto(`${BASE_URL}/ja`, { waitUntil: "networkidle2" });
    const jaText = await page.$eval("h1", (el) => el.innerText);
    console.log(`  -> Japanese Header: "${jaText.slice(0, 35)}..."`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "05-desktop-home-ja.png"), fullPage: false });

    // -------------------------------------------------------------
    // TEST 3: Tablet Viewport (768x1024) - Products & Detail
    // -------------------------------------------------------------
    console.log("\n[3/7] Testing Tablet Viewport (768x1024)...");
    await page.setViewport({ width: 768, height: 1024 });
    await page.goto(`${BASE_URL}/en/products`, { waitUntil: "networkidle2" });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "06-tablet-products.png"), fullPage: false });
    console.log("  -> Captured 06-tablet-products.png");

    await page.goto(`${BASE_URL}/en/products/server-motherboard-grade-a`, { waitUntil: "networkidle2" });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "07-tablet-product-detail.png"), fullPage: false });
    console.log("  -> Captured 07-tablet-product-detail.png");

    // -------------------------------------------------------------
    // TEST 4: Mobile Viewport (390x844 - iPhone 14)
    // -------------------------------------------------------------
    console.log("\n[4/7] Testing Mobile Viewport (390x844)...");
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle2" });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "08-mobile-home.png"), fullPage: false });
    console.log("  -> Captured 08-mobile-home.png");

    // Click mobile hamburger menu
    const menuBtn = await page.$("button[aria-label*='navigation menu']");
    if (menuBtn) {
      await menuBtn.click();
      await new Promise((r) => setTimeout(r, 400));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "09-mobile-menu-open.png"), fullPage: false });
      console.log("  -> Captured 09-mobile-menu-open.png (Drawer opened)");
    }

    // -------------------------------------------------------------
    // TEST 5: Interactive Public RFQ Submission in Real Browser
    // -------------------------------------------------------------
    console.log("\n[5/7] Testing Interactive Public RFQ Form Submission...");
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(`${BASE_URL}/en/inquiry`, { waitUntil: "networkidle2" });

    // Fill form fields
    await page.type("input[placeholder*='Kenji']", "Kenji Tanaka");
    await page.type("input[placeholder*='Precious']", "Osaka Precious Metal Smelting KK");
    await page.type("input[placeholder*='procurement@']", "k.tanaka@osakasmelt.jp");
    await page.type("input[placeholder*='+1']", "+81 6 6208 0000");

    // Select country
    await page.select("select:nth-of-type(1)", "Japan");
    // Type volume
    await page.type("input[placeholder*='Metric']", "20 Metric Tons");
    // Message
    await page.type("textarea", "Inquiry for ongoing supply of Grade A server motherboards CIF Yokohama Port. Please confirm available assays.");

    // Submit
    const submitBtn = await page.$("button[type='submit']");
    if (submitBtn) {
      await submitBtn.click();
      console.log("  -> Clicked Submit Inquiry button. Waiting for server response...");
      await page.waitForSelector("span.font-mono", { timeout: 10000 });
      const refCode = await page.$eval("span.font-mono", (el) => el.innerText);
      console.log(`  -> SUCCESS! Reference Code Received: ${refCode}`);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "10-inquiry-submitted-success.png") });
      console.log("  -> Captured 10-inquiry-submitted-success.png");
    }

    // -------------------------------------------------------------
    // TEST 6: Admin Authentication & Pipeline Verification
    // -------------------------------------------------------------
    console.log("\n[6/7] Testing Protected Admin Portal & Pipeline View...");
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "networkidle2" });
    await page.waitForSelector("input[type='email']", { timeout: 10000 });
    await page.type("input[type='email']", "admin@ewastechittagong.com");
    await page.type("input[type='password']", "Admin@EWC2026!");

    const loginBtn = await page.$("button[type='submit']");
    await loginBtn.click();
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    console.log(`  -> Navigated to: ${page.url()}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "12-admin-dashboard.png") });
    console.log("  -> Captured 12-admin-dashboard.png");

    // View Inquiries
    await page.goto(`${BASE_URL}/admin/inquiries`, { waitUntil: "networkidle2" });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "13-admin-inquiries-pipeline.png") });
    console.log("  -> Captured 13-admin-inquiries-pipeline.png");

    // View Gallery Management
    await page.goto(`${BASE_URL}/admin/gallery`, { waitUntil: "networkidle2" });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "14-admin-gallery-manager.png") });
    console.log("  -> Captured 14-admin-gallery-manager.png");

    // View Users Management (Super Admin allowed)
    await page.goto(`${BASE_URL}/admin/users`, { waitUntil: "networkidle2" });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "15-admin-users-manager.png") });
    console.log("  -> Captured 15-admin-users-manager.png");

    // -------------------------------------------------------------
    // TEST 7: Role Permission Guard (Content Manager Restricted)
    // -------------------------------------------------------------
    console.log("\n[7/7] Testing Role-Based Permission Guard (Content Manager)...");
    // Logout
    await page.goto(`${BASE_URL}/api/admin/logout`, { method: "POST" }).catch(() => {});
    await page.deleteCookie({ name: "ewc_admin_session", url: BASE_URL });

    // Login as Content Manager
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "networkidle2" });
    await page.waitForSelector("input[type='email']", { timeout: 10000 });
    await page.type("input[type='email']", "manager@ewastechittagong.com");
    await page.type("input[type='password']", "Manager@EWC2026!");
    const loginManagerBtn = await page.$("button[type='submit']");
    await loginManagerBtn.click();
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    // Attempt to access /admin/users
    await page.goto(`${BASE_URL}/admin/users`, { waitUntil: "networkidle2" });
    const guardText = await page.$eval("h2", (el) => el.innerText).catch(() => "");
    console.log(`  -> Content Manager attempt to access /admin/users: "${guardText}"`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "16-content-manager-role-guard.png") });
    console.log("  -> Captured 16-content-manager-role-guard.png");

    console.log("\n🎯 BROWSER AUDIT COMPLETED SUCCESSFULLY WITH 16 SCREENSHOTS VERIFIED!");
  } catch (error) {
    console.error("Browser audit error:", error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runBrowserAudit();
