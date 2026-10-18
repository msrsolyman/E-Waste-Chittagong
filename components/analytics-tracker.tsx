"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Only track public routes, skip admin / api
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    if (lastTrackedPath.current === pathname) {
      return;
    }

    lastTrackedPath.current = pathname;

    // Detect device type
    const width = typeof window !== "undefined" ? window.innerWidth : 1200;
    const device = width < 768 ? "Mobile" : width < 1024 ? "Tablet" : "Desktop";

    // Detect simple browser name
    let browser = "Other";
    if (typeof navigator !== "undefined") {
      const ua = navigator.userAgent;
      if (ua.includes("Firefox")) browser = "Firefox";
      else if (ua.includes("Edg/")) browser = "Edge";
      else if (ua.includes("Chrome")) browser = "Chrome";
      else if (ua.includes("Safari")) browser = "Safari";
    }

    const payload = {
      path: pathname,
      referer: typeof document !== "undefined" ? document.referrer : "",
      device,
      browser,
    };

    // Send non-blocking beacon or fetch
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], {
          type: "application/json",
        });
        navigator.sendBeacon("/api/analytics/track", blob);
      } else {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Ignore client side telemetry errors
    }
  }, [pathname]);

  return null;
}
