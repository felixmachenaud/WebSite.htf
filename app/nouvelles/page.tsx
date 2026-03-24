import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { ACTUALITES } from "@/data/actualites";
import Link from "next/link";

export const metadata = {
  title: "Actualités | Collège Lycée Hautefeuille",
  description: "Les dernières actualités du Collège Lycée Hautefeuille.",
};

const HEADER_IMAGE = "/images/nouvelles/header.png";

export default function NouvellesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-page safe-navbar-pt">
        <PageHeader title="Actualités" imageUrl={HEADER_IMAGE} />
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-3">
            {ACTUALITES.map((actu) => (
              <article
                key={actu.id}
                className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Espace photo */}
                <div className="aspect-video w-full overflow-hidden bg-slate-200">
                  <img
                    src={actu.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Contenu */}
                <div className="relative flex flex-1 flex-col p-6">
                  <h2 className="font-serif text-lg font-bold text-slate-900">
                    {actu.titre}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-4">
                    {actu.excerpt}
                  </p>
                  {/* Bouton rond flèche */}
                  <Link
                    href={`/nouvelles/${actu.slug}`}
                    className="mt-4 flex h-10 w-10 items-center justify-center self-end rounded-full border-2 border-slate-800 text-slate-800 transition-colors hover:bg-black hover:border-black hover:text-white"
                    aria-label={`Lire ${actu.titre}`}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
