"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollContextValue {
  scrollY: number;
  targetScroll: number;
  maxScroll: number;
  sectionCount: number;
  vh: number;
}

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function useScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useScroll must be used within ScrollContainer");
  return ctx;
}

interface ScrollContainerProps {
  children: React.ReactNode;
  sectionCount: number;
  /** Easing factor for smooth interpolation (0.05–0.15 typical) */
  ease?: number;
  /** Inertia / momentum factor when releasing scroll */
  inertia?: number;
}

export function ScrollContainer({
  children,
  sectionCount,
  ease = 0.08,
  inertia = 0.92,
}: ScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const scrollYRef = useRef(0);
  const targetRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastWheelRef = useRef(0);
  const lastTouchRef = useRef(0);
  const [vh, setVh] = useState(800);

  scrollYRef.current = scrollY;
  const maxScroll = (sectionCount - 1) * vh;

  const updateVh = useCallback(() => {
    if (typeof window !== "undefined") {
      setVh(window.innerHeight);
    }
  }, []);

  useEffect(() => {
    updateVh();
    window.addEventListener("resize", updateVh);
    return () => window.removeEventListener("resize", updateVh);
  }, [updateVh]);

  const animate = useCallback(() => {
    const current = scrollYRef.current;
    const vel = velocityRef.current;

    // Apply inertia to target
    targetRef.current += vel;
    targetRef.current = Math.max(0, Math.min(maxScroll, targetRef.current));
    velocityRef.current *= inertia;

    // Smooth interpolation toward target
    const diff = targetRef.current - current;
    const next = current + diff * ease;

    scrollYRef.current = next;
    setScrollY(next);

    if (Math.abs(diff) > 0.01 || Math.abs(vel) > 0.01) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [maxScroll, ease, inertia]);

  // Register custom scroll with GSAP ScrollTrigger for compatibility
  useEffect(() => {
    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true,
    });
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
      lastWheelRef.current = Date.now();

      targetRef.current += delta;
      targetRef.current = Math.max(0, Math.min(maxScroll, targetRef.current));
      velocityRef.current = delta * 0.3;

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchRef.current = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const y = e.touches[0].clientY;
      const delta = lastTouchRef.current - y;
      lastTouchRef.current = y;

      targetRef.current += delta;
      targetRef.current = Math.max(0, Math.min(maxScroll, targetRef.current));
      velocityRef.current = delta * 0.5;

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [maxScroll, animate]);

  const ctxValue: ScrollContextValue = {
    scrollY,
    targetScroll: targetRef.current,
    maxScroll,
    sectionCount,
    vh,
  };

  return (
    <ScrollContext.Provider value={ctxValue}>
      <div
        ref={containerRef}
        className="scroll-container relative h-screen w-full overflow-hidden"
        style={{ touchAction: "none" }}
      >
        {children}
      </div>
    </ScrollContext.Provider>
  );
}
