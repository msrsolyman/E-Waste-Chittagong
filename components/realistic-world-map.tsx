"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Globe2,
  Anchor,
  MapPin,
  Building2,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Sparkles,
  Layers,
  Search,
  RotateCcw,
  Navigation,
} from "lucide-react";
import type { CountryStat } from "@/lib/analytics-service";
import {
  GIS_BUYER_COUNTRIES,
  CHITTAGONG_EPICENTER,
  type GisCountryDetail,
  type GisCityPoint,
} from "@/lib/world-gis-data";

// Dynamically import Leaflet with ssr: false to prevent Next.js server-side errors
const LeafletWorldMapInner = dynamic(
  () => import("./leaflet-world-map-inner"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[420px] rounded-2xl bg-slate-950 flex flex-col items-center justify-center gap-3 border border-slate-800 text-slate-400">
        <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <span className="text-xs font-semibold tracking-wide">
          রিয়েল স্যাটেলাইট ও জিআইএস টাইলস লোড হচ্ছে...
        </span>
      </div>
    ),
  }
);

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
  selectedHub,
  onSelectHub,
  activeFilter = "all",
}: RealisticWorldMapProps) {
  const [filter, setFilter] = useState<"all" | "top" | "active">(activeFilter);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("BD");
  const [selectedCityId, setSelectedCityId] = useState<string | null>("bd-ctg");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [flyToTarget, setFlyToTarget] = useState<{
    lat: number;
    lon: number;
    zoom: number;
  } | null>({
    lat: CHITTAGONG_EPICENTER.lat,
    lon: CHITTAGONG_EPICENTER.lon,
    zoom: 6,
  });

  // Sync with parent selectedHub if provided
  useEffect(() => {
    if (selectedHub?.code && GIS_BUYER_COUNTRIES[selectedHub.code]) {
      setSelectedCountryCode(selectedHub.code);
      const country = GIS_BUYER_COUNTRIES[selectedHub.code];
      if (country) {
        setFlyToTarget({
          lat: country.lat,
          lon: country.lon,
          zoom: country.defaultZoom,
        });
      }
    }
  }, [selectedHub]);

  const activeCountry: GisCountryDetail | null =
    selectedCountryCode && GIS_BUYER_COUNTRIES[selectedCountryCode]
      ? GIS_BUYER_COUNTRIES[selectedCountryCode]
      : null;

  const activeStat = countryStats.find(
    (c) => c.code.toUpperCase() === selectedCountryCode.toUpperCase()
  );

  // Filter buyer countries
  const buyerCountriesList = Object.values(GIS_BUYER_COUNTRIES).filter(
    (country) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        country.name.toLowerCase().includes(q) ||
        country.nameBn.includes(q) ||
        country.cities.some((c) => c.name.toLowerCase().includes(q) || c.nameBn.includes(q))
      );
    }
  );

  const handleCountryClick = (country: GisCountryDetail) => {
    setSelectedCountryCode(country.code);
    setSelectedCityId(null);
    setFlyToTarget({
      lat: country.lat,
      lon: country.lon,
      zoom: country.defaultZoom,
    });
    if (onSelectHub) {
      const match = countryStats.find(
        (c) => c.code.toUpperCase() === country.code.toUpperCase()
      );
      if (match) onSelectHub(match);
    }
  };

  const handleCityClick = (city: GisCityPoint) => {
    setSelectedCityId(city.id);
    setFlyToTarget({
      lat: city.lat,
      lon: city.lon,
      zoom: 9,
    });
  };

  const handleResetToWorld = () => {
    setSelectedCountryCode("BD");
    setSelectedCityId(null);
    setFlyToTarget({
      lat: 23,
      lon: 65,
      zoom: 3,
    });
  };

  const handleFlyToChittagong = () => {
    setSelectedCountryCode("BD");
    setSelectedCityId("bd-ctg");
    setFlyToTarget({
      lat: CHITTAGONG_EPICENTER.lat,
      lon: CHITTAGONG_EPICENTER.lon,
      zoom: 7,
    });
  };

  return (
    <div className="w-full rounded-3xl bg-slate-950 border border-slate-800/80 p-3.5 sm:p-5 shadow-2xl overflow-hidden">
      {/* Top Header & Fast Country Navigation Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-800/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                আন্তর্জাতিক ইন্টারেক্টিভ ট্রেড ম্যাপ (GIS Leaflet Engine)
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold text-emerald-400 animate-pulse">
                লাইভ জুম ও প্যান
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              মাউস হুইল বা টাচ দিয়ে জুম করুন। যেকোনো দেশ বা শহরে ক্লিক করলে ক্যামেরা সরাসরি সেখানে ফ্লাই করবে।
            </p>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2 self-start lg:self-center">
          <button
            type="button"
            onClick={handleFlyToChittagong}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all"
          >
            <Anchor className="w-3.5 h-3.5 text-amber-400" />
            <span>চট্টগ্রাম বন্দর (HQ)</span>
          </button>
          <button
            type="button"
            onClick={handleResetToWorld}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>বিশ্ব মানচিত্র</span>
          </button>
        </div>
      </div>

      {/* Horizontal Country Quick Pills Carousel */}
      <div className="py-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-800/40">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Navigation className="w-3 h-3 text-emerald-400" />
          রপ্তানি হাব:
        </span>
        {Object.values(GIS_BUYER_COUNTRIES).map((country) => {
          const isActive = selectedCountryCode === country.code;
          return (
            <button
              key={country.code}
              type="button"
              onClick={() => handleCountryClick(country)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 border border-emerald-400/50 scale-105"
                  : "bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
              }`}
            >
              <span>{country.flag}</span>
              <span>{country.nameBn}</span>
            </button>
          );
        })}
      </div>

      {/* Main Split-Screen Architecture: 100% Unobstructed Map on Left, Dedicated Intel Panel on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mt-4">
        {/* Left Column: Leaflet Interactive Slippy Map (Full View, No overlapping overlay card!) */}
        <div className="xl:col-span-7 2xl:col-span-8 relative rounded-2xl overflow-hidden border border-slate-800 bg-[#020617] shadow-inner h-[380px] sm:h-[480px] lg:h-[580px]">
          {/* Top Left Mode Pills over Map */}
          <div className="absolute top-3 left-3 z-[400] flex items-center gap-1 bg-slate-950/80 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-xl">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                filter === "all"
                  ? "bg-emerald-500 text-slate-950 font-black shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              সব দেশ ({countryStats.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("top")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                filter === "top"
                  ? "bg-emerald-500 text-slate-950 font-black shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              টপ বায়ার
            </button>
            <button
              type="button"
              onClick={() => setFilter("active")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                filter === "active"
                  ? "bg-emerald-500 text-slate-950 font-black shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              সক্রিয় আরএফকিউ
            </button>
          </div>

          {/* Leaflet Map Component */}
          <LeafletWorldMapInner
            selectedCountryCode={selectedCountryCode}
            onSelectCountryCode={(code) => {
              if (code) {
                setSelectedCountryCode(code);
                const c = GIS_BUYER_COUNTRIES[code];
                if (c && onSelectHub) {
                  const match = countryStats.find(
                    (s) => s.code.toUpperCase() === code.toUpperCase()
                  );
                  if (match) onSelectHub(match);
                }
              }
            }}
            selectedCityId={selectedCityId}
            onSelectCityId={setSelectedCityId}
            flyToTarget={flyToTarget}
            activeFilter={filter}
          />
        </div>

        {/* Right Column: Dedicated Country & City Intelligence Panel */}
        <div className="xl:col-span-5 2xl:col-span-4 flex flex-col gap-3.5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-4 h-[500px] sm:h-[520px] lg:h-[580px] overflow-y-auto">
          {activeCountry ? (
            <>
              {/* Selected Country Banner */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800/80 border border-slate-700/60 shadow-lg">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl sm:text-4xl filter drop-shadow">
                      {activeCountry.flag}
                    </span>
                    <div>
                      <h4 className="text-lg font-black text-white flex items-center gap-1.5">
                        <span>{activeCountry.nameBn}</span>
                        <span className="text-xs font-semibold text-slate-400">
                          ({activeCountry.name})
                        </span>
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          সক্রিয় বাণিজ্যিক অংশীদার
                        </span>
                        <span className="text-[10px] text-slate-400">
                          কোড: {activeCountry.code}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setFlyToTarget({
                        lat: activeCountry.lat,
                        lon: activeCountry.lon,
                        zoom: activeCountry.defaultZoom,
                      })
                    }
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
                    title="পুরো দেশে জুম করুন"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>

                <p className="text-xs text-slate-300/90 mt-2.5 leading-relaxed bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                  {activeCountry.overviewBn}
                </p>
              </div>

              {/* Live Metric Statistics Cards */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] font-medium text-slate-400 block">
                    লাইভ সেশন
                  </span>
                  <p className="text-base sm:text-lg font-black text-emerald-400 mt-0.5">
                    {activeStat ? activeStat.visitors.toLocaleString() : "১,২০+"}
                  </p>
                  <span className="text-[9px] text-emerald-500 font-semibold flex items-center gap-0.5">
                    <TrendingUp className="w-2.5 h-2.5" />
                    রিয়েল-টাইম
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] font-medium text-slate-400 block">
                    কোটেশন আরএফকিউ
                  </span>
                  <p className="text-base sm:text-lg font-black text-purple-400 mt-0.5">
                    {activeStat ? `${activeStat.inquiries} টি` : "২ টি"}
                  </p>
                  <span className="text-[9px] text-purple-400 font-semibold flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" />
                    ভেরিফাইড
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] font-medium text-slate-400 block">
                    ট্রাফিক অনুপাত
                  </span>
                  <p className="text-base sm:text-lg font-black text-cyan-400 mt-0.5">
                    {activeStat
                      ? `${(
                          (activeStat.visitors /
                            (countryStats.reduce((s, c) => s + c.visitors, 0) ||
                              1)) *
                          100
                        ).toFixed(1)}%`
                      : "৮.৫%"}
                  </p>
                  <span className="text-[9px] text-cyan-400 font-semibold">
                    বৈশ্বিক শেয়ার
                  </span>
                </div>
              </div>

              {/* City & District Hubs Drilldown Section */}
              <div className="flex-1 flex flex-col gap-2 mt-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>শহর ও জেলা নেটওয়ার্ক ({activeCountry.cities.length}টি সক্রিয় হাব)</span>
                  </h5>
                  <span className="text-[10px] text-slate-400 font-medium">
                    ক্লিক করে শহরে জুম করুন
                  </span>
                </div>

                {/* Cities List */}
                <div className="flex flex-col gap-2 overflow-y-auto pr-1">
                  {activeCountry.cities.map((city) => {
                    const isSelected = selectedCityId === city.id;
                    return (
                      <div
                        key={city.id}
                        className={`p-3 rounded-xl border transition-all text-left ${
                          isSelected
                            ? "bg-slate-800 border-cyan-500/60 shadow-lg shadow-cyan-950/30"
                            : "bg-slate-950/50 hover:bg-slate-800/60 border-slate-800/80"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  city.isHq
                                    ? "bg-amber-400"
                                    : isSelected
                                    ? "bg-cyan-400"
                                    : "bg-emerald-400"
                                }`}
                              />
                              <h6 className="text-xs sm:text-sm font-bold text-white">
                                {city.nameBn}
                              </h6>
                              {city.isHq && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-black border border-amber-500/40">
                                  HQ
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-cyan-400 font-medium mt-0.5">
                              {city.roleBn}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCityClick(city)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                              isSelected
                                ? "bg-cyan-500 text-slate-950 font-black shadow-sm"
                                : "bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700"
                            }`}
                          >
                            <span>জুম</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        {/* Scrap / Commodity Stream */}
                        <div className="mt-2 pt-2 border-t border-slate-800/70 flex flex-wrap items-center justify-between gap-1 text-[10px]">
                          <span className="text-slate-400">
                            পণ্য: <strong className="text-slate-200 font-semibold">{city.primaryMaterialBn}</strong>
                          </span>
                          <span className="text-emerald-400 font-semibold">
                            {city.visitors} সেশন
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Globe2 className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
              <h5 className="text-sm font-bold text-white">কোনো দেশ নির্বাচিত নেই</h5>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                মানচিত্রের যেকোনো পিনে ক্লিক করুন অথবা উপরের বোতামগুলো থেকে দেশ নির্বাচন করে শহরভিত্তিক তথ্য দেখুন।
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
