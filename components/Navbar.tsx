"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarMenu } from "./SidebarMenu";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav
        className="fixed left-0 right-0 top-0 z-[1000] flex min-h-[69px] items-center justify-between px-4 backdrop-blur-sm md:px-7"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          paddingTop: "max(0.75rem, env(safe-area-inset-top))",
        }}
      >
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex min-h-[44px] min-w-[44px] flex-shrink-0 items-center gap-2 text-black"
          aria-label="Menu"
        >
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="hidden font-semibold sm:inline">MENU</span>
        </button>
        <Link href="/" scroll={false} className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 font-serif text-xl font-semibold text-slate-800 sm:gap-2.5 sm:text-2xl">
          <img src="/images/logo.png" alt="" className="h-8 w-8 object-contain sm:h-9 sm:w-9" />
          <span className="truncate">Hautefeuille</span>
        </Link>
        <div className="hidden min-w-[200px] items-center justify-end gap-4 md:flex lg:gap-6">
          <a
            href="https://www.ecoledirecte.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium uppercase tracking-wider text-slate-800 hover:text-slate-600"
          >
            École directe
          </a>
          <Link
            href="/contact"
            className="font-medium uppercase tracking-wider text-slate-800 hover:text-slate-600"
          >
            Contact
          </Link>
        </div>
        <div className="w-[44px] flex-shrink-0 md:hidden" aria-hidden />
      </nav>

      {/* Menu latéral — pleine largeur sur mobile */}
      <div
        className={`fixed inset-0 z-[1001] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden
      />
      <div
        className={`fixed left-0 top-0 z-[1002] flex h-full w-[85vw] max-w-[486px] flex-col overflow-y-auto pl-4 pr-6 pb-8 shadow-xl backdrop-blur-md transition-transform duration-300 ease-out md:pl-0 md:pr-8 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          paddingTop: "max(3rem, calc(env(safe-area-inset-top) + 1rem))",
        }}
      >
        <SidebarMenu onClose={() => setMenuOpen(false)} currentPath={pathname} />
      </div>
    </>
  );
}
