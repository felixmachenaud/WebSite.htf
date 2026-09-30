import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content-store";

const IMAGES = {
  hero: "/images/college/header.jpg",
  fondation: "/images/histoire/collage-1.jpg?v=2",
  vieScolaire: "/images/college/collage-1.jpeg",
  activites: "/images/lycee/collage-1.jpg",
};

export async function generateMetadata(): Promise<Metadata> {
  const { histoire } = await getContent();
  return { title: histoire.metaTitle, description: histoire.metaDescription };
}

export default async function HistoirePage() {
  const { histoire } = await getContent();
  return (
    <main className="min-h-screen bg-page safe-navbar-pt">
      <section className="relative">
        <div className="relative flex min-h-[55vh] flex-col justify-end">
          <div className="absolute inset-0">
            <img src={IMAGES.hero} alt="" className="h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-slate-900/40" />
          </div>
          <div className="relative z-10 mx-auto max-w-4xl px-6 pb-16 pt-24 text-center">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl">
              {histoire.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-white/95 md:text-xl">{histoire.heroLead}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="font-serif text-xl leading-relaxed text-slate-700 md:text-2xl">
          <em>{histoire.accroche}</em>
        </p>
      </div>

      <section className="border-t border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-serif text-3xl font-bold text-slate-900 md:text-4xl">{histoire.convictionTitle}</h2>
          <div className="mt-12 grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="font-sans text-base leading-relaxed text-slate-700 md:text-lg">{histoire.convictionP1}</p>
              <p className="mt-6 font-sans text-base leading-relaxed text-slate-700 md:text-lg">{histoire.convictionP2}</p>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-slate-100">
              <img src={IMAGES.fondation} alt={histoire.convictionAlt} className="h-full w-full object-cover object-center" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-[#faf9f7] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-serif text-3xl font-bold text-slate-900 md:text-4xl">{histoire.fondementsTitle}</h2>
          <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-slate-600 md:text-lg">{histoire.fondementsLead}</p>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {histoire.fondements.map((item) => (
              <div key={item.titre} className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-serif text-lg font-semibold text-slate-900">{item.titre}</h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-slate-600">{item.phrase}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-slate-100">
              <img src={IMAGES.vieScolaire} alt={histoire.photoAlt1} className="h-full w-full object-cover object-center" />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-slate-100">
              <img src={IMAGES.activites} alt={histoire.photoAlt2} className="h-full w-full object-cover object-center" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-[#faf9f7] py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-slate-900 md:text-4xl">{histoire.blasonTitle}</h2>
          <div className="mt-12 flex flex-col items-center gap-12 md:flex-row md:items-start md:gap-16">
            <div className="flex-shrink-0">
              <img src="/images/logo.png" alt={histoire.blasonAlt} className="h-32 w-32 object-contain md:h-40 md:w-40" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-sans text-base leading-relaxed text-slate-700 md:text-lg">
                {histoire.blasonBefore}
                <strong>{histoire.blasonParents}</strong>
                {histoire.blasonMid1}
                <strong>{histoire.blasonTeachers}</strong>
                {histoire.blasonMid2}
                <strong>{histoire.blasonStudents}</strong>
                {histoire.blasonAfter}
              </p>
              <p className="mt-6 font-sans text-base leading-relaxed text-slate-700 md:text-lg">{histoire.blasonP2}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-serif text-2xl font-bold text-slate-900 md:text-3xl">{histoire.conclusionTitle}</h2>
          <p className="mt-8 font-sans text-base leading-relaxed text-slate-700 md:text-lg">{histoire.conclusionBody}</p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/a-propos/projet-educatif" className="rounded-sm border-2 border-slate-800 bg-transparent px-8 py-3 font-sans text-sm font-medium text-slate-800 transition-colors hover:bg-slate-800 hover:text-white">
              {histoire.ctaProjet}
            </Link>
            <Link href="/a-propos/information-generale" className="rounded-sm border-2 border-slate-800 bg-transparent px-8 py-3 font-sans text-sm font-medium text-slate-800 transition-colors hover:bg-slate-800 hover:text-white">
              {histoire.ctaRencontrer}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
