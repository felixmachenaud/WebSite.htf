import React from "react";

interface InstitutionalParagraphProps {
  children: React.ReactNode;
  /** Première lettre en lettrine */
  dropCap?: boolean;
  className?: string;
}

export function InstitutionalParagraph({
  children,
  dropCap = false,
  className = "",
}: InstitutionalParagraphProps) {
  return (
    <div className={`instit-paragraph-wrap ${className}`}>
      <div className="instit-paragraph-bar" aria-hidden />
      <p
        className={`flex-1 font-sans text-base leading-relaxed text-slate-700 md:text-lg ${
          dropCap ? "instit-drop-cap" : ""
        }`}
      >
        {children}
      </p>
    </div>
  );
}
