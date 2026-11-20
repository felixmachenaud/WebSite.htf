import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { ActualitesGrid } from "@/components/ActualitesGrid";
import { getContent } from "@/lib/content-store";
import { ContentSection } from "@/components/ContentPage";
import { CONTENT_PAGES } from "@/data/pages";

const HEADER_IMAGE = "/images/photos/htf-0057688.jpg";

export async function generateMetadata(): Promise<Metadata> {
  const { actualitesPage } = await getContent();
  return { title: actualitesPage.metaTitle, description: actualitesPage.metaDescription };
}

export default async function NouvellesPage() {
  const content = await getContent();
  return (
    <>
      <Navbar chrome={content.chrome} />
      <main className="min-h-screen bg-page safe-navbar-pt">
        <PageHeader title={content.actualitesPage.title} imageUrl={HEADER_IMAGE} />
        <div className="mx-auto max-w-5xl px-6 pt-16">
          <ContentSection id="activites" page={CONTENT_PAGES.vie} heading={false} />
        </div>
        <div id="actualites" className="mx-auto max-w-6xl scroll-mt-28 px-6 py-16">
          <h2 className="mb-10 font-serif text-3xl font-bold text-slate-900 md:text-4xl">Actualités</h2>
          <ActualitesGrid items={content.actualites} readPrefix={content.actualitesPage.readPrefix} />
        </div>
      </main>
      <Footer />
    </>
  );
}
