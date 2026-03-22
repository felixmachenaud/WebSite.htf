"use client";

import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Full-screen section (100vh). Used as a wrapper for scroll-based layout.
 */
export function Section({ children, className = "" }: SectionProps) {
  return (
    <section
      className={`relative h-[100vh] w-full shrink-0 ${className}`}
      style={{ minHeight: "100vh" }}
    >
      {children}
    </section>
  );
}
