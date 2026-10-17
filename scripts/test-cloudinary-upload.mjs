import fs from "fs";
import path from "path";

async function testUpload() {
  console.log("=== TESTING CLOUDINARY UPLOAD API ===");

  // 1. Authenticate as Super Admin
  const loginRes = await fetch("http://localhost:3000/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@ewastechittagong.com",
      password: "Admin@EWC2026!",
    }),
  });
  if (!loginRes.ok) throw new Error("Admin login failed");
  const cookie = loginRes.headers.get("set-cookie");

  // 2. Prepare sample image file
  const testImagePath = path.resolve("public/images/products/cpu-scrap.jpg");
  const imageBuffer = fs.readFileSync(testImagePath);
  const blob = new Blob([imageBuffer], { type: "image/jpeg" });

  const formData = new FormData();
  formData.append("file", blob, "test-cpu-scrap.jpg");
  formData.append("folder", "products");

  // 3. Send upload request
  const uploadRes = await fetch("http://localhost:3000/api/admin/upload", {
    method: "POST",
    headers: {
      cookie,
    },
    body: formData,
  });

  console.log("Upload HTTP status:", uploadRes.status);
  const result = await uploadRes.json();
  console.log("Upload result:", result);

  if (!uploadRes.ok || !result.url) {
    throw new Error(`Upload failed: ${JSON.stringify(result)}`);
  }

  console.log("✅ [PASS] Successfully uploaded image to Cloudinary!");
  console.log("Cloudinary Secure URL:", result.url);
}

testUpload().catch((err) => {
  console.error("❌ [FAIL]", err);
  process.exit(1);
});
