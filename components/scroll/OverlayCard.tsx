"use client";

import React from "react";
import { useScroll } from "./ScrollContainer";

interface OverlayCardProps {
  children: React.ReactNode;
  /** Section index (0-based) */
  sectionIndex: number;
  className?: string;
}

/**
 * Centered semi-transparent dark card.
 * Fades in and slides slightly upward when the section is centered.
 */
export function OverlayCard({
  children,
  sectionIndex,
  className = "",
}: OverlayCardProps) {
  const { scrollY, vh } = useScroll();

  const sectionStart = sectionIndex * vh;
  const sectionCenter = sectionStart + vh / 2;

  // Progress: 1 when section centered in viewport, 0 when far
  const viewportCenter = scrollY + vh / 2;
  const distanceFromCenter = Math.abs(viewportCenter - sectionCenter);
  const visibilityRadius = vh * 0.35;
  const progress = Math.max(
    0,
    Math.min(1, 1 - distanceFromCenter / visibilityRadius)
  );

  const opacity = progress;
  const translateY = 12 * (1 - progress);

  return (
    <div
      className={`pointer-events-auto flex items-center justify-center transition-none ${className}`}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        opacity,
        transform: `translate3d(0, ${translateY}px, 0)`,
        pointerEvents: progress > 0.1 ? "auto" : "none",
      }}
    >
      <div
        className="mx-4 max-w-2xl rounded-2xl px-8 py-10 text-center shadow-2xl backdrop-blur-sm md:ml-[10%] md:mr-auto md:px-12 md:py-14"
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.65)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
