import { ScrollHijackLanding } from "@/components/ScrollHijackLanding";
import { Footer } from "@/components/Footer";
import { ActualitesGrid } from "@/components/ActualitesGrid";
import { getContent } from "@/lib/content-store";

export default async function HomePage() {
  const content = await getContent();
  return (
    <>
      <ScrollHijackLanding overlays={content.landing.overlays} chrome={content.chrome} />
      <div className="relative z-[600] mt-[100svh] flex min-h-screen flex-col bg-page">
        <section className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16 pt-20 md:px-8 md:pb-24 md:pt-28">
          <h1 className="mb-12 text-center font-serif text-3xl font-bold tracking-tight text-slate-900 md:mb-16 md:text-4xl">
            {content.home.welcomeTitle}
          </h1>
          <ActualitesGrid
            items={content.actualites}
            readPrefix={content.actualitesPage.readPrefix}
            variant="home"
          />
        </section>
        <Footer />
      </div>
    </>
  );
}
