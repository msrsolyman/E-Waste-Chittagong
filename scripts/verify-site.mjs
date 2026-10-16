const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("=== STARTING AUTOMATED ACCEPTANCE TESTS ===");
  let passed = 0;
  let total = 0;

  async function assertTest(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
    }
  }

  // 1. Language routes
  await assertTest("Default English homepage renders (200 OK)", async () => {
    const res = await fetch(`${BASE_URL}/en`);
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
    const text = await res.text();
    if (!text.includes("E-Waste Chittagong")) throw new Error("Missing brand title");
    if (!text.includes("B2B Product Catalogue")) throw new Error("Missing catalogue section");
  });

  await assertTest("Bengali localized route renders (200 OK & Bengali text)", async () => {
    const res = await fetch(`${BASE_URL}/bn`);
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
    const text = await res.text();
    if (!text.includes("চট্টগ্রাম")) throw new Error("Missing Bengali translation text");
  });

  await assertTest("Simplified Chinese localized route renders (200 OK & Chinese text)", async () => {
    const res = await fetch(`${BASE_URL}/zh-CN`);
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
    const text = await res.text();
    if (!text.includes("吉大港")) throw new Error("Missing Chinese translation text");
  });

  await assertTest("Japanese localized route renders (200 OK & Japanese text)", async () => {
    const res = await fetch(`${BASE_URL}/ja`);
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
    const text = await res.text();
    if (!text.includes("チッタゴン")) throw new Error("Missing Japanese translation text");
  });

  // 2. Catalogue and product details
  await assertTest("Public product catalogue page renders (200 OK)", async () => {
    const res = await fetch(`${BASE_URL}/en/products`);
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
    const text = await res.text();
    if (!text.includes("Server Motherboard Scrap")) throw new Error("Missing product title in catalogue");
  });

  await assertTest("Product detail page renders with technical specs (200 OK)", async () => {
    const res = await fetch(`${BASE_URL}/en/products/server-motherboard-grade-a`);
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
    const text = await res.text();
    if (!text.includes("Commercial &amp; Technical Specifications") && !text.includes("Commercial & Technical Specifications")) {
      throw new Error("Missing specs header");
    }
  });

  // 3. Inquiry API Submission
  let testRefNo = "";
  await assertTest("Public inquiry API validates and returns reference number", async () => {
    const res = await fetch(`${BASE_URL}/api/inquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Hiroshi Sato",
        companyName: "Tokyo Precious Recycling KK",
        email: "hsato@tokyorecycling.jp",
        phoneOrWhatsApp: "+81 3 9999 8888",
        country: "Japan",
        interestedCategory: "Printed Circuit Boards (PCBs)",
        estimatedQty: "10 Metric Tons",
        message: "Requesting trial container quotation for Grade A motherboards to Yokohama Port.",
        productId: null,
      }),
    });
    if (res.status !== 200) throw new Error(`Inquiry submission returned status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.referenceNo) throw new Error("Missing reference number in response");
    testRefNo = data.referenceNo;
    console.log(`   -> Generated Reference No: ${testRefNo}`);
  });

  // 4. Honeypot Spam Protection
  await assertTest("Inquiry API blocks automated spam bots with honeypot field", async () => {
    const res = await fetch(`${BASE_URL}/api/inquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Bot Spammer",
        companyName: "Bot Spammer LLC",
        email: "bot@spam.com",
        country: "United States",
        message: "Buy cheap backlinks now!",
        website_field_hp: "I am a spam bot filling hidden fields",
      }),
    });
    if (res.status !== 400) throw new Error(`Expected status 400 for honeypot, got ${res.status}`);
  });

  // 5. Admin Authentication
  let sessionCookie = "";
  await assertTest("Admin login succeeds and issues secure session cookie", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@ewastechittagong.com",
        password: "Admin@EWC2026!",
      }),
    });
    if (res.status !== 200) throw new Error(`Login failed with status ${res.status}`);
    const setCookie = res.headers.get("set-cookie");
    if (!setCookie || !setCookie.includes("ewc_admin_session")) {
      throw new Error("Missing ewc_admin_session cookie");
    }
    sessionCookie = setCookie.split(";")[0];
  });

  // 6. Protected Admin Dashboard with Cookie
  await assertTest("Admin dashboard accesses protected metrics with session", async () => {
    const res = await fetch(`${BASE_URL}/admin`, {
      headers: { Cookie: sessionCookie },
    });
    if (res.status !== 200) throw new Error(`Admin dashboard returned status ${res.status}`);
    const text = await res.text();
    if (!text.includes("Operations &amp; Executive Dashboard") && !text.includes("Operations & Executive Dashboard")) {
      throw new Error("Missing dashboard title in response");
    }
  });

  // 7. Robots.txt and Sitemap.xml
  await assertTest("Robots.txt is accessible and disallows /admin/", async () => {
    const res = await fetch(`${BASE_URL}/robots.txt`);
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
    const text = await res.text();
    if (!text.includes("Disallow: /admin/")) throw new Error("Missing admin disallow rule");
  });

  await assertTest("Sitemap.xml contains multilingual routes", async () => {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    if (res.status !== 200) throw new Error(`Status was ${res.status}`);
    const text = await res.text();
    if (!text.includes("/en/products") || !text.includes("/bn/products")) {
      throw new Error("Missing localized product routes in sitemap");
    }
  });

  console.log(`\n=== TEST RESULTS: ${passed} / ${total} TESTS PASSED ===\n`);
  if (passed === total) {
    console.log("🎯 ALL TESTS PASSED SUCCESSFULLY!");
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
