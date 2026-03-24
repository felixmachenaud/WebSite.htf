import { PageHeader } from "@/components/PageHeader";

export const metadata = {
  title: "Notre projet éducatif | Collège Lycée Hautefeuille",
  description: "Le projet éducatif de Hautefeuille.",
};

// Images dans public/images/projet-educatif/
const SECTIONS = [
  {
    title: "Éducation globale",
    text: "Notre projet éducatif vise à former des jeunes dans toutes les dimensions de leur personne : intellectuelle, humaine, spirituelle et sociale. Nous accompagnons chaque élève pour qu'il développe ses talents et grandisse en confiance.",
    imageUrl: "/images/projet-educatif/collage-1.jpg",
    imageLeft: true,
  },
  {
    title: "Formation du caractère",
    text: "La formation du caractère est au cœur de notre pédagogie. Nous encourageons l'effort, la persévérance et le sens des responsabilités. Chaque élève apprend à se dépasser et à donner le meilleur de lui-même.",
    imageUrl: "/images/projet-educatif/collage-2.jpeg",
    imageLeft: false,
  },
  {
    title: "Ouverture au monde",
    text: "S'ouvrir au monde et aux autres est une priorité. Voyages, échanges, projets culturels et solidaires permettent aux élèves de développer leur curiosité et leur empathie.",
    imageUrl: "/images/projet-educatif/collage-3.jpeg",
    imageLeft: true,
  },
];

export default function ProjetEducatifPage() {
  return (
    <main className="min-h-screen bg-page safe-navbar-pt">
      <PageHeader
        title="Notre projet éducatif"
        imageUrl="/images/projet-educatif/header.jpg.webp"
      />
      {/* Citation : bande verte claire avec lettrine */}
      <section
        className="px-6 py-16 md:px-12"
        style={{ backgroundColor: "var(--page-bg)" }}
        aria-label="Citation"
      >
        <p className="mx-auto max-w-2xl font-serif text-lg font-bold italic leading-relaxed text-slate-800 md:text-xl md:whitespace-nowrap">
          <span className="quote-lettrine"><span className="quote-lettrine-char">L</span></span>&apos;éducation est l&apos;art de conduire les jeunes à la vérité. — Saint Jean Bosco
        </p>
      </section>
      <div className="py-0">
        {SECTIONS.map((section, i) => (
          <section
            key={i}
            className={`grid items-center gap-8 md:grid-cols-2 md:gap-12 ${
              i % 2 === 0 ? "bg-slate-100" : "bg-slate-200/80"
            }`}
          >
            <div className={section.imageLeft ? "order-2 md:order-1" : "order-2"}>
              <img
                src={section.imageUrl}
                alt=""
                className="h-[320px] w-full object-cover md:h-[400px]"
              />
            </div>
            <div className={`px-6 py-12 md:px-12 ${section.imageLeft ? "order-1 md:order-2" : ""}`}>
              <h2 className="font-serif text-2xl font-bold uppercase tracking-wider text-slate-900">
                {section.title}
              </h2>
              <p className="mt-6 font-sans text-base leading-relaxed text-slate-700">
                {section.text}
              </p>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
