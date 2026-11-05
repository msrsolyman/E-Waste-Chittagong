import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ASSETS_DIR = path.resolve("d:/E-Waste-Chittagong/temp_gdrive_assets");
const OUTPUT_MAP_FILE = path.resolve("scripts/uploaded_assets_map.json");

async function uploadFile(filePath, isVideo = false) {
  const fileName = path.basename(filePath);
  const cleanId = fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
  const folder = "ewaste-chittagong/facility-real";

  console.log(`Uploading ${fileName} (${isVideo ? "video" : "image"})...`);

  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    public_id: cleanId,
    resource_type: isVideo ? "video" : "image",
    overwrite: true,
  });

  return {
    originalName: fileName,
    publicId: result.public_id,
    secureUrl: result.secure_url,
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    duration: result.duration || null,
    resourceType: result.resource_type,
  };
}

async function main() {
  const allFiles = fs.readdirSync(ASSETS_DIR);
  const imageFiles = allFiles.filter((f) => f.endsWith(".jpeg") || f.endsWith(".jpg") || f.endsWith(".png"));
  const videoFiles = allFiles.filter((f) => f.endsWith(".mp4"));

  console.log(`Found ${imageFiles.length} images and ${videoFiles.length} videos.`);

  let mapData = {};
  if (fs.existsSync(OUTPUT_MAP_FILE)) {
    try {
      mapData = JSON.parse(fs.readFileSync(OUTPUT_MAP_FILE, "utf-8"));
    } catch (e) {
      mapData = {};
    }
  }

  // 1. Upload Images
  for (const img of imageFiles) {
    if (mapData[img]?.secureUrl) {
      console.log(`Skipping already uploaded image: ${img}`);
      continue;
    }
    try {
      const res = await uploadFile(path.join(ASSETS_DIR, img), false);
      mapData[img] = res;
      fs.writeFileSync(OUTPUT_MAP_FILE, JSON.stringify(mapData, null, 2));
      console.log(`✓ Uploaded ${img} -> ${res.secureUrl}`);
    } catch (err) {
      console.error(`✗ Error uploading image ${img}:`, err.message);
    }
  }

  // 2. Upload Videos
  for (const vid of videoFiles) {
    if (mapData[vid]?.secureUrl) {
      console.log(`Skipping already uploaded video: ${vid}`);
      continue;
    }
    try {
      const res = await uploadFile(path.join(ASSETS_DIR, vid), true);
      mapData[vid] = res;
      fs.writeFileSync(OUTPUT_MAP_FILE, JSON.stringify(mapData, null, 2));
      console.log(`✓ Uploaded ${vid} -> ${res.secureUrl}`);
    } catch (err) {
      console.error(`✗ Error uploading video ${vid}:`, err.message);
    }
  }

  console.log("\n=================================");
  console.log(`Successfully uploaded and recorded ${Object.keys(mapData).length} assets.`);
  console.log(`Saved output map to ${OUTPUT_MAP_FILE}`);
}

main().catch(console.error);
