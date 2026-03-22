import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { ACTUALITES } from "@/data/actualites";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return ACTUALITES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const actu = ACTUALITES.find((a) => a.slug === params.slug);
  if (!actu) return { title: "Actualité | HauteFeuille" };
  return {
    title: `${actu.titre} | HauteFeuille`,
    description: actu.excerpt.slice(0, 160),
  };
}

export default function ActualitePage({ params }: { params: { slug: string } }) {
  const actu = ACTUALITES.find((a) => a.slug === params.slug);
  if (!actu) notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-page safe-navbar-pt">
        <PageHeader title={actu.titre} imageUrl={actu.imageUrl} />
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">{actu.excerpt}</p>
            <p className="mt-4 text-sm text-slate-500">
              Page à enrichir via le CMS (texte et photos supplémentaires).
            </p>
          </div>
          <Link
            href="/nouvelles"
            className="mt-12 inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            ← Retour aux actualités
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
