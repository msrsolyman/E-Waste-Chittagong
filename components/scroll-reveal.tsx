"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  variant?: "up" | "fade";
  as?: React.ElementType;
}

export function ScrollReveal({
  children,
  className,
  delayMs = 0,
  variant = "up",
  as: Component = "div",
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const elementRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    // If user prefers reduced motion, show immediately without waiting
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsVisible(true);
      return;
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const currentElement = elementRef.current;
    if (!currentElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    observer.observe(currentElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  const variantClass = variant === "fade" ? "motion-reveal-fade" : "motion-reveal";

  return (
    <Component
      ref={elementRef}
      style={{
        transitionDelay: delayMs > 0 ? `${delayMs}ms` : undefined,
      }}
      className={cn(variantClass, isVisible && "is-visible", className)}
    >
      {children}
    </Component>
  );
}
