"use client";

import Link from "next/link";
import { ACTUALITES } from "@/data/actualites";

interface ActualitesTimelineProps {
  visible?: boolean;
}

export function ActualitesTimeline({ visible = true }: ActualitesTimelineProps) {
  if (!visible) return null;

  return (
    <div
      className="pointer-events-auto w-[296px] rounded-lg p-4 shadow-xl backdrop-blur-sm"
      style={{ backgroundColor: "rgba(20, 83, 45, 0.55)" }}
    >
      <h3 className="mb-4 font-serif text-base font-bold uppercase tracking-wider text-white md:text-lg">
        Actualités
      </h3>
      <div className="space-y-0">
        {ACTUALITES.map((item, i) => (
          <div key={item.id} className="relative flex gap-3 py-3">
            {i < ACTUALITES.length - 1 && (
              <div
                className="absolute left-[5px] top-8 h-full w-px bg-white/50"
                style={{ height: "calc(100% + 8px)" }}
              />
            )}
            <div className="relative z-10 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-white/90" />
            <div className="min-w-0 flex-1">
              {item.date ? <span className="text-xs text-white/80">{item.date}</span> : null}
              <Link
                href={`/nouvelles/${item.slug}`}
                scroll={false}
                className="mt-0.5 block text-sm font-medium text-white hover:text-white/90"
              >
                {item.titre}
              </Link>
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/nouvelles"
        scroll={false}
        className="mt-4 block text-center text-sm font-medium text-white hover:text-white/90"
      >
        Voir toutes les actualités →
      </Link>
    </div>
  );
}
