"use client";

import { useState } from "react";

function MapSlot({ title, query }: { title: string; query: string }) {
  const [shown, setShown] = useState(false);

  return (
    <div className="mt-6 aspect-video w-full overflow-hidden rounded bg-slate-200">
      {shown ? (
        <iframe
          title={title}
          src={`https://www.google.com/maps?q=${query}&output=embed`}
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
          Afficher la carte Google Maps
        </button>
      )}
    </div>
  );
}

export function AdresseCards() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-6 md:flex-row">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl md:p-8">
        <h3 className="font-serif text-xl font-bold text-slate-800">Collège</h3>
        <p className="mt-2 text-slate-600">5 Rue Armand Silvestre, 92400 Courbevoie, France</p>
        <MapSlot
          title="Collège Hautefeuille - Courbevoie"
          query="5+Rue+Armand+Silvestre+92400+Courbevoie+France"
        />
      </div>
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl md:p-8">
        <h3 className="font-serif text-xl font-bold text-slate-800">Lycée</h3>
        <p className="mt-2 text-slate-600">26 rue Pierre Joigneaux, 92270 Bois-Colombes, France</p>
        <MapSlot
          title="Lycée Hautefeuille - Bois-Colombes"
          query="26+rue+Pierre+Joigneaux+92270+Bois+Colombes+France"
        />
      </div>
    </div>
  );
}
