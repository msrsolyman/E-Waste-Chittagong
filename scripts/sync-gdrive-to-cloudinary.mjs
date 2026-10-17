import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "jpzhmh1r",
  api_key: process.env.CLOUDINARY_API_KEY || "836793954479867",
  api_secret: process.env.CLOUDINARY_API_SECRET || "RhIQG5r6wNBJccDqgQ2G8xFP074",
  secure: true,
});

async function uploadFileStream(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, res) => {
      if (err || !res) reject(err || new Error("Upload failed"));
      else resolve(res);
    });
    stream.end(buffer);
  });
}

async function run() {
  const allFiles = JSON.parse(fs.readFileSync("scripts/gdrive-files.json", "utf-8"));
  // Filter out the folder itself
  const files = allFiles.filter((f) => f.id !== "1AZ1LG2_bMi7fGbf6P9y2gFhYMe8e9pY9");

  console.log(`Processing ${files.length} media files from Google Drive to Cloudinary...`);

  // Load existing uploaded files if script was resumed
  let uploaded = [];
  if (fs.existsSync("scripts/cloudinary-media.json")) {
    try {
      uploaded = JSON.parse(fs.readFileSync("scripts/cloudinary-media.json", "utf-8"));
    } catch {}
  }
  const uploadedIds = new Set(uploaded.map((u) => u.gdriveId));

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (uploadedIds.has(file.id)) {
      console.log(`[${i + 1}/${files.length}] Already uploaded: ${file.name}`);
      continue;
    }

    const isVideo = file.name.toLowerCase().endsWith(".mp4");
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${file.id}`;

    console.log(`[${i + 1}/${files.length}] Downloading: ${file.name} (isVideo: ${isVideo})...`);
    try {
      const res = await fetch(downloadUrl);
      if (!res.ok) {
        console.error(`Failed to download ${file.name}: status ${res.status}`);
        continue;
      }
      const arrayBuf = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);
      console.log(`Downloaded ${buffer.length} bytes. Uploading to Cloudinary...`);

      const uploadResult = await uploadFileStream(buffer, {
        folder: isVideo ? "ewaste-chittagong/videos" : "ewaste-chittagong/facility-real",
        resource_type: isVideo ? "video" : "image",
        transformation: isVideo ? undefined : [{ quality: "auto", fetch_format: "auto" }],
      });

      console.log(`✅ Uploaded to Cloudinary: ${uploadResult.secure_url}`);

      const record = {
        gdriveId: file.id,
        originalName: file.name,
        resourceType: isVideo ? "video" : "image",
        cloudinaryUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        bytes: uploadResult.bytes,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
        duration: uploadResult.duration,
      };

      uploaded.push(record);
      uploadedIds.add(file.id);
      fs.writeFileSync("scripts/cloudinary-media.json", JSON.stringify(uploaded, null, 2));
    } catch (err) {
      console.error(`Error processing ${file.name}:`, err);
    }
  }

  console.log(`🎉 Finished syncing! Total uploaded: ${uploaded.length} assets.`);
}

run().catch(console.error);
