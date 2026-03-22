"use client";

import { useState } from "react";

export function SafeSectionImage({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <div className="aspect-[4/3] w-full bg-slate-200" aria-hidden />;
  }

  return (
    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-200">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
