import fs from "fs";
import path from "path";
import topojson from "topojson-client";
import world from "world-atlas/countries-110m.json" with { type: "json" };
import * as d3 from "d3-geo";

// ISO numeric to alpha-2 map
const ISO_NUM_TO_ALPHA2 = {
  "004": "AF", "008": "AL", "012": "DZ", "024": "AO", "032": "AR", "036": "AU", "040": "AT", "050": "BD",
  "056": "BE", "064": "BT", "068": "BO", "070": "BA", "072": "BW", "076": "BR", "096": "BN", "100": "BG",
  "104": "MM", "108": "BI", "116": "KH", "120": "CM", "124": "CA", "140": "CF", "148": "TD", "152": "CL",
  "156": "CN", "170": "CO", "178": "CG", "180": "CD", "188": "CR", "191": "HR", "192": "CU", "196": "CY",
  "203": "CZ", "208": "DK", "214": "DO", "218": "EC", "222": "SV", "231": "ET", "232": "ER", "233": "EE",
  "242": "FJ", "246": "FI", "250": "FR", "266": "GA", "268": "GE", "276": "DE", "288": "GH", "300": "GR",
  "320": "GT", "324": "GN", "328": "GY", "332": "HT", "340": "HN", "348": "HU", "352": "IS", "356": "IN",
  "360": "ID", "364": "IR", "368": "IQ", "372": "IE", "376": "IL", "380": "IT", "384": "CI", "388": "JM",
  "392": "JP", "398": "KZ", "400": "JO", "404": "KE", "408": "KP", "410": "KR", "414": "KW", "417": "KG",
  "418": "LA", "422": "LB", "426": "LS", "430": "LR", "434": "LY", "440": "LT", "442": "LU", "450": "MG",
  "454": "MW", "458": "MY", "466": "ML", "478": "MR", "484": "MX", "496": "MN", "498": "MD", "504": "MA",
  "508": "MZ", "516": "NA", "524": "NP", "528": "NL", "554": "NZ", "558": "NI", "562": "NE", "566": "NG",
  "578": "NO", "512": "OM", "586": "PK", "591": "PA", "598": "PG", "600": "PY", "604": "PE", "608": "PH",
  "616": "PL", "620": "PT", "634": "QA", "642": "RO", "643": "RU", "646": "RW", "682": "SA", "686": "SN",
  "688": "RS", "694": "SL", "702": "SG", "703": "SK", "704": "VN", "705": "SI", "706": "SO", "710": "ZA",
  "716": "ZW", "724": "ES", "728": "SS", "729": "SD", "740": "SR", "752": "SE", "756": "CH", "760": "SY",
  "762": "TJ", "764": "TH", "768": "TG", "784": "AE", "788": "TN", "792": "TR", "795": "TM", "800": "UG",
  "804": "UA", "826": "GB", "834": "TZ", "840": "US", "858": "UY", "860": "UZ", "862": "VE", "887": "YE",
  "894": "ZM"
};

const COUNTRY_NAMES_BN = {
  BD: "বাংলাদেশ", CN: "চীন", JP: "জাপান", AE: "সংযুক্ত আরব আমিরাত", US: "যুক্তরাষ্ট্র",
  DE: "জার্মানি", SG: "সিঙ্গাপুর", VN: "ভিয়েতনাম", KR: "দক্ষিণ কোরিয়া", IN: "ভারত",
  GB: "যুক্তরাজ্য", RU: "রাশিয়া", CA: "কানাডা", AU: "অস্ট্রেলিয়া", BR: "ব্রাজিল",
  FR: "ফ্রান্স", IT: "ইতালি", ES: "স্পেন", TR: "তুরস্ক", SA: "সৌদি আরব",
  MY: "মালয়েশিয়া", TH: "থাইল্যান্ড", ID: "ইন্দোনেশিয়া", ZA: "দক্ষিণ আফ্রিকা",
  EG: "মিশর", MX: "মেক্সিকো", NL: "নেদারল্যান্ডস", SE: "সুইডেন", CH: "সুইজারল্যান্ড"
};

const COUNTRY_FLAGS = {
  BD: "🇧🇩", CN: "🇨🇳", JP: "🇯🇵", AE: "🇦🇪", US: "🇺🇸", DE: "🇩🇪", SG: "🇸🇬",
  VN: "🇻🇳", KR: "🇰🇷", IN: "🇮🇳", GB: "🇬🇧", RU: "🇷🇺", CA: "🇨🇦", AU: "🇦🇺",
  BR: "🇧🇷", FR: "🇫🇷", IT: "🇮🇹", ES: "🇪🇸", TR: "🇹🇷", SA: "🇸🇦", MY: "🇲🇾",
  TH: "🇹🇭", ID: "🇮🇩", ZA: "🇿🇦", EG: "🇪🇬", MX: "🇲🇽", NL: "🇳🇱", SE: "🇸🇪", CH: "🇨🇭"
};

// Cities and district definitions with true Lon/Lat
const RAW_CITIES = {
  BD: [
    {
      id: "bd-ctg",
      name: "Chittagong Port (HQ & Yard)",
      nameBn: "চট্টগ্রাম বন্দর (HQ ও রিসাইক্লিং ইয়ার্ড)",
      role: "Main Processing Yard & Maritime Container Terminal",
      roleBn: "প্রধান ডিসম্যান্তলিং ইয়ার্ড ও কন্টেইনার টার্মিনাল",
      lon: 91.8317,
      lat: 22.3384,
      isHq: true,
      visitors: 480,
      inquiries: 3,
      primaryMaterial: "Heavy Enterprise Dismantling & Port Intake",
      primaryMaterialBn: "হেভি এন্টারপ্রাইজ ডিসম্যান্তলিং ও পোর্ট ইনটেক",
    },
    {
      id: "bd-dhk",
      name: "Dhaka Metro",
      nameBn: "ঢাকা মহানগর (করপোরেট অফিস)",
      role: "Headquarters & Commercial Liaison Desk",
      roleBn: "বাণিজ্যিক যোগাযোগ ডেস্ক ও কর্পোরেট সোর্সিং",
      lon: 90.4125,
      lat: 23.8103,
      visitors: 180,
      inquiries: 1,
      primaryMaterial: "Corporate IT Equipment & Telecom Decommissioning",
      primaryMaterialBn: "কর্পোরেট আইটি সরঞ্জাম ও টেলিকম ডিকমিশনিং",
    },
    {
      id: "bd-ng",
      name: "Narayanganj Recycling Belt",
      nameBn: "নারায়ণগঞ্জ স্ক্র্যাপ হাব",
      role: "Regional Metal Aggregation & Sorting",
      roleBn: "আঞ্চলিক মেটাল বাছাই ও সেকেন্ডারি প্রসেসিং",
      lon: 90.5000,
      lat: 23.6238,
      visitors: 50,
      inquiries: 0,
      primaryMaterial: "Copper Granules & Electric Motors",
      primaryMaterialBn: "কপার গ্র্যানিউলস ও ইলেকট্রিক মোটর স্ক্র্যাপ",
    },
    {
      id: "bd-khu",
      name: "Khulna / Mongla Port",
      nameBn: "খুলনা ও মোংলা বন্দর হাব",
      role: "Secondary Riverine Logistics Gateway",
      roleBn: "নদী বন্দর ও দক্ষিণ-পশ্চিমাঞ্চলীয় স্ক্র্যাপ ইনটেক",
      lon: 89.5400,
      lat: 22.8456,
      visitors: 30,
      inquiries: 0,
      primaryMaterial: "Industrial Transformers & Marine Electronics",
      primaryMaterialBn: "শিল্প ট্রান্সফরমার ও মেরিন ইলেকট্রনিক্স",
    },
  ],
  CN: [
    {
      id: "cn-sz",
      name: "Shenzhen",
      nameBn: "শেনঝেন (Shenzhen)",
      role: "High-Density IC Chips & Server Motherboard Hub",
      roleBn: "হাই-ডেনসিটি আইসি চিপস ও সার্ভার মাদারবোর্ড মার্কেট",
      lon: 114.0579,
      lat: 22.5431,
      visitors: 760,
      inquiries: 5,
      primaryMaterial: "Server Motherboards & Gold Connector Pins",
      primaryMaterialBn: "সার্ভার মাদারবোর্ড ও গোল্ড কানেক্টর পিন",
    },
    {
      id: "cn-gz",
      name: "Guangzhou",
      nameBn: "গুয়াংজু (Guangzhou)",
      role: "Precious Metals Smelting & Bulk PCB Ingestion",
      roleBn: "মূল্যবান ধাতু স্মেল্টিং ও বাল্ক পিসিবি প্রসেসিং",
      lon: 113.2644,
      lat: 23.1291,
      visitors: 380,
      inquiries: 2,
      primaryMaterial: "High-Yield Circuit Boards & SMT Scrap",
      primaryMaterialBn: "উচ্চ ইল্ড সার্কিট বোর্ড ও এসএমটি স্ক্র্যাপ",
    },
    {
      id: "cn-sh",
      name: "Shanghai Port",
      nameBn: "সাংহাই বন্দর (Shanghai Port)",
      role: "International Maritime Gateway & Import Brokerage",
      roleBn: "আন্তর্জাতিক কন্টেইনার বন্দর ও ট্রেডিং ডেস্ক",
      lon: 121.4737,
      lat: 31.2304,
      visitors: 190,
      inquiries: 1,
      primaryMaterial: "Copper Anodes & Refined Shreds",
      primaryMaterialBn: "কপার অ্যানোড ও পরিশোধিত পিসিবি শ্রেডস",
    },
    {
      id: "cn-bj",
      name: "Beijing",
      nameBn: "বেইজিং (Beijing)",
      role: "State Environmental Enterprise Compliance",
      roleBn: "পরিবেশগত ট্রেড কমপ্লায়েন্স ও এন্টারপ্রাইজ পার্টনার",
      lon: 116.4074,
      lat: 39.9042,
      visitors: 90,
      inquiries: 1,
      primaryMaterial: "Industrial Telecom Racks",
      primaryMaterialBn: "শিল্প টেলিকম র্যাক ও নেটওয়ার্কিং গিয়ার",
    },
  ],
  JP: [
    {
      id: "jp-tky",
      name: "Tokyo Metro",
      nameBn: "টোকিও (Tokyo Metro)",
      role: "Commodity Trading Exchange & Executive Brokerage",
      roleBn: "কমোডিটি ট্রেডিং ডেস্ক ও এক্সিকিউটিভ ব্রোকারেজ",
      lon: 139.6917,
      lat: 35.6895,
      visitors: 520,
      inquiries: 4,
      primaryMaterial: "High-Purity Precious Metal Refining Lots",
      primaryMaterialBn: "উচ্চ বিশুদ্ধতার মূল্যবান ধাতু রিফাইনিং লট",
    },
    {
      id: "jp-osk",
      name: "Osaka",
      nameBn: "ওসাকা (Osaka)",
      role: "Industrial Metal Smelting & Secondary Refining",
      roleBn: "শিল্প স্মেল্টিং ও সেকেন্ডারি রিফাইনিং সেন্টার",
      lon: 135.5023,
      lat: 34.6937,
      visitors: 310,
      inquiries: 2,
      primaryMaterial: "Gold-Plated Connector Pins & IC Trimmings",
      primaryMaterialBn: "গোল্ড-প্লেটেড কানেক্টর পিন ও আইসি ট্রিমিংস",
    },
    {
      id: "jp-ngy",
      name: "Nagoya",
      nameBn: "নাগোয়া (Nagoya)",
      role: "Automotive & Industrial Electronics Recovery",
      roleBn: "অটোমোটিভ ইলেকট্রনিক্স ও হেভি কেবলস রিকভারি",
      lon: 136.9066,
      lat: 35.1815,
      visitors: 110,
      inquiries: 1,
      primaryMaterial: "Automotive Sensor Scrap & Copper Windings",
      primaryMaterialBn: "অটোমোটিভ সেন্সর স্ক্র্যাপ ও কপার উইন্ডিং",
    },
    {
      id: "jp-ykh",
      name: "Yokohama Port",
      nameBn: "ইয়োকোহামা বন্দর (Yokohama Port)",
      role: "Maritime Bulk Intake Terminal",
      roleBn: "আন্তর্জাতিক সামুদ্রিক বাল্ক ইনটেক টার্মিনাল",
      lon: 139.6380,
      lat: 35.4437,
      visitors: 40,
      inquiries: 0,
      primaryMaterial: "Containerized Shredded Circuit Boards",
      primaryMaterialBn: "কন্টেইনারাইজড শ্রেডেড সার্কিট বোর্ড",
    },
  ],
  AE: [
    {
      id: "ae-dxb",
      name: "Dubai (Jebel Ali)",
      nameBn: "দুবাই (জাবাল আলী পোর্ট ও ফ্রিজোন)",
      role: "Middle East Mega Transshipment Freezone",
      roleBn: "মধ্যপ্রাচ্য রি-এক্সপোর্ট হাব ও ফ্রন্টলাইন ফ্রিজোন",
      lon: 55.0273,
      lat: 24.9857,
      visitors: 510,
      inquiries: 3,
      primaryMaterial: "Mixed Shredded Circuit Boards & Connectors",
      primaryMaterialBn: "মিক্সড শ্রেডেড সার্কিট বোর্ড ও কানেক্টরস",
    },
    {
      id: "ae-shj",
      name: "Sharjah Industrial",
      nameBn: "শারজাহ ইন্ডাস্ট্রিয়াল স্ক্র্যাপ বেল্ট",
      role: "Secondary Segregation & Dismantling Yards",
      roleBn: "সেকেন্ডারি বাছাইকরণ ও ডিসম্যান্তলিং ইয়ার্ডস",
      lon: 55.4033,
      lat: 25.3463,
      visitors: 220,
      inquiries: 2,
      primaryMaterial: "Heavy Telecom Racks & Power Cables",
      primaryMaterialBn: "হেভি টেলিকম র্যাক ও পাওয়ার কেবলস",
    },
    {
      id: "ae-auh",
      name: "Abu Dhabi",
      nameBn: "আবুধাবি (Abu Dhabi)",
      role: "Petrochemical & Industrial Electronics Sourcing",
      roleBn: "শিল্প অবকাঠামো ও হেভি ইলেকট্রনিক্স সোর্সিং",
      lon: 54.3773,
      lat: 24.4539,
      visitors: 80,
      inquiries: 0,
      primaryMaterial: "Industrial Transformers & Substation Scrap",
      primaryMaterialBn: "শিল্প ট্রান্সফরমার ও সাবস্টেশন স্ক্র্যাপ",
    },
  ],
  US: [
    {
      id: "us-hou",
      name: "Houston / Gulf Coast",
      nameBn: "হিউস্টন (Houston / Gulf Coast)",
      role: "Industrial Oilfield & Heavy Transformer Scrap Gateway",
      roleBn: "শিল্প তেলক্ষেত্র ও হেভি ট্রান্সফরমার স্ক্র্যাপ গেটওয়ে",
      lon: -95.3698,
      lat: 29.7604,
      visitors: 240,
      inquiries: 1,
      primaryMaterial: "Industrial Transformers & Power Substation Boards",
      primaryMaterialBn: "শিল্প ট্রান্সফরমার ও পাওয়ার সাবস্টেশন বোর্ডস",
    },
    {
      id: "us-la",
      name: "Los Angeles Port",
      nameBn: "লস অ্যাঞ্জেলেস বন্দর (Los Angeles Port)",
      role: "Trans-Pacific Scrap Export Port",
      roleBn: "প্রশান্ত মহাসাগরীয় স্ক্র্যাপ রপ্তানি বন্দর",
      lon: -118.2437,
      lat: 34.0522,
      visitors: 140,
      inquiries: 1,
      primaryMaterial: "Sorted Server Motherboards & IC Chips",
      primaryMaterialBn: "বাছাইকৃত সার্ভার মাদারবোর্ড ও আইসি চিপস",
    },
    {
      id: "us-dal",
      name: "Dallas / Fort Worth",
      nameBn: "ডালাস (Dallas / Fort Worth)",
      role: "Data Center Decommissioning Hub",
      roleBn: "ডাটা সেন্টার ডিকমিশনিং ও টেলিকম বেল্ট",
      lon: -96.7970,
      lat: 32.7767,
      visitors: 80,
      inquiries: 0,
      primaryMaterial: "Cloud Server Racks & High-Density RAM",
      primaryMaterialBn: "ক্লাউড সার্ভার র্যাক ও হাই-ডেনসিটি র‍্যাম",
    },
    {
      id: "us-ny",
      name: "New York / Newark",
      nameBn: "নিউ ইয়র্ক / নিউয়ার্ক পোর্ট",
      role: "Atlantic Financial IT Recycling Logistics",
      roleBn: "আটলান্টিক করপোরেট আইটি রিসাইক্লিং গেটওয়ে",
      lon: -74.0060,
      lat: 40.7128,
      visitors: 60,
      inquiries: 0,
      primaryMaterial: "Enterprise Banking Hardware Scrap",
      primaryMaterialBn: "ব্যাংকিং হার্ডওয়্যার ও সার্ভার স্ক্র্যাপ",
    },
  ],
  DE: [
    {
      id: "de-fra",
      name: "Frankfurt Metro",
      nameBn: "ফ্রাঙ্কফুর্ট (Frankfurt Metro)",
      role: "Central European Financial & Data Center Hub",
      roleBn: "ইউরোপীয় আর্থিক কেন্দ্র ও ডাটা সেন্টার হাব",
      lon: 8.6821,
      lat: 50.1109,
      visitors: 190,
      inquiries: 1,
      primaryMaterial: "EU WEEE Compliant PCB Scrap & Shreds",
      primaryMaterialBn: "ইইউ WEEE কমপ্লায়েন্ট পিসিবি স্ক্র্যাপ ও শ্রেডস",
    },
    {
      id: "de-ham",
      name: "Hamburg Port",
      nameBn: "হামবুর্গ বন্দর (Hamburg Port)",
      role: "Major Maritime Scrap Intake Terminal",
      roleBn: "বৃহত্তম সামুদ্রিক স্ক্র্যাপ ইনটেক টার্মিনাল",
      lon: 9.9937,
      lat: 53.5511,
      visitors: 110,
      inquiries: 1,
      primaryMaterial: "High-Purity Copper Granules & Stripped Wire",
      primaryMaterialBn: "উচ্চ বিশুদ্ধতার তামা গ্র্যানিউলস ও তার",
    },
    {
      id: "de-dus",
      name: "Düsseldorf / Ruhr",
      nameBn: "ডুসেলডর্ফ ও রুর শিল্পাঞ্চল",
      role: "Heavy Metallurgy & Smelting Cluster",
      roleBn: "মেটালার্জি ও স্মেল্টিং শিল্পাঞ্চল",
      lon: 6.7735,
      lat: 51.2277,
      visitors: 60,
      inquiries: 0,
      primaryMaterial: "Industrial Transformers & Copper Rotors",
      primaryMaterialBn: "শিল্প ট্রান্সফরমার ও কপার রোটর",
    },
  ],
  SG: [
    {
      id: "sg-jur",
      name: "Jurong Port & Industrial Zone",
      nameBn: "জুরং পোর্ট ও শিল্পাঞ্চল (Jurong Port)",
      role: "Deepwater Scrap Loading & Smelting Berth",
      roleBn: "গভীর সমুদ্র স্ক্র্যাপ লোডিং ও স্মেল্টিং বার্থ",
      lon: 103.7198,
      lat: 1.3090,
      visitors: 210,
      inquiries: 12,
      primaryMaterial: "Refined Copper Wire & High-Purity Granules",
      primaryMaterialBn: "পরিশোধিত তামা তার ও হাই-পিউরিটি গ্র্যানিউলস",
    },
    {
      id: "sg-cbd",
      name: "Singapore Trading Hub",
      nameBn: "সিঙ্গাপুর ট্রেডিং ডেস্ক (Downtown Core)",
      role: "Regional Commodity Financial Desk",
      roleBn: "আঞ্চলিক কমোডিটি ফিন্যান্সিয়াল ডেস্ক",
      lon: 103.8519,
      lat: 1.2840,
      visitors: 100,
      inquiries: 4,
      primaryMaterial: "High-Density Motherboards & Memory Modules",
      primaryMaterialBn: "হাই-ডেনসিটি মাদারবোর্ড ও মেমরি মডিউলস",
    },
  ],
  VN: [
    {
      id: "vn-hcm",
      name: "Ho Chi Minh City",
      nameBn: "হো চি মিন সিটি (Ho Chi Minh City)",
      role: "Southern Electronics Manufacturing Hub",
      roleBn: "দক্ষিণ ভিয়েতনাম ইলেকট্রনিক্স ম্যানুফ্যাকচারিং হাব",
      lon: 106.6297,
      lat: 10.8231,
      visitors: 100,
      inquiries: 1,
      primaryMaterial: "SMT Assembly Offcuts & Connectors",
      primaryMaterialBn: "এসএমটি অ্যাসেম্বলি অফকাটস ও কানেক্টরস",
    },
    {
      id: "vn-han",
      name: "Hanoi & Hai Phong",
      nameBn: "হ্যানয় ও হাইফং বন্দর (Hanoi & Hai Phong)",
      role: "Northern Industrial Corridor & Export Port",
      roleBn: "উত্তরাঞ্চলীয় শিল্পাঞ্চল ও রপ্তানি বন্দর",
      lon: 105.8542,
      lat: 21.0285,
      visitors: 60,
      inquiries: 0,
      primaryMaterial: "Printed Circuit Board Trimmings",
      primaryMaterialBn: "প্রিন্টেড সার্কিট বোর্ড ট্রিমিংস ও পিনস",
    },
  ],
  KR: [
    {
      id: "kr-sel",
      name: "Seoul Metro",
      nameBn: "সিউল মহানগর (Seoul Metro)",
      role: "Advanced Semiconductor Refinement Desk",
      roleBn: "উন্নত সেমিকন্ডাক্টর রিফাইনিং ডেস্ক ও ট্রেড হাব",
      lon: 126.9780,
      lat: 37.5665,
      visitors: 80,
      inquiries: 1,
      primaryMaterial: "DRAM / NAND Flash Circuit Boards",
      primaryMaterialBn: "ডি-র‍্যাম ও ন্যান্ড ফ্ল্যাশ সার্কিট বোর্ড",
    },
    {
      id: "kr-bus",
      name: "Busan Port",
      nameBn: "বুসান বন্দর (Busan Port)",
      role: "Global Marine Transshipment Port",
      roleBn: "আন্তর্জাতিক সামুদ্রিক ট্রান্সশিপমেন্ট বন্দর",
      lon: 129.0756,
      lat: 35.1796,
      visitors: 40,
      inquiries: 0,
      primaryMaterial: "Industrial PCB Scrap Lots",
      primaryMaterialBn: "শিল্প পিসিবি স্ক্র্যাপ লটস",
    },
  ],
  IN: [
    {
      id: "in-mum",
      name: "Mumbai (JNPT Port)",
      nameBn: "মুম্বাই (জেএনপিটি বন্দর)",
      role: "Western Coast Metal Trade & Port Gateway",
      roleBn: "পশ্চিম উপকূলীয় মেটাল ট্রেড ও কন্টেইনার বন্দর",
      lon: 72.8777,
      lat: 19.0760,
      visitors: 140,
      inquiries: 1,
      primaryMaterial: "Industrial Transformers & Heavy Copper",
      primaryMaterialBn: "শিল্প ট্রান্সফরমার ও হেভি কপার স্ক্র্যাপ",
    },
    {
      id: "in-che",
      name: "Chennai Port",
      nameBn: "চেন্নাই বন্দর (Chennai Port)",
      role: "Automotive & Telecom Scrap Corridor",
      roleBn: "অটোমোটিভ ও টেলিকম স্ক্র্যাপ করিডোর",
      lon: 80.2707,
      lat: 13.0827,
      visitors: 80,
      inquiries: 0,
      primaryMaterial: "Telecom Electronic Components",
      primaryMaterialBn: "টেলিকম ইলেকট্রনিক যন্ত্রাংশ ও ক্যাবলস",
    },
  ],
  GB: [
    {
      id: "gb-lon",
      name: "London (LME Hub)",
      nameBn: "লন্ডন (LME ট্রেডিং হাব)",
      role: "Global Non-Ferrous Metals Brokerage",
      roleBn: "আন্তর্জাতিক নন-ফেরাস মেটাল ব্রোকারেজ",
      lon: -0.1278,
      lat: 51.5074,
      visitors: 90,
      inquiries: 1,
      primaryMaterial: "Refined Copper Scrap & Precious Metals",
      primaryMaterialBn: "পরিশোধিত তামা স্ক্র্যাপ ও মূল্যবান ধাতু",
    },
  ],
};

const OVERVIEWS_BN = {
  BD: "চট্টগ্রাম পোর্ট ভিত্তিক রিসাইক্লিং ডিসম্যান্তলিং ইয়ার্ড এবং ঢাকা-নারায়ণগঞ্জ কর্পোরেট ইনটেক হাব।",
  CN: "বিশ্বের বৃহত্তম সেমিকন্ডাক্টর ও মাদারবোর্ড স্ক্র্যাপ প্রসেসিং হাব—শেনঝেন ও গুয়াংজু চ্যানেল।",
  JP: "হাই-টেক পাইরোমেটালার্জিক্যাল মূল্যবান ধাতু (স্বর্ণ, রৌপ্য, প্যালাডিয়াম) রিফাইনিং লট।",
  AE: "মধ্যপ্রাচ্যের শীর্ষ রি-এক্সপোর্ট ও মিক্সড স্ক্র্যাপ কন্টেইনার ট্রানজিট কেন্দ্র।",
  US: "উত্তর আমেরিকার টেলিকম অবকাঠামো, হেভি ট্রান্সফরমার ও এন্টারপ্রাইজ সার্ভার ডিকমিশনিং।",
  DE: "ইউরোপীয় ইউনিয়ন WEEE নিয়মাবলী অনুযায়ী সার্টিফাইড ডিসম্যান্তলিং ও কপার স্মেল্টিং।",
  SG: "আসিয়ান আন্তর্জাতিক কমোডিটি ব্রোকারেজ ও পরিশোধিত তামা চুক্তি হাব।",
  VN: "দক্ষিণ-পূর্ব এশিয়ার দ্রুত বর্ধনশীল এসএমটি ইলেকট্রনিক্স সংযোজন ও ট্রিম স্ক্র্যাপ কেন্দ্র।",
  KR: "বিশ্বমানের মেমরি সেমিকন্ডাক্টর (DRAM ও NAND Flash) সার্কিট বোর্ড রিকভারি।",
  IN: "দক্ষিণ এশীয় ভারী শিল্প স্ক্র্যাপ, ট্রান্সফরমার ও কপার কেবলস রিকভারি বেল্ট।",
  GB: "লন্ডন মেটাল এক্সচেঞ্জ (LME) লিঙ্কড আন্তর্জাতিক ট্রেডিং ও নন-ফেরাস কমোডিটি সোর্সিং।"
};

const OVERVIEWS_EN = {
  BD: "Chittagong Port-based recycling dismantling yard and Dhaka-Narayanganj corporate intake hub.",
  CN: "World's largest semiconductor and motherboard scrap processing hub across Shenzhen and Guangzhou corridors.",
  JP: "High-tech pyrometallurgical precious metal (gold, silver, palladium) refining lots in Tokyo & Osaka.",
  AE: "Middle East premier re-export and mixed scrap container transshipment terminal in Jebel Ali & Sharjah.",
  US: "North American telecom infrastructure, heavy transformer, and enterprise data center decommissioning.",
  DE: "EU WEEE compliant certified electronics dismantling and copper metallurgy cluster in Frankfurt & Hamburg.",
  SG: "ASEAN international commodity brokerage and refined copper contract clearing hub.",
  VN: "Southeast Asia's fastest-growing SMT electronics assembly offcuts and PCB trimmings hub.",
  KR: "World-class memory semiconductor (DRAM and NAND Flash) circuit board recovery in Seoul & Busan.",
  IN: "South Asian heavy industrial scrap, transformers, and copper cable recovery belt in Mumbai & Chennai.",
  GB: "London Metal Exchange (LME) linked international trading and non-ferrous commodity sourcing desk."
};

function main() {
  console.log("Generating 100% authentic Natural Earth GIS world map data...");

  // Extract country features
  const countries = topojson.feature(world, world.objects.countries);

  // Natural Earth projection fitted into 1000 x 500 canvas with slight breathing room
  const projection = d3.geoNaturalEarth1().fitExtent([[10, 10], [990, 490]], countries);
  const pathGen = d3.geoPath().projection(projection);

  // Compile country geometries
  const countryList = [];

  for (const feat of countries.features) {
    const numId = String(feat.id).padStart(3, "0");
    const alpha2 = ISO_NUM_TO_ALPHA2[numId] || null;
    const name = feat.properties?.name || "Country " + numId;
    const nameBn = (alpha2 && COUNTRY_NAMES_BN[alpha2]) || name;
    const flag = (alpha2 && COUNTRY_FLAGS[alpha2]) || "🌐";

    const d = pathGen(feat);
    if (!d) continue;

    // Bounds in projection coordinates [[x0, y0], [x1, y1]]
    const bounds = pathGen.bounds(feat);
    const centroid = pathGen.centroid(feat);

    const bx0 = bounds[0][0];
    const by0 = bounds[0][1];
    const bx1 = bounds[1][0];
    const by1 = bounds[1][1];

    const w = Math.max(20, bx1 - bx0);
    const h = Math.max(20, by1 - by0);

    // Padding for smooth zoom
    const pad = Math.max(15, Math.max(w, h) * 0.25);
    const zoomBounds = {
      x: Math.round(Math.max(0, bx0 - pad)),
      y: Math.round(Math.max(0, by0 - pad)),
      width: Math.round(w + pad * 2),
      height: Math.round(h + pad * 2),
    };

    countryList.push({
      numId,
      alpha2,
      name,
      nameBn,
      flag,
      d,
      centroid: [Math.round(centroid[0] || (bx0 + bx1) / 2), Math.round(centroid[1] || (by0 + by1) / 2)],
      zoomBounds,
    });
  }

  // Compile buyer hubs with precise projected city pins
  const buyerCountriesData = {};

  for (const [code, rawCityList] of Object.entries(RAW_CITIES)) {
    const countryGeo = countryList.find((c) => c.alpha2 === code);
    if (!countryGeo) continue;

    // Specific zoom tuning for optimal visual presentation
    let customBounds = countryGeo.zoomBounds;
    if (code === "BD") {
      customBounds = { x: 715, y: 150, width: 60, height: 50 };
    } else if (code === "SG") {
      customBounds = { x: 760, y: 230, width: 30, height: 25 };
    } else if (code === "AE") {
      customBounds = { x: 625, y: 155, width: 45, height: 35 };
    } else if (code === "KR") {
      customBounds = { x: 805, y: 115, width: 40, height: 35 };
    } else if (code === "DE") {
      customBounds = { x: 505, y: 65, width: 45, height: 40 };
    } else if (code === "GB") {
      customBounds = { x: 470, y: 55, width: 45, height: 45 };
    } else if (code === "JP") {
      customBounds = { x: 820, y: 95, width: 60, height: 60 };
    } else if (code === "VN") {
      customBounds = { x: 755, y: 165, width: 50, height: 65 };
    } else if (code === "IN") {
      customBounds = { x: 670, y: 125, width: 95, height: 105 };
    } else if (code === "CN") {
      customBounds = { x: 675, y: 70, width: 160, height: 130 };
    } else if (code === "US") {
      customBounds = { x: 130, y: 60, width: 200, height: 135 };
    }

const COUNTRY_COORDINATES = {
  BD: { lat: 23.6850, lon: 90.3563, zoom: 7 },
  CN: { lat: 35.8617, lon: 104.1954, zoom: 4 },
  JP: { lat: 36.2048, lon: 138.2529, zoom: 5 },
  AE: { lat: 24.4539, lon: 54.3773, zoom: 7 },
  US: { lat: 37.0902, lon: -95.7129, zoom: 4 },
  DE: { lat: 51.1657, lon: 10.4515, zoom: 6 },
  SG: { lat: 1.3521, lon: 103.8198, zoom: 11 },
  VN: { lat: 14.0583, lon: 108.2772, zoom: 6 },
  KR: { lat: 35.9078, lon: 127.7669, zoom: 7 },
  IN: { lat: 20.5937, lon: 78.9629, zoom: 5 },
  GB: { lat: 54.3781, lon: -2.4360, zoom: 6 },
};

    const projectedCities = rawCityList.map((city) => {
      const [px, py] = projection([city.lon, city.lat]);
      return {
        id: city.id,
        name: city.name,
        nameBn: city.nameBn,
        role: city.role,
        roleBn: city.roleBn,
        lat: city.lat,
        lon: city.lon,
        x: Number(px.toFixed(1)),
        y: Number(py.toFixed(1)),
        isHq: Boolean(city.isHq),
        visitors: city.visitors,
        inquiries: city.inquiries,
        primaryMaterial: city.primaryMaterial,
        primaryMaterialBn: city.primaryMaterialBn,
      };
    });

    const coords = COUNTRY_COORDINATES[code] || { lat: 20, lon: 0, zoom: 4 };

    buyerCountriesData[code] = {
      code,
      name: countryGeo.name,
      nameBn: COUNTRY_NAMES_BN[code] || countryGeo.nameBn,
      flag: COUNTRY_FLAGS[code] || "🌐",
      lat: coords.lat,
      lon: coords.lon,
      defaultZoom: coords.zoom,
      centroid: { x: countryGeo.centroid[0], y: countryGeo.centroid[1] },
      zoomBounds: customBounds,
      cities: projectedCities,
      overviewBn: OVERVIEWS_BN[code] || "",
      overviewEn: OVERVIEWS_EN[code] || "",
      pathD: countryGeo.d,
    };
  }

  // Chittagong Port Projected Epicenter
  const [ctgX, ctgY] = projection([91.8317, 22.3384]);
  const chittagongEpicenter = {
    lat: 22.3384,
    lon: 91.8317,
    x: Number(ctgX.toFixed(1)),
    y: Number(ctgY.toFixed(1)),
    name: "Chittagong Port (HQ & Yard)",
    nameBn: "চট্টগ্রাম বন্দর (HQ ও রিসাইক্লিং ইয়ার্ড)",
  };

  const tsContent = `// 100% Authentic Natural Earth GIS World Map Data
// Mathematically projected using D3 Natural Earth 1 onto 1000x500 canvas

export interface GisCityPoint {
  id: string;
  name: string;
  nameBn: string;
  role: string;
  roleBn: string;
  lat: number;
  lon: number;
  x: number;
  y: number;
  isHq?: boolean;
  visitors: number;
  inquiries: number;
  primaryMaterial: string;
  primaryMaterialBn: string;
}

export interface GisCountryDetail {
  code: string;
  name: string;
  nameBn: string;
  flag: string;
  lat: number;
  lon: number;
  defaultZoom: number;
  centroid: { x: number; y: number };
  zoomBounds: { x: number; y: number; width: number; height: number };
  cities: GisCityPoint[];
  overviewBn: string;
  overviewEn: string;
  pathD: string;
}

export interface WorldCountryFeature {
  numId: string;
  alpha2: string | null;
  name: string;
  nameBn: string;
  flag: string;
  d: string;
  centroid: [number, number];
  zoomBounds: { x: number; y: number; width: number; height: number };
}

export const CHITTAGONG_EPICENTER = ${JSON.stringify(chittagongEpicenter, null, 2)};

export const GIS_BUYER_COUNTRIES: Record<string, GisCountryDetail> = ${JSON.stringify(buyerCountriesData, null, 2)};

export const GIS_WORLD_COUNTRIES: WorldCountryFeature[] = ${JSON.stringify(countryList, null, 2)};
`;

  const outPath = path.join(process.cwd(), "lib", "world-gis-data.ts");
  fs.writeFileSync(outPath, tsContent, "utf-8");
  console.log("Successfully generated:", outPath, "with", countryList.length, "countries!");
}

main();
