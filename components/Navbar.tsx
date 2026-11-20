"use client";

import Link from "next/link";
import type { SiteContent } from "@/lib/site-content";
import { MenuDrawer } from "./MenuDrawer";

export function Navbar({ chrome }: { chrome: SiteContent["chrome"] }) {
  return (
    <>
      <nav
        className="fixed left-0 right-0 top-0 z-[1000] flex min-h-[69px] items-center justify-between px-4 backdrop-blur-sm md:px-7"
        style={{
          backgroundColor: "rgba(209, 250, 229, 0.42)",
          paddingTop: "max(0.75rem, env(safe-area-inset-top))",
        }}
      >
        <MenuDrawer
          items={chrome.nav}
          renderButton={({ open, ...props }) => (
            <button
              type="button"
              {...props}
              className="flex min-h-[44px] min-w-[44px] flex-shrink-0 items-center gap-2 text-black"
              aria-label={chrome.menuButton}
              data-open={open}
            >
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="hidden font-semibold sm:inline">{chrome.menuWord}</span>
            </button>
          )}
        />
        <Link href="/" scroll={false} className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 font-serif text-xl font-semibold text-slate-800 sm:gap-2.5 sm:text-2xl">
          <img src="/images/logo.png" alt="" className="h-8 w-8 object-contain sm:h-9 sm:w-9" />
          <span className="truncate">{chrome.brand}</span>
        </Link>
        <div className="hidden min-w-[200px] items-center justify-end gap-4 md:flex lg:gap-6">
          <Link
            href="/a-propos/inscriptions"
            className="font-medium uppercase tracking-wider text-slate-800 hover:text-slate-600"
          >
            Inscriptions
          </Link>
          <a
            href={chrome.ecoleDirecteHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium uppercase tracking-wider text-slate-800 hover:text-slate-600"
          >
            {chrome.ecoleDirecte}
          </a>
          <Link
            href="/contact"
            className="font-medium uppercase tracking-wider text-slate-800 hover:text-slate-600"
          >
            {chrome.contactLabel}
          </Link>
        </div>
        <div className="w-[44px] flex-shrink-0 md:hidden" aria-hidden />
      </nav>

    </>
  );
}
