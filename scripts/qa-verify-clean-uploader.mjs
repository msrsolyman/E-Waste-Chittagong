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

  // 2. Settings & Banners (matching the user's screenshot exactly)
  await page.goto("http://localhost:3000/admin/settings", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1200));

  // Click on Media Gallery Banner tab
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const tab = buttons.find((b) => b.textContent?.includes("Media Gallery Banner"));
    if (tab) tab.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  const shotPath = path.join(ARTIFACT_DIR, "admin_clean_minimal_uploader.png");
  await page.screenshot({ path: shotPath, fullPage: false });
  console.log("Captured clean uploader screenshot:", shotPath);

  // Check DOM for any 'Cloudinary' text
  const bodyText = await page.evaluate(() => document.body.innerText);
  const mentionsCloudinary = bodyText.includes("Cloudinary");
  console.log("Mentions Cloudinary in UI text:", mentionsCloudinary);

  await browser.close();
}

run().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
