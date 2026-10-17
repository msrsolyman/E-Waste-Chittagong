import puppeteer from "puppeteer-core";
import path from "path";

async function snap() {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto("http://localhost:3000/admin/login", { waitUntil: "networkidle2" });
  await page.type("input[type='email']", "admin@ewastechittagong.com");
  await page.type("input[type='password']", "Admin@EWC2026!");
  await page.click("button[type='submit']");
  await page.waitForNavigation({ waitUntil: "networkidle2" });

  // 1. Gallery modal with MediaUploader
  await page.goto("http://localhost:3000/admin/gallery", { waitUntil: "networkidle2" });
  // Click "+ Add Media Asset" button
  const addBtn = await page.$("button ::-p-text(Add Media Asset)");
  if (addBtn) {
    await addBtn.click();
    await new Promise((r) => setTimeout(r, 600));
    // Click on Category & Image tab in modal
    const mediaTab = await page.$("button ::-p-text(Category & Image)");
    if (mediaTab) await mediaTab.click();
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: path.resolve("screenshots/25-gallery-cloudinary-uploader.png") });
    console.log("Captured screenshots/25-gallery-cloudinary-uploader.png");
  }

  await browser.close();
}
snap();
