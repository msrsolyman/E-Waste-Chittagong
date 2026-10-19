"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronRight,
  FileCheck2,
  MapPin,
  Building2,
  Sparkles,
} from "lucide-react";
import type { CountryStat } from "@/lib/analytics-service";
import {
  GIS_WORLD_COUNTRIES,
  GIS_BUYER_COUNTRIES,
  CHITTAGONG_EPICENTER,
  type GisCountryDetail,
  type GisCityPoint,
  type WorldCountryFeature,
} from "@/lib/world-gis-data";

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
  const [hoveredCity, setHoveredCity] = useState<GisCityPoint | null>(null);
  const [hoveredCountryFeature, setHoveredCountryFeature] = useState<WorldCountryFeature | null>(null);

  // Sync with parent selectedHub if passed
  useEffect(() => {
    if (selectedHub?.code && GIS_BUYER_COUNTRIES[selectedHub.code]) {
      setZoomedCountryCode(selectedHub.code);
    }
  }, [selectedHub]);

  // Current active zoom geo
  const activeGeo: GisCountryDetail | null = zoomedCountryCode
    ? GIS_BUYER_COUNTRIES[zoomedCountryCode] || null
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

  const handleCountryZoom = (countryCode: string) => {
    setZoomedCountryCode(countryCode);
    setHoveredCity(null);
  };

  const handleResetZoom = () => {
    setZoomedCountryCode(null);
    setHoveredCity(null);
    setHoveredCountryFeature(null);
  };

  // Center coordinate of Chittagong Epicenter
  const ctgCenter = CHITTAGONG_EPICENTER;

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#020617] via-[#050e21] to-[#020617] border border-slate-800 p-3 sm:p-5 overflow-hidden shadow-2xl">
      {/* SVG Filters & Gradients Definition */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          <filter id="emeraldGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#050e1f" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="buyerCountryGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#064e3b" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#022c22" stopOpacity="0.9" />
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-700 font-bold transition-all shadow-sm active:scale-95"
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
              {Object.values(GIS_BUYER_COUNTRIES).map((country) => (
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
      <div className="relative w-full aspect-[2/1] min-h-[350px] sm:min-h-[440px] select-none rounded-2xl overflow-hidden border border-slate-800/80 bg-[#020617]">
        <svg
          viewBox={currentViewBox}
          className="w-full h-full select-none transition-all duration-700 ease-in-out"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ocean Background Canvas */}
          <rect x="-300" y="-150" width="1600" height="800" fill="url(#oceanGrad)" />

          {/* Precision Lat/Long Graticule Grid */}
          <g stroke="#1e293b" strokeWidth={activeGeo ? "0.2" : "0.5"} strokeDasharray="3 3" opacity="0.3">
            <line x1="0" y1="100" x2="1000" y2="100" />
            <line x1="0" y1="180" x2="1000" y2="180" />
            <line x1="0" y1="250" x2="1000" y2="250" strokeDasharray="none" strokeWidth={activeGeo ? "0.3" : "0.7"} opacity="0.4" />
            <line x1="0" y1="330" x2="1000" y2="330" />
            <line x1="0" y1="410" x2="1000" y2="410" />
            <line x1="160" y1="0" x2="160" y2="500" />
            <line x1="330" y1="0" x2="330" y2="500" />
            <line x1="500" y1="0" x2="500" y2="500" strokeDasharray="none" strokeWidth={activeGeo ? "0.3" : "0.7"} opacity="0.4" />
            <line x1="670" y1="0" x2="670" y2="500" />
            <line x1="840" y1="0" x2="840" y2="500" />
          </g>

          {/* 100% AUTHENTIC GIS NATURAL EARTH SOVEREIGN COUNTRY POLYGONS (All 177 Countries) */}
          <g strokeLinejoin="round" strokeLinecap="round">
            {GIS_WORLD_COUNTRIES.map((feat) => {
              const alpha2 = feat.alpha2;
              const isBuyerCountry = Boolean(alpha2 && GIS_BUYER_COUNTRIES[alpha2]);
              const isCurrentZoomed = activeGeo?.code === alpha2;
              const isHovered = hoveredCountryFeature?.numId === feat.numId;

              // Stroke width adjusts to zoom scale
              const baseStrokeWidth = activeGeo ? 0.35 : 0.55;

              // Colors based on country status
              let fill = "#151e2e";
              let stroke = "#243247";
              let opacity = 0.88;

              if (isBuyerCountry) {
                fill = isCurrentZoomed ? "#064e3b" : "url(#buyerCountryGrad)";
                stroke = isCurrentZoomed ? "#34d399" : isHovered ? "#38bdf8" : "#10b981";
                opacity = isCurrentZoomed ? 0.98 : 0.92;
              } else if (isHovered) {
                fill = "#1e293b";
                stroke = "#475569";
              }

              return (
                <path
                  key={`country-${feat.numId}`}
                  d={feat.d}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isCurrentZoomed ? baseStrokeWidth * 1.5 : isHovered ? baseStrokeWidth * 1.3 : baseStrokeWidth}
                  opacity={opacity}
                  filter={isCurrentZoomed ? "url(#emeraldGlow)" : undefined}
                  className="transition-colors duration-200 cursor-pointer"
                  onMouseEnter={() => {
                    setHoveredCountryFeature(feat);
                    if (alpha2) {
                      const stat = countryStats.find((s) => s.code === alpha2) || null;
                      onHoverHub(stat);
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredCountryFeature(null);
                    onHoverHub(null);
                  }}
                  onClick={() => {
                    if (alpha2 && GIS_BUYER_COUNTRIES[alpha2]) {
                      handleCountryZoom(alpha2);
                    }
                  }}
                />
              );
            })}
          </g>

          {/* DYNAMIC ANIMATED CARGO PATHS & FLOW COMETS (Global View) */}
          {!activeGeo &&
            visibleCountries.map((c, index) => {
              if (c.code === "BD") return null;
              const buyerGeo = GIS_BUYER_COUNTRIES[c.code];
              if (!buyerGeo) return null;

              const startX = buyerGeo.centroid.x;
              const startY = buyerGeo.centroid.y;
              const endX = ctgCenter.x;
              const endY = ctgCenter.y;

              // Generate graceful curved Bezier arc
              const midX = (startX + endX) / 2;
              const midY = Math.min(startY, endY) - 35 - (index % 3) * 5;
              const arcId = `cargo-arc-gis-${c.code}`;
              const pathD = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
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
                    strokeOpacity={isHovered ? 0.95 : 0.45}
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
              transform={`translate(${ctgCenter.x}, ${ctgCenter.y})`}
              className="cursor-pointer"
              onClick={() => handleCountryZoom("BD")}
            >
              <circle r="24" fill="#10b981" opacity="0.1" className="animate-ping" />
              <circle r="15" fill="#10b981" opacity="0.25" />
              <circle r="8" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
              <circle r="3.5" fill="#ffffff" />

              {/* HQ Label Tag */}
              <g transform="translate(0, 16)">
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
              const buyerGeo = GIS_BUYER_COUNTRIES[c.code];
              if (!buyerGeo) return null;

              const isHovered = hoveredHub?.code === c.code || selectedHub?.code === c.code;
              const radius = Math.max(5, Math.min(10, Math.sqrt(c.visitors) / 3));
              const cx = buyerGeo.centroid.x;
              const cy = buyerGeo.centroid.y;

              return (
                <g
                  key={`hub-node-${c.code}`}
                  transform={`translate(${cx}, ${cy})`}
                  className="cursor-pointer group"
                  onMouseEnter={() => onHoverHub(c)}
                  onMouseLeave={() => onHoverHub(null)}
                  onClick={() => handleCountryZoom(c.code)}
                >
                  <circle r="18" fill="transparent" />

                  {/* Activity Pulse */}
                  {c.activeNow && (
                    <circle
                      r={radius + 4}
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
                      opacity={isHovered ? 1 : 0.9}
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

          {/* ZOOMED COUNTRY VIEW: MATHEMATICALLY EXACT DISTRICT & CITY PINPOINTS */}
          {activeGeo && (
            <g>
              {/* Internal Transit Arcs for Bangladesh (HQ to Regional Zones) */}
              {activeGeo.code === "BD" && (
                <g stroke="#10b981" strokeWidth="0.6" strokeDasharray="1.5 1.5" opacity="0.7">
                  <line x1={ctgCenter.x} y1={ctgCenter.y} x2={728.9} y2={173.3} />
                  <line x1={ctgCenter.x} y1={ctgCenter.y} x2={729.2} y2={173.9} />
                  <line x1={ctgCenter.x} y1={ctgCenter.y} x2={726.0} y2={176.7} />
                </g>
              )}

              {/* Render Precise City and District Nodes */}
              {activeGeo.cities.map((city, index) => {
                const isHq = city.isHq;
                const isHovered = hoveredCity?.id === city.id;

                // Scaling relative to country zoom bounding box width
                const scaleFactor = activeGeo.zoomBounds.width / 1000;
                const nodeRadius = Math.max(0.9, scaleFactor * 22);
                const badgeWidth = Math.max(13, scaleFactor * 160);
                const badgeHeight = Math.max(2.8, scaleFactor * 32);
                const fontSize = Math.max(1.15, scaleFactor * 15);

                // Alternating vertical offset to prevent any label overlap
                const isAbove = index % 2 === 0;
                const yOffset = isAbove
                  ? -nodeRadius - badgeHeight * 0.7
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
                    <circle r={nodeRadius * 2.8} fill="transparent" />

                    {/* Outer Pulsing Beacon */}
                    <circle
                      r={nodeRadius * 2.2}
                      fill={isHq ? "#10b981" : "#38bdf8"}
                      opacity={isHovered ? 0.5 : 0.2}
                      className="animate-pulse"
                    />

                    {/* Central Solid Pin */}
                    <circle
                      r={nodeRadius}
                      fill={isHq ? "#10b981" : isHovered ? "#38bdf8" : "#0284c7"}
                      stroke="#ffffff"
                      strokeWidth={Math.max(0.2, scaleFactor * 2.2)}
                      filter={isHq ? "url(#emeraldGlow)" : "url(#cyanGlow)"}
                    />

                    {/* Core White Dot */}
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
                        y={badgeHeight * 0.2}
                        textAnchor="middle"
                        fill={isHq ? "#34d399" : isHovered ? "#ffffff" : "#e2e8f0"}
                        fontSize={fontSize}
                        fontWeight="bold"
                        className="select-none tracking-tight"
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
        {Object.values(GIS_BUYER_COUNTRIES).slice(0, 6).map((item) => {
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
