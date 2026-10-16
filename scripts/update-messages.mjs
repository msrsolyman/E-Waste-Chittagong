import fs from "fs";
import path from "path";

const messagesDir = path.resolve(process.cwd(), "messages");

const enAdditions = {
  about: {
    badge: "Company Overview",
    title: "About E-Waste Chittagong",
    subtitle: "Dedicated to responsible e-waste aggregation, systematic material separation, and international circular economy trade.",
    p1: "E-Waste Chittagong operates at the vital intersection of regional electronic asset retirement and global resource recovery. Based in Bangladesh's foremost maritime gateway city, our organization collects discarded computer equipment, server infrastructure, telecommunication boards, and industrial electronics from corporate enterprises.",
    p2: "Our core mission is to replace informal, hazardous e-waste handling with structured, transparent B2B procedures. We prioritize the safe separation of dangerous substances—such as lead solder and lithium accumulators—while maximizing the extraction yield of high-value non-ferrous and precious metal-bearing components.",
    p3: "All materials prepared for export or domestic industrial supply undergo systematic grading and packaging according to international industry specifications, allowing certified global smelters and refiners to process them efficiently.",
    policyTitle: "Verified Operational Policy",
    policyDesc: "E-Waste Chittagong upholds strict factual transparency. All facility specifications, material lots, and business details are verified prior to formal commercial execution.",
    missionTitle: "Our Mission",
    missionDesc: "To provide safe, ethical, and economically viable electronic waste recovery solutions that divert hazardous electronics from local landfills into the global circular supply chain.",
    portTitle: "Chittagong Port Proximity",
    portDesc: "Our strategic position near Chittagong's seaport reduces inland transportation overhead, facilitating prompt container stuffing, customs clearance, and global ocean freight dispatch.",
    readinessTitle: "International B2B Readiness",
    readinessDesc: "We cater to overseas refiners and recyclers with multilingual communication, formal Proforma Invoices, clear assay test terms, and FOB / CIF shipping arrangements."
  },
  services: {
    title: "Our Specialized Services",
    subtitle: "Providing structured, environmentally responsible solutions for electronic waste management.",
    learnMore: "Learn More",
    badge: "Corporate Services",
    pageTitle: "Comprehensive Electronic Waste & Material Solutions",
    pageSubtitle: "End-to-end recycling solutions tailored for telecom providers, corporations, and international commodity refiners.",
    requestService: "Request Service Information"
  },
  process: {
    title: "Compliant Recycling Process",
    subtitle: "Every stage adheres to transparency, worker safety, and systematic resource recovery.",
    operationalStandardsBadge: "Operational Standards",
    badge: "Quality & Compliance",
    stage: "Stage",
    step1Title: "Collection & Aggregation",
    step1Desc: "Systematic intake of retired business electronics and bulk enterprise scrap.",
    step1Detail: "Commercial lots and enterprise electronic hardware are logged and assigned traceability tracking codes upon intake at our Chittagong handling hub.",
    step2Title: "Classification & Grading",
    step2Desc: "Trained manual segregation of circuit boards, telecom modules, and ferrous metals.",
    step2Detail: "Trained sorting teams classify circuit board grades based on component density, multilayer plating, and IC architecture to ensure pure batches.",
    step3Title: "Safe Dismantling",
    step3Desc: "Physical disassembly into primary components, separating hazardous batteries safely.",
    step3Detail: "Subassemblies are physically dismantled using specialized tools. Batteries and hazardous capacitors are isolated into certified storage drums.",
    step4Title: "B2B Dispatch & Recovery",
    step4Desc: "Carefully packaged material dispatch to verified industrial recyclers and refiners.",
    step4Detail: "Graded materials are packaged into export-ready super sacks or drums, palletized, and loaded into shipping containers for maritime transit.",
    safetyBadge: "Worker Safety & Zero Informal Acid Leaching",
    safetyTitle: "Strict Policy Against Informal Chemical Refining",
    safetyDesc: "E-Waste Chittagong operates purely on physical dismantling, sorting, and mechanical segregation principles. We strictly prohibit crude open-burning, acid bath leaching, or environmentally destructive chemical stripping. All downstream pyrometallurgical refining is conducted exclusively by licensed, accredited international smelters."
  },
  gallery: {
    title: "Facility Activities & Gallery",
    subtitle: "A transparent look at our handling practices and material sorting.",
    badge: "Visual Verification",
    verifiedBadge: "Confirmed Operation",
    illustrativeBadge: "Illustrative Concept",
    transparencyNote: "E-Waste Chittagong clearly distinguishes between authentic facility handling photographs and illustrative industry concepts for complete buyer transparency.",
    all: "All Media",
    facility: "Facility",
    material: "Materials",
    dismantling: "Dismantling"
  },
  categories: {
    badge: "Material Taxonomies",
    title: "Electronic Waste Product Categories",
    subtitle: "Explore our specialized sorting streams for circuit boards, semiconductor microprocessors, telecom infrastructure, and industrial scrap.",
    itemsCount: "{count} Catalogue Items",
    browse: "Browse {name}"
  },
  products: {
    title: "B2B Product Catalogue",
    subtitle: "Carefully sorted electronic waste categories available for verified B2B recycling and industrial recovery.",
    badge: "B2B Scrap Catalogue",
    pageTitle: "Electronic Scrap & Raw Material Categories",
    pageSubtitle: "Sorted, graded, and prepared in accordance with international circular economy and pyrometallurgical refiner guidelines.",
    verifiedInventoryBadge: "Verified Inventory",
    viewFullCatalogue: "View Full Catalogue",
    searchPlaceholder: "Search products or grades...",
    allCategories: "All Categories",
    grade: "Grade",
    origin: "Origin",
    moq: "Min. Order",
    packaging: "Packaging",
    status: "Status",
    requestQuote: "Request Quote",
    viewDetails: "View Details",
    empty: "No products found matching your filter criteria.",
    specifications: "Technical Specifications",
    inquireThis: "Inquire About This Product",
    draftNotice: "This product specification is awaiting final client confirmation before shipment clearance."
  },
  productDetail: {
    backToCatalogue: "Back to Product Catalogue",
    verifiedGuaranteeTitle: "Verified Material Lot Guarantee",
    verifiedGuaranteeDesc: "Every shipment is packaged and sealed under supervision in Chittagong, adhering strictly to agreed B2B assay expectations and international logistics requirements.",
    specsTitle: "Commercial & Technical Specifications",
    gradeLabel: "Material Grade",
    originLabel: "Origin Port",
    packagingLabel: "Packaging",
    moqLabel: "Minimum Order (MOQ)",
    descTitle: "Full Description & Dismantling Protocol",
    rfqTitle: "Request Quotation for: {title}",
    rfqDesc: "Submit your inquiry directly. Our commercial export desk will respond with FOB/CIF pricing, trial shipping schedule, and full documentation."
  },
  privacy: {
    badge: "Compliance & Confidentiality",
    title: "Privacy & Data Protection Policy",
    subtitle: "How E-Waste Chittagong collects, handles, and protects information submitted by international buyers and corporate clients.",
    guarantee: "Strict Corporate Guarantee: We never sell, share, or disclose prospective buyer contact details or quotation specifications to third parties.",
    sec1Title: "1. Collection of Commercial Inquiries",
    sec1Desc: "When you submit a Request for Quotation (RFQ) or contact inquiry through our platform, we collect company identifiers, contact representative names, business email addresses, contact telephone numbers, and material procurement specifications.",
    sec2Title: "2. Purpose of Processing",
    sec2Desc: "Data gathered is utilized exclusively to formulate formal commercial offers, calculate FOB/CIF freight rates from the Port of Chittagong, confirm inventory readiness, and fulfill international trade documentation requirements.",
    sec3Title: "3. Data Security & Storage",
    sec3Desc: "All submitted records are encrypted in transit and stored within protected database environments with strict role-based administrative access controls.",
    sec4Title: "4. Inquiries & Data Rights",
    sec4Desc: "You may request the review, correction, or deletion of your company's commercial records at any time by contacting our compliance desk at info@ewastechittagong.com."
  }
};

const bnAdditions = {
  about: {
    badge: "কোম্পানি পরিচিতি",
    title: "ই-ওয়েস্ট চট্টগ্রাম সম্পর্কে",
    subtitle: "দায়িত্বশীল ইলেকট্রনিক বর্জ্য সংগ্রহ, নিয়মতান্ত্রিক উপাদান পৃথকীকরণ এবং আন্তর্জাতিক সার্কুলার অর্থনীতি বাণিজ্যে নিবেদিত।",
    p1: "ই-ওয়েস্ট চট্টগ্রাম আঞ্চলিক ইলেকট্রনিক সম্পদের অপসরণ ও বৈশ্বিক উপাদান পুনরুদ্ধারের গুরুত্বপূর্ণ কেন্দ্রবিন্দুতে কাজ করে। বাংলাদেশের প্রধান সামুদ্রিক বন্দর নগরীতে অবস্থিত আমাদের সংস্থা কর্পোরেট প্রতিষ্ঠান থেকে বাতিল কম্পিউটার সরঞ্জাম, সার্ভার অবকাঠামো, টেলিকম বোর্ড এবং শিল্প ইলেকট্রনিক্স সংগ্রহ করে।",
    p2: "আমাদের মূল লক্ষ্য হলো ক্ষতিকর ও অপ্রাতিষ্ঠানিক বর্জ্য ব্যবস্থাপনার পরিবর্তে একটি কাঠামোগত ও স্বচ্ছ B2B পদ্ধতি প্রবর্তন করা। আমরা সীসা ও লিথিয়াম ব্যাটারির মতো বিপজ্জনক উপাদানগুলোকে নিরাপদে আলাদা করার পাশাপাশি মূল্যবান অ-লৌহঘটিত এবং মূল্যবান ধাতব উপাদানের নিষ্কাশন ফলন সর্বাধিক করি।",
    p3: "রপ্তানি বা স্থানীয় শিল্পের জন্য প্রস্তুতকৃত সকল উপাদান আন্তর্জাতিক স্পেসিফিকেশন অনুযায়ী গ্রেডিং ও প্যাকেজিং করা হয়, যাতে বিশ্বস্ত রিফাইনার ও স্মেল্টাররা সেগুলো সহজে প্রক্রিয়া করতে পারে।",
    policyTitle: "যাচাইকৃত অপারেশনাল নীতি",
    policyDesc: "ই-ওয়েস্ট চট্টগ্রাম কঠোর তথ্যগত স্বচ্ছতা বজায় রাখে। আনুষ্ঠানিক বাণিজ্যিক কার্যক্রমের পূর্বে সমস্ত লট ও ব্যবসায়িক বিবরণ যাচাই করা হয়।",
    missionTitle: "আমাদের লক্ষ্য",
    missionDesc: "নিরাপদ, পরিবেশবান্ধব ও লাভজনক বর্জ্য ব্যবস্থাপনা নিশ্চিত করে ইলেকট্রনিক বর্জ্যকে আবর্জনাভূমি থেকে বৈশ্বিক সার্কুলার সরবরাহ শৃঙ্খলে রূপান্তর করা।",
    portTitle: "চট্টগ্রাম বন্দরের নৈকট্য",
    portDesc: "চট্টগ্রাম সমুদ্রবন্দরের নিকটে আমাদের কৌশলগত অবস্থান অভ্যন্তরীণ পরিবহন খরচ কমায় এবং দ্রুত কনটেইনার স্টাফিং ও রপ্তানি সহজতর করে।",
    readinessTitle: "আন্তর্জাতিক B2B প্রস্তুতি",
    readinessDesc: "বহুভাষিক যোগাযোগ, আনুষ্ঠানিক প্রোফরমা ইনভয়েস, স্পষ্ট ধাতু পরীক্ষা নীতি এবং FOB/CIF শিপিং ব্যবস্থার মাধ্যমে আমরা আন্তর্জাতিক ক্রেতাদের সেবা প্রদান করি।"
  },
  services: {
    title: "আমাদের বিশেষায়িত সেবাসমূহ",
    subtitle: "ইলেকট্রনিক বর্জ্য ব্যবস্থাপনার জন্য পরিকল্পিত এবং পরিবেশবান্ধব সমাধান প্রদান।",
    learnMore: "আরও জানুন",
    badge: "কর্পোরেট সেবাসমূহ",
    pageTitle: "ইলেকট্রনিক বর্জ্য ও উপাদান ব্যবস্থাপনার পূর্ণাঙ্গ সমাধান",
    pageSubtitle: "টেলিকম অপারেটর, কর্পোরেট প্রতিষ্ঠান এবং আন্তর্জাতিক রিফাইনারদের জন্য সমন্বিত সমাধান।",
    requestService: "সেবা সম্পর্কে তথ্য চান"
  },
  process: {
    title: "অনুমোদিত রিসাইক্লিং প্রক্রিয়া",
    subtitle: "প্রতিটি ধাপ স্বচ্ছতা, শ্রমিকের নিরাপত্তা এবং নিয়মতান্ত্রিক সম্পদ পুনরুদ্ধারের নীতি মেনে চলে।",
    operationalStandardsBadge: "অপারেশনাল মানদণ্ড",
    badge: "গুণমান ও সম্মতি",
    stage: "পর্যায়",
    step1Title: "সংগ্রহ ও একত্রীকরণ",
    step1Desc: "প্রতিষ্ঠানসমূহের অব্যবহৃত ইলেকট্রনিক্স এবং বাল্ক স্ক্র্যাপের নিয়মিত সংগ্রহ।",
    step1Detail: "বাণিজ্যিক লট ও এন্টারপ্রাইজ হার্ডওয়্যার গ্রহণকালে ট্র্যাকিং কোড বরাদ্দ করা হয়।",
    step2Title: "শ্রেণীবিন্যাস ও গ্রেডিং",
    step2Desc: "সার্কিট বোর্ড, টেলিকম মডিউল এবং অন্যান্য উপাদান দক্ষভাবে আলাদা করা।",
    step2Detail: "কম্পোনেন্টের ঘনত্ব ও প্লেটিং অনুসারে সার্কিট বোর্ডের সঠিক গ্রেডিং নিশ্চিত করা হয়।",
    step3Title: "নিরাপদ বিযুক্তি",
    step3Desc: "যন্ত্রাংশগুলো সাবধানে খুলে ক্ষতিকর ব্যাটারি নিরাপদে পৃথক করা।",
    step3Detail: "বিশেষায়িত টুলের সাহায্যে যন্ত্রাংশ বিযুক্ত করে বিপজ্জনক উপাদান নিরাপদ ড্রামে রাখা হয়।",
    step4Title: "B2B সরবরাহ ও নিষ্কাশন",
    step4Desc: "যথাযথ প্যাকেজিং সহ বিশ্বস্ত শিল্প গ্রাহকদের কাছে উপাদান হস্তান্তর।",
    step4Detail: "রপ্তানির উপযোগী সুপার ব্যাগে প্যাক করে কনটেইনারের মাধ্যমে সমুদ্রপথে প্রেরণ করা হয়।",
    safetyBadge: "শ্রমিক সুরক্ষা ও পরিবেশবান্ধব নিষ্কাশন",
    safetyTitle: "রাসায়নিক অ্যাসিড ব্যবহারের বিরুদ্ধে কঠোর অবস্থান",
    safetyDesc: "ই-ওয়েস্ট চট্টগ্রাম কেবল যান্ত্রিক পৃথকীকরণ ও হস্তচালিত বাছাইকরণ পরিচালনা করে। উন্মুক্ত পোড়ানো বা অনিরাপদ অ্যাসিডের ব্যবহার সম্পূর্ণ নিষিদ্ধ। সমস্ত ধাতব পরিশোধন অনুমোদিত আন্তর্জাতিক স্মেল্টার দ্বারা সম্পন্ন হয়।"
  },
  gallery: {
    title: "সুবিধা ও কার্যক্রম গ্যালারি",
    subtitle: "আমাদের উপাদান বাছাই এবং প্রক্রিয়াকরণ পদ্ধতির একটি স্বচ্ছ দৃশ্য।",
    badge: "ভিজ্যুয়াল যাচাইকরণ",
    verifiedBadge: "যাচাইকৃত কার্যক্রম",
    illustrativeBadge: "চিত্রায়ন ধারণা",
    transparencyNote: "সম্পূর্ণ স্বচ্ছতার স্বার্থে ই-ওয়েস্ট চট্টগ্রাম বাস্তব ফ্যাসিলিটির ছবি এবং ধারণাগত চিত্রায়নের মধ্যে স্পষ্ট পার্থক্য বজায় রাখে।",
    all: "সকল ছবি",
    facility: "স্থাপনা",
    material: "উপাদান",
    dismantling: "বিযুক্তি"
  },
  categories: {
    badge: "উপাদান শ্রেণীবিন্যাস",
    title: "ইলেকট্রনিক বর্জ্য পণ্য ক্যাটাগরি",
    subtitle: "সার্কিট বোর্ড, সেমিকন্ডাক্টর প্রসেসর, টেলিকম পরিকাঠামো এবং শিল্প স্ক্র্যাপের বিশদ বিবরণ।",
    itemsCount: "{count}টি ক্যাটালগ আইটেম",
    browse: "{name} দেখুন"
  },
  products: {
    title: "B2B পণ্য ক্যাটালগ",
    subtitle: "যাচাইকৃত B2B রিসাইক্লিং এবং শিল্প পুনরুদ্ধারের জন্য শ্রেণীবদ্ধ ইলেকট্রনিক বর্জ্য।",
    badge: "B2B স্ক্র্যাপ ক্যাটালগ",
    pageTitle: "ইলেকট্রনিক স্ক্র্যাপ ও কাঁচামাল ক্যাটাগরি",
    pageSubtitle: "আন্তর্জাতিক সার্কুলার অর্থনীতি ও স্মেল্টার নির্দেশিকা অনুসারে সাজানো ও গ্রেড করা পণ্য।",
    verifiedInventoryBadge: "যাচাইকৃত ইনভেন্টরি",
    viewFullCatalogue: "সম্পূর্ণ ক্যাটালগ দেখুন",
    searchPlaceholder: "পণ্য বা গ্রেড অনুসন্ধান করুন...",
    allCategories: "সকল ক্যাটাগরি",
    grade: "গ্রেড",
    origin: "উৎপত্তি",
    moq: "সর্বনিম্ন পরিমাণ",
    packaging: "প্যাকেজিং",
    status: "অবস্থা",
    requestQuote: "কোটেশন চান",
    viewDetails: "বিস্তারিত দেখুন",
    empty: "আপনার ফিল্টারের সাথে মিলে এমন কোনো পণ্য পাওয়া যায়নি।",
    specifications: "প্রযুক্তিগত বৈশিষ্ট্যসমূহ",
    inquireThis: "এই পণ্যটি সম্পর্কে অনুসন্ধান করুন",
    draftNotice: "চালান অনুমোদনের পূর্বে এই পণ্যের তথ্য চূড়ান্ত নিশ্চিতকরণের অপেক্ষায় রয়েছে।"
  },
  productDetail: {
    backToCatalogue: "পণ্য ক্যাটালগে ফিরে যান",
    verifiedGuaranteeTitle: "যাচাইকৃত উপাদান লট গ্যারান্টি",
    verifiedGuaranteeDesc: "চট্টগ্রামে তদারকির অধীনে প্রতিটি চালান সিল ও প্যাক করা হয়, যা আন্তর্জাতিক চুক্তি ও লজিস্টিক মান মেনে চলে।",
    specsTitle: "বাণিজ্যিক ও প্রযুক্তিগত স্পেসিফিকেশন",
    gradeLabel: "উপাদান গ্রেড",
    originLabel: "উৎপত্তি বন্দর",
    packagingLabel: "প্যাকেজিং",
    moqLabel: "সর্বনিম্ন অর্ডার (MOQ)",
    descTitle: "সম্পূর্ণ বিবরণ ও ডিসম্যান্টলিং প্রটোকল",
    rfqTitle: "কোটেশন অনুরোধ: {title}",
    rfqDesc: "সরাসরি আপনার অনুসন্ধান জমা দিন। আমাদের রপ্তানি ডেস্ক এফওবি/সিআইএফ মূল্য ও বিবরণ সহ দ্রুত যোগাযোগ করবে।"
  },
  privacy: {
    badge: "সম্মতি ও গোপনীয়তা",
    title: "গোপনীয়তা ও তথ্য সুরক্ষা নীতি",
    subtitle: "ই-ওয়েস্ট চট্টগ্রাম কীভাবে আন্তর্জাতিক ক্রেতা ও অংশীদারদের তথ্য সংগ্রহ ও সুরক্ষা করে।",
    guarantee: "কর্পোরেট প্রতিশ্রুতি: আমরা কখনোই কোনো তৃতীয় পক্ষের সাথে বাণিজ্যিক তথ্য বা কোটেশনের বিবরণ শেয়ার করি না।",
    sec1Title: "১. বাণিজ্যিক অনুসন্ধানের তথ্য সংগ্রহ",
    sec1Desc: "কোটেশন বা যোগাযোগের অনুরোধ করার সময় আমরা কোম্পানির নাম, প্রতিনিধির নাম, ইমেইল, ফোন নম্বর এবং পণ্যের প্রয়োজনীয় বিবরণ সংগ্রহ করি।",
    sec2Title: "২. তথ্য ব্যবহারের উদ্দেশ্য",
    sec2Desc: "সংগৃহীত তথ্য কেবল আনুষ্ঠানিক বাণিজ্যিক অফার তৈরি, চট্টগ্রাম বন্দর থেকে শিপিং রেট গণনা এবং রপ্তানি নথিপত্র তৈরির কাজে ব্যবহৃত হয়।",
    sec3Title: "৩. তথ্য সুরক্ষা ও সংরক্ষণ",
    sec3Desc: "সকল তথ্য এনক্রিপ্ট করে সুরক্ষিত ডাটাবেজে সংরক্ষণ করা হয় যা কেবল অনুমোদিত প্রশাসক দ্বারা পরিচালিত হয়।",
    sec4Title: "৪. তথ্য সংক্রান্ত অধিকার",
    sec4Desc: "আপনার কোম্পানির তথ্য সংশোধন বা মুছে ফেলার জন্য আমাদের compliance ডেস্কে info@ewastechittagong.com-এ যোগাযোগ করতে পারেন।"
  }
};

const zhAdditions = {
  about: {
    badge: "企业概览",
    title: "关于 E-Waste Chittagong",
    subtitle: "专注于合规电子废弃物归集、专业材料分拣与国际循环经济贸易。",
    p1: "E-Waste Chittagong 立足于区域企业级电子资产退役与全球资源再生的战略交汇点。我们依托孟加拉国最重要的海运门户城市吉大港，规范化回收废旧计算机、服务器网络设施、通信板卡及工业电子废料。",
    p2: "我们的使命是以透明、可审计的B2B作业流程替代传统非正规拆解。我们严格隔离焊锡与锂电池等有害物质，最大化提升高品位有色金属和贵金属部件的提取收率。",
    p3: "所有出口及工业原料均按国际公认标准执行分拣、等级评定和标准化包装，为全球合规冶炼企业提供高品质的再生原料保障。",
    policyTitle: "核实运营政策",
    policyDesc: "E-Waste Chittagong 坚持事实透明原则。所有设施指标、物料批次与商业数据均在正式贸易履约前严格核实。",
    missionTitle: "我们的使命",
    missionDesc: "提供安全、环保且具备商业可行性的电子废料回收方案，将工业废弃物转化为全球循环经济资源。",
    portTitle: "吉大港枢纽区位",
    portDesc: "紧邻吉大港国际集装箱海运港区，大幅降低内陆驳运损耗，实现快速装箱、通关与国际干线发运。",
    readinessTitle: "国际商务履约保障",
    readinessDesc: "支持多语种商贸沟通，出具标准形式发票（PI），提供清晰的化验协议与 FOB / CIF 国际海运条款支持。"
  },
  services: {
    title: "核心服务领域",
    subtitle: "为大中型企业提供合规、可审计的电子废弃物全流程处理方案。",
    learnMore: "了解详情",
    badge: "企业服务",
    pageTitle: "全流程电子废料与金属材料循环利用方案",
    pageSubtitle: "专为通信运营商、跨国企业及全球有色金属冶炼厂定制的合规再生服务。",
    requestService: "索取服务详情"
  },
  process: {
    title: "合规回收作业流程",
    subtitle: "每一环节严格遵循环保规范、作业安全与资源系统化提取标准。",
    operationalStandardsBadge: "运营标准",
    badge: "质量与合规",
    stage: "工段",
    step1Title: "批量回收与汇聚",
    step1Desc: "规范接收企事业单位退役电子资产及批量工业残料。",
    step1Detail: "企业退役资产进入吉大港作业中心时，立即赋予唯一溯源码与称重台账。",
    step2Title: "专业等级分选",
    step2Desc: "人工精细分拣通信板卡、主板芯片与金属构件。",
    step2Detail: "按元器件密度、多层镀金厚度及封装工艺进行分级，保障纯度与冶炼收率。",
    step3Title: "环保拆解分离",
    step3Desc: "物理拆解各级模块，单独隔离并妥善处置电池及有害元件。",
    step3Detail: "专用机械工具物理拆解，废蓄电池与电解电容严格隔离至危废储运桶。",
    step4Title: "B2B 打包与交运",
    step4Desc: "标准工业包装密封，直供通过审计的全球冶炼与精炼基地。",
    step4Detail: "采用吨袋托盘密封打包，直接装运海运集装箱，送往国际合规精炼企业。",
    safetyBadge: "作业安全与杜绝非正规酸浸",
    safetyTitle: "严禁非正规化学冶炼与酸洗",
    safetyDesc: "E-Waste Chittagong 严格坚持物理拆解与机械分选原则。严禁露天焚烧、强酸浸出或有毒剥离。后续高温火法与湿法冶炼由持牌国际专业精炼厂完成。"
  },
  gallery: {
    title: "作业现场与设施图库",
    subtitle: "透明展示我们的材料处置标准、工序规范与现场管理。",
    badge: "实景验证",
    verifiedBadge: "真实作业影像",
    illustrativeBadge: "示意图景",
    transparencyNote: "为保障国际采购商知情权，E-Waste Chittagong 严格区分真实作业现场照片与行业示意图景。",
    all: "全部媒体",
    facility: "作业设施",
    material: "材料库存",
    dismantling: "拆解工段"
  },
  categories: {
    badge: "物料品类分类",
    title: "电子废弃物商品分类",
    subtitle: "探索印刷电路板、半导体处理器、通信基站退役模块及工业残料的专业分流。",
    itemsCount: "{count} 个目录品类",
    browse: "浏览 {name}"
  },
  products: {
    title: "B2B 电子废料产品目录",
    subtitle: "经过专业分拣与等级划分的电子废料，面向国际合规冶炼与资源再生企业。",
    badge: "B2B 废料目录",
    pageTitle: "电子废料与再生原料品类",
    pageSubtitle: "严格遵照国际循环经济标准与金属精炼冶炼规范执行等级标定与打包。",
    verifiedInventoryBadge: "已验证库存",
    viewFullCatalogue: "查看完整目录",
    searchPlaceholder: "搜索产品名称或品级...",
    allCategories: "所有分类",
    grade: "等级/品级",
    origin: "来源产地",
    moq: "最小起订量",
    packaging: "包装方式",
    status: "状态",
    requestQuote: "申请报价",
    viewDetails: "查看详情",
    empty: "未找到符合筛选条件的产品记录。",
    specifications: "规格参数",
    inquireThis: "咨询该产品采购",
    draftNotice: "该产品规格正等待最终客户确认后执行装运放行。"
  },
  productDetail: {
    backToCatalogue: "返回产品目录",
    verifiedGuaranteeTitle: "核实物料批次保障",
    verifiedGuaranteeDesc: "每批货物均在吉大港专人监装并密封打包，严格符合合同化验约定与国际海运货代规范。",
    specsTitle: "商业与技术规格参数",
    gradeLabel: "物料品级",
    originLabel: "装运港口",
    packagingLabel: "包装规格",
    moqLabel: "最小起订量 (MOQ)",
    descTitle: "产品详述与拆解规范",
    rfqTitle: "采购询价: {title}",
    rfqDesc: "请直接提交您的采购需求，我们的国际贸易业务部将迅速回复 FOB/CIF 报价、样单装运周期及单证要求。"
  },
  privacy: {
    badge: "合规与保密承诺",
    title: "隐私权保护与数据合规政策",
    subtitle: "E-Waste Chittagong 如何收集、处理与保护国际买家及企业合作伙伴提交的商业信息。",
    guarantee: "企业严格承诺：我们绝不出售、共享或向任何无关第三方披露潜在客户的联络方式及采购询盘规格。",
    sec1Title: "1. 商业询盘信息收集",
    sec1Desc: "当您在平台提交询价单（RFQ）或商务联络时，我们将收集企业全称、联系人姓名、业务邮箱、商务电话及意向采购指标。",
    sec2Title: "2. 数据处理目的",
    sec2Desc: "所收集数据严格用于出具正式商业报价、核算吉大港出发海运运费、核查现货库存及办理国际海关出口单证。",
    sec3Title: "3. 数据安全与技术防护",
    sec3Desc: "所有提交数据均通过传输加密，并存储在具有严格基于角色访问控制（RBAC）的数据库环境中。",
    sec4Title: "4. 客户数据权利",
    sec4Desc: "您可随时联络合规部邮箱 info@ewastechittagong.com 申请查阅、更正或删除您企业的商贸档案。"
  }
};

const jaAdditions = {
  about: {
    badge: "企業概要",
    title: "E-Waste Chittagong について",
    subtitle: "責任ある電子廃棄物の集約、体系的な素材分別、そして国際的なサーキュラーエコノミー貿易を推進。",
    p1: "E-Waste Chittagongは、バングラデシュ最大の港湾都市チッタゴンを拠点に、企業から排出されるOA機器、サーバーインフラ、通信基板、産業用電子機器の適正回収とマテリアルリサイクルを行っています。",
    p2: "非公式で危険な廃棄物処理を排除し、透明で体系的なB2Bプロセスを確立することが私たちの使命です。鉛やバッテリーなどの有害物質を安全に隔離しつつ、非鉄金属および有価貴金属含有部品の回収効率を最大化しています。",
    p3: "輸出用および国内産業向けのすべての原料は、国際基準に準拠した厳格な選別・梱包を行い、国内外の認定製錬所へ高品位なリサイクル原料を安定供給しています。",
    policyTitle: "検証済み事業方針",
    policyDesc: "事実に基づいた透明性を重視し、すべての施設仕様および材料ロットは正式契約前に厳格に確認されています。",
    missionTitle: "私たちのミッション",
    missionDesc: "安全かつ適正な電子スクラップ回収により、有害物質の埋立処分を防ぎ、グローバルな資源循環サプライチェーンへ還元します。",
    portTitle: "チッタゴン港の立地拠点",
    portDesc: "チッタゴン国際港湾ターミナルへの近接性により、陸上輸送コストを削減し、迅速なバンニング、通関、外航船積載を実現します。",
    readinessTitle: "国際B2B貿易体制",
    readinessDesc: "多言語での商談対応、プロフォーマインボイスの発行、検収・アッセイ条件の明確化、FOB/CIF条件での海上輸送に対応します。"
  },
  services: {
    title: "事業・サービス内容",
    subtitle: "環境負荷を低減し、安全基準を遵守した電子機器廃棄物管理ソリューション。",
    learnMore: "詳細はこちら",
    badge: "企業向けサービス",
    pageTitle: "電子廃棄物・有価金属リサイクルの包括的ソリューション",
    pageSubtitle: "通信事業者、企業、国際金属製錬所向けに最適化された循環型リサイクルサービス。",
    requestService: "サービス詳細のお問い合わせ"
  },
  process: {
    title: "適正リサイクル工程",
    subtitle: "すべての工程で透明性、作業者の安全衛生、効率的な資源回収を徹底しています。",
    operationalStandardsBadge: "運用基準",
    badge: "品質とコンプライアンス",
    stage: "工程",
    step1Title: "回収および集約",
    step1Desc: "企業から排出された不要な電子機器や基板スクラップの計画的回収。",
    step1Detail: "チッタゴンの拠点に搬入された業務用機器は、即座に計量および追跡コードが付与されます。",
    step2Title: "分類とグレーディング",
    step2Desc: "熟練スタッフによる基板種別、通信モジュール、金属パーツの目視選別。",
    step2Detail: "実装密度、メッキ仕様、IC構成に基づき、純度の高いロットへの等級分別を実施します。",
    step3Title: "安全解体と有害物分離",
    step3Desc: "筐体の分解と、二次電池や危険物質の安全な取り外し・隔離。",
    step3Detail: "専用治具を用いて安全に分解し、有害バッテリーやコンデンサを密閉ドラム缶へ隔離保管します。",
    step4Title: "B2B出荷と精錬供給",
    step4Desc: "フレコンバッグやパレットに安全梱包し、認定精錬事業者へ出荷。",
    step4Detail: "輸出仕様のフレコンバッグまたはパレット積載で海上コンテナにバンニングし出荷します。",
    safetyBadge: "労働安全衛生と有害酸浸出の完全禁止",
    safetyTitle: "非公式な化学精錬の完全禁止方針",
    safetyDesc: "E-Waste Chittagongは物理解体・機械選別の原則を徹底しています。野焼きや酸浸出（アシッドリーチング）などの環境破壊行為は固く禁止し、製錬処理は認可を受けた国際製錬所へ委託しています。"
  },
  gallery: {
    title: "事業活動・ギャラリー",
    subtitle: "原料の取り扱いおよび分別プロセスの透明な記録。",
    badge: "視覚的検証",
    verifiedBadge: "確認済み実業務",
    illustrativeBadge: "イメージ概念図",
    transparencyNote: "国際バイヤーへの透明性確保のため、E-Waste Chittagongは実際の作業現場と概念イメージを厳格に区別して掲載しています。",
    all: "全メディア",
    facility: "作業施設",
    material: "原料・材料",
    dismantling: "解体工程"
  },
  categories: {
    badge: "品目分類",
    title: "電子スクラップ品目カテゴリー",
    subtitle: "プリント基板、半導体プロセッサー、通信機器、産業用電子残渣の専門分別ライン。",
    itemsCount: "{count} 品目掲載中",
    browse: "{name} を見る"
  },
  products: {
    title: "B2B電子スクラップ製品カタログ",
    subtitle: "適正に選別・等級分けされたリサイクル原料。国内外の製錬所および資源再生パートナー向け。",
    badge: "B2B原料カタログ",
    pageTitle: "電子スクラップ・リサイクル原料一覧",
    pageSubtitle: "サーキュラーエコノミーおよび製錬受入基準に適合するよう選別・梱包されています。",
    verifiedInventoryBadge: "検証済み在庫",
    viewFullCatalogue: "全カタログを見る",
    searchPlaceholder: "製品名またはグレードを検索...",
    allCategories: "全カテゴリー",
    grade: "グレード",
    origin: "産地",
    moq: "最小発注数量 (MOQ)",
    packaging: "梱包形態",
    status: "状態",
    requestQuote: "見積りを依頼",
    viewDetails: "詳細を見る",
    empty: "該当する製品は見つかりませんでした。",
    specifications: "技術仕様・規格",
    inquireThis: "この製品について問い合わせる",
    draftNotice: "この製品仕様は最終確認中の下書き情報です。"
  },
  productDetail: {
    backToCatalogue: "製品カタログへ戻る",
    verifiedGuaranteeTitle: "検証済み材料ロット保証",
    verifiedGuaranteeDesc: "すべての出荷貨物はチッタゴンにて立ち会い検収・封緘され、合意されたアッセイ基準と国際輸送基準を遵守します。",
    specsTitle: "取引条件および技術仕様",
    gradeLabel: "材料グレード",
    originLabel: "仕出港",
    packagingLabel: "梱包形態",
    moqLabel: "最小発注数量 (MOQ)",
    descTitle: "詳細説明・解体プロトコル",
    rfqTitle: "お見積り依頼: {title}",
    rfqDesc: "お見積り依頼をお送りください。当社の国際貿易窓口より、FOB/CIF運賃、出荷スケジュール、必要書類をご案内します。"
  },
  privacy: {
    badge: "コンプライアンス＆機密保持",
    title: "プライバシーおよびデータ保護方針",
    subtitle: "国際バイヤーおよび取引先企業から提供された情報の取り扱い方針。",
    guarantee: "企業方針の保証: 当社は、お客様の企業連絡先や見積もり仕様を第三者に開示・販売・共有することは一切ございません。",
    sec1Title: "1. お問い合わせ情報の収集",
    sec1Desc: "お見積り（RFQ）のご依頼時、会社名、担当者名、法人メールアドレス、電話番号、調達希望仕様を収集します。",
    sec2Title: "2. 利用目的",
    sec2Desc: "収集した情報は、見積書の発行、チッタゴン港からのFOB/CIF海上運賃の算出、在庫確認、貿易書類の作成にのみ使用します。",
    sec3Title: "3. 安全管理とデータ保管",
    sec3Desc: "通信は暗号化され、役割ベースのアクセス制御（RBAC）を備えた安全なデータベース環境で保管されます。",
    sec4Title: "4. お客様の権利",
    sec4Desc: "ご登録情報の確認、修正、削除をご希望の場合は、コンプライアンス窓口 info@ewastechittagong.com までご連絡ください。"
  }
};

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

function updateFile(filename, additions) {
  const filePath = path.join(messagesDir, filename);
  const current = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const merged = deepMerge(current, additions);
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + "\n", "utf-8");
  console.log(`✅ Updated ${filename}`);
}

updateFile("en.json", enAdditions);
updateFile("bn.json", bnAdditions);
updateFile("zh-CN.json", zhAdditions);
updateFile("ja.json", jaAdditions);

console.log("All language dictionaries synchronized successfully!");
