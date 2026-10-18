import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const prisma = new PrismaClient();

async function run() {
  const filePath = path.resolve("public/images/products/products-hero-banner.jpg");
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  console.log("Uploading products hero banner to Cloudinary...");
  const uploadResult = await cloudinary.uploader.upload(filePath, {
    folder: "ewaste-chittagong/banners",
    public_id: "products-hero-banner",
    overwrite: true,
    resource_type: "image",
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });

  console.log("Uploaded successfully:", uploadResult.secure_url);

  const bannerData = {
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
    updatedAt: new Date().toISOString(),
  };

  await prisma.companySetting.upsert({
    where: { key: "products_banner" },
    update: {
      value: JSON.stringify(bannerData),
    },
    create: {
      key: "products_banner",
      value: JSON.stringify(bannerData),
    },
  });

  console.log("Saved products_banner to CompanySetting in database!");
}

run()
  .catch((err) => {
    console.error("Error uploading products banner:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
