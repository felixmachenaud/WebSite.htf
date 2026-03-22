"use client";

import React from "react";
import { useScroll } from "./ScrollContainer";

interface SectionData {
  backgroundImage: string;
}

interface ImageTransitionStackProps {
  sections: SectionData[];
  /** Parallax factor for images (0.2–0.4) */
  parallaxFactor?: number;
}

/**
 * Stack of section images with bottom-to-top reveal transition.
 * Current image clips out from bottom; next image appears underneath.
 */
export function ImageTransitionStack({
  sections,
  parallaxFactor = 0.3,
}: ImageTransitionStackProps) {
  const { scrollY, vh } = useScroll();

  const currentIndex = Math.min(
    Math.floor(scrollY / vh),
    sections.length - 1
  );
  const progress = Math.max(
    0,
    Math.min(1, (scrollY - currentIndex * vh) / vh)
  );

  const parallaxOffset = scrollY * (1 - parallaxFactor);

  const currentSection = sections[currentIndex];
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Current image - clips from bottom to top as progress increases */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 0 ${progress * 100}% 0)`,
          willChange: "clip-path",
        }}
      >
        <div
          className="absolute inset-0 h-[300vh] w-full"
          style={{
            transform: `translate3d(0, ${-parallaxOffset}px, 0)`,
            willChange: "transform",
          }}
        >
          <img
            src={currentSection.backgroundImage}
            alt=""
            className="h-full w-full object-cover object-center"
          />
        </div>
      </div>

      {/* Next image - behind current, positioned to slide up into view */}
      {nextSection && (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 h-[300vh] w-full"
            style={{
              transform: `translate3d(0, ${vh * (progress - 1) - parallaxOffset}px, 0)`,
              willChange: "transform",
            }}
          >
            <img
              src={nextSection.backgroundImage}
              alt=""
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      )}
    </div>
  );
}
