import Link from "next/link";

const GREEN_COLOR = "#14532d";

export function Footer() {
  return (
    <div className="w-full">
      <footer
        className="w-full border-b border-slate-200 bg-white px-6 py-14 md:px-8"
        style={{ paddingBottom: "max(3.5rem, calc(1.25rem + env(safe-area-inset-bottom, 0px)))" }}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-3 md:gap-0">
          <div className="flex flex-col items-center md:items-start md:border-r md:border-black md:pr-8">
            <img src="/images/logo.png" alt="" className="h-20 w-20 object-contain" />
            <span className="mt-4 font-serif text-2xl font-bold text-slate-900">Hautefeuille</span>
            <span className="mt-1 text-sm font-medium uppercase tracking-wider text-slate-600">
              Collège Lycée
            </span>
          </div>

          <div className="flex flex-col md:border-r md:border-black md:px-8">
            <h2 className="font-bold uppercase tracking-wider text-slate-900">
              Lettre d&apos;information
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Nouvelles, concours, projets internationaux, initiatives de solidarité... L&apos;inscription
              à la lettre d&apos;information sera bientôt disponible.
            </p>
          </div>

          <div className="flex flex-col md:pl-8">
            <h2 className="font-bold uppercase tracking-wider text-slate-900">
              Contactez-nous
            </h2>
            <p className="mt-4 font-medium text-slate-800">Collège Lycée Hautefeuille</p>
            <p className="mt-2 text-sm text-slate-600">
              5 Rue Armand Silvestre
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

        <nav
          aria-label="Informations légales"
          className="mx-auto mt-12 flex max-w-6xl flex-wrap gap-x-6 gap-y-2 border-t border-slate-200 pt-6 text-sm text-slate-600"
        >
          <Link href="/mentions-legales" className="hover:text-slate-900">
            Mentions légales
          </Link>
          <Link href="/confidentialite" className="hover:text-slate-900">
            Politique de confidentialité
          </Link>
        </nav>
      </footer>
      <div className="h-3 w-full" style={{ backgroundColor: GREEN_COLOR }} />
    </div>
  );
}
