import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COUNTRY_META = {
  BD: { name: "Bangladesh", nameBn: "বাংলাদেশ", flag: "🇧🇩", x: 729, y: 174, interest: "Chittagong Staging & Domestic Intake", interestBn: "চট্টগ্রাম স্টেজিং ও দেশীয় ইনটেক" },
  US: { name: "United States", nameBn: "যুক্তরাষ্ট্র", flag: "🇺🇸", x: 206, y: 108, interest: "Industrial Transformers & Substation Scrap", interestBn: "শিল্প ট্রান্সফরমার ও সাবস্টেশন স্ক্র্যাপ" },
  DE: { name: "Germany", nameBn: "জার্মানি", flag: "🇩🇪", x: 495, y: 78, interest: "WEEE Certified Dismantling & Copper Granules", interestBn: "WEEE প্রত্যয়িত ডিসম্যান্তলিং ও কপার গ্র্যানিউলস" },
  FR: { name: "France", nameBn: "ফ্রান্স", flag: "🇫🇷", x: 480, y: 88, interest: "European Telecom & Server PCB Scrap", interestBn: "ইউরোপীয় টেলিকম ও সার্ভার পিসিবি স্ক্র্যাপ" },
  CA: { name: "Canada", nameBn: "কানাডা", flag: "🇨🇦", x: 210, y: 65, interest: "High-Grade Electronics Refining Lots", interestBn: "উচ্চ গ্রেডের ইলেকট্রনিক্স রিফাইনিং লট" },
  CN: { name: "China", nameBn: "চীন", flag: "🇨🇳", x: 755, y: 134, interest: "Server Motherboards & IC Chips", interestBn: "সার্ভার মাদারবোর্ড ও আইসি চিপস" },
  JP: { name: "Japan", nameBn: "জাপান", flag: "🇯🇵", x: 846, y: 126, interest: "High-Purity Precious Metal Refining Lots", interestBn: "উচ্চ বিশুদ্ধতার মূল্যবান ধাতু রিফাইনিং লট" },
  AE: { name: "United Arab Emirates", nameBn: "সংযুক্ত আরব আমিরাত", flag: "🇦🇪", x: 642, y: 170, interest: "Middle East Industrial Scrap Re-Export", interestBn: "মধ্যপ্রাচ্য রি-এক্সপোর্ট ও মিশ্র সার্কিট বোর্ড" },
  SG: { name: "Singapore", nameBn: "সিঙ্গাপুর", flag: "🇸🇬", x: 755, y: 220, interest: "Refined Copper Wire & Granules", interestBn: "পরিশোধিত তামা তার ও গ্র্যানিউলস" },
  GB: { name: "United Kingdom", nameBn: "যুক্তরাজ্য", flag: "🇬🇧", x: 470, y: 72, interest: "Industrial PCB Scrap & High-Yield Lots", interestBn: "শিল্প পিসিবি স্ক্র্যাপ ও হাই-ইল্ড লট" },
};

function getCountryMeta(code, fallbackName) {
  const c = code?.toUpperCase();
  if (c && COUNTRY_META[c]) return { code: c, ...COUNTRY_META[c] };
  return {
    code: c || "UN",
    name: fallbackName || c || "International",
    nameBn: fallbackName || c || "আন্তর্জাতিক",
    flag: "🌐",
    x: 500,
    y: 150,
    interest: "Electronic Scrap & Circuit Boards",
    interestBn: "ইলেকট্রনিক স্ক্র্যাপ ও সার্কিট বোর্ড",
  };
}

async function testAnalytics(timeRange = "30d") {
  const now = new Date();
  let dateFilter = {};
  if (timeRange === "today") {
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    dateFilter = { createdAt: { gte: startOfToday } };
  } else if (timeRange === "7d") {
    const d7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    dateFilter = { createdAt: { gte: d7 } };
  } else if (timeRange === "30d") {
    const d30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    dateFilter = { createdAt: { gte: d30 } };
  }

  const fifteenMinAgo = new Date(now.getTime() - 15 * 60 * 1000);

  const [
    totalVisitors,
    liveVisitorsNow,
    totalInquiries,
    visitorCountryGroups,
    inqCountryGroups,
    deviceGroups,
    cityGroups,
  ] = await Promise.all([
    prisma.visitorLog.count({ where: dateFilter }),
    prisma.visitorLog.count({ where: { createdAt: { gte: fifteenMinAgo } } }),
    prisma.inquiry.count({ where: dateFilter }),
    prisma.visitorLog.groupBy({
      by: ["country", "countryCode"],
      _count: { id: true },
      where: dateFilter,
      orderBy: { _count: { id: "desc" } },
    }),
    prisma.inquiry.groupBy({
      by: ["country"],
      _count: { id: true },
      where: dateFilter,
    }),
    prisma.visitorLog.groupBy({
      by: ["device"],
      _count: { id: true },
      where: dateFilter,
    }),
    prisma.visitorLog.groupBy({
      by: ["city", "country", "countryCode"],
      _count: { id: true },
      where: {
        ...dateFilter,
        city: { not: null },
      },
      orderBy: { _count: { id: "desc" } },
      take: 12,
    }),
  ]);

  const dbInquiryCountsByCountry = {};
  for (const g of inqCountryGroups) {
    if (g.country) dbInquiryCountsByCountry[g.country] = g._count.id;
  }

  const countryStats = visitorCountryGroups.map((g) => {
    const meta = getCountryMeta(g.countryCode, g.country);
    const visitors = g._count.id;
    const share = totalVisitors > 0 ? Number(((visitors / totalVisitors) * 100).toFixed(1)) : 0;
    const inquiries = dbInquiryCountsByCountry[g.country] || 0;
    const conversionRate = visitors > 0 ? Number(((inquiries / visitors) * 100).toFixed(2)) : 0;
    return {
      code: meta.code,
      name: meta.name,
      nameBn: meta.nameBn,
      flag: meta.flag,
      visitors,
      share,
      inquiries,
      conversionRate,
      primaryInterest: meta.interest,
      primaryInterestBn: meta.interestBn,
      x: meta.x,
      y: meta.y,
      activeNow: 0,
      recentLeads: [],
    };
  });

  let dDesktop = 0, dMobile = 0, dTablet = 0;
  for (const dg of deviceGroups) {
    if (dg.device === "Mobile") dMobile += dg._count.id;
    else if (dg.device === "Tablet") dTablet += dg._count.id;
    else dDesktop += dg._count.id;
  }
  const devTotal = dDesktop + dMobile + dTablet;
  const deviceBreakdown = {
    desktop: devTotal > 0 ? Math.round((dDesktop / devTotal) * 100) : 0,
    mobile: devTotal > 0 ? Math.round((dMobile / devTotal) * 100) : 0,
    tablet: devTotal > 0 ? Math.round((dTablet / devTotal) * 100) : 0,
  };

  const cityHubs = cityGroups
    .filter((cg) => cg.city && cg.city.trim().length > 0)
    .map((cg) => {
      const meta = getCountryMeta(cg.countryCode, cg.country);
      return {
        city: cg.city,
        cityBn: cg.city,
        country: meta.name,
        countryBn: meta.nameBn,
        flag: meta.flag,
        visitors: cg._count.id,
        inquiries: 0,
        specialty: meta.interest,
        specialtyBn: meta.interestBn,
        status: cg._count.id > 20 ? "High Volume" : "Active Deals",
        statusBn: cg._count.id > 20 ? "উচ্চ ট্রাফিক" : "সক্রিয় ট্রেড",
        x: meta.x,
        y: meta.y,
      };
    });

  const globalConversionRate =
    totalVisitors > 0 ? Number(((totalInquiries / totalVisitors) * 100).toFixed(2)) : 0;

  console.log(`=== Real Analytics for [${timeRange}] ===`);
  console.log("Total Visitors:", totalVisitors);
  console.log("Live Visitors Now:", liveVisitorsNow);
  console.log("Total Inquiries:", totalInquiries);
  console.log("Conversion Rate:", globalConversionRate + "%");
  console.log("Device Breakdown:", deviceBreakdown);
  console.log("Countries Count:", countryStats.length);
  console.log("Top Country:", countryStats[0]?.name || "None");
  console.log("Country Stats:", countryStats);
  console.log("City Hubs Count:", cityHubs.length);
}

async function run() {
  await testAnalytics("today");
  await testAnalytics("7d");
  await testAnalytics("30d");
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
