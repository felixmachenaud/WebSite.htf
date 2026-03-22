"use client";

import React from "react";
import Image from "next/image";
import { useScroll } from "./ScrollContainer";

interface ParallaxImageProps {
  src: string;
  alt?: string;
  /** Scroll factor: 0.2–0.4 = slow/resistant, 1 = normal */
  factor?: number;
  className?: string;
  /** Use Next Image (requires width/height for static) or img */
  useNextImage?: boolean;
  priority?: boolean;
}

/**
 * Parallax image that moves slower than scroll (resistant effect).
 * Uses transform only for performance.
 */
export function ParallaxImage({
  src,
  alt = "",
  factor = 0.3,
  className = "",
  useNextImage = false,
  priority = false,
}: ParallaxImageProps) {
  const { scrollY, vh, sectionCount } = useScroll();

  // Parallax offset: image moves slower than viewport
  const parallaxOffset = scrollY * (1 - factor);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ willChange: "transform" }}
    >
      <div
        className="absolute inset-0 h-[300vh] w-full"
        style={{
          transform: `translate3d(0, ${-parallaxOffset}px, 0)`,
          willChange: "transform",
        }}
      >
        {useNextImage ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority={priority}
          />
        ) : (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover object-center"
            style={{ objectPosition: "center center" }}
          />
        )}
      </div>
    </div>
  );
}
