// Meta Pixel (Facebook Pixel) Utility & Helper Functions
// Canonical ID provided: 2420576645414960

export const DEFAULT_META_PIXEL_ID = "2420576645414960";

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || DEFAULT_META_PIXEL_ID;

declare global {
  interface Window {
    fbq?: {
      (action: "init", pixelId: string): void;
      (action: "track", event: string, params?: Record<string, unknown>): void;
      (action: "trackCustom", event: string, params?: Record<string, unknown>): void;
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
    };
    _fbq?: unknown;
  }
}

/**
 * Tracks standard page view event in Meta Pixel
 */
export function trackMetaPageView(): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
}

/**
 * Tracks standard or custom event in Meta Pixel
 * Examples: 'Lead', 'ViewContent', 'Contact', 'Search'
 */
export function trackMetaEvent(
  event: "Lead" | "ViewContent" | "Contact" | "Search" | "CompleteRegistration" | string,
  params?: Record<string, unknown>
): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    if (params) {
      window.fbq("track", event, params);
    } else {
      window.fbq("track", event);
    }
  }
}
