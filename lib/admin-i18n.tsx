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

  // Admin Subpage Headers & Subtitles
  "page.inquiries.title": { bn: "বায়ার ইনকোয়ারি ও আরএফকিউ পাইপলাইন", en: "Buyer Inquiry & RFQ Pipeline" },
  "page.inquiries.subtitle": {
    bn: "আন্তর্জাতিক পাইকারি ক্রেতাদের ইনকোয়ারি পর্যবেক্ষণ, স্ট্যাটাস আপডেট এবং অভ্যন্তরীণ কোটেশন অগ্রগতি ট্র্যাকিং।",
    en: "Manage incoming international procurement inquiries, update statuses, and log internal quotation progress.",
  },
  "page.products.title": { bn: "পণ্য ও ক্যাটালগ ম্যানেজমেন্ট", en: "Product Catalogue Management" },
  "page.products.subtitle": {
    bn: "স্ক্র্যাপ পণ্যের তালিকা পরিচালনা, চার ভাষার বিবরণ আপডেট, ড্রাফট/পাবলিশ ও ফিচারড স্ট্যাটাস পরিবর্তন।",
    en: "Manage electronic scrap listings, update 4-language technical descriptions, toggle draft/published/featured status, and clone listings.",
  },
  "page.new_product.title": { bn: "নতুন B2B পণ্য যোগ করুন", en: "Add New B2B Product Listing" },
  "page.new_product.subtitle": {
    bn: "ইংরেজি, বাংলা, চীনা ও জাপানি ভাষায় পণ্যের স্পেসিফিকেশন ও বিস্তারিত তথ্য নির্ধারণ করুন।",
    en: "Specify technical details and localized titles for English, Bengali, Chinese, and Japanese.",
  },
  "page.categories.title": { bn: "ক্যাটাগরি ট্যাক্সোনমি ম্যানেজমেন্ট", en: "Category Taxonomy Management" },
  "page.categories.subtitle": {
    bn: "স্ক্র্যাপ মেটেরিয়াল স্ট্রিম, বিভাগ বিন্যাস এবং লাইভ ক্যাটালগ অর্গানাইজেশন।",
    en: "Material streams, sorting categories, and catalogue organization with live CRUD operations.",
  },
  "page.gallery.title": { bn: "মিডিয়া ও ইয়ার্ড গ্যালারি ম্যানেজমেন্ট", en: "Media & Facility Gallery Management" },
  "page.gallery.subtitle": {
    bn: "চট্টগ্রাম ইয়ার্ডের কার্যক্রমের ছবি ও ভিডিও সাজান, স্ক্র্যাপ ক্যাটাগরি সংযুক্ত করুন এবং ভেরিফাইড ব্যাজ নির্ধারণ করুন।",
    en: "Organize activity photos, assign scrap categories, and toggle authentic vs illustrative badges for buyer transparency.",
  },
  "page.settings.title": { bn: "সাইট ব্যানার ও গ্লোবাল সেটিংস", en: "Site Settings & Banners" },
  "page.settings.subtitle": {
    bn: "পাবলিক ওয়েবসাইটের ব্যানার ছবি, ভিজ্যুয়াল ব্র্যান্ডিং এবং কোম্পানি তথ্য নিয়ন্ত্রণ করুন।",
    en: "Manage public website hero banners, visual branding assets, and dynamic company configurations.",
  },
  "page.users.title": { bn: "অ্যাডমিন টিম ও রোল পারমিশন", en: "Admin Users & Role Permissions" },
  "page.users.subtitle": {
    bn: "প্রশাসনিক কর্মকর্তা পরিচালনা, সুপার অ্যাডমিন বা কনটেন্ট ম্যানেজার ক্ষমতা প্রদান এবং অ্যাকাউন্ট পর্যবেক্ষণ।",
    en: "Manage administrative personnel, assign Content Manager or Super Admin privileges, and monitor account statuses.",
  },
  "page.audit.title": { bn: "অডিট ট্রেইল ও সিকিউরিটি লগ", en: "Audit Trail & Security Logs" },
  "page.audit.subtitle": {
    bn: "অ্যাডমিন কার্যক্রম, ক্যাটালগ পরিবর্তন, ইনকোয়ারি আপডেট এবং লগইন ট্র্যাকিংয়ের স্থায়ী অডিট ট্রেইল।",
    en: "Immutable log of administrative operations, catalog changes, inquiry status updates, and authenticated logins.",
  },

  // Inquiry Pipeline Specific
  "inq.search_placeholder": {
    bn: "রেফারেন্স নম্বর, কোম্পানি, দেশ, ক্যাটাগরি বা ইমেইল দিয়ে খুঁজুন...",
    en: "Search reference, company, country, category, or email...",
  },
  "inq.all_countries": { bn: "সব দেশ", en: "All Countries" },
  "inq.sort_newest": { bn: "সর্বশেষ আগে", en: "Newest First" },
  "inq.sort_oldest": { bn: "পুরোনো আগে", en: "Oldest First" },
  "inq.sort_toggle": { bn: "তারিখ অনুযায়ী সাজান", en: "Toggle Sort by Date" },
  "inq.status_all": { bn: "সব", en: "All" },
  "inq.status_new": { bn: "নতুন লিড", en: "New Lead" },
  "inq.status_contacted": { bn: "যোগাযোগকৃত", en: "Contacted" },
  "inq.status_in_progress": { bn: "চলমান", en: "In Progress" },
  "inq.status_quoted": { bn: "কোটেশন প্রেরিত", en: "Quoted" },
  "inq.status_closed": { bn: "সম্পন্ন", en: "Closed / Done" },
  "inq.export_csv": { bn: "CSV এক্সপোর্ট", en: "Export CSV" },
  "inq.export_tooltip": {
    bn: "ফর্মুলা ইনজেকশন ডিফেন্স সহ স্প্রেডশিট ডাউনলোড করুন",
    en: "Download Inquiries Spreadsheet with Formula Injection Defense",
  },
  "inq.showing": { bn: "মোট", en: "Showing" },
  "inq.of": { bn: "টির মধ্যে", en: "of" },
  "inq.inquiries_displayed": { bn: "টি বায়ার ইনকোয়ারি প্রদর্শিত হচ্ছে", en: "buyer inquiries" },
  "inq.reset_filters": { bn: "ফিল্টার রিসেট করুন", en: "Reset Filters" },
  "inq.no_results": { bn: "ফিল্টারের সাথে কোনো ইনকোয়ারি মেলেনি।", en: "No inquiries match your current filters." },
  "inq.details": { bn: "বিস্তারিত", en: "Details" },
  "inq.hide": { bn: "লুকান", en: "Hide" },
  "inq.tooltip_whatsapp": { bn: "পূর্বনির্ধারিত টেমপ্লেট সহ WhatsApp চ্যাট খুলুন", en: "Open WhatsApp Chat with Pre-filled RFQ Template" },
  "inq.tooltip_email": { bn: "কোটেশন ড্রাফট ইমেইল পাঠান", en: "Send Quotation Draft Email" },
  "inq.tooltip_print": { bn: "অফিসিয়াল আরএফকিউ স্লিপ প্রিন্ট করুন", en: "Print Official RFQ Slip" },
  "inq.tooltip_delete": { bn: "ইনকোয়ারি বা স্প্যাম মুছে ফেলুন", en: "Delete / Remove Spam Inquiry" },
  "inq.tooltip_copy_email": { bn: "ইমেইল কপি করুন", en: "Copy Email" },
  "inq.volume_qty": { bn: "আনুমানিক পরিমাণ / ভলিউম", en: "Estimated Volume / Quantity" },
  "inq.target_category": { bn: "আগ্রহী পণ্যের ক্যাটাগরি", en: "Target Material Category" },
  "inq.contact_country": { bn: "যোগাযোগ ও দেশ", en: "Contact Info & Country" },
  "inq.buyer_message": { bn: "বায়ারের ইনকোয়ারি বার্তা", en: "Buyer Inquiry Message" },
  "inq.quotation_dossier": { bn: "বাণিজ্যিক কোটেশন ও দরদাম ট্র্যাকার", en: "Commercial Quotation & Negotiation Dossier" },
  "inq.internal_record": { bn: "অভ্যন্তরীণ রেকর্ড · সুরক্ষিত অডিট ট্রেইল", en: "Internal Only · Secure Audit Record" },
  "inq.quotation_desc": {
    bn: "কোটেশন বিবরণ, রেট ($/MT), ইনকোটার্মস ও পেমেন্ট শর্তাবলী:",
    en: "Quotation Details, Pricing ($/MT), Incoterms, and Payment Terms:",
  },
  "inq.quotation_placeholder": {
    bn: "যেমন: কোটেশন $৪,৮৫০/MT CIF ইয়োকোহামা পোর্ট। শর্ত: ৩০% TT অগ্রিম, ৭০% BL কপির বিপরীতে।",
    en: "e.g. Quoted $4,850/MT CIF Yokohama Port. Terms: 30% TT deposit, 70% against BL copy. Assay sample sent via FedEx on Oct 16.",
  },
  "inq.audit_notice": {
    bn: "সংরক্ষণের সাথে সাথে স্থায়ী অডিট ট্রেইলে সংরক্ষিত হবে।",
    en: "Changes logged to the immutable security audit trail upon saving.",
  },
  "inq.save_notes": { bn: "বাণিজ্যিক নোট সংরক্ষণ করুন", en: "Save Commercial Notes" },
  "inq.copy": { bn: "কপি", en: "Copy" },
  "inq.custom_batch": { bn: "কাস্টম / স্পট ব্যাচ", en: "Custom / Spot Batch" },
  "inq.general_scrap": { bn: "সাধারণ স্ক্র্যাপ লট", en: "General Scrap" },
  "inq.delete_title": { bn: "বায়ার ইনকোয়ারি মুছে ফেলবেন?", en: "Delete Buyer Inquiry?" },
  "inq.delete_prompt": { bn: "আপনি কি নিশ্চিতভাবে এই ইনকোয়ারি স্থায়ীভাবে মুছে ফেলতে চান?", en: "Are you sure you want to permanently remove inquiry" },
  "inq.from": { bn: "কোম্পানি:", en: "from" },
  "inq.delete_security_notice": {
    bn: "নিরাপত্তা নোটিশ: এই কাজটি স্থায়ী অডিট ট্রেইলে সংরক্ষিত হবে। শুধুমাত্র টেস্ট ইনকোয়ারি বা নিশ্চিত স্প্যাম মুছে ফেলুন।",
    en: "Security Notice: This action is recorded in the permanent audit trail. Only test inquiries or confirmed spam should be permanently removed.",
  },
  "inq.cancel": { bn: "বাতিল", en: "Cancel" },
  "inq.confirm_delete": { bn: "মুছে ফেলা নিশ্চিত করুন", en: "Confirm Delete" },
  "inq.print_slip_subtitle": {
    bn: "B2B স্ক্র্যাপ মেটেরিয়াল প্রকিউরমেন্ট ও কোটেশন স্লিপ",
    en: "B2B Scrap Material Procurement & Quotation Slip",
  },
  "inq.client_buyer": { bn: "ক্লায়েন্ট / বায়ার", en: "Client / Buyer" },
  "inq.communication": { bn: "যোগাযোগ মাধ্যম", en: "Communication" },
  "inq.status_label": { bn: "স্ট্যাটাস:", en: "Status:" },
  "inq.category_interest": { bn: "আগ্রহী ক্যাটাগরি", en: "Category of Interest" },
  "inq.estimated_volume": { bn: "আনুমানিক ভলিউম", en: "Estimated Volume" },
  "inq.not_specified": { bn: "উল্লেখ নেই", en: "Not specified" },
  "inq.original_message": { bn: "মূল ইনকোয়ারি বার্তা:", en: "Original Inquiry Message:" },
  "inq.official_quotation_terms": {
    bn: "অফিসিয়াল কোটেশন শর্তাবলী ও অ্যাসে রেকর্ড:",
    en: "Official Quotation Terms & Assay Record:",
  },
  "inq.close": { bn: "বন্ধ করুন", en: "Close" },
  "inq.print_slip_btn": { bn: "ডজিয়ার স্লিপ প্রিন্ট করুন", en: "Print Dossier Slip" },
  "inq.status_updated": { bn: "ইনকোয়ারি স্ট্যাটাস আপডেট হয়েছে:", en: "Inquiry status updated to" },
  "inq.notes_saved": { bn: "কোটেশন নোট এবং শর্তাবলী সফলভাবে সংরক্ষিত হয়েছে!", en: "Quotation notes and terms saved successfully!" },
  "inq.copied_notice": { bn: "ক্লিপবোর্ডে কপি করা হয়েছে!", en: "copied to clipboard!" },

  // Products Table Specific
  "prod.search_placeholder": { bn: "নাম, ক্যাটাগরি বা স্পেসিফিকেশন দিয়ে খুঁজুন...", en: "Search by title, category, or specs..." },
  "prod.all_categories": { bn: "সব ক্যাটাগরি", en: "All Categories" },
  "prod.all_status": { bn: "সব স্ট্যাটাস", en: "All Status" },
  "prod.status_published": { bn: "পাবলিশড (সক্রিয়)", en: "Published" },
  "prod.status_draft": { bn: "ড্রাফট (পেন্ডিং)", en: "Draft" },
  "prod.showing": { bn: "মোট {total}টির মধ্যে {count}টি পণ্য প্রদর্শিত হচ্ছে", en: "Showing {count} of {total} products" },
  "prod.add_product": { bn: "নতুন পণ্য যোগ করুন", en: "Add Product" },
  "prod.col_product": { bn: "পণ্যের বিবরণ ও শিরোনাম", en: "Product & Title" },
  "prod.col_category": { bn: "ক্যাটাগরি", en: "Category" },
  "prod.col_grade": { bn: "গ্রেড ও উৎস", en: "Grade & Origin" },
  "prod.col_moq": { bn: "MOQ ও প্যাকেজিং", en: "MOQ & Packaging" },
  "prod.col_status": { bn: "স্ট্যাটাস", en: "Status" },
  "prod.col_actions": { bn: "অ্যাকশন", en: "Actions" },
  "prod.edit": { bn: "সম্পাদনা", en: "Edit" },
  "prod.delete": { bn: "মুছে ফেলুন", en: "Delete" },
  "prod.duplicate": { bn: "ক্লোন করুন", en: "Clone" },
  "prod.feature": { bn: "ফিচার করুন", en: "Feature" },
  "prod.unfeature": { bn: "আন-ফিচার", en: "Unfeature" },
  "prod.view_live": { bn: "লাইভ দেখুন", en: "View Live" },
  "prod.no_products": { bn: "কোনো পণ্য পাওয়া যায়নি।", en: "No products found." },
  "prod.save": { bn: "সংরক্ষণ করুন", en: "Save Product" },
  "prod.cancel": { bn: "বাতিল", en: "Cancel" },

  // Categories Manager Specific
  "cat.search_placeholder": { bn: "ক্যাটাগরি নাম দিয়ে খুঁজুন...", en: "Search category name..." },
  "cat.add_category": { bn: "নতুন ক্যাটাগরি যোগ করুন", en: "Add Category" },
  "cat.col_order": { bn: "ক্রম", en: "Order" },
  "cat.col_name": { bn: "ক্যাটাগরি নাম", en: "Category Name" },
  "cat.col_slug": { bn: "স্লাগ", en: "Slug" },
  "cat.col_products": { bn: "পণ্য সংখ্যা", en: "Products" },
  "cat.col_actions": { bn: "অ্যাকশন", en: "Actions" },
  "cat.move_up": { bn: "উপরে নিন", en: "Move Up" },
  "cat.move_down": { bn: "নিচে নিন", en: "Move Down" },
  "cat.delete_modal_title": { bn: "ক্যাটাগরি মুছে ফেলবেন?", en: "Delete Category?" },
  "cat.delete_modal_prompt": { bn: "আপনি কি নিশ্চিতভাবে এই ক্যাটাগরি মুছে ফেলতে চান?", en: "Are you sure you want to delete this category?" },

  // Gallery Manager Specific
  "gallery.search_placeholder": { bn: "শিরোনাম বা ক্যাপশন দিয়ে খুঁজুন...", en: "Search title or caption..." },
  "gallery.add_media": { bn: "নতুন মিডিয়া যোগ করুন", en: "Add Media" },
  "gallery.tab_all": { bn: "সব মিডিয়া", en: "All Media" },
  "gallery.tab_videos": { bn: "ভিডিও", en: "Videos" },
  "gallery.tab_photos": { bn: "স্থিরচিত্র", en: "Photos" },
  "gallery.tab_material": { bn: "উপাদান / স্ক্র্যাপ", en: "Material" },
  "gallery.tab_facility": { bn: "ইয়ার্ড ফ্যাসিলিটি", en: "Facility" },
  "gallery.tab_dismantling": { bn: "ডিসম্যান্তলিং", en: "Dismantling" },
  "gallery.tab_processing": { bn: "প্রসেসিং", en: "Processing" },
  "gallery.badge_authentic": { bn: "চট্টগ্রাম ইয়ার্ডের আসল চিত্র", en: "Authentic Chittagong Facility" },
  "gallery.badge_illustrative": { bn: "চিত্ররূপ", en: "Illustrative" },
  "gallery.toggle_verification": { bn: "ভেরিফিকেশন টগল", en: "Toggle Verification" },
  "gallery.copy_url": { bn: "URL কপি করুন", en: "Copy URL" },

  // Settings Manager Specific
  "settings.tab_about": { bn: "আমাদের সম্পর্কে ব্যানার", en: "About Us Banner" },
  "settings.tab_products": { bn: "পণ্য পেজ ব্যানার", en: "Products Banner" },
  "settings.tab_services": { bn: "সেবাসমূহ ব্যানার", en: "Services Banner" },
  "settings.tab_process": { bn: "কার্যপ্রক্রিয়া ব্যানার", en: "Process Banner" },
  "settings.tab_gallery": { bn: "গ্যালারি ব্যানার", en: "Gallery Banner" },
  "settings.tab_contact": { bn: "যোগাযোগ ব্যানার", en: "Contact Banner" },
  "settings.save_all": { bn: "সব ব্যানার সেটিংস সংরক্ষণ করুন", en: "Save Banner Settings" },
  "settings.reset_default": { bn: "ডিফল্ট ফিরিয়ে আনুন", en: "Reset to Default" },
  "settings.preview": { bn: "লাইভ ব্যানার প্রিভিউ", en: "Live Banner Preview" },
  "settings.upload_new": { bn: "নতুন ব্যানার আপলোড করুন", en: "Upload New Banner" },

  // Users Manager Specific
  "users.search_placeholder": { bn: "নাম বা ইমেইল দিয়ে কর্মকর্তা খুঁজুন...", en: "Search admin by name or email..." },
  "users.add_user": { bn: "নতুন কর্মকর্তা যোগ করুন", en: "Add Admin User" },
  "users.col_user": { bn: "কর্মকর্তা", en: "Administrator" },
  "users.col_role": { bn: "পদবী ও অনুমতি", en: "Role & Permissions" },
  "users.col_status": { bn: "অ্যাকাউন্ট স্ট্যাটাস", en: "Status" },
  "users.col_created": { bn: "নিবন্ধন তারিখ", en: "Created At" },
  "users.col_actions": { bn: "অ্যাকশন", en: "Actions" },
  "users.active": { bn: "সক্রিয়", en: "Active" },
  "users.inactive": { bn: "নিষ্ক্রিয়", en: "Inactive" },
  "users.role_super_admin": { bn: "সুপার অ্যাডমিন", en: "Super Admin" },
  "users.role_content_manager": { bn: "কনটেন্ট ম্যানেজার", en: "Content Manager" },

  // Audit Logs Specific
  "audit.search_placeholder": { bn: "অ্যাকশন, ইউজার, বা আইপি দিয়ে খুঁজুন...", en: "Search by action, user, or IP..." },
  "audit.filter_all": { bn: "সব লগ", en: "All Logs" },
  "audit.filter_login": { bn: "লগইন", en: "Logins" },
  "audit.filter_product": { bn: "পণ্য", en: "Products" },
  "audit.filter_inquiry": { bn: "ইনকোয়ারি", en: "Inquiries" },
  "audit.filter_category": { bn: "ক্যাটাগরি", en: "Categories" },
  "audit.filter_user": { bn: "ইউজার", en: "Users" },
  "audit.filter_gallery": { bn: "গ্যালারি", en: "Gallery" },
  "audit.col_timestamp": { bn: "তারিখ ও সময়", en: "Timestamp" },
  "audit.col_user": { bn: "কর্মকর্তা", en: "User" },
  "audit.col_action": { bn: "অপারেশন / অ্যাকশন", en: "Operation / Action" },
  "audit.col_ip": { bn: "আইপি ঠিকানা", en: "IP Address" },
  "audit.col_details": { bn: "বিবরণ", en: "Details" },
  "audit.inspect": { bn: "নিরীক্ষণ", en: "Inspect" },
  "audit.export_csv": { bn: "অডিট লগ এক্সপোর্ট", en: "Export Audit Log" },
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

export const COMMODITY_CATEGORY_MAP: Record<string, { bn: string; en: string }> = {
  "Printed Circuit Boards (PCBs)": { bn: "প্রিন্টেড সার্কিট বোর্ড (PCBs)", en: "Printed Circuit Boards (PCBs)" },
  "Server Motherboards": { bn: "সার্ভার মাদারবোর্ড", en: "Server Motherboards" },
  "Telecom Equipment": { bn: "টেলিকম ও নেটওয়ার্কিং সরঞ্জাম", en: "Telecom Equipment" },
  "CPU Processors": { bn: "সিপিইউ প্রসেসর", en: "CPU Processors" },
  "RAM & Memory Modules": { bn: "র‍্যাম ও মেমোরি মডিউল", en: "RAM & Memory Modules" },
  "Hard Drives & SSDs": { bn: "হার্ড ড্রাইভ ও এসএসডি", en: "Hard Drives & SSDs" },
  "Copper Scrap / Cables": { bn: "তামার তার ও কপার স্ক্র্যাপ", en: "Copper Scrap / Cables" },
  "Power Supplies & Batteries": { bn: "পাওয়ার সাপ্লাই ও ব্যাটারি", en: "Power Supplies & Batteries" },
  "Industrial Electronic Scrap": { bn: "শিল্প কারখানার ইলেকট্রনিক স্ক্র্যাপ", en: "Industrial Electronic Scrap" },
  "Mixed Electronics Scrap": { bn: "মিশ্র ইলেকট্রনিক্স স্ক্র্যাপ", en: "Mixed Electronics Scrap" },
};

export function translateCommodityCategory(
  categoryName: string | null | undefined,
  locale: AdminLocale
): string {
  if (!categoryName) return locale === "bn" ? "সাধারণ স্ক্র্যাপ" : "General Scrap";
  const mapped = COMMODITY_CATEGORY_MAP[categoryName];
  if (mapped) {
    return mapped[locale] || categoryName;
  }
  return categoryName;
}

export function translateInquiryStatus(
  status: string,
  locale: AdminLocale
): string {
  const map: Record<string, { bn: string; en: string }> = {
    ALL: { bn: "সব", en: "All" },
    NEW: { bn: "নতুন লিড", en: "New Lead" },
    CONTACTED: { bn: "যোগাযোগকৃত", en: "Contacted" },
    IN_PROGRESS: { bn: "চলমান", en: "In Progress" },
    QUOTED: { bn: "কোটেশন প্রেরিত", en: "Quoted" },
    CLOSED: { bn: "সম্পন্ন", en: "Closed / Done" },
  };
  return map[status]?.[locale] || status;
}

