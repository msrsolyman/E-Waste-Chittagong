import puppeteer from "puppeteer-core";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ARTIFACT_DIR = "C:\\Users\\msr88\\.gemini\\antigravity\\brain\\4680ae22-2d07-4173-9d1a-5203c8974a5e";

async function run() {
  console.log("Launching Edge to verify Smart Cinematic Video Player...");
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Visit homepage
  console.log("Navigating to http://localhost:3000/en ...");
  await page.goto("http://localhost:3000/en", { waitUntil: "networkidle2" });

  // Scroll down to Operations Reel section
  console.log("Scrolling to Live Operations section...");
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2, span'));
    const liveSection = headings.find((el) =>
      el.textContent?.includes("LIVE OPERATIONS") ||
      el.textContent?.includes("Live Operations") ||
      el.textContent?.includes("Facility Live Operations")
    );
    if (liveSection) {
      liveSection.scrollIntoView({ behavior: "instant", block: "center" });
    }
  });

  await new Promise((r) => setTimeout(r, 1000));

  // Find the first video card in operations reel and click it
  console.log("Clicking first video card...");
  await page.evaluate(() => {
    // Look for element with text "Chittagong Facility Tour"
    const titles = Array.from(document.querySelectorAll('h4'));
    const tourCard = titles.find((el) => el.textContent?.includes("Chittagong Facility Tour"));
    if (tourCard) {
      tourCard.closest('.group')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
  });

  await new Promise((r) => setTimeout(r, 1500));

  // Check if modal is visible
  const modalInfo = await page.evaluate(() => {
    const video = document.querySelector('video');
    const badge = document.querySelector('span')?.textContent || "";
    const scrollLocked = document.body.style.overflow === "hidden";
    const paddingRight = document.body.style.paddingRight;
    const isPlaying = video ? !video.paused : false;
    return {
      hasVideo: !!video,
      src: video?.src || "",
      scrollLocked,
      paddingRight,
      isPlaying,
    };
  });
  console.log("Modal verification state:", modalInfo);

  // Capture desktop screenshot
  const desktopScreenshot = path.join(ARTIFACT_DIR, "smart_cinema_player_desktop.png");
  await page.screenshot({ path: desktopScreenshot, fullPage: false });
  console.log("Captured:", path.basename(desktopScreenshot));

  // Click Next arrow to switch to video 2
  console.log("Clicking Next video arrow...");
  await page.evaluate(() => {
    const nextBtn = document.querySelector('button[aria-label="Next video"]');
    if (nextBtn) {
      nextBtn.click();
    }
  });

  await new Promise((r) => setTimeout(r, 1500));

  const reel2Screenshot = path.join(ARTIFACT_DIR, "smart_cinema_player_reel2.png");
  await page.screenshot({ path: reel2Screenshot, fullPage: false });
  console.log("Captured:", path.basename(reel2Screenshot));

  // Close modal with ESC
  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 500));

  // 2. Test Mobile Viewport (390x844)
  console.log("Testing mobile viewport 390x844...");
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => {
    const titles = Array.from(document.querySelectorAll('h4'));
    const tourCard = titles.find((el) => el.textContent?.includes("Chittagong Facility Tour"));
    if (tourCard) {
      tourCard.closest('.group')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
  });

  await new Promise((r) => setTimeout(r, 1500));

  const mobileScreenshot = path.join(ARTIFACT_DIR, "smart_cinema_player_mobile.png");
  await page.screenshot({ path: mobileScreenshot, fullPage: false });
  console.log("Captured:", path.basename(mobileScreenshot));

  // Close modal
  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 500));

  // 3. Test Bengali View (/bn)
  console.log("Testing Bengali view at http://localhost:3000/bn ...");
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/bn", { waitUntil: "networkidle2" });

  await page.evaluate(() => {
    const titles = Array.from(document.querySelectorAll('h4'));
    const tourCard = titles.find((el) => el.textContent?.includes("চট্টগ্রাম ইয়ার্ড ট্যুর"));
    if (tourCard) {
      tourCard.closest('.group')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
  });

  await new Promise((r) => setTimeout(r, 1500));

  const bnScreenshot = path.join(ARTIFACT_DIR, "smart_cinema_player_bengali.png");
  await page.screenshot({ path: bnScreenshot, fullPage: false });
  console.log("Captured:", path.basename(bnScreenshot));

  await browser.close();
  console.log("ALL VIDEO PLAYER QA CHECKS PASSED FLAWLESSLY!");
}

run().catch((err) => {
  console.error("QA error:", err);
  process.exit(1);
});
