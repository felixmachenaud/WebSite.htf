import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { ActualitesGrid } from "@/components/ActualitesGrid";
import { getContent } from "@/lib/content-store";

const HEADER_IMAGE = "/images/nouvelles/header.png";

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
        <div className="mx-auto max-w-6xl px-6 py-16">
          <ActualitesGrid items={content.actualites} readPrefix={content.actualitesPage.readPrefix} />
        </div>
      </main>
      <Footer />
    </>
  );
}
