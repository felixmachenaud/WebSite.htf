import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ResultatsSection } from "@/components/ResultatsSection";
import { toResultatsBac } from "@/data/resultats";
import { InstitutionalParagraph } from "@/components/InstitutionalParagraph";
import { getContent } from "@/lib/content-store";

const LYCEE_IMAGES = {
  header: "/images/lycee/header.JPG",
  collage: ["/images/lycee/collage-1.jpg", "/images/lycee/collage-2.jpg", "/images/lycee/collage-3.jpg"],
  direction: ["/images/lycee/direction-1.jpg", "/images/lycee/direction-2.jpg", "/images/lycee/direction-3.jpg"],
};

export async function generateMetadata(): Promise<Metadata> {
  const { lycee } = await getContent();
  return { title: lycee.metaTitle, description: lycee.metaDescription };
}

export default async function LyceePage() {
  const { lycee } = await getContent();
  return (
    <main className="min-h-screen bg-page safe-navbar-pt">
      <PageHeader title={lycee.title} imageUrl={LYCEE_IMAGES.header} />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <section className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          <div className="flex flex-col justify-center">
            <InstitutionalParagraph dropCap>{lycee.intro}</InstitutionalParagraph>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="row-span-2 flex items-stretch">
              <img src={LYCEE_IMAGES.collage[0]} alt={lycee.collageAlt} className="h-full w-full object-cover" />
            </div>
            <div>
              <img src={LYCEE_IMAGES.collage[1]} alt={lycee.collageAlt} className="h-full w-full object-cover" />
            </div>
            <div>
              <img src={LYCEE_IMAGES.collage[2]} alt={lycee.collageAlt} className="h-full w-full object-cover" />
            </div>
          </div>
        </section>

        <section className="mt-16">
          <ResultatsSection data={toResultatsBac(lycee.resultats)} />
        </section>

        <section className="mt-16">
          <h2 className="font-serif text-xl font-bold uppercase tracking-wider text-slate-900">{lycee.practicalTitle}</h2>
          <ul className="mt-4 space-y-2 font-sans text-slate-700">
            {lycee.stats.map((stat, index) => (
              <li key={stat}>{index === 1 ? stat : <strong>{stat}</strong>}</li>
            ))}
          </ul>
        </section>

        <section className="mt-20">
          <h2 className="font-serif text-xl font-bold uppercase tracking-wider text-slate-900">{lycee.directionTitle}</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {lycee.direction.map((person, index) => (
              <div key={LYCEE_IMAGES.direction[index]} className="flex flex-col">
                <div className="aspect-[3/4] overflow-hidden rounded bg-slate-200">
                  <img src={LYCEE_IMAGES.direction[index]} alt={person.name} className="h-full w-full object-cover" />
                </div>
                <p className="mt-4 text-center font-sans text-sm font-bold uppercase tracking-wide text-slate-900">{person.name}</p>
                <p className="mt-1 text-center font-sans text-sm text-slate-600">{person.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
