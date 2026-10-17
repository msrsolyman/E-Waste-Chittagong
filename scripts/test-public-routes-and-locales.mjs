const BASE_URL = "http://localhost:3000";

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

async function main() {
  console.log("=== COMPREHENSIVE 4-LANGUAGE PUBLIC ROUTE AUDIT ===");
  let passed = 0;
  let total = 0;
  const errors = [];

  for (const locale of LOCALES) {
    console.log(`\n--- Testing Locale: ${locale.toUpperCase()} ---`);
    for (const route of ROUTES) {
      total++;
      const url = `${BASE_URL}/${locale}${route}`;
      try {
        const res = await fetch(url);
        if (res.status !== 200) {
          throw new Error(`HTTP Status ${res.status}`);
        }
        const text = await res.text();

        // Check for missing translation indicators (e.g. key missing fallback raw key)
        if (text.includes("MISSING_MESSAGE") || text.includes("Could not resolve message")) {
          throw new Error(`Detected missing translation message in ${url}`);
        }

        // Check for Next.js error page
        if (text.includes("Application error: a client-side exception has occurred")) {
          throw new Error(`Client-side exception occurred in ${url}`);
        }

        console.log(`✅ [200 OK] /${locale}${route}`);
        passed++;
      } catch (err) {
        console.error(`❌ [FAIL] /${locale}${route}: ${err.message}`);
        errors.push({ url, error: err.message });
      }
    }
  }

  // Also test product detail pages in all 4 locales
  const slugs = [
    "server-motherboard-grade-a",
    "sorted-cpu-ceramic-fiber",
    "telecom-base-station-boards",
  ];

  console.log("\n--- Testing Product Detail Pages in 4 Locales ---");
  for (const locale of LOCALES) {
    for (const slug of slugs) {
      total++;
      const url = `${BASE_URL}/${locale}/products/${slug}`;
      try {
        const res = await fetch(url);
        if (res.status !== 200) {
          throw new Error(`HTTP Status ${res.status}`);
        }
        const text = await res.text();
        if (text.includes("Application error")) {
          throw new Error(`Client error in ${url}`);
        }
        console.log(`✅ [200 OK] /${locale}/products/${slug}`);
        passed++;
      } catch (err) {
        console.error(`❌ [FAIL] /${locale}/products/${slug}: ${err.message}`);
        errors.push({ url, error: err.message });
      }
    }
  }

  console.log(`\n=== AUDIT RESULTS: ${passed} / ${total} PASSED ===`);
  if (errors.length > 0) {
    console.error("Errors found:", errors);
    process.exit(1);
  } else {
    console.log("🎯 ALL PUBLIC ROUTES AND LOCALES VERIFIED 100%!");
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
