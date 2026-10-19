"use client";

import * as React from "react";
import { useState } from "react";
import type { CountryStat } from "@/lib/analytics-service";

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

  // Filter countries according to filter toggle
  const visibleCountries = countryStats.filter((c) => {
    if (filter === "top") return c.visitors >= 500;
    if (filter === "active") return c.inquiries > 0;
    return true;
  });

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-950 via-[#030b17] to-slate-950 border border-slate-800/90 p-3 sm:p-5 overflow-hidden shadow-2xl">
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
          <linearGradient id="oceanGrid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
          </linearGradient>
        </defs>
      </svg>

      {/* Top Map Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 relative z-10 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-200">
            ট্রেড এপিসেন্টার: <strong className="text-emerald-400">চট্টগ্রাম কন্টেইনার বন্দর (HQ & Yard)</strong>
          </span>
        </div>

        {/* Route Filters */}
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
            শীর্ষ বায়ার রুট
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
            সক্রিয় RFQ রুট
          </button>
        </div>
      </div>

      {/* Interactive Map SVG Canvas (viewBox 0 0 1000 500) */}
      <div className="relative w-full aspect-[2/1] min-h-[340px] select-none">
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Cyber Graticule Grid */}
          <g stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.2">
            {/* Latitude parallels */}
            <line x1="0" y1="100" x2="1000" y2="100" />
            <line x1="0" y1="180" x2="1000" y2="180" />
            <line x1="0" y1="250" x2="1000" y2="250" strokeDasharray="none" strokeWidth="0.8" opacity="0.3" /> {/* Equator */}
            <line x1="0" y1="330" x2="1000" y2="330" />
            <line x1="0" y1="410" x2="1000" y2="410" />
            {/* Longitude meridians */}
            <line x1="160" y1="0" x2="160" y2="500" />
            <line x1="330" y1="0" x2="330" y2="500" />
            <line x1="500" y1="0" x2="500" y2="500" strokeDasharray="none" strokeWidth="0.8" opacity="0.3" /> {/* Prime Meridian */}
            <line x1="670" y1="0" x2="670" y2="500" />
            <line x1="840" y1="0" x2="840" y2="500" />
          </g>

          {/* HIGH-DEFINITION REALISTIC WORLD CONTINENTS */}
          <g fill="#1e293b" stroke="#334155" strokeWidth="0.6" strokeLinejoin="round" opacity="0.85">
            {/* 1. NORTH AMERICA (Alaska, Canada, Greenland, USA, Mexico, Central America) */}
            <path d="M 68 85 L 85 70 L 115 62 L 155 58 L 180 65 L 200 52 L 235 60 L 265 75 L 295 85 L 305 105 L 285 118 L 270 110 L 255 125 L 245 150 L 255 165 L 235 185 L 210 195 L 225 210 L 205 225 L 185 220 L 175 235 L 165 220 L 150 205 L 135 185 L 125 155 L 105 140 L 85 130 L 70 105 Z" />
            {/* Greenland */}
            <path d="M 330 40 L 375 35 L 395 55 L 385 85 L 350 95 L 335 75 Z" />
            {/* Florida Peninsula */}
            <path d="M 235 185 L 245 210 L 240 220 L 230 215 Z" />
            {/* Caribbean Islands */}
            <circle cx="260" cy="230" r="3" />
            <circle cx="275" cy="235" r="2.5" />

            {/* 2. SOUTH AMERICA */}
            <path d="M 245 240 L 275 235 L 315 245 L 345 270 L 350 300 L 335 340 L 315 390 L 295 440 L 285 450 L 275 440 L 280 400 L 270 360 L 255 315 L 240 270 L 240 250 Z" />

            {/* 3. EUROPE & SCANDINAVIA */}
            {/* Scandinavia & Baltic */}
            <path d="M 495 55 L 530 48 L 545 65 L 535 95 L 515 115 L 495 105 L 485 80 Z" />
            {/* British Isles (UK & Ireland) */}
            <path d="M 465 110 L 480 100 L 488 115 L 480 135 L 468 135 Z" />
            <path d="M 452 118 L 462 115 L 460 130 L 450 128 Z" />
            {/* Western & Central Europe */}
            <path d="M 480 125 L 510 120 L 535 125 L 555 145 L 540 165 L 515 160 L 505 175 L 490 170 L 475 160 L 465 140 Z" />
            {/* Iberian Peninsula (Spain & Portugal) */}
            <path d="M 455 165 L 480 160 L 485 185 L 460 195 L 450 180 Z" />
            {/* Italy */}
            <path d="M 510 165 L 525 185 L 535 200 L 525 202 L 515 180 Z" />

            {/* 4. AFRICA & MADAGASCAR */}
            <path d="M 465 200 L 510 190 L 565 205 L 590 230 L 610 260 L 595 300 L 575 350 L 555 390 L 525 410 L 505 380 L 490 320 L 465 285 L 445 250 L 445 220 L 465 200 Z" />
            {/* Madagascar */}
            <path d="M 610 345 L 625 355 L 615 395 L 600 385 Z" />

            {/* 5. ASIA (Russia, Middle East, India, China, Indochina) */}
            {/* Middle East & Arabian Peninsula */}
            <path d="M 570 200 L 615 205 L 635 225 L 640 255 L 615 270 L 585 255 L 575 220 Z" />
            {/* Indian Subcontinent */}
            <path d="M 645 210 L 675 215 L 705 235 L 695 275 L 680 300 L 665 270 L 650 235 Z" />
            {/* Sri Lanka */}
            <circle cx="690" cy="305" r="3.5" />
            {/* Central & Northern Asia (Siberia to East Asia) */}
            <path d="M 550 120 L 620 90 L 700 80 L 790 75 L 870 90 L 920 110 L 905 145 L 850 160 L 800 170 L 760 185 L 700 195 L 630 185 L 570 170 L 550 140 Z" />
            {/* China & East Coast */}
            <path d="M 720 185 L 775 180 L 820 195 L 825 230 L 800 255 L 765 255 L 730 230 Z" />
            {/* Korean Peninsula */}
            <path d="M 830 180 L 845 185 L 840 205 L 830 200 Z" />
            {/* Japanese Archipelago */}
            <path d="M 865 170 L 885 160 L 890 180 L 865 210 L 855 205 Z" />
            {/* Taiwan */}
            <circle cx="810" cy="245" r="3" />

            {/* 6. SOUTHEAST ASIA & MARITIME ARCHIPELAGO */}
            {/* Indochina (Vietnam, Thailand, Myanmar, Malaysia) */}
            <path d="M 725 230 L 760 235 L 775 260 L 760 290 L 745 285 L 735 255 Z" />
            {/* Indonesia & Malaysia (Sumatra, Java, Borneo, Celebes) */}
            <path d="M 730 305 L 765 325 L 750 335 L 720 315 Z" /> {/* Sumatra */}
            <path d="M 770 300 L 805 305 L 795 330 L 770 325 Z" /> {/* Borneo */}
            <path d="M 760 340 L 805 345 L 790 355 L 755 350 Z" /> {/* Java */}
            <path d="M 810 240 L 830 255 L 825 285 L 810 270 Z" /> {/* Philippines */}

            {/* 7. AUSTRALIA & OCEANIA */}
            <path d="M 815 330 L 855 320 L 890 335 L 905 375 L 885 420 L 835 425 L 805 385 L 800 350 Z" />
            {/* Tasmania */}
            <circle cx="875" cy="445" r="4" />
            {/* New Zealand */}
            <path d="M 940 405 L 955 420 L 945 450 L 935 435 Z" />
          </g>

          {/* DYNAMIC ANIMATED CARGO PATHS & FLOW COMETS */}
          {visibleCountries.map((c, index) => {
            if (c.code === "BD") return null;

            // Generate clean curved Bezier arc
            const midX = (c.x + chittagongPort.x) / 2;
            const midY = Math.min(c.y, chittagongPort.y) - 45 - (index % 3) * 6;
            const arcId = `cargo-arc-${c.code}`;
            const pathD = `M ${c.x} ${c.y} Q ${midX} ${midY} ${chittagongPort.x} ${chittagongPort.y}`;
            const isHovered = hoveredHub?.code === c.code || selectedHub?.code === c.code;
            const duration = `${(3.2 + (index % 4) * 0.4).toFixed(1)}s`;

            return (
              <g key={`route-${c.code}`}>
                {/* Reference Arc for animateMotion */}
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

                {/* Animated Glowing Comet 1 (Cargo stream moving towards Chittagong) */}
                <circle r="3" fill="#34d399" filter="url(#emeraldGlow)">
                  <animateMotion
                    dur={duration}
                    repeatCount="indefinite"
                    rotate="auto"
                  >
                    <mpath href={`#${arcId}`} />
                  </animateMotion>
                </circle>

                {/* Animated Trailing Particle 2 (Delayed phase for high density leads) */}
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

          {/* CHITTAGONG PORT (HQ) CENTRAL RADAR EPICENTER */}
          <g transform={`translate(${chittagongPort.x}, ${chittagongPort.y})`}>
            {/* Multiple expanding radar rings */}
            <circle r="26" fill="#10b981" opacity="0.1" className="animate-ping" />
            <circle r="16" fill="#10b981" opacity="0.25" />
            <circle r="9" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
            <circle r="4" fill="#ffffff" />

            {/* Epicenter Label Tag */}
            <g transform="translate(0, 18)">
              <rect
                x="-58"
                y="-3"
                width="116"
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
                চট্টগ্রাম বন্দর (HQ & Yard)
              </text>
            </g>
          </g>

          {/* INTERNATIONAL BUYER HUBS / NODES */}
          {visibleCountries.map((c) => {
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
                onClick={() => onSelectHub(c)}
              >
                {/* Generous touch/click hit area */}
                <circle r="20" fill="transparent" />

                {/* Outer Activity Beacon */}
                {c.activeNow && (
                  <circle
                    r={radius + 5}
                    fill={isHovered ? "#38bdf8" : "#0284c7"}
                    opacity={isHovered ? 0.6 : 0.3}
                    className="animate-pulse"
                  />
                )}

                {/* Solid Core Node */}
                <circle
                  r={radius}
                  fill={isHovered ? "#38bdf8" : "#0ea5e9"}
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  filter={isHovered ? "url(#cyanGlow)" : undefined}
                  className="transition-all duration-200"
                />

                {/* Badge Label */}
                <g transform={`translate(0, ${-radius - 7})`}>
                  <rect
                    x="-34"
                    y="-9"
                    width="68"
                    height="14"
                    rx="7"
                    fill={isHovered ? "#0f172a" : "#020617"}
                    stroke={isHovered ? "#38bdf8" : "#334155"}
                    strokeWidth="0.8"
                    opacity={isHovered ? 1 : 0.85}
                  />
                  <text
                    x="0"
                    y="1.5"
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
        </svg>

        {/* Hover Quick Insight Card (Shown when hovering over a node) */}
        {hoveredHub && !selectedHub && (
          <div className="absolute bottom-3 left-3 sm:left-4 max-w-xs bg-slate-900/95 backdrop-blur-md border border-emerald-500/50 rounded-2xl p-3 text-white shadow-2xl text-xs space-y-1.5 z-20 pointer-events-none animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">{hoveredHub.flag}</span>
                <div>
                  <h5 className="font-bold text-white text-xs">
                    {hoveredHub.nameBn} ({hoveredHub.name})
                  </h5>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    {hoveredHub.activeNow} জন বায়ার এখন সক্রিয়
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
            <p className="text-[9.5px] text-emerald-400 text-center font-semibold pt-0.5 border-t border-slate-800/80">
              👉 ক্লিক করে বায়ারদের আরএফকিউ ও সরাসরি যোগাযোগ দেখুন
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
