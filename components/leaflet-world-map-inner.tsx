"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import L from "leaflet";
import {
  CHITTAGONG_EPICENTER,
  GIS_BUYER_COUNTRIES,
  type GisCityPoint,
  type GisCountryDetail,
} from "@/lib/world-gis-data";

import type { CountryStat } from "@/lib/analytics-service";

interface LeafletWorldMapInnerProps {
  selectedCountryCode: string | null;
  onSelectCountryCode: (code: string | null) => void;
  selectedCityId: string | null;
  onSelectCityId: (cityId: string | null) => void;
  flyToTarget: { lat: number; lon: number; zoom: number } | null;
  activeFilter?: "all" | "top" | "active";
  countryStats?: CountryStat[];
}

export default function LeafletWorldMapInner({
  selectedCountryCode,
  onSelectCountryCode,
  selectedCityId,
  onSelectCityId,
  flyToTarget,
  activeFilter = "all",
  countryStats = [],
}: LeafletWorldMapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [23, 65],
      zoom: 3,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: true,
      fadeAnimation: true,
      zoomAnimation: true,
    });

    // Add Zoom Control top-right
    L.control.zoom({ position: "topright" }).addTo(map);

    // 1. ESRI World Dark Gray Base (Clean, high-tech dark theme, no watermarks)
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 16,
        attribution:
          '&copy; <a href="https://www.esri.com/">Esri</a> &copy; OpenStreetMap',
      }
    ).addTo(map);

    // 2. ESRI World Dark Gray Reference (Crisp labels & country boundaries)
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 16,
      }
    ).addTo(map);

    // Layer groups for dynamic markers and trade routes
    const routesLayer = L.layerGroup().addTo(map);
    const markersLayer = L.layerGroup().addTo(map);

    routesLayerRef.current = routesLayer;
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers & Trade Routes on data or filter change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    const routesLayer = routesLayerRef.current;
    if (!map || !markersLayer || !routesLayer) return;

    markersLayer.clearLayers();
    routesLayer.clearLayers();

    // 1. Epicenter Marker: Chittagong Port HQ
    const ctgIcon = L.divIcon({
      className: "custom-leaflet-icon",
      html: `
        <div class="marker-beacon-epicenter">
          <div class="relative w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-400 border-2 border-white shadow-lg flex items-center justify-center text-[10px] text-slate-950 font-black cursor-pointer">
            ⚓
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const ctgMarker = L.marker([CHITTAGONG_EPICENTER.lat, CHITTAGONG_EPICENTER.lon], {
      icon: ctgIcon,
      zIndexOffset: 1000,
    });

    ctgMarker.bindTooltip(
      `
      <div style="padding: 10px 14px; font-family: inherit;">
        <div style="display: flex; align-items: center; gap: 6px; font-weight: 800; font-size: 13px; color: #fbbf24;">
          <span>⚓</span>
          <span>${CHITTAGONG_EPICENTER.name}</span>
        </div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">
          গ্লোবাল অপারেশনস ও রিসাইক্লিং ইয়ার্ড হেডকোয়ার্টার
        </div>
        <div style="margin-top: 6px; display: inline-block; padding: 2px 8px; border-radius: 9999px; background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.4); font-size: 10px; font-weight: 700; color: #34d399;">
          সরাসরি রপ্তানি টার্মিনাল
        </div>
      </div>
      `,
      { direction: "top", offset: [0, -12], opacity: 1 }
    );

    ctgMarker.on("click", () => {
      onSelectCountryCode("BD");
      map.flyTo([CHITTAGONG_EPICENTER.lat, CHITTAGONG_EPICENTER.lon], 7, {
        duration: 1.2,
      });
    });

    ctgMarker.addTo(markersLayer);

    // 2. Buyer Countries and Cities (Strictly driven by live database countryStats)
    const activeCountryCodes = new Set(
      countryStats.length > 0
        ? ["BD", ...countryStats.map((c) => c.code.toUpperCase())]
        : ["BD"]
    );
    const buyerCountriesList = Object.values(GIS_BUYER_COUNTRIES).filter((country) =>
      activeCountryCodes.has(country.code.toUpperCase())
    );

    buyerCountriesList.forEach((country) => {
      // Filter logic
      const isSelected = selectedCountryCode === country.code;

      country.cities.forEach((city) => {
        if (activeFilter === "top" && city.visitors < 200) return;
        if (activeFilter === "active" && city.inquiries === 0) return;

        // Trade route line from Chittagong to city
        if (!city.isHq) {
          const latlngs: [number, number][] = [
            [CHITTAGONG_EPICENTER.lat, CHITTAGONG_EPICENTER.lon],
            [city.lat, city.lon],
          ];

          const polyline = L.polyline(latlngs, {
            color: isSelected ? "#38bdf8" : "#10b981",
            weight: isSelected ? 2.5 : 1.2,
            opacity: isSelected ? 0.9 : 0.4,
            className: "trade-route-line",
          });

          polyline.addTo(routesLayer);
        }

        // City Marker
        const isCitySelected = selectedCityId === city.id;
        const cityIcon = L.divIcon({
          className: "custom-leaflet-icon",
          html: `
            <div class="marker-beacon-city">
              <div class="w-3.5 h-3.5 rounded-full ${
                city.isHq
                  ? "bg-amber-400 border border-white"
                  : isCitySelected
                  ? "bg-cyan-400 border-2 border-white shadow-[0_0_12px_#38bdf8] scale-125"
                  : isSelected
                  ? "bg-emerald-400 border border-white"
                  : "bg-emerald-500/90 border border-slate-900"
              } transition-transform duration-300"></div>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker([city.lat, city.lon], {
          icon: cityIcon,
          zIndexOffset: isCitySelected ? 500 : 100,
        });

        marker.bindTooltip(
          `
          <div style="padding: 10px 14px; font-family: inherit;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
              <span style="font-size: 14px;">${country.flag}</span>
              <span style="font-weight: 800; font-size: 13px; color: #f8fafc;">${city.nameBn}</span>
            </div>
            <div style="font-size: 11px; color: #38bdf8; font-weight: 600; margin-top: 2px;">
              ${city.roleBn}
            </div>
            <div style="margin-top: 8px; display: flex; align-items: center; gap: 10px; font-size: 10px; color: #94a3b8; border-top: 1px solid rgba(51, 65, 85, 0.4); padding-top: 6px;">
              <span>লাইভ ভিজিটর: <strong style="color: #34d399;">${city.visitors.toLocaleString()} সেশন</strong></span>
              ${
                city.inquiries > 0
                  ? `<span>কোটেশন: <strong style="color: #a855f7;">${city.inquiries} টি RFQ</strong></span>`
                  : ""
              }
            </div>
          </div>
          `,
          { direction: "top", offset: [0, -10], opacity: 1 }
        );

        marker.on("click", () => {
          onSelectCountryCode(country.code);
          onSelectCityId(city.id);
          map.flyTo([city.lat, city.lon], Math.max(map.getZoom(), 7), {
            duration: 1,
          });
        });

        marker.addTo(markersLayer);
      });
    });
  }, [selectedCountryCode, selectedCityId, activeFilter, onSelectCountryCode, onSelectCityId]);

  // Handle external flyTo requests (e.g. clicking country pill or city button)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (flyToTarget) {
      map.flyTo([flyToTarget.lat, flyToTarget.lon], flyToTarget.zoom, {
        duration: 1.2,
      });
    }
  }, [flyToTarget]);

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[540px]">
      <div ref={mapContainerRef} className="w-full h-full rounded-2xl z-0" />
    </div>
  );
}
