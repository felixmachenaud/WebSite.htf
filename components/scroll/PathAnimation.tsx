"use client";

import React from "react";
import { useScroll } from "./ScrollContainer";

interface PathAnimationProps {
  /** Parallax factor: 0.8–1.2 = moves faster than images */
  factor?: number;
  className?: string;
}

/**
 * Vertical SVG path on the right side.
 * Fixed horizontally, moves vertically with scroll (parallax ~0.8–1.2).
 */
export function PathAnimation({
  factor = 1.0,
  className = "",
}: PathAnimationProps) {
  const { scrollY } = useScroll();

  const offsetY = -scrollY * factor;

  return (
    <div
      className={`pointer-events-none fixed right-0 top-0 z-10 flex h-full justify-end ${className}`}
      aria-hidden
    >
      <div
        className="h-[300vh] w-[min(24vw,340px)]"
        style={{
          transform: `translate3d(0, ${offsetY}px, 0)`,
          willChange: "transform",
        }}
      >
        <svg
          viewBox="0 0 120 2000"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <defs>
            <linearGradient
              id="pathGradRed"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="rgba(185, 28, 28, 0.7)" />
              <stop offset="100%" stopColor="rgba(220, 38, 38, 0.65)" />
            </linearGradient>
          </defs>
          <path
            d="M 60 0 C 95 80 25 160 60 240 C 95 320 25 400 60 480 C 25 560 95 640 60 720 C 95 800 25 880 60 960 C 25 1040 95 1120 60 1200 C 95 1280 25 1360 60 1440 C 25 1520 95 1600 60 1680 C 95 1760 25 1840 60 1920 C 25 2000 95 2000 60 2000"
            fill="none"
            stroke="url(#pathGradRed)"
            strokeWidth="28"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
