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

  // 1. Desktop English 1440x900
  console.log("\n--- 1. Testing Header at 1440x900 ---");
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/en", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1200));

  const ctaCheck1440 = await page.evaluate(() => {
    const cta = document.querySelector('a[href="/inquiry"], a[href="/en/inquiry"]');
    if (!cta) return { exists: false };
    const rect = cta.getBoundingClientRect();
    return {
      exists: true,
      text: cta.textContent.trim(),
      right: rect.right,
      windowWidth: window.innerWidth,
      isFullyVisible: rect.right <= window.innerWidth,
    };
  });
  console.log("1440px CTA Check:", ctaCheck1440);

  const desktopShot1440 = path.join(ARTIFACT_DIR, "header_refinement_desktop_1440.png");
  await page.screenshot({ path: desktopShot1440, clip: { x: 0, y: 0, width: 1440, height: 120 } });
  console.log("Captured:", path.basename(desktopShot1440));

  // 2. Desktop English 1200x800 (Narrower Laptop Screen)
  console.log("\n--- 2. Testing Header at 1200x800 ---");
  await page.setViewport({ width: 1200, height: 800 });
  await new Promise((r) => setTimeout(r, 500));

  const ctaCheck1200 = await page.evaluate(() => {
    const cta = document.querySelector('a[href="/inquiry"], a[href="/en/inquiry"]');
    if (!cta) return { exists: false };
    const rect = cta.getBoundingClientRect();
    return {
      exists: true,
      text: cta.textContent.trim(),
      right: rect.right,
      windowWidth: window.innerWidth,
      isFullyVisible: rect.right <= window.innerWidth,
    };
  });
  console.log("1200px CTA Check:", ctaCheck1200);

  const desktopShot1200 = path.join(ARTIFACT_DIR, "header_refinement_desktop_1200.png");
  await page.screenshot({ path: desktopShot1200, clip: { x: 0, y: 0, width: 1200, height: 120 } });
  console.log("Captured:", path.basename(desktopShot1200));

  // 3. Desktop Bengali 1440x900
  console.log("\n--- 3. Testing Bengali Header at 1440x900 ---");
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/bn", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1200));

  const ctaCheckBn = await page.evaluate(() => {
    const cta = document.querySelector('a[href="/inquiry"], a[href="/bn/inquiry"]');
    if (!cta) return { exists: false };
    const rect = cta.getBoundingClientRect();
    return {
      exists: true,
      text: cta.textContent.trim(),
      right: rect.right,
      windowWidth: window.innerWidth,
      isFullyVisible: rect.right <= window.innerWidth,
    };
  });
  console.log("Bengali 1440px CTA Check:", ctaCheckBn);

  const bnShot1440 = path.join(ARTIFACT_DIR, "header_refinement_bengali_1440.png");
  await page.screenshot({ path: bnShot1440, clip: { x: 0, y: 0, width: 1440, height: 120 } });
  console.log("Captured:", path.basename(bnShot1440));

  // 4. Mobile Bengali 390x844 & Drawer
  console.log("\n--- 4. Testing Mobile Drawer at 390x844 ---");
  await page.setViewport({ width: 390, height: 844 });
  await page.goto("http://localhost:3000/bn", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1000));

  const menuButton = await page.$('button[aria-label="Toggle navigation menu"]');
  if (menuButton) {
    await menuButton.click();
    await new Promise((r) => setTimeout(r, 500));
    const drawerShot = path.join(ARTIFACT_DIR, "header_refinement_mobile_drawer_390.png");
    await page.screenshot({ path: drawerShot, fullPage: false });
    console.log("Captured:", path.basename(drawerShot));
  }

  await browser.close();
  console.log("\nHeader refinement QA checks completed successfully!");
}

run().catch((err) => {
  console.error("QA error:", err);
  process.exit(1);
});
