import puppeteer from "puppeteer-core";
import path from "path";

async function snap() {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/admin/login", { waitUntil: "networkidle2" });
  await page.type("input[type='email']", "admin@ewastechittagong.com");
  await page.type("input[type='password']", "Admin@EWC2026!");
  await page.click("button[type='submit']");
  await page.waitForNavigation({ waitUntil: "networkidle2" });

  await page.goto("http://localhost:3000/admin/audit-logs", { waitUntil: "networkidle2" });
  await page.screenshot({ path: path.resolve("screenshots/22-admin-audit-logs-full-controls.png") });
  console.log("Captured screenshots/22-admin-audit-logs-full-controls.png");
  await browser.close();
}
snap();
