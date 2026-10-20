import * as React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSettingsManager } from "@/components/admin-settings-manager";
import { AdminPageHeader } from "@/components/admin-page-header";
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
  let processBannerUrl =
    "https://res.cloudinary.com/jpzhmh1r/image/upload/v1792330610/ewaste-chittagong/banners/process-hero-banner.jpg";
  let galleryBannerUrl =
    "https://res.cloudinary.com/jpzhmh1r/image/upload/v1792331523/ewaste-chittagong/banners/gallery-hero-banner.jpg";
  let contactBannerUrl =
    "https://res.cloudinary.com/jpzhmh1r/image/upload/v1792340096/ewaste-chittagong/banners/contact-hero-banner.jpg";

  try {
    const [aboutSetting, productsSetting, servicesSetting, processSetting, gallerySetting, contactSetting] =
      await Promise.all([
        prisma.companySetting.findUnique({ where: { key: "about_banner" } }),
        prisma.companySetting.findUnique({ where: { key: "products_banner" } }),
        prisma.companySetting.findUnique({ where: { key: "services_banner" } }),
        prisma.companySetting.findUnique({ where: { key: "process_banner" } }),
        prisma.companySetting.findUnique({ where: { key: "gallery_banner" } }),
        prisma.companySetting.findUnique({ where: { key: "contact_banner" } }),
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

    if (processSetting?.value) {
      const parsed = JSON.parse(processSetting.value);
      if (parsed.url) processBannerUrl = parsed.url;
    }

    if (gallerySetting?.value) {
      const parsed = JSON.parse(gallerySetting.value);
      if (parsed.url) galleryBannerUrl = parsed.url;
    }

    if (contactSetting?.value) {
      const parsed = JSON.parse(contactSetting.value);
      if (parsed.url) contactBannerUrl = parsed.url;
    }
  } catch (err) {
    console.error("Failed to read banner settings:", err);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={<Sliders className="w-6 h-6 text-emerald-600" />}
        titleKey="page.settings.title"
        defaultTitle="Site Settings & Banners"
        subtitleKey="page.settings.subtitle"
        defaultSubtitle="Manage public website hero banners, visual branding assets, and dynamic company configurations."
      />

      <AdminSettingsManager
        initialContactBannerUrl={contactBannerUrl}
        initialGalleryBannerUrl={galleryBannerUrl}
        initialProcessBannerUrl={processBannerUrl}
        initialServicesBannerUrl={servicesBannerUrl}
        initialProductsBannerUrl={productsBannerUrl}
        initialAboutBannerUrl={aboutBannerUrl}
      />
    </div>
  );
}
