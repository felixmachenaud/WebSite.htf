import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { InstitutionalParagraph } from "@/components/InstitutionalParagraph";
import { getContent } from "@/lib/content-store";

const COLLEGE_IMAGES = {
  header: "/images/college/header.jpg",
  collage: ["/images/college/collage-1.jpeg", "/images/college/collage-2.jpg", "/images/college/collage-3.JPG"],
  direction: ["/images/college/direction-1.jpg", "/images/college/direction-2.jpg", "/images/college/direction-3.jpg"],
};

export async function generateMetadata(): Promise<Metadata> {
  const { college } = await getContent();
  return { title: college.metaTitle, description: college.metaDescription };
}

export default async function CollegePage() {
  const { college } = await getContent();
  return (
    <main className="min-h-screen bg-page safe-navbar-pt">
      <PageHeader title={college.title} imageUrl={COLLEGE_IMAGES.header} />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <section className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          <div className="flex flex-col justify-center">
            <InstitutionalParagraph dropCap>{college.intro}</InstitutionalParagraph>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="row-span-2 flex items-stretch">
              <img src={COLLEGE_IMAGES.collage[0]} alt={college.collageAlt} className="h-full w-full object-cover" />
            </div>
            <div>
              <img src={COLLEGE_IMAGES.collage[1]} alt={college.collageAlt} className="h-full w-full object-cover" />
            </div>
            <div>
              <img src={COLLEGE_IMAGES.collage[2]} alt={college.collageAlt} className="h-full w-full object-cover" />
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-xl font-bold uppercase tracking-wider text-slate-900">{college.resultsTitle}</h2>
            <InstitutionalParagraph className="mt-4">{college.resultsBody}</InstitutionalParagraph>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold uppercase tracking-wider text-slate-900">{college.practicalTitle}</h2>
            <ul className="mt-4 space-y-2 font-sans text-slate-700">
              {college.stats.map((stat, index) => (
                <li key={stat}>
                  {index === 1 ? stat : <strong>{stat}</strong>}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-20">
          <h2 className="font-serif text-xl font-bold uppercase tracking-wider text-slate-900">{college.directionTitle}</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {college.direction.map((person, index) => (
              <div key={COLLEGE_IMAGES.direction[index]} className="flex flex-col">
                <div className="aspect-[3/4] overflow-hidden rounded bg-slate-200">
                  <img src={COLLEGE_IMAGES.direction[index]} alt={person.name} className="h-full w-full object-cover" />
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
