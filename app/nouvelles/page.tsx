import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { ActualitesGrid } from "@/components/ActualitesGrid";

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
          <ActualitesGrid />
        </div>
      </main>
      <Footer />
    </>
  );
}
