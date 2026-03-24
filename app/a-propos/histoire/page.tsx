import Link from "next/link";

export const metadata = {
  title: "Histoire | Collège Lycée Hautefeuille",
  description:
    "L'histoire, l'identité et les fondements éducatifs de Hautefeuille. Une école née d'une conviction en 1985.",
};

// Images — placez vos 4 photos dans public/images/histoire/ (voir README)
// En attendant, utilisation d'images existantes du site
const IMAGES = {
  hero: "/images/college/header.jpg",
  fondation: "/images/histoire/collage-1.jpg?v=2",
  vieScolaire: "/images/college/collage-1.jpeg",
  activites: "/images/lycee/collage-1.jpg",
};

const FONDEMENTS = [
  { titre: "Une école de parents", phrase: "Créée et portée par des familles engagées dans l'éducation de leurs enfants." },
  { titre: "Une éducation pour garçons", phrase: "Un cadre adapté au développement et à l'épanouissement des garçons." },
  { titre: "Un enseignement de qualité", phrase: "Exigence académique et transmission des savoirs fondamentaux." },
  { titre: "Le préceptorat", phrase: "Accompagnement personnalisé et suivi individualisé de chaque élève." },
  { titre: "L'éducation aux vertus", phrase: "Formation du caractère et développement des qualités humaines." },
  { titre: "L'uniforme", phrase: "Symbole d'appartenance et d'égalité au sein de la communauté scolaire." },
  { titre: "La relation professeurs-élèves", phrase: "Proximité et confiance au cœur de la transmission." },
  { titre: "La formation chrétienne", phrase: "Ouverture à la foi et sens de la vie." },
  { titre: "Un avantage Parcoursup", phrase: "Préparation solide pour les études supérieures." },
  { titre: "De belles sorties", phrase: "Découvertes culturelles et voyages formateurs." },
  { titre: "De vraies méthodes de travail", phrase: "Rigueur, organisation et autonomie." },
  { titre: "Des activités attrayantes", phrase: "Sport, arts et vie de groupe." },
];

export default function HistoirePage() {
  return (
    <main className="min-h-screen bg-page safe-navbar-pt">
        {/* 1. Hero section */}
        <section className="relative">
          <div className="relative flex min-h-[55vh] flex-col justify-end">
            <div className="absolute inset-0">
              <img
                src={IMAGES.hero}
                alt=""
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-slate-900/40" />
            </div>
            <div className="relative z-10 mx-auto max-w-4xl px-6 pb-16 pt-24 text-center">
              <h1 className="font-serif text-4xl font-bold tracking-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl">
                L&apos;histoire de Hautefeuille
              </h1>
              <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-white/95 md:text-xl">
                Une école née d&apos;une conviction : former des jeunes exigeants, ouverts au monde et capables de donner du sens à leur vie.
              </p>
            </div>
          </div>
        </section>

        {/* Accroche */}
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="font-serif text-xl leading-relaxed text-slate-700 md:text-2xl">
            <em>Viser l&apos;excellence académique, s&apos;ouvrir au monde et aux autres, donner du sens à sa vie.</em>
          </p>
        </div>

        {/* 2. Une école née d'une conviction */}
        <section className="border-t border-slate-200 bg-white py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-serif text-3xl font-bold text-slate-900 md:text-4xl">
              Une école née d&apos;une conviction
            </h2>
            <div className="mt-12 grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <p className="font-sans text-base leading-relaxed text-slate-700 md:text-lg">
                  Hautefeuille a été fondée en 1985 par des parents désireux d&apos;offrir à leurs enfants une éducation
                  exigeante, cohérente et ancrée dans des valeurs humaines et chrétiennes. Convaincus que l&apos;école
                  doit prolonger et renforcer le travail des familles, ces pionniers ont créé un lieu où l&apos;excellence
                  intellectuelle va de pair avec la formation du caractère.
                </p>
                <p className="mt-6 font-sans text-base leading-relaxed text-slate-700 md:text-lg">
                  Depuis près de quarante ans, l&apos;établissement a grandi et s&apos;est structuré, tout en restant fidèle
                  à cette intuition fondatrice : une école de parents, pour des parents, au service de la transmission.
                </p>
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-slate-100">
                <img
                  src={IMAGES.fondation}
                  alt="Fondation de Hautefeuille"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Les fondements de Hautefeuille */}
        <section className="border-t border-slate-200 bg-[#faf9f7] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-serif text-3xl font-bold text-slate-900 md:text-4xl">
              Les fondements de Hautefeuille
            </h2>
            <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-slate-600 md:text-lg">
              Douze piliers structurent notre projet éducatif et définissent l&apos;identité de l&apos;établissement.
            </p>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {FONDEMENTS.map((item, i) => (
                <div
                  key={i}
                  className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="font-serif text-lg font-semibold text-slate-900">
                    {item.titre}
                  </h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-slate-600">
                    {item.phrase}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Section photo éditoriale intermédiaire */}
        <section className="border-t border-slate-200 bg-white py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-slate-100">
                <img
                  src={IMAGES.vieScolaire}
                  alt="Vie scolaire et relation éducative"
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-slate-100">
                <img
                  src={IMAGES.activites}
                  alt="Activités et sorties"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 5. Le blason et sa signification */}
        <section className="border-t border-slate-200 bg-[#faf9f7] py-24">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="font-serif text-3xl font-bold text-slate-900 md:text-4xl">
              Le blason et sa signification
            </h2>
            <div className="mt-12 flex flex-col items-center gap-12 md:flex-row md:items-start md:gap-16">
              <div className="flex-shrink-0">
                <img
                  src="/images/logo.png"
                  alt="Blason Hautefeuille"
                  className="h-32 w-32 object-contain md:h-40 md:w-40"
                />
              </div>
              <div className="flex-1 text-left">
                <p className="font-sans text-base leading-relaxed text-slate-700 md:text-lg">
                  Le blason de Hautefeuille porte trois feuilles de chêne, symbolisant les trois piliers de
                  l&apos;éducation : les <strong>parents</strong>, les <strong>professeurs</strong> et les{" "}
                  <strong>élèves</strong>. Ensemble, ils forment une communauté éducative unie autour d&apos;un même projet.
                </p>
                <p className="mt-6 font-sans text-base leading-relaxed text-slate-700 md:text-lg">
                  L&apos;or évoque la charité et la générosité ; l&apos;argent, la science et la clarté de l&apos;esprit.
                  Ces couleurs rappellent que la formation intellectuelle et la formation du cœur vont de pair.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Section finale de conclusion */}
        <section className="border-t border-slate-200 bg-white py-24">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="font-serif text-2xl font-bold text-slate-900 md:text-3xl">
              Fidélité aux fondamentaux, renouvellement permanent
            </h2>
            <p className="mt-8 font-sans text-base leading-relaxed text-slate-700 md:text-lg">
              Hautefeuille reste fidèle à ses racines tout en s&apos;adaptant aux défis de chaque époque. Une équipe
              éducative généreuse et engagée œuvre au quotidien pour offrir à chaque élève une formation intellectuelle,
              humaine et chrétienne de qualité.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link
                href="/a-propos/projet-educatif"
                className="rounded-sm border-2 border-slate-800 bg-transparent px-8 py-3 font-sans text-sm font-medium text-slate-800 transition-colors hover:bg-slate-800 hover:text-white"
              >
                Découvrir notre projet éducatif
              </Link>
              <Link
                href="/a-propos/information-generale"
                className="rounded-sm border-2 border-slate-800 bg-transparent px-8 py-3 font-sans text-sm font-medium text-slate-800 transition-colors hover:bg-slate-800 hover:text-white"
              >
                Nous rencontrer
              </Link>
            </div>
          </div>
        </section>
      </main>
  );
}
