"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  MapPin,
  Building2,
  Ship,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Radio,
  FileCheck2,
  Users,
} from "lucide-react";
import type { CountryStat } from "@/lib/analytics-service";
import {
  COUNTRIES_GEO_DATA,
  type CountryGeoDetail,
  type CityDistrictPoint,
} from "@/lib/world-geo-data";

interface RealisticWorldMapProps {
  countryStats: CountryStat[];
  chittagongPort: { x: number; y: number; name: string };
  hoveredHub: CountryStat | null;
  selectedHub: CountryStat | null;
  onHoverHub: (c: CountryStat | null) => void;
  onSelectHub: (c: CountryStat | null) => void;
  activeFilter?: "all" | "top" | "active";
}

export function RealisticWorldMap({
  countryStats,
  chittagongPort,
  hoveredHub,
  selectedHub,
  onHoverHub,
  onSelectHub,
  activeFilter = "all",
}: RealisticWorldMapProps) {
  const [filter, setFilter] = useState<"all" | "top" | "active">(activeFilter);
  const [zoomedCountryCode, setZoomedCountryCode] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<CityDistrictPoint | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Sync with parent selectedHub if passed
  useEffect(() => {
    if (selectedHub?.code && COUNTRIES_GEO_DATA[selectedHub.code]) {
      setZoomedCountryCode(selectedHub.code);
    }
  }, [selectedHub]);

  // Current active zoom geo
  const activeGeo: CountryGeoDetail | null = zoomedCountryCode
    ? COUNTRIES_GEO_DATA[zoomedCountryCode] || null
    : null;

  // Filter countries according to filter toggle
  const visibleCountries = countryStats.filter((c) => {
    if (filter === "top") return c.visitors >= 500;
    if (filter === "active") return c.inquiries > 0;
    return true;
  });

  // Calculate current SVG viewBox
  const defaultViewBox = "0 0 1000 500";
  const currentViewBox = activeGeo
    ? `${activeGeo.zoomBounds.x} ${activeGeo.zoomBounds.y} ${activeGeo.zoomBounds.width} ${activeGeo.zoomBounds.height}`
    : defaultViewBox;

  // Search filtered list of countries
  const filteredCountryOptions = Object.values(COUNTRIES_GEO_DATA).filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.nameBn.includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.cities.some((c) => c.name.toLowerCase().includes(q) || c.nameBn.includes(q))
    );
  });

  const handleCountryZoom = (countryCode: string) => {
    setZoomedCountryCode(countryCode);
    setHoveredCity(null);
  };

  const handleResetZoom = () => {
    setZoomedCountryCode(null);
    setHoveredCity(null);
  };

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-slate-950 via-[#020b18] to-slate-950 border border-slate-800 p-3 sm:p-5 overflow-hidden shadow-2xl">
      {/* Glow filters definition */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#08101e" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.98" />
          </linearGradient>
          <linearGradient id="landGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="highlightGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#065f46" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.75" />
          </linearGradient>
        </defs>
      </svg>

      {/* Top Map Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 relative z-10 text-xs">
        {/* Left: Status & Breadcrumb */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeGeo ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetZoom}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-700/80 font-bold transition-all shadow-sm active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>গ্লোবাল ম্যাপে ফিরুন</span>
              </button>
              <div className="flex items-center gap-1.5 text-slate-300 font-bold bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <span className="text-base">{activeGeo.flag}</span>
                <span className="text-white">{activeGeo.nameBn}</span>
                <span className="text-slate-400 font-normal">({activeGeo.name})</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 ml-1">
                  {activeGeo.cities.length} টি বাণিজ্যিক জোন
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-slate-200">
                ট্রেড এপিসেন্টার: <strong className="text-emerald-400">চট্টগ্রাম কন্টেইনার বন্দর (HQ & Yard)</strong>
              </span>
            </div>
          )}
        </div>

        {/* Right: Country Search Selector & Route Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Country Quick Jump Dropdown */}
          <div className="relative">
            <select
              value={zoomedCountryCode || ""}
              onChange={(e) => {
                if (e.target.value) {
                  handleCountryZoom(e.target.value);
                } else {
                  handleResetZoom();
                }
              }}
              className="bg-slate-900/90 text-slate-200 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-7 cursor-pointer"
            >
              <option value="">🌐 বিশ্ব মানচিত্র (গ্লোবাল ভিউ)</option>
              {Object.values(COUNTRIES_GEO_DATA).map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.nameBn} ({country.cities.length} টি জোন)
                </option>
              ))}
            </select>
          </div>

          {/* Filter Pills (Global View only) */}
          {!activeGeo && (
            <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  filter === "all"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                সবগুলো রুট ({countryStats.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("top")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  filter === "top"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                শীর্ষ বায়ার
              </button>
              <button
                type="button"
                onClick={() => setFilter("active")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  filter === "active"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                সক্রিয় RFQ
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Map SVG Canvas with Smooth Dynamic ViewBox */}
      <div className="relative w-full aspect-[2/1] min-h-[350px] sm:min-h-[420px] select-none rounded-2xl overflow-hidden border border-slate-800/80 bg-[#020714]">
        <svg
          viewBox={currentViewBox}
          className="w-full h-full select-none transition-all duration-700 ease-in-out"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ocean Background Gradient */}
          <rect x="-200" y="-100" width="1400" height="700" fill="url(#oceanGrad)" />

          {/* Precision Lat/Long Graticule Grid */}
          <g stroke="#334155" strokeWidth={activeGeo ? "0.2" : "0.5"} strokeDasharray="3 3" opacity="0.25">
            <line x1="0" y1="100" x2="1000" y2="100" />
            <line x1="0" y1="180" x2="1000" y2="180" />
            <line x1="0" y1="250" x2="1000" y2="250" strokeDasharray="none" strokeWidth={activeGeo ? "0.3" : "0.8"} opacity="0.35" />
            <line x1="0" y1="330" x2="1000" y2="330" />
            <line x1="0" y1="410" x2="1000" y2="410" />
            <line x1="160" y1="0" x2="160" y2="500" />
            <line x1="330" y1="0" x2="330" y2="500" />
            <line x1="500" y1="0" x2="500" y2="500" strokeDasharray="none" strokeWidth={activeGeo ? "0.3" : "0.8"} opacity="0.35" />
            <line x1="670" y1="0" x2="670" y2="500" />
            <line x1="840" y1="0" x2="840" y2="500" />
          </g>

          {/* HIGH-PRECISION REALISTIC WORLD CONTINENTS */}
          <g fill="url(#landGrad)" stroke="#334155" strokeWidth={activeGeo ? "0.3" : "0.6"} strokeLinejoin="round" opacity="0.88">
            {/* 1. NORTH AMERICA (Alaska, Canada, USA, Florida, Mexico, Baja) */}
            <path d="M 68 85 C 75 75 88 68 115 62 C 140 58 165 52 195 56 C 220 60 250 68 280 80 C 300 88 310 102 295 116 C 280 125 260 120 250 140 C 242 155 255 170 248 186 C 242 200 245 215 235 220 C 225 224 212 210 205 225 C 195 232 182 225 175 238 C 168 226 156 215 146 195 C 132 175 120 155 102 138 C 85 122 72 105 68 85 Z" />
            {/* Greenland */}
            <path d="M 330 40 C 350 35 380 32 395 55 C 392 75 382 90 355 94 C 338 88 330 65 330 40 Z" />
            {/* Florida Peninsula */}
            <path d="M 235 185 C 240 195 245 208 242 220 C 236 220 230 205 232 190 Z" />
            {/* Caribbean Islands */}
            <circle cx="260" cy="230" r="2.5" />
            <circle cx="275" cy="235" r="2" />

            {/* 2. SOUTH AMERICA */}
            <path d="M 245 240 C 270 234 305 242 335 260 C 355 280 358 315 340 345 C 325 385 305 425 292 455 C 282 452 275 435 278 405 C 272 370 258 330 244 285 C 238 260 240 245 245 240 Z" />

            {/* 3. EUROPE & SCANDINAVIA */}
            {/* Scandinavia */}
            <path d="M 495 55 C 515 48 535 52 546 68 C 540 92 528 112 510 115 C 495 105 488 80 495 55 Z" />
            {/* British Isles (UK & Ireland) */}
            <path d="M 466 112 C 476 104 485 110 487 122 C 484 134 472 138 466 130 Z" />
            <path d="M 452 118 C 460 115 463 125 458 132 C 452 130 450 124 452 118 Z" />
            {/* Western & Central Europe */}
            <path d="M 478 126 C 505 120 535 122 555 142 C 548 162 525 160 508 174 C 492 170 478 158 468 142 Z" />
            {/* Iberian Peninsula (Spain/Portugal) */}
            <path d="M 455 165 C 475 160 486 175 480 192 C 462 196 450 185 455 165 Z" />
            {/* Italy */}
            <path d="M 512 166 C 522 178 534 195 528 204 C 522 202 516 182 512 166 Z" />

            {/* 4. AFRICA & MADAGASCAR */}
            <path d="M 465 200 C 500 192 550 200 580 220 C 605 245 615 275 600 315 C 585 355 565 395 532 414 C 510 395 492 340 472 295 C 450 260 445 225 465 200 Z" />
            {/* Madagascar */}
            <path d="M 610 348 C 622 355 620 385 612 396 C 602 388 602 365 610 348 Z" />

            {/* 5. MIDDLE EAST & ASIA */}
            {/* Arabian Peninsula */}
            <path d="M 570 202 C 605 205 632 222 638 248 C 625 268 595 265 578 245 C 568 225 565 210 570 202 Z" />
            {/* Indian Subcontinent */}
            <path d="M 645 210 C 675 212 702 230 698 268 C 688 295 675 305 664 285 C 650 255 642 228 645 210 Z" />
            {/* Sri Lanka */}
            <circle cx="690" cy="305" r="3" />
            {/* Central & Northern Asia (Siberia to East Coast) */}
            <path d="M 550 120 C 620 88 710 75 800 78 C 880 92 925 115 905 145 C 860 160 805 172 755 186 C 690 196 615 182 550 120 Z" />
            {/* China & East Coast */}
            <path d="M 720 185 C 765 180 815 192 824 225 C 810 252 770 258 732 232 Z" />
            {/* Korean Peninsula */}
            <path d="M 830 180 C 844 184 842 202 832 205 C 826 195 826 186 830 180 Z" />
            {/* Japanese Archipelago */}
            <path d="M 865 168 C 885 158 892 175 870 208 C 856 205 855 185 865 168 Z" />
            {/* Taiwan */}
            <circle cx="810" cy="245" r="2.5" />

            {/* 6. SOUTHEAST ASIA & MARITIME */}
            {/* Indochina (Vietnam, Thailand, Malaysia) */}
            <path d="M 725 230 C 755 232 774 255 765 285 C 748 285 735 260 725 230 Z" />
            {/* Maritime Southeast Asia */}
            <path d="M 730 305 C 755 320 748 335 722 318 Z" /> {/* Sumatra */}
            <path d="M 770 300 C 802 304 795 328 772 324 Z" /> {/* Borneo */}
            <path d="M 760 340 C 800 345 788 355 756 350 Z" /> {/* Java */}
            <path d="M 812 242 C 830 255 825 282 812 268 Z" /> {/* Philippines */}

            {/* 7. AUSTRALIA & OCEANIA */}
            <path d="M 815 330 C 850 318 890 332 905 370 C 892 415 842 425 808 385 C 798 355 802 338 815 330 Z" />
            {/* Tasmania */}
            <circle cx="875" cy="445" r="3.5" />
            {/* New Zealand */}
            <path d="M 940 405 C 955 418 948 448 935 435 Z" />
          </g>

          {/* HIGHLIGHTED ACTIVE ZOOM COUNTRY REGIONAL OVERLAY */}
          {activeGeo && (
            <g>
              {/* Regional Ambient Backdrop Glow */}
              <rect
                x={activeGeo.zoomBounds.x}
                y={activeGeo.zoomBounds.y}
                width={activeGeo.zoomBounds.width}
                height={activeGeo.zoomBounds.height}
                fill="none"
                stroke="#10b981"
                strokeWidth={activeGeo.zoomBounds.width * 0.008}
                strokeDasharray={`${activeGeo.zoomBounds.width * 0.03} ${activeGeo.zoomBounds.width * 0.02}`}
                opacity="0.3"
              />

              {/* Centroid Radar Pulse in Zoom Mode */}
              <circle
                cx={activeGeo.centroid.x}
                cy={activeGeo.centroid.y}
                r={activeGeo.zoomBounds.width * 0.3}
                fill="#10b981"
                opacity="0.04"
              />
              <circle
                cx={activeGeo.centroid.x}
                cy={activeGeo.centroid.y}
                r={activeGeo.zoomBounds.width * 0.15}
                fill="#10b981"
                opacity="0.08"
              />
            </g>
          )}

          {/* DYNAMIC ANIMATED CARGO PATHS & FLOW COMETS (Global View) */}
          {!activeGeo &&
            visibleCountries.map((c, index) => {
              if (c.code === "BD") return null;

              // Generate curved Bezier arc
              const midX = (c.x + chittagongPort.x) / 2;
              const midY = Math.min(c.y, chittagongPort.y) - 45 - (index % 3) * 6;
              const arcId = `cargo-arc-${c.code}`;
              const pathD = `M ${c.x} ${c.y} Q ${midX} ${midY} ${chittagongPort.x} ${chittagongPort.y}`;
              const isHovered = hoveredHub?.code === c.code || selectedHub?.code === c.code;
              const duration = `${(3.2 + (index % 4) * 0.4).toFixed(1)}s`;

              return (
                <g key={`route-${c.code}`}>
                  <path
                    id={arcId}
                    d={pathD}
                    fill="none"
                    stroke={isHovered ? "#10b981" : "#059669"}
                    strokeWidth={isHovered ? 2.5 : 1.2}
                    strokeDasharray={isHovered ? "6 3" : "4 5"}
                    strokeOpacity={isHovered ? 0.95 : 0.4}
                    className="transition-all duration-300"
                  />

                  {/* Flowing Cargo Comet */}
                  <circle r="3" fill="#34d399" filter="url(#emeraldGlow)">
                    <animateMotion dur={duration} repeatCount="indefinite" rotate="auto">
                      <mpath href={`#${arcId}`} />
                    </animateMotion>
                  </circle>

                  {/* Secondary Density Particle */}
                  {c.inquiries > 2 && (
                    <circle r="2" fill="#38bdf8" filter="url(#cyanGlow)" opacity="0.8">
                      <animateMotion
                        dur={duration}
                        begin={`${(1.5 + (index % 2) * 0.3).toFixed(1)}s`}
                        repeatCount="indefinite"
                        rotate="auto"
                      >
                        <mpath href={`#${arcId}`} />
                      </animateMotion>
                    </circle>
                  )}
                </g>
              );
            })}

          {/* CHITTAGONG PORT (HQ) CENTRAL RADAR EPICENTER (Global View) */}
          {!activeGeo && (
            <g
              transform={`translate(${chittagongPort.x}, ${chittagongPort.y})`}
              className="cursor-pointer"
              onClick={() => handleCountryZoom("BD")}
            >
              <circle r="26" fill="#10b981" opacity="0.1" className="animate-ping" />
              <circle r="16" fill="#10b981" opacity="0.25" />
              <circle r="9" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
              <circle r="4" fill="#ffffff" />

              {/* HQ Label Tag */}
              <g transform="translate(0, 18)">
                <rect
                  x="-62"
                  y="-3"
                  width="124"
                  height="16"
                  rx="8"
                  fill="#022c22"
                  stroke="#10b981"
                  strokeWidth="1"
                  opacity="0.95"
                />
                <text
                  x="0"
                  y="9"
                  textAnchor="middle"
                  fill="#34d399"
                  fontSize="8.5"
                  fontWeight="bold"
                  className="select-none tracking-wide"
                >
                  🇧🇩 চট্টগ্রাম বন্দর (HQ & Yard)
                </text>
              </g>
            </g>
          )}

          {/* GLOBAL VIEW: INTERNATIONAL BUYER COUNTRY HUBS */}
          {!activeGeo &&
            visibleCountries.map((c) => {
              if (c.code === "BD") return null;
              const isHovered = hoveredHub?.code === c.code || selectedHub?.code === c.code;
              const radius = Math.max(5, Math.min(10, Math.sqrt(c.visitors) / 3));

              return (
                <g
                  key={`hub-node-${c.code}`}
                  transform={`translate(${c.x}, ${c.y})`}
                  className="cursor-pointer group"
                  onMouseEnter={() => onHoverHub(c)}
                  onMouseLeave={() => onHoverHub(null)}
                  onClick={() => handleCountryZoom(c.code)}
                >
                  <circle r="20" fill="transparent" />

                  {/* Activity Pulse */}
                  {c.activeNow && (
                    <circle
                      r={radius + 5}
                      fill={isHovered ? "#38bdf8" : "#0284c7"}
                      opacity={isHovered ? 0.6 : 0.3}
                      className="animate-pulse"
                    />
                  )}

                  {/* Core Node */}
                  <circle
                    r={radius}
                    fill={isHovered ? "#38bdf8" : "#0ea5e9"}
                    stroke="#ffffff"
                    strokeWidth="1.8"
                    filter={isHovered ? "url(#cyanGlow)" : undefined}
                    className="transition-all duration-200"
                  />

                  {/* Country Name Badge */}
                  <g transform={`translate(0, ${-radius - 7})`}>
                    <rect
                      x="-38"
                      y="-9"
                      width="76"
                      height="15"
                      rx="7.5"
                      fill={isHovered ? "#0f172a" : "#020617"}
                      stroke={isHovered ? "#38bdf8" : "#334155"}
                      strokeWidth="0.8"
                      opacity={isHovered ? 1 : 0.88}
                    />
                    <text
                      x="0"
                      y="2"
                      textAnchor="middle"
                      fill={isHovered ? "#ffffff" : "#cbd5e1"}
                      fontSize="8.5"
                      fontWeight={isHovered ? "bold" : "600"}
                      className="select-none"
                    >
                      {c.flag} {c.nameBn}
                    </text>
                  </g>
                </g>
              );
            })}

          {/* ZOOMED COUNTRY VIEW: DISTRICT & CITY PINPOINTS */}
          {activeGeo && (
            <g>
              {/* Trade Line connecting country cities to Chittagong Port (HQ) if within bounds */}
              {activeGeo.code === "BD" && (
                <g stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6">
                  {/* Internal transit lines between Chittagong HQ and Dhaka/Narayanganj/Khulna */}
                  <line x1="724" y1="248" x2="712" y2="236" />
                  <line x1="724" y1="248" x2="716" y2="240" />
                  <line x1="724" y1="248" x2="698" y2="252" />
                </g>
              )}

              {/* Render City and District Nodes */}
              {activeGeo.cities.map((city, index) => {
                const isHq = city.isHq;
                const isHovered = hoveredCity?.id === city.id;
                // Responsive SVG scaling based on zoom width
                const scaleFactor = activeGeo.zoomBounds.width / 1000;
                const nodeRadius = Math.max(0.8, scaleFactor * 20);
                const badgeWidth = Math.max(12, scaleFactor * 150);
                const badgeHeight = Math.max(2.8, scaleFactor * 32);
                const fontSize = Math.max(1.1, scaleFactor * 14);
                // Stagger label position above/below pin to avoid overlap
                const isAbove = index % 2 === 0;
                const yOffset = isAbove
                  ? -nodeRadius - badgeHeight * 0.65
                  : nodeRadius + badgeHeight * 0.75;

                return (
                  <g
                    key={city.id}
                    transform={`translate(${city.x}, ${city.y})`}
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredCity(city)}
                    onMouseLeave={() => setHoveredCity(null)}
                    onClick={() => {
                      const parentStat = countryStats.find((s) => s.code === activeGeo.code) || null;
                      if (parentStat) {
                        onSelectHub(parentStat);
                      }
                    }}
                  >
                    {/* Generous touch target */}
                    <circle r={nodeRadius * 2.5} fill="transparent" />

                    {/* Outer Radar Rings */}
                    <circle
                      r={nodeRadius * 2}
                      fill={isHq ? "#10b981" : "#38bdf8"}
                      opacity={isHovered ? 0.45 : 0.2}
                      className="animate-pulse"
                    />

                    {/* Core Pin */}
                    <circle
                      r={nodeRadius}
                      fill={isHq ? "#10b981" : isHovered ? "#38bdf8" : "#0284c7"}
                      stroke="#ffffff"
                      strokeWidth={Math.max(0.2, scaleFactor * 2)}
                      filter={isHq ? "url(#emeraldGlow)" : "url(#cyanGlow)"}
                    />

                    {/* Small inner dot */}
                    <circle r={nodeRadius * 0.35} fill="#ffffff" />

                    {/* City Name & Role Badge */}
                    <g transform={`translate(0, ${yOffset})`}>
                      <rect
                        x={-badgeWidth / 2}
                        y={-badgeHeight / 2}
                        width={badgeWidth}
                        height={badgeHeight}
                        rx={badgeHeight / 2}
                        fill={isHq ? "#022c22" : isHovered ? "#0f172a" : "#030712"}
                        stroke={isHq ? "#10b981" : isHovered ? "#38bdf8" : "#334155"}
                        strokeWidth={Math.max(0.2, scaleFactor * 1.5)}
                        opacity="0.95"
                      />
                      <text
                        x="0"
                        y={badgeHeight * 0.18}
                        textAnchor="middle"
                        fill={isHq ? "#34d399" : isHovered ? "#ffffff" : "#e2e8f0"}
                        fontSize={fontSize}
                        fontWeight="bold"
                        className="select-none"
                      >
                        {isHq ? "★ " : "📍 "}
                        {city.nameBn.split("(")[0].trim()}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          )}
        </svg>

        {/* Global View: Hover Quick Insight Card */}
        {!activeGeo && hoveredHub && !selectedHub && (
          <div className="absolute bottom-3 left-3 sm:left-4 max-w-xs bg-slate-900/95 backdrop-blur-md border border-emerald-500/50 rounded-2xl p-3 text-white shadow-2xl text-xs space-y-1.5 z-20 pointer-events-none animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">{hoveredHub.flag}</span>
                <div>
                  <h5 className="font-bold text-white text-xs">
                    {hoveredHub.nameBn} ({hoveredHub.name})
                  </h5>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    {hoveredHub.activeNow} জন বায়ার সক্রিয়
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-900/80 text-purple-200 border border-purple-700">
                {hoveredHub.inquiries} টি RFQ
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center bg-slate-950/70 rounded-xl p-1.5 border border-slate-800/80 text-[11px]">
              <div>
                <span className="text-[10px] text-slate-400 block">ভিজিটর</span>
                <strong className="text-emerald-400 font-bold">
                  {hoveredHub.visitors.toLocaleString()}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">রূপান্তর হার</span>
                <strong className="text-white font-bold">{hoveredHub.conversionRate}%</strong>
              </div>
            </div>

            <p className="text-[10px] text-slate-300">
              <span className="text-slate-400">চাহিদা: </span>
              <strong className="text-emerald-300">{hoveredHub.primaryInterestBn}</strong>
            </p>
            <p className="text-[9.5px] text-emerald-400 text-center font-bold pt-0.5 border-t border-slate-800/80">
              👉 ক্লিক করে এই দেশের জেলা ও পোর্ট হাব জুম করুন
            </p>
          </div>
        )}

        {/* Zoomed View: Active City Detail / Country Control Overlay */}
        {activeGeo && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md bg-slate-900/95 backdrop-blur-md border border-emerald-500/60 rounded-2xl p-3 sm:p-4 text-white shadow-2xl z-20 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-1 bg-slate-800 rounded-xl">{activeGeo.flag}</span>
                <div>
                  <h4 className="font-black text-sm text-white">
                    {hoveredCity ? hoveredCity.nameBn : activeGeo.nameBn}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {hoveredCity ? hoveredCity.roleBn : activeGeo.overviewBn}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetZoom}
                className="text-[10px] px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
              >
                রিসেট
              </button>
            </div>

            {/* City or District Metrics */}
            {hoveredCity ? (
              <div className="space-y-1.5 text-xs">
                <div className="grid grid-cols-2 gap-2 bg-slate-950/70 p-2 rounded-xl border border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block">সরাসরি ট্রাফিক</span>
                    <strong className="text-emerald-400 font-bold">
                      {hoveredCity.visitors.toLocaleString()} ভিজিটর
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">আরএফকিউ লিড</span>
                    <strong className="text-purple-400 font-bold">
                      {hoveredCity.inquiries} টি কোটেশন
                    </strong>
                  </div>
                </div>
                <div className="text-[11px] bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-2 text-emerald-200">
                  <span className="text-emerald-400 font-bold block mb-0.5">চাহিদাকৃত উপাদান:</span>
                  <span>{hoveredCity.primaryMaterialBn}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {activeGeo.cities.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setHoveredCity(c)}
                      className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-600 hover:text-white text-slate-300 text-[10px] font-semibold transition border border-slate-700/60"
                    >
                      {c.isHq && "★ "}
                      {c.nameBn.split("(")[0].trim()}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const stat = countryStats.find((s) => s.code === activeGeo.code) || null;
                    if (stat) onSelectHub(stat);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/40 transition active:scale-98"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>এই দেশের আরএফকিউ ও সরাসরি যোগাযোগ ড্রয়ার খুলুন</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Quick Geo Strip */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
        {Object.values(COUNTRIES_GEO_DATA).slice(0, 6).map((item) => {
          const isSelected = activeGeo?.code === item.code;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => handleCountryZoom(item.code)}
              className={`p-2 rounded-xl text-left transition-all border flex items-center justify-between ${
                isSelected
                  ? "bg-emerald-950/80 border-emerald-500 text-emerald-200"
                  : "bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300"
              }`}
            >
              <div className="truncate pr-1">
                <span className="font-bold flex items-center gap-1">
                  <span>{item.flag}</span>
                  <span className="truncate">{item.nameBn}</span>
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {item.cities.length} টি বাণিজ্যিক জোন
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
