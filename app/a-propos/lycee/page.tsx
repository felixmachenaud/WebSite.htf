import { PageHeader } from "@/components/PageHeader";
import { ResultatsSection } from "@/components/ResultatsSection";
import { RESULTATS_BAC } from "@/data/resultats";
import { InstitutionalParagraph } from "@/components/InstitutionalParagraph";

export const metadata = {
  title: "Lycée | Collège Lycée Hautefeuille",
  description: "Le lycée Hautefeuille - accompagnement vers l'excellence.",
};

const LYCEE_IMAGES = {
  header: "/images/lycee/header.JPG",
  collage: ["/images/lycee/collage-1.jpg", "/images/lycee/collage-2.jpg", "/images/lycee/collage-3.jpg"],
  direction: ["/images/lycee/direction-1.jpg", "/images/lycee/direction-2.jpg", "/images/lycee/direction-3.jpg"],
};

const LYCEE_DIRECTION = [
  {
    image: LYCEE_IMAGES.direction[0],
    name: "François-Xavier Bouillet",
    role: "Chef d'Établissement et Directeur du Lycée",
  },
  { image: LYCEE_IMAGES.direction[1], name: "Frédéric Delorme", role: "Directeur des Études" },
  { image: LYCEE_IMAGES.direction[2], name: "Luc Neuville", role: "Directeur Administratif" },
] as const;

export default function LyceePage() {
  return (
    <main className="min-h-screen bg-page safe-navbar-pt">
      <PageHeader title="Lycée" imageUrl={LYCEE_IMAGES.header} />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <section className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          <div className="flex flex-col justify-center">
            <InstitutionalParagraph dropCap>
              Le lycée Hautefeuille accompagne les élèves de la seconde à la terminale vers
              l&apos;excellence académique et personnelle. Un cadre propice à la réussite et à
              l&apos;épanouissement.
            </InstitutionalParagraph>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="row-span-2 flex items-stretch">
              <img
                src={LYCEE_IMAGES.collage[0]}
                alt="Vie au lycée"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <img
                src={LYCEE_IMAGES.collage[1]}
                alt="Vie au lycée"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <img
                src={LYCEE_IMAGES.collage[2]}
                alt="Vie au lycée"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mt-16">
          <ResultatsSection data={RESULTATS_BAC} />
        </section>

        <section className="mt-16">
          <h2 className="font-serif text-xl font-bold uppercase tracking-wider text-slate-900">
            Informations pratiques
          </h2>
          <ul className="mt-4 space-y-2 font-sans text-slate-700">
            <li><strong>240 élèves</strong></li>
            <li>2 classes par division de la 2de à la terminale</li>
            <li><strong>19 professeurs</strong></li>
          </ul>
        </section>

        <section className="mt-20">
          <h2 className="font-serif text-xl font-bold uppercase tracking-wider text-slate-900">
            La direction
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {LYCEE_DIRECTION.map((person) => (
              <div key={person.image} className="flex flex-col">
                <div className="aspect-[3/4] overflow-hidden rounded bg-slate-200">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-4 text-center font-sans text-sm font-bold uppercase tracking-wide text-slate-900">
                  {person.name}
                </p>
                <p className="mt-1 text-center font-sans text-sm text-slate-600">{person.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
