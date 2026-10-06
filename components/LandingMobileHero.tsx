"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import type { SiteContent } from "@/lib/site-content";
import {
  LANDING_IMAGES,
  LANDING_IMAGE_FILTERS,
  LANDING_IMAGE_OBJECT_POSITION,
  PATH_GREEN,
} from "./landingData";

/**
 * Hero page d’accueil — mobile : scroll natif + snap, pas de hijack wheel/touch (fluide sur iOS/Android).
 */
export function LandingMobileHero({
  overlays,
}: {
  overlays: SiteContent["landing"]["overlays"];
}) {
  useEffect(() => {
    document.documentElement.classList.add("landing-mobile-snap");
    return () => document.documentElement.classList.remove("landing-mobile-snap");
  }, []);

  return (
    <div className="relative z-[800] w-full bg-black md:hidden">
      {LANDING_IMAGES.map((src, index) => {
        const ov = overlays[index];
        if (!ov) return null;
        return (
          <section
            key={src}
            className="landing-mobile-section relative flex min-h-[100dvh] snap-start snap-always flex-col justify-end"
          >
            <img
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                objectPosition: LANDING_IMAGE_OBJECT_POSITION[index] ?? "50% 50%",
                filter: LANDING_IMAGE_FILTERS[index] ?? LANDING_IMAGE_FILTERS[0],
              }}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"
              aria-hidden
            />
            <div
              className="relative z-10 mx-auto w-full max-w-md px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[min(28vh,12rem)]"
              style={{ paddingTop: "max(5.5rem, env(safe-area-inset-top, 0px))" }}
            >
              <div
                className="pointer-events-auto rounded-2xl border border-white/15 bg-black/55 px-4 py-5 shadow-lg backdrop-blur-[3px]"
                style={{ borderLeftWidth: 4, borderLeftColor: PATH_GREEN }}
              >
                <h2 className="font-sans text-[0.7rem] font-bold uppercase leading-snug tracking-wide text-white">
                  {ov.title}
                </h2>
                <p className="mt-2.5 font-sans text-[0.75rem] leading-relaxed text-white/95">{ov.body}</p>
                <div className="mx-1 my-4 border-t border-white/25" />
                <Link
                  href={ov.href}
                  className="inline-flex min-h-[40px] w-full items-center justify-center rounded-full border border-white/40 bg-black/40 px-4 text-[0.65rem] font-semibold uppercase tracking-wider text-white active:bg-white active:text-slate-900"
                >
                  {ov.buttonLabel}
                </Link>
              </div>
            </div>
            <div
              className="pointer-events-none absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5"
              aria-hidden
            >
              {LANDING_IMAGES.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-[width,opacity] duration-300 ${
                    i === index ? "w-5 bg-white opacity-100" : "w-1 bg-white/35 opacity-80"
                  }`}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
