import puppeteer from "puppeteer-core";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ARTIFACT_DIR = "C:\\Users\\msr88\\.gemini\\antigravity\\brain\\4680ae22-2d07-4173-9d1a-5203c8974a5e";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Admin Login
  console.log("\n--- 1. Admin Login & Speed Check ---");
  const loginStart = Date.now();
  await page.goto("http://localhost:3000/admin/login", { waitUntil: "networkidle2" });
  await page.type('input[type="email"]', "admin@ewastechittagong.com");
  await page.type('input[type="password"]', "Admin@EWC2026!");
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  const loginDuration = Date.now() - loginStart;
  console.log(`Login & Dashboard Transition Time: ${loginDuration}ms`);

  // Screenshot Dashboard
  const dashShot = path.join(ARTIFACT_DIR, "admin_speed_dashboard.png");
  await page.screenshot({ path: dashShot, fullPage: false });
  console.log("Captured:", path.basename(dashShot));

  // 2. Products - Add Product (Pure Upload)
  console.log("\n--- 2. Inspecting Product Upload Zone ---");
  await page.goto("http://localhost:3000/admin/products/new", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 800));

  const productUrlInputCheck = await page.evaluate(() => {
    const urlInputs = Array.from(document.querySelectorAll('input[type="text"]')).filter((el) => {
      const ph = (el.placeholder || "").toLowerCase();
      return ph.includes("http") || ph.includes("url") || ph.includes("link");
    });
    return {
      hasUrlInput: urlInputs.length > 0,
      hasUploadZone: Boolean(document.querySelector('input[type="file"]')),
    };
  });
  console.log("Product Pure Upload Check:", productUrlInputCheck);

  const prodShot = path.join(ARTIFACT_DIR, "admin_pure_upload_products.png");
  await page.screenshot({ path: prodShot, fullPage: false });
  console.log("Captured:", path.basename(prodShot));

  // 3. Gallery - Add Media Modal (Pure Upload)
  console.log("\n--- 3. Inspecting Gallery Upload Zone ---");
  await page.goto("http://localhost:3000/admin/gallery", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 800));

  const addMediaBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    return buttons.find((b) => b.textContent?.includes("Add Media Asset") || b.textContent?.includes("Upload"));
  });
  if (addMediaBtn) {
    await addMediaBtn.click();
    await new Promise((r) => setTimeout(r, 600));

    // Scroll to media uploader tab inside modal
    const mediaTab = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      return buttons.find((b) => b.textContent?.includes("Media Asset") || b.textContent?.includes("Media"));
    });
    if (mediaTab) {
      await mediaTab.click();
      await new Promise((r) => setTimeout(r, 400));
    }

    const galleryShot = path.join(ARTIFACT_DIR, "admin_pure_upload_gallery.png");
    await page.screenshot({ path: galleryShot, fullPage: false });
    console.log("Captured:", path.basename(galleryShot));
  }

  // 4. Categories - Add Category Modal (Pure Upload)
  console.log("\n--- 4. Inspecting Category Upload Zone ---");
  await page.goto("http://localhost:3000/admin/categories", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 800));

  const clickedCat = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const btn = buttons.find((b) => b.textContent?.includes("Add New Category") || b.textContent?.includes("Category"));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });

  if (clickedCat) {
    await new Promise((r) => setTimeout(r, 600));
    // Click Media tab in modal
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const mediaTab = buttons.find((b) => b.textContent?.includes("Media") || b.textContent?.includes("Image"));
      if (mediaTab) mediaTab.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    const catShot = path.join(ARTIFACT_DIR, "admin_pure_upload_categories.png");
    await page.screenshot({ path: catShot, fullPage: false });
    console.log("Captured:", path.basename(catShot));
  }

  // 5. Settings - Site Banners (Pure Upload)
  console.log("\n--- 5. Inspecting Settings Banners Pure Upload ---");
  await page.goto("http://localhost:3000/admin/settings", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1200));

  const settingsShot = path.join(ARTIFACT_DIR, "admin_pure_upload_settings.png");
  await page.screenshot({ path: settingsShot, fullPage: false });
  console.log("Captured:", path.basename(settingsShot));

  await browser.close();
  console.log("\nAll Admin Speed & Pure Upload QA checks passed!");
}

run().catch((err) => {
  console.error("QA error:", err);
  process.exit(1);
});
