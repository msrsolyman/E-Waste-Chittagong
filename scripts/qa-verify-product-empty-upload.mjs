import puppeteer from "puppeteer-core";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ARTIFACT_DIR = "C:\\Users\\msr88\\.gemini\\antigravity\\brain\\4680ae22-2d07-4173-9d1a-5203c8974a5e";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  // 1. Login
  await page.goto("http://localhost:3000/admin/login", { waitUntil: "networkidle2" });
  await page.type('input[type="email"]', "admin@ewastechittagong.com");
  await page.type('input[type="password"]', "Admin@EWC2026!");
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);

  // 2. Products table
  await page.goto("http://localhost:3000/admin/products", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1000));

  // Click "+ Add New Product"
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const addBtn = buttons.find((b) => b.textContent?.includes("Add New Product") || b.textContent?.includes("Add Product"));
    if (addBtn) addBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // Switch to "Product Image" tab
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const imgTab = buttons.find((b) => b.textContent?.includes("Product Image") || b.textContent?.includes("Media"));
    if (imgTab) imgTab.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  const shotPath = path.join(ARTIFACT_DIR, "admin_add_product_empty_dropzone.png");
  await page.screenshot({ path: shotPath, fullPage: false });
  console.log("Captured Add Product Empty Dropzone:", shotPath);

  // Check that dropzone is present and no pre-filled image exists
  const hasDropzone = await page.evaluate(() => {
    return document.body.innerText.includes("Drag & drop file here") && document.body.innerText.includes("Select File from Computer / Phone");
  });
  console.log("Has clean empty upload dropzone:", hasDropzone);

  await browser.close();
}

run().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
