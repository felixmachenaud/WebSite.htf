"use client";

import { useState } from "react";

function MapSlot({ title, address, button }: { title: string; address: string; button: string }) {
  const [shown, setShown] = useState(false);

  return (
    <div className="mt-6 aspect-video w-full overflow-hidden rounded bg-slate-200">
      {shown ? (
        <iframe
          title={title}
          src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          onClick={() => setShown(true)}
          className="flex h-full w-full items-center justify-center px-4 text-center text-sm font-medium text-slate-700 hover:bg-slate-300/60"
        >
          {button}
        </button>
      )}
    </div>
  );
}

export function AdresseCards({
  mapButton,
  collegeTitle,
  lyceeTitle,
  collegeAddress,
  lyceeAddress,
}: {
  mapButton: string;
  collegeTitle: string;
  lyceeTitle: string;
  collegeAddress: string;
  lyceeAddress: string;
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-6 md:flex-row">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl md:p-8">
        <h3 className="font-serif text-xl font-bold text-slate-800">{collegeTitle}</h3>
        <p className="mt-2 text-slate-600">{collegeAddress}</p>
        <MapSlot title={collegeTitle} address={collegeAddress} button={mapButton} />
      </div>
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl md:p-8">
        <h3 className="font-serif text-xl font-bold text-slate-800">{lyceeTitle}</h3>
        <p className="mt-2 text-slate-600">{lyceeAddress}</p>
        <MapSlot title={lyceeTitle} address={lyceeAddress} button={mapButton} />
      </div>
    </div>
  );
}
