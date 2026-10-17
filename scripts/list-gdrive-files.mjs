import puppeteer from "puppeteer-core";
import fs from "fs";

async function listAll() {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });

  await page.goto("https://drive.google.com/drive/folders/1AZ1LG2_bMi7fGbf6P9y2gFhYMe8e9pY9?usp=sharing", {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  // Scroll down multiple times to load all items
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => {
      const container = document.querySelector("[role='main']") || document.body;
      container.scrollTop += 2000;
      window.scrollBy(0, 2000);
    });
    await new Promise((r) => setTimeout(r, 1000));
  }

  const items = await page.evaluate(() => {
    const rows = document.querySelectorAll("[data-id]");
    const fileList = [];
    const seen = new Set();

    rows.forEach((r) => {
      const id = r.getAttribute("data-id");
      const nameEl = r.querySelector("[aria-label]") || r;
      const text = r.innerText || "";
      const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
      const name = lines[0] || "";

      if (id && id.length > 20 && !seen.has(id)) {
        seen.add(id);
        fileList.push({ id, name, text: lines.slice(0, 3).join(" | ") });
      }
    });

    return fileList;
  });

  console.log(`Found total ${items.length} files in Google Drive folder:`);
  items.forEach((it, idx) => console.log(`${idx + 1}. [${it.id}] ${it.name}`));

  fs.writeFileSync("scripts/gdrive-files.json", JSON.stringify(items, null, 2));
  console.log("Saved to scripts/gdrive-files.json");

  await browser.close();
}

listAll().catch(console.error);
