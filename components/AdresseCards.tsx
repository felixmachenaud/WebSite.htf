export function AdresseCards() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-6 md:flex-row">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl md:p-8">
        <h3 className="font-serif text-xl font-bold text-slate-800">Collège</h3>
        <p className="mt-2 text-slate-600">65 Rue Armand Sylvestre, 92400 Courbevoie, France</p>
        <div className="mt-6 aspect-video w-full overflow-hidden rounded bg-slate-200">
          <iframe
            title="Collège HauteFeuille - Courbevoie"
            src="https://www.google.com/maps?q=65+Rue+Armand+Sylvestre+92400+Courbevoie+France&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl md:p-8">
        <h3 className="font-serif text-xl font-bold text-slate-800">Lycée</h3>
        <p className="mt-2 text-slate-600">26 rue Pierre Joigneaux, 92270 Bois-Colombes, France</p>
        <div className="mt-6 aspect-video w-full overflow-hidden rounded bg-slate-200">
          <iframe
            title="Lycée HauteFeuille - Bois-Colombes"
            src="https://www.google.com/maps?q=26+rue+Pierre+Joigneaux+92270+Bois+Colombes+France&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
