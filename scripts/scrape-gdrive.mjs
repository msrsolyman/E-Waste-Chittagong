import puppeteer from "puppeteer-core";

async function scrapeGDrive() {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log("Navigating to Google Drive folder...");
  await page.goto("https://drive.google.com/drive/folders/1AZ1LG2_bMi7fGbf6P9y2gFhYMe8e9pY9?usp=sharing", {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  // Wait 4 seconds for react/angular dynamic rendering
  await new Promise((r) => setTimeout(r, 4000));

  // Extract file items
  const items = await page.evaluate(() => {
    // Look for data-id or aria-label in items
    const elements = document.querySelectorAll("[data-id], [role='row'], [role='option'], c-wiz div[aria-label]");
    const results = [];
    const seen = new Set();

    elements.forEach((el) => {
      const text = el.innerText || el.getAttribute("aria-label") || "";
      const id = el.getAttribute("data-id") || el.getAttribute("data-target-id");
      if (text && text.trim().length > 0 && !seen.has(text)) {
        seen.add(text);
        results.push({ id, text: text.trim().slice(0, 100) });
      }
    });

    // Also look for img elements or preview images
    const images = Array.from(document.querySelectorAll("img")).map(img => ({
      src: img.src,
      alt: img.alt
    }));

    return { title: document.title, results, imagesCount: images.length, images: images.slice(0, 10) };
  });

  console.log("Scraped page title:", items.title);
  console.log("Found DOM items:", items.results.length);
  items.results.forEach((it, idx) => {
    if (idx < 30) console.log(`[${idx}]`, it.id, "=>", it.text.replace(/\n/g, " | "));
  });

  await page.screenshot({ path: "screenshots/gdrive-folder.png" });
  console.log("Saved screenshots/gdrive-folder.png");

  await browser.close();
}

scrapeGDrive().catch(console.error);
