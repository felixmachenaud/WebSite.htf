import { ScrollHijackLanding } from "@/components/ScrollHijackLanding";
import { Footer } from "@/components/Footer";
import { ActualitesGrid } from "@/components/ActualitesGrid";

export default function HomePage() {
  return (
    <>
      <ScrollHijackLanding />
      <div className="relative z-[600] mt-[100svh] flex min-h-screen flex-col bg-page">
        <section className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16 pt-20 md:px-8 md:pb-24 md:pt-28">
          <h2 className="mb-12 text-center font-serif text-3xl font-bold tracking-tight text-slate-900 md:mb-16 md:text-4xl">
            Bienvenue à Hautefeuille
          </h2>
          <ActualitesGrid variant="home" />
        </section>
        <Footer />
      </div>
    </>
  );
}
