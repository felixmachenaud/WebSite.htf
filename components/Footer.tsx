"use client";

const GREEN_COLOR = "#14532d";

export function Footer() {
  return (
    <div className="w-full">
      <footer className="w-full border-b border-slate-200 bg-white px-8 py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-3 md:gap-0">
          {/* Colonne gauche : branding */}
          <div className="flex flex-col items-center md:items-start md:border-r md:border-black md:pr-8">
            <img src="/images/logo.png" alt="" className="h-20 w-20 object-contain" />
            <span className="mt-4 font-serif text-2xl font-bold text-slate-900">HauteFeuille</span>
            <span className="mt-1 text-sm font-medium uppercase tracking-wider text-slate-600">
              Collège Lycée
            </span>
          </div>

          {/* Colonne centrale : newsletter */}
          <div className="flex flex-col md:border-r md:border-black md:px-8">
            <h3 className="font-bold uppercase tracking-wider text-slate-900">
              Lettre d&apos;information
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Nouvelles, concours, projets internationaux, initiatives de solidarité... Abonnez-vous à
              notre newsletter pour découvrir les dernières nouveautés.
            </p>
            <form className="mt-6 flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Prénom *"
                className="rounded border border-slate-300 px-4 py-2.5 text-sm"
              />
              <input
                type="email"
                placeholder="Courriel *"
                className="rounded border border-slate-300 px-4 py-2.5 text-sm"
              />
              <label className="flex items-start gap-2 text-xs text-slate-600">
                <input type="checkbox" className="mt-1" />
                <span>J&apos;accepte les conditions et la politique de confidentialité.</span>
              </label>
              <button
                type="submit"
                className="mt-2 w-fit rounded px-6 py-2.5 font-bold uppercase text-white transition hover:opacity-90"
                style={{ backgroundColor: GREEN_COLOR }}
              >
                Envoyer
              </button>
            </form>
          </div>

          {/* Colonne droite : contact */}
          <div className="flex flex-col md:pl-8">
            <h3 className="font-bold uppercase tracking-wider text-slate-900">
              Contactez-nous
            </h3>
            <p className="mt-4 font-medium text-slate-800">Collège Lycée HauteFeuille</p>
            <p className="mt-2 text-sm text-slate-600">
              65 Rue Armand Sylvestre
              <br />
              92400 Courbevoie, France
            </p>
            <p className="mt-2 text-sm text-slate-600">
              26 rue Pierre Joigneaux
              <br />
              92270 Bois-Colombes, France
            </p>
            <a href="tel:+33143332402" className="mt-4 text-sm text-slate-600 hover:text-slate-900">
              01 43 33 24 02
            </a>
            <a
              href="mailto:hautefeuille92@gmail.com"
              className="mt-1 text-sm text-slate-600 hover:text-slate-900"
            >
              hautefeuille92@gmail.com
            </a>
          </div>
        </div>
      </footer>
      {/* Bande verte horizontale */}
      <div
        className="h-3 w-full"
        style={{ backgroundColor: GREEN_COLOR }}
      />
    </div>
  );
}
