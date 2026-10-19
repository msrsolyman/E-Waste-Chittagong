"use client";

import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";

export type AdminLocale = "bn" | "en";

interface AdminLocaleContextType {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
  toggleLocale: () => void;
  t: (key: string, fallback?: string) => string;
}

export const ADMIN_TRANSLATIONS: Record<string, { bn: string; en: string }> = {
  // Navigation Links
  "nav.dashboard": { bn: "ড্যাশবোর্ড ওভারভিউ", en: "Dashboard Overview" },
  "nav.inquiries": { bn: "ইনকোয়ারি পাইপলাইন", en: "Inquiry Pipeline" },
  "nav.products": { bn: "পণ্য ও ক্যাটালগ", en: "Products & Catalogue" },
  "nav.categories": { bn: "ক্যাটাগরি ট্যাক্সোনমি", en: "Category Taxonomy" },
  "nav.gallery": { bn: "মিডিয়া ও গ্যালারি", en: "Media & Gallery" },
  "nav.settings": { bn: "ব্যানার ও সেটিংস", en: "Site Banners & Settings" },
  "nav.users": { bn: "অ্যাডমিন টিম ও রোলস", en: "Admin Users & Roles" },
  "nav.audit": { bn: "অডিট ট্রেইল ও নিরাপত্তা", en: "Audit Trail & Security" },
  "nav.public_site": { bn: "পাবলিক ওয়েবসাইট দেখুন", en: "View Public Website" },
  "nav.logout": { bn: "লগআউট করুন", en: "Log Out Session" },
  "nav.super_admin": { bn: "সুপার অ্যাডমিন", en: "Super Admin" },
  "nav.content_manager": { bn: "কনটেন্ট ম্যানেজার", en: "Content Manager" },

  // Header & Global Actions
  "header.title": { bn: "অপারেশনস ও এক্সিকিউটিভ ড্যাশবোর্ড", en: "Operations & Executive Dashboard" },
  "header.welcome": { bn: "স্বাগতম,", en: "Welcome back," },
  "header.add_product": { bn: "নতুন পণ্য যোগ করুন", en: "Add Product" },
  "header.rfq_pipeline": { bn: "আরএফকিউ পাইপলাইন", en: "RFQ Pipeline" },
  "header.upload_media": { bn: "মিডিয়া আপলোড", en: "Upload Media" },
  "header.export_inquiries": { bn: "ইনকোয়ারি এক্সপোর্ট", en: "Export Inquiries" },

  // Overview KPI Cards
  "kpi.new_inquiries": { bn: "নতুন আরএফকিউ ইনকোয়ারি", en: "New RFQ Inquiries" },
  "kpi.of_total_leads": { bn: "সর্বমোট ২৩টি লিড থেকে", en: "Of 23 total leads" },
  "kpi.quoted_deals": { bn: "প্রেরিত বাণিজ্যিক ডিল", en: "Quoted Deals" },
  "kpi.active_negotiations": { bn: "সক্রিয় আন্তর্জাতিক আলোচনা", en: "Active negotiations" },
  "kpi.catalogue_items": { bn: "ক্যাটালগ পণ্যসমূহ", en: "Catalogue Items" },
  "kpi.drafts_pending": { bn: "০টি ড্রাফট বাকি", en: "0 drafts pending" },
  "kpi.taxonomies": { bn: "রিসাইক্লিং ক্যাটাগরি", en: "Taxonomies" },
  "kpi.recycling_streams": { bn: "ভেরিফাইড উপাদান স্ট্রিম", en: "Recycling streams" },
  "kpi.media_assets": { bn: "ইয়ার্ড ও মিডিয়া অ্যাসেট", en: "Media Assets" },
  "kpi.facility_photos": { bn: "পরিদর্শিত ইয়ার্ড স্থিরচিত্র", en: "Facility photographs" },
  "kpi.admin_team": { bn: "নিবন্ধিত কর্মকর্তা", en: "Admin Team" },
  "kpi.registered_personnel": { bn: "অনুমোদিত অ্যাডমিন টিম", en: "Registered personnel" },

  // Super Dashboard Geo-Radar Section
  "radar.badge": { bn: "লাইভ বায়ার জিও-ট্রেকার (Live Geo-Radar)", en: "Live Buyer Geo-Radar" },
  "radar.active_now": { bn: "জন আন্তর্জাতিক বায়ার বর্তমানে সাইটে সক্রিয়", en: "international buyers currently active on site" },
  "radar.heading": { bn: "গ্লোবাল বায়ার ট্রাফিক ও আন্তর্জাতিক জিও-এনালিটিক্স", en: "Global Buyer Traffic & International Geo-Analytics" },
  "radar.subheading": {
    bn: "কোন কোন দেশ ও বাণিজ্যিক হাব (যেমন: চীন, জাপান, সংযুক্ত আরব আমিরাত, যুক্তরাষ্ট্র) থেকে পাইকারি ক্রেতারা আসছেন এবং আরএফকিউ পাঠাচ্ছেন তার লাইভ ম্যাপিং।",
    en: "Live real-time mapping of global wholesale buyers & commercial RFQ sourcing from countries such as China, Japan, UAE, USA, and Germany.",
  },

  // Time Range Tabs
  "time.today": { bn: "আজকের লাইভ", en: "Today Live" },
  "time.7d": { bn: "গত ৭ দিন", en: "Last 7 Days" },
  "time.30d": { bn: "গত ৩০ দিন", en: "Last 30 Days" },
  "time.all": { bn: "সর্বমোট", en: "All Time" },

  // Metric Cards Row
  "metric.total_visitors": { bn: "মোট ভিজিটর", en: "Total Visitors" },
  "metric.growth": { bn: "+18.4% আন্তর্জাতিক প্রবৃদ্ধি", en: "+18.4% Global Growth" },
  "metric.active_countries": { bn: "সক্রিয় ক্রেতা দেশ", en: "Active Buyer Countries" },
  "metric.countries_count": { bn: "টি দেশ", en: "Countries" },
  "metric.top_country": { bn: "শীর্ষ দেশ:", en: "Top Country:" },
  "metric.inquiries_received": { bn: "প্রাপ্ত ইনকোয়ারি", en: "Inquiries Received" },
  "metric.rfq_count": { bn: "টি RFQ", en: "RFQs" },
  "metric.verified_quotations": { bn: "ভেরিফাইড আন্তর্জাতিক কোটেশন", en: "Verified international quotations" },
  "metric.conversion_rate": { bn: "রূপান্তর হার (CR)", en: "Conversion Rate (CR)" },
  "metric.visitor_to_lead": { bn: "ভিজিটর থেকে সরাসরি লিড", en: "Visitors directly to leads" },
  "metric.device_split": { bn: "ডিভাইস অনুপাত", en: "Device Breakdown" },
  "metric.desktop": { bn: "ডেস্কটপ", en: "Desktop" },
  "metric.mobile": { bn: "মোবাইল", en: "Mobile" },
  "metric.tablet": { bn: "ট্যাবলেট", en: "Tablet" },

  // Navigation Tabs in Super Dashboard
  "tab.map": { bn: "ইন্টারেক্টিভ ওয়ার্ল্ড ম্যাপ ও রুট", en: "Interactive World Map & Routes" },
  "tab.countries": { bn: "দেশভিত্তিক পূর্ণাঙ্গ পরিসংখ্যান", en: "Country-Wise Statistics" },
  "tab.cities": { bn: "বাণিজ্যিক শহর ও পোর্ট হাব", en: "Commercial Cities & Port Hubs" },
  "tab.trends": { bn: "ট্রাফিক বেগ ও আরএফকিউ ট্রেন্ড", en: "Traffic Velocity & RFQ Trends" },

  // Map Controls & Filters
  "map.engine_title": { bn: "আন্তর্জাতিক ইন্টারেক্টিভ ট্রেড ম্যাপ (GIS Leaflet Engine)", en: "Global Interactive Trade Map (GIS Leaflet Engine)" },
  "map.engine_badge": { bn: "লাইভ জুম ও প্যান", en: "Live Zoom & Pan" },
  "map.engine_desc": {
    bn: "মাউস হুইল বা টাচ দিয়ে জুম করুন। যেকোনো দেশ বা শহরে ক্লিক করলে ক্যামেরা সরাসরি সেখানে ফ্লাই করবে।",
    en: "Zoom with mouse wheel or pinch. Click any country or city marker to smoothly fly to that hub.",
  },
  "map.chittagong_hq": { bn: "চট্টগ্রাম বন্দর (HQ)", en: "Chittagong Port (HQ)" },
  "map.global_view": { bn: "বিশ্ব মানচিত্র", en: "Global View" },
  "map.export_hubs": { bn: "রপ্তানি হাব:", en: "Export Hubs:" },
  "map.filter_all": { bn: "সব দেশ", en: "All Countries" },
  "map.filter_top": { bn: "টপ বায়ার", en: "Top Buyers" },
  "map.filter_active": { bn: "সক্রিয় আরএফকিউ", en: "Active RFQs" },

  // Side-Split Intel Panel
  "panel.active_partner": { bn: "সক্রিয় বাণিজ্যিক অংশীদার", en: "Active Commercial Partner" },
  "panel.country_code": { bn: "কোড:", en: "Code:" },
  "panel.zoom_country": { bn: "পুরো দেশে জুম করুন", en: "Zoom to Country" },
  "panel.live_sessions": { bn: "লাইভ সেশন", en: "Live Sessions" },
  "panel.realtime": { bn: "রিয়েল-টাইম", en: "Real-Time" },
  "panel.quotations": { bn: "কোটেশন আরএফকিউ", en: "RFQ Quotations" },
  "panel.verified": { bn: "ভেরিফাইড", en: "Verified" },
  "panel.traffic_share": { bn: "ট্রাফিক অনুপাত", en: "Traffic Share" },
  "panel.global_share": { bn: "বৈশ্বিক শেয়ার", en: "Global Share" },
  "panel.network_title": { bn: "শহর ও জেলা নেটওয়ার্ক", en: "City & District Network" },
  "panel.active_hubs": { bn: "টি সক্রিয় হাব", en: "active hubs" },
  "panel.click_to_zoom": { bn: "ক্লিক করে শহরে জুম করুন", en: "Click to focus city" },
  "panel.fly_to_city": { bn: "জুম", en: "Fly To" },
  "panel.material": { bn: "পণ্য:", en: "Stream:" },
  "panel.sessions": { bn: "সেশন", en: "Sessions" },
  "panel.no_country": { bn: "কোনো দেশ নির্বাচিত নেই", en: "No country selected" },
  "panel.no_country_desc": {
    bn: "মানচিত্রের যেকোনো পিনে ক্লিক করুন অথবা উপরের বোতামগুলো থেকে দেশ নির্বাচন করে শহরভিত্তিক তথ্য দেখুন।",
    en: "Click any map pin or select a country from the carousel above to view district intelligence.",
  },

  // Smart Insight Bar
  "insight.smart_badge": { bn: "স্মার্ট বায়ার ইন্টেলিজেন্স:", en: "Smart Buyer Intelligence:" },
  "insight.text": {
    bn: "মানচিত্রের নোড বা দেশের নামের ওপর ক্লিক করে ওই দেশের বায়ারদের আরএফকিউ এবং সরাসরি WhatsApp/ইমেইলে যোগাযোগ করুন।",
    en: "Click map nodes or country pills to inspect commercial RFQs and communicate directly via WhatsApp/Email.",
  },
  "insight.view_all": { bn: "প্রাপ্ত সব ইনকোয়ারি দেখুন", en: "View All Inquiries" },

  // Country Rankings Table
  "table.rank": { bn: "র‍্যাংক", en: "Rank" },
  "table.country_market": { bn: "দেশ ও বায়ার মার্কেট", en: "Country & Buyer Market" },
  "table.visitors": { bn: "ভিজিটর সংখ্যা", en: "Visitor Count" },
  "table.traffic_share": { bn: "ট্রাফিক শেয়ার (%)", en: "Traffic Share (%)" },
  "table.inquiries": { bn: "প্রাপ্ত RFQ", en: "RFQs Received" },
  "table.conversion_rate": { bn: "রূপান্তর হার", en: "Conversion Rate" },
  "table.primary_interest": { bn: "প্রধান চাহিদাকৃত পণ্য", en: "Primary Commodity" },
  "table.action": { bn: "অ্যাকশন", en: "Action" },
  "table.map_zoom": { bn: "ম্যাপ জুম", en: "Map Zoom" },
  "table.unit_rfq": { bn: "টি", en: "RFQs" },

  // Commercial City Hubs
  "cities.visitors": { bn: "ভিজিটর", en: "Visitors" },
  "cities.inquiries": { bn: "ইনকোয়ারি", en: "Inquiries" },
  "cities.unit_rfq": { bn: "টি", en: "RFQs" },

  // Trends Tab
  "trends.title": { bn: "দৈনিক আন্তর্জাতিক ট্রাফিক বেগ (Velocity Wave Curve)", en: "Daily Global Traffic Velocity (Velocity Wave Curve)" },
  "trends.subtitle": {
    bn: "আন্তর্জাতিক ট্রেড সিজন ও সময়কাল অনুযায়ী ভিজিটর আগমন এবং আরএফকিউ সাবমিশনের গতিপ্রকৃতি।",
    en: "Temporal pattern of wholesale visitors & RFQ submissions across trade seasons.",
  },
  "trends.peak": { bn: "শীর্ষ পিক:", en: "Peak Volume:" },
  "trends.unit": { bn: "জন/দিন", en: "visitors/day" },

  // Country Intelligence Drawer
  "drawer.port": { bn: "আন্তর্জাতিক বায়ার পোর্ট", en: "International Buyer Port" },
  "drawer.active_now": { bn: "জন বায়ার বর্তমানে সক্রিয়", en: "buyers active now" },
  "drawer.live_sourcing": { bn: "লাইভ সোর্সিং সেশন", en: "Live Sourcing Session" },
  "drawer.total_visitors": { bn: "মোট ভিজিটর", en: "Total Visitors" },
  "drawer.global_volume": { bn: "আন্তর্জাতিক ভলিউম", en: "Global Volume" },
  "drawer.traffic_share": { bn: "ট্রাফিক শেয়ার", en: "Traffic Share" },
  "drawer.rfqs_received": { bn: "প্রাপ্ত আরএফকিউ", en: "RFQs Received" },
  "drawer.verified_quotations": { bn: "ভেরিফাইড কোটেশন", en: "Verified RFQs" },
  "drawer.conversion_rate": { bn: "কনভার্সন রেট", en: "Conversion Rate" },
  "drawer.visitor_to_buyer": { bn: "ভিজিটর টু বায়ার", en: "Visitor to Buyer" },
  "drawer.primary_commodity": { bn: "প্রধান চাহিদাকৃত স্ক্র্যাপ ক্যাটাগরি", en: "Primary Scrap Category Demand" },
  "drawer.recent_leads": { bn: "সাম্প্রতিক আরএফকিউ ও বায়ার লিস্ট", en: "Recent RFQ Leads & Buyers" },
  "drawer.direct_contact": { bn: "সরাসরি যোগাযোগ", en: "Direct Contact" },
  "drawer.person": { bn: "ব্যক্তি:", en: "Contact:" },
  "drawer.product": { bn: "পণ্য:", en: "Product:" },
  "drawer.volume": { bn: "ভলিউম:", en: "Volume:" },
  "drawer.whatsapp": { bn: "WhatsApp চ্যাট", en: "WhatsApp Chat" },
  "drawer.email": { bn: "ইমেইল পাঠান", en: "Send Email" },
  "drawer.copy_title": { bn: "কোটেশন তথ্য কপি করুন", en: "Copy Lead Info" },
  "drawer.no_leads": { bn: "এই মুহূর্তে এই দেশের কোনো পেন্ডিং আরএফকিউ নেই।", en: "No pending RFQ leads from this country at the moment." },
  "drawer.no_leads_desc": { bn: "নতুন আরএফকিউ আসলে তা সরাসরি এখানে ও লিড পাইপলাইনে দেখা যাবে।", en: "New inquiries will appear here and in the RFQ pipeline automatically." },
  "drawer.yard_intel": { bn: "চট্টগ্রাম ডিসম্যান্তলিং ইয়ার্ড ইন্টেলিজেন্স", en: "Chittagong Dismantling Yard Intelligence" },
  "drawer.view_all_rfq": { bn: "সকল আরএফকিউ পাইপলাইনে যান", en: "Go to RFQ Pipeline" },

  // Switcher labels
  "switcher.language": { bn: "ভাষা", en: "Language" },
  "switcher.bangla": { bn: "বাংলা", en: "Bangla" },
  "switcher.english": { bn: "English", en: "English" },
};

const AdminLocaleContext = createContext<AdminLocaleContextType>({
  locale: "bn",
  setLocale: () => {},
  toggleLocale: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

const COOKIE_NAME = "ewc_admin_locale";

export function AdminLocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>("bn");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read saved locale from cookie or localStorage
    const savedCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${COOKIE_NAME}=`))
      ?.split("=")[1] as AdminLocale | undefined;

    const savedLocal = typeof window !== "undefined"
      ? (localStorage.getItem(COOKIE_NAME) as AdminLocale | null)
      : null;

    const initial = savedCookie || savedLocal || "bn";
    if (initial === "en" || initial === "bn") {
      setLocaleState(initial);
      document.documentElement.lang = initial;
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: AdminLocale) => {
    setLocaleState(newLocale);
    document.documentElement.lang = newLocale;

    // Persist in Cookie (expires in 1 year)
    document.cookie = `${COOKIE_NAME}=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

    // Persist in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(COOKIE_NAME, newLocale);
    }
  };

  const toggleLocale = () => {
    setLocale(locale === "bn" ? "en" : "bn");
  };

  const t = (key: string, fallback?: string): string => {
    const entry = ADMIN_TRANSLATIONS[key];
    if (entry) {
      return entry[locale] || fallback || entry.en || key;
    }
    return fallback || key;
  };

  return (
    <AdminLocaleContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
      <div className={locale === "bn" ? "font-bengali" : "font-sans"}>
        {children}
      </div>
    </AdminLocaleContext.Provider>
  );
}

export function useAdminLocale() {
  return useContext(AdminLocaleContext);
}
