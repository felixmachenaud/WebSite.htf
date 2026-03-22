import { PageHeader } from "@/components/PageHeader";
import { InstitutionalParagraph } from "@/components/InstitutionalParagraph";

export const metadata = {
  title: "Collège | Collège Lycée HauteFeuille",
  description: "Le collège HauteFeuille - 100% de réussite au brevet, 96% de mentions.",
};

const COLLEGE_IMAGES = {
  header: "/images/college/header.jpg",
  collage: ["/images/college/collage-1.jpeg", "/images/college/collage-2.jpg", "/images/college/collage-3.JPG"],
  direction: ["/images/college/direction-1.jpg", "/images/college/direction-2.jpg", "/images/college/direction-3.jpg"],
};

const COLLEGE_DIRECTION = [
  { image: COLLEGE_IMAGES.direction[0], name: "François-Xavier Bouillet", role: "Chef d'Établissement" },
  { image: COLLEGE_IMAGES.direction[1], name: "Xavier Villarmet", role: "Directeur du Collège" },
  { image: COLLEGE_IMAGES.direction[2], name: "Luc Neuville", role: "Directeur Administratif" },
] as const;

export default function CollegePage() {
  return (
    <main className="min-h-screen bg-page safe-navbar-pt">
      <PageHeader title="Collège" imageUrl={COLLEGE_IMAGES.header} />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <section className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          <div className="flex flex-col justify-center">
            <InstitutionalParagraph dropCap>
              Le collège HauteFeuille accueille les élèves de la 6e à la 3e dans un cadre bienveillant
              et exigeant. Notre projet éducatif vise à former des jeunes capables de s&apos;engager
              avec confiance dans leur parcours scolaire et personnel.
            </InstitutionalParagraph>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="row-span-2 flex items-stretch">
              <img
                src={COLLEGE_IMAGES.collage[0]}
                alt="Vie au collège"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <img
                src={COLLEGE_IMAGES.collage[1]}
                alt="Vie au collège"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <img
                src={COLLEGE_IMAGES.collage[2]}
                alt="Vie au collège"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-xl font-bold uppercase tracking-wider text-slate-900">
              Les résultats
            </h2>
            <InstitutionalParagraph className="mt-4">
              100 % de réussite au brevet, 96 % de mentions
            </InstitutionalParagraph>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold uppercase tracking-wider text-slate-900">
              Informations pratiques
            </h2>
            <ul className="mt-4 space-y-2 font-sans text-slate-700">
              <li><strong>240 élèves</strong></li>
              <li>2 classes par division de la 6e à la 3e</li>
              <li><strong>19 professeurs</strong></li>
            </ul>
          </div>
        </section>

        <section className="mt-20">
          <h2 className="font-serif text-xl font-bold uppercase tracking-wider text-slate-900">
            La direction
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {COLLEGE_DIRECTION.map((person) => (
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
