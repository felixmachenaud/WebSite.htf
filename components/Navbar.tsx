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
        className="fixed left-0 right-0 top-0 z-[1000] flex h-[69px] items-center justify-between px-7 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.85)" }}
      >
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 text-black"
          aria-label="Menu"
        >
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="font-semibold">MENU</span>
        </button>
        <Link href="/" scroll={false} className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2.5 font-serif text-2xl font-semibold text-slate-800">
          <img src="/images/logo.png" alt="" className="h-9 w-9 object-contain" />
          HauteFeuille
        </Link>
        <div className="flex min-w-[200px] items-center justify-end gap-6">
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
      </nav>

      {/* Menu latéral — visible sur tous les écrans */}
      <div
        className={`fixed inset-0 z-[1001] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden
      />
      <div
        className={`fixed left-0 top-0 z-[1002] flex h-full w-[486px] flex-col overflow-y-auto pl-0 pr-8 pt-12 pb-8 shadow-xl backdrop-blur-md transition-transform duration-300 ease-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: "rgba(255, 255, 255, 0.98)" }}
      >
        <SidebarMenu onClose={() => setMenuOpen(false)} currentPath={pathname} />
      </div>
    </>
  );
}
