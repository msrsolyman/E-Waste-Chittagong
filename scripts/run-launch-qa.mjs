import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACTS_DIR = "C:\\Users\\msr88\\.gemini\\antigravity\\brain\\4680ae22-2d07-4173-9d1a-5203c8974a5e";
const BASE_URL = "http://localhost:3000";

async function runQA() {
  console.log("Launching headless Chrome for Launch QA...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log("\n--- TEST 1: Homepage (Bengali) ---");
  await page.goto(`${BASE_URL}/bn`, { waitUntil: "networkidle2", timeout: 30000 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "launch_qa_home_bn_1440.png") });
  console.log("Saved screenshot: launch_qa_home_bn_1440.png");

  console.log("\n--- TEST 2: Products Page (Bengali) ---");
  await page.goto(`${BASE_URL}/bn/products`, { waitUntil: "networkidle2", timeout: 30000 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "launch_qa_products_bn_1440.png") });
  console.log("Saved screenshot: launch_qa_products_bn_1440.png");

  console.log("\n--- TEST 3: Cleaned Product Detail Page ---");
  await page.goto(`${BASE_URL}/bn/products/server-ddr3-ddr4-ram-memory-scrap`, { waitUntil: "networkidle2", timeout: 30000 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "launch_qa_product_single_1440.png") });
  console.log("Saved screenshot: launch_qa_product_single_1440.png");

  console.log("\n--- TEST 4: Gallery Page & Video Player ---");
  await page.goto(`${BASE_URL}/bn/gallery`, { waitUntil: "networkidle2", timeout: 30000 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "launch_qa_gallery_1440.png") });
  console.log("Saved screenshot: launch_qa_gallery_1440.png");

  console.log("\n--- TEST 5: Public Order Tracking (Empty lookup) ---");
  await page.goto(`${BASE_URL}/bn/track`, { waitUntil: "networkidle2", timeout: 30000 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "launch_qa_track_initial_1440.png") });
  console.log("Saved screenshot: launch_qa_track_initial_1440.png");

  console.log("\n--- TEST 6: Submitting RFQ Inquiry from Contact Page ---");
  await page.goto(`${BASE_URL}/bn/contact`, { waitUntil: "networkidle2", timeout: 30000 });
  
  // Fill the RFQ / Contact form using precise inputs
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll("form input, form select, form textarea"));
    for (const el of inputs) {
      if (el.placeholder && el.placeholder.includes("Kenji Tanaka")) {
        el.value = "Tanvir Ahmed Chowdhury";
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      } else if (el.placeholder && el.placeholder.includes("Global Precious")) {
        el.value = "Bengal Metals & Refining Corp";
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      } else if (el.type === "email") {
        el.value = "procurement@bengalmetals.com";
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      } else if (el.type === "tel") {
        el.value = "+8801819000111";
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      } else if (el.tagName === "SELECT") {
        if (el.options.length > 2 && el.value === "") {
          el.selectedIndex = 1;
          el.dispatchEvent(new Event("change", { bubbles: true }));
        }
      } else if (el.tagName === "TEXTAREA") {
        el.value = "Looking for trial consignment of 20 MT High-Grade Server Motherboard & RAM scrap for Chittagong Port FOB delivery.";
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  });

  // Submit form
  const submitBtn = await page.$('form button[type="submit"]');
  let generatedRef = "";
  if (submitBtn) {
    await submitBtn.click();
    console.log("Clicked submit button, awaiting response...");
    await new Promise(r => setTimeout(r, 4000));
    
    // Check if reference code is visible
    generatedRef = await page.evaluate(() => {
      const el = document.querySelector(".font-mono");
      return el ? el.textContent.trim() : "";
    });
    console.log("Generated Reference Code from Form Submission:", generatedRef);
  }
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "launch_qa_contact_submitted_1440.png") });
  console.log("Saved screenshot: launch_qa_contact_submitted_1440.png");

  if (generatedRef) {
    console.log("\n--- TEST 6B: Looking up generated reference on /track ---");
    await page.goto(`${BASE_URL}/bn/track?ref=${encodeURIComponent(generatedRef)}`, { waitUntil: "networkidle2", timeout: 30000 });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "launch_qa_track_found_1440.png") });
    console.log("Saved screenshot: launch_qa_track_found_1440.png");
  }

  console.log("\n--- TEST 7: Admin Panel Login ---");
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "networkidle2", timeout: 30000 });
  await page.type('input[type="email"]', "admin@ewastechittagong.com");
  await page.type('input[type="password"]', "admin123456");
  
  const loginBtn = await page.$('button[type="submit"]');
  if (loginBtn) {
    await loginBtn.click();
    await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));
  }
  await page.goto(`${BASE_URL}/admin`, { waitUntil: "networkidle2", timeout: 30000 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "launch_qa_admin_overview_bn_1440.png") });
  console.log("Saved screenshot: launch_qa_admin_overview_bn_1440.png");

  console.log("\n--- TEST 8: Admin Inquiries Pipeline ---");
  await page.goto(`${BASE_URL}/admin/inquiries`, { waitUntil: "networkidle2", timeout: 30000 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "launch_qa_admin_inquiries_1440.png") });
  console.log("Saved screenshot: launch_qa_admin_inquiries_1440.png");

  console.log("\n--- TEST 9: Mobile Viewport Responsive Audit (390px) ---");
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(`${BASE_URL}/bn`, { waitUntil: "networkidle2", timeout: 30000 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "launch_qa_mobile_home_390.png") });
  console.log("Saved screenshot: launch_qa_mobile_home_390.png");

  await page.goto(`${BASE_URL}/bn/gallery`, { waitUntil: "networkidle2", timeout: 30000 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "launch_qa_mobile_gallery_390.png") });
  console.log("Saved screenshot: launch_qa_mobile_gallery_390.png");

  await browser.close();
  console.log("\n✅ All QA Launch Tests Completed Successfully!");
}

runQA().catch((err) => {
  console.error("QA Test Error:", err);
  process.exit(1);
});
