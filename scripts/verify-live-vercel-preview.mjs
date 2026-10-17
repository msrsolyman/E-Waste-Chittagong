const PREVIEW_BASE_URL = "https://e-waste-chittagong-git-audit-fix-preview-e-waste-chittagong.vercel.app";

const LOCALES = ["en", "bn", "zh-CN", "ja"];
const ROUTES = [
  "",
  "/products",
  "/categories",
  "/gallery",
  "/about",
  "/process",
  "/services",
  "/inquiry",
  "/contact",
  "/privacy",
];

const SLUGS = [
  "server-motherboard-grade-a",
  "sorted-cpu-ceramic-fiber",
  "telecom-base-station-boards",
];

async function main() {
  console.log("=== VERIFYING LIVE VERCEL PREVIEW DEPLOYMENT ===");
  console.log(`Target URL: ${PREVIEW_BASE_URL}\n`);

  let total = 0;
  let passed = 0;
  const errors = [];

  // 1. Verify Root and Headers
  const rootRes = await fetch(`${PREVIEW_BASE_URL}/en`);
  console.log("Root /en Status:", rootRes.status);
  console.log("Vercel Headers:");
  for (const [k, v] of rootRes.headers.entries()) {
    if (k.startsWith("x-vercel") || k.includes("cache") || k.includes("deployment")) {
      console.log(`  ${k}: ${v}`);
    }
  }

  const rootHtml = await rootRes.text();
  console.log("\nHomepage Checks:");
  console.log("- Contains Operations Reel:", rootHtml.includes("Chittagong Facility Live Operations"));
  console.log("- Contains Cloudinary Media:", rootHtml.includes("res.cloudinary.com"));
  console.log("- Cleaned test product removed from public:", !rootHtml.includes("Test High Purity Server RAM"));

  // 2. Test 4 Locales Across All Core Pages
  console.log("\n--- Testing All Core Pages in 4 Locales ---");
  for (const loc of LOCALES) {
    for (const r of ROUTES) {
      total++;
      const url = `${PREVIEW_BASE_URL}/${loc}${r}`;
      try {
        const res = await fetch(url);
        if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        if (html.includes("Application error")) throw new Error("Application error detected");
        console.log(`✅ [200 OK] /${loc}${r}`);
        passed++;
      } catch (err) {
        console.error(`❌ [FAIL] /${loc}${r}: ${err.message}`);
        errors.push({ url, error: err.message });
      }
    }
  }

  // 3. Test Product Detail Pages in 4 Locales
  console.log("\n--- Testing Product Detail Pages in 4 Locales ---");
  for (const loc of LOCALES) {
    for (const slug of SLUGS) {
      total++;
      const url = `${PREVIEW_BASE_URL}/${loc}/products/${slug}`;
      try {
        const res = await fetch(url);
        if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        if (html.includes("Application error")) throw new Error("Application error detected");
        console.log(`✅ [200 OK] /${loc}/products/${slug}`);
        passed++;
      } catch (err) {
        console.error(`❌ [FAIL] /${loc}/products/${slug}: ${err.message}`);
        errors.push({ url, error: err.message });
      }
    }
  }

  // 4. Test Gallery with Real Cloudinary Video Lightbox
  console.log("\n--- Testing Gallery Page ---");
  const galleryRes = await fetch(`${PREVIEW_BASE_URL}/en/gallery`);
  const galleryHtml = await galleryRes.text();
  console.log("- Gallery contains verified badges:", galleryHtml.includes("Confirmed Operation") || galleryHtml.includes("Verified"));
  console.log("- Gallery contains video assets (.mp4):", galleryHtml.includes(".mp4"));

  console.log(`\n=== LIVE PREVIEW AUDIT RESULTS: ${passed} / ${total} PASSED ===`);
  if (errors.length === 0) {
    console.log("🎯 ALL LIVE VERCEL PREVIEW ROUTES VERIFIED 100% OPERATIONAL!");
  } else {
    console.error("Errors found:", errors);
    process.exit(1);
  }
}

main().catch(console.error);
