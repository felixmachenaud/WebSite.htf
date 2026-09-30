"use client";

import React from "react";
import Link from "next/link";

import type { SiteContent } from "@/lib/site-content";

interface SidebarMenuProps {
  items: SiteContent["chrome"]["nav"];
  onClose?: () => void;
  currentPath?: string;
  linkClassName?: string;
}

export function SidebarMenu({ items, onClose, currentPath = "", linkClassName = "text-lg font-medium text-slate-800 hover:text-slate-600" }: SidebarMenuProps) {
  return (
    <div className="relative flex h-full">
      <div className="flex flex-1 flex-col pl-8">
        <div className="flex flex-col items-center border-b border-black/20 pb-6">
          <div className="flex items-center justify-center gap-4">
            <img src="/images/logo.png" alt="" className="h-[104px] w-[104px] object-contain" />
            <img src="/images/logo-40-ans.png" alt="40 ans Hautefeuille" className="h-[80px] w-[80px] object-contain" />
          </div>
          <span className="mt-2 font-serif text-xl font-semibold text-slate-800">Hautefeuille</span>
        </div>
        <nav className="flex flex-col gap-0 pt-4">
          {items.map((item, i) => {
            const isActive =
              currentPath === item.href ||
              (item.href !== "/" && currentPath.startsWith(item.href));
            return (
              <React.Fragment key={item.href}>
                {i > 0 && <hr className="my-0 border-t border-black/30" />}
                <Link
                  href={item.href}
                  scroll={false}
                  className={`block py-4 ${isActive ? "text-slate-400" : linkClassName}`}
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
