import * as React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSettingsManager } from "@/components/admin-settings-manager";
import { Sliders } from "lucide-react";

export const metadata = {
  title: "Site Settings & Banners | E-Waste Chittagong Admin",
};

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  let aboutBannerUrl =
    "https://res.cloudinary.com/jpzhmh1r/image/upload/v1792327290/ewaste-chittagong/banners/about-hero-banner.jpg";
  let productsBannerUrl =
    "https://res.cloudinary.com/jpzhmh1r/image/upload/v1792328119/ewaste-chittagong/banners/products-hero-banner.jpg";
  let servicesBannerUrl =
    "https://res.cloudinary.com/jpzhmh1r/image/upload/v1792329707/ewaste-chittagong/banners/services-hero-banner.jpg";

  try {
    const [aboutSetting, productsSetting, servicesSetting] = await Promise.all([
      prisma.companySetting.findUnique({ where: { key: "about_banner" } }),
      prisma.companySetting.findUnique({ where: { key: "products_banner" } }),
      prisma.companySetting.findUnique({ where: { key: "services_banner" } }),
    ]);

    if (aboutSetting?.value) {
      const parsed = JSON.parse(aboutSetting.value);
      if (parsed.url) aboutBannerUrl = parsed.url;
    }

    if (productsSetting?.value) {
      const parsed = JSON.parse(productsSetting.value);
      if (parsed.url) productsBannerUrl = parsed.url;
    }

    if (servicesSetting?.value) {
      const parsed = JSON.parse(servicesSetting.value);
      if (parsed.url) servicesBannerUrl = parsed.url;
    }
  } catch (err) {
    console.error("Failed to read banner settings:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-emerald-600" />
            <span>Site Settings & Banners</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage public website hero banners, visual branding assets, and dynamic company configurations.
          </p>
        </div>
      </div>

      <AdminSettingsManager
        initialAboutBannerUrl={aboutBannerUrl}
        initialProductsBannerUrl={productsBannerUrl}
        initialServicesBannerUrl={servicesBannerUrl}
      />
    </div>
  );
}
