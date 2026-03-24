import { PageHeader } from "@/components/PageHeader";
import Link from "next/link";
import { SafeSectionImage } from "@/components/SafeSectionImage";
import { AdresseCards } from "@/components/AdresseCards";

export const metadata = {
  title: "Informations générales | Collège Lycée Hautefeuille",
  description: "Informations pratiques : transport, uniforme, calendrier, etc.",
};

const GREEN = "#14532d";

// Installations et Matériel scolaire permutés dans l'index
const INDEX_ITEMS = [
  { id: "transport", label: "Transport" },
  { id: "uniforme", label: "Uniforme" },
  { id: "installations", label: "Installations" },
  { id: "materiel-scolaire", label: "Matériel scolaire" },
  { id: "menu-scolaire", label: "Menu scolaire" },
  { id: "services", label: "Services" },
  { id: "calendrier", label: "Calendrier" },
  { id: "extrascolaire", label: "Extrascolaire" },
] as const;

const SECTION_COPY: Record<
  (typeof INDEX_ITEMS)[number]["id"],
  { title: string; body: string; imageSrc?: string; images?: { src: string; label: string }[] }
> = {
  transport: {
    title: "Transport",
    body: "Le collège et le lycée sont à 5 minutes à pied de l'arrêt Bécon les Bruyères sur la ligne L. De plus, chaque établissement propose des espaces pour ranger les vélos et les trotinettes.",
    imageSrc: undefined,
  },
  uniforme: {
    title: "Uniforme",
    body: "Au collège, il se compose d'un pull vert au blason de l'école, d'une chemise blanche, d'un pantalon noir et d'une paire de chaussures de ville. Il n'y a pas d'uniforme pour le lycée, il est néanmoins exigé une chemise, un pantalon de toile ainsi qu'une paire de chaussures de ville.",
    imageSrc: "/images/informations-generales/collage-2.jpg",
  },
  installations: {
    title: "Installations",
    body: "Présentation des locaux, salles spécialisées et espaces dédiés à la vie scolaire.",
    images: [
      { src: "/images/informations-generales/collage3-1.jpg", label: "Le Collège" },
      { src: "/images/informations-generales/collage3.2.jpg", label: "Le terrain de sport" },
      { src: "/images/informations-generales/collage-3.3.jpg", label: "Le Lycée" },
    ],
  },
  "materiel-scolaire": {
    title: "Matériel scolaire",
    body: "Listes de fournitures par niveau et recommandations pour bien équiper votre enfant tout au long de l'année.",
    imageSrc: "/images/informations-generales/materiel-scolaire.jpg",
  },
  "menu-scolaire": {
    title: "Menu scolaire",
    body: "Menus de la cantine, équilibre alimentaire et informations sur les inscriptions.",
    imageSrc: "/images/informations-generales/menu-scolaire.jpg",
  },
  services: {
    title: "Services",
    body: "Services proposés aux familles et aux élèves au sein de l'établissement.",
    imageSrc: "/images/informations-generales/services.jpg",
  },
  calendrier: {
    title: "Calendrier",
    body: "Vacances scolaires, jours fériés et dates importantes de l'année scolaire.",
    imageSrc: "/images/informations-generales/calendrier.jpg",
  },
  extrascolaire: {
    title: "Extrascolaire",
    body: "Activités proposées en dehors des cours : sport, culture et projets collectifs.",
    imageSrc: "/images/informations-generales/extrascolaire.jpg",
  },
};

function InstallationsPhotos({
  images,
}: {
  images: { src: string; label: string }[];
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {images.map((img) => (
        <div key={img.src} className="flex flex-col">
          <div className="aspect-[4/3] w-full overflow-hidden rounded bg-slate-200">
            <img
              src={img.src}
              alt={img.label}
              className="h-full w-full object-cover"
            />
          </div>
          <p className="mt-3 text-center font-sans text-sm font-semibold text-slate-800">
            {img.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function InformationGeneralePage() {
  return (
    <main className="min-h-screen bg-page safe-navbar-pt">
      <PageHeader
        title="Informations générales"
        imageUrl="/images/informations-generales-header.jpg"
      />

      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-center font-sans text-2xl font-bold uppercase tracking-wide text-slate-900 md:text-3xl">
          Bienvenue à l&apos;année scolaire 2025 / 2026
        </h1>
        <p
          className="mt-4 text-center font-sans text-sm font-semibold uppercase tracking-wider md:text-base"
          style={{ color: GREEN }}
        >
          Informations générales
        </p>

        {/* INDEX — grille 4×2, barres horizontales */}
        <section className="mt-14" aria-label="Index">
          <h2
            className="font-sans text-lg font-bold uppercase tracking-wider md:text-xl"
            style={{ color: GREEN }}
          >
            Index
          </h2>
          <div className="mt-4 h-px w-full" style={{ backgroundColor: GREEN }} />
          <div className="grid grid-cols-2 gap-3 py-6 md:grid-cols-4 md:gap-4">
            {INDEX_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                scroll={true}
                className="flex min-h-[52px] items-center justify-center border-2 px-3 py-3 text-center font-sans text-sm font-medium transition-opacity hover:opacity-80 md:text-base"
                style={{ borderColor: GREEN, color: GREEN }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="h-px w-full" style={{ backgroundColor: GREEN }} />
        </section>

        {/* Sections détaillées avec barres horizontales entre chaque */}
        <div className="mt-8">
          {INDEX_ITEMS.map((item, index) => {
            const copy = SECTION_COPY[item.id];
            const imageLeft = index % 2 === 0;
            const isLast = index === INDEX_ITEMS.length - 1;

            let sectionContent: React.ReactNode;

            // Transport : texte + cartes Collège / Lycée (identique landing)
            if (item.id === "transport") {
              sectionContent = (
                <section id={item.id} className="scroll-mt-24 py-8">
                  <h2 className="font-sans text-xl font-bold uppercase tracking-wide text-slate-900 md:text-2xl">
                    {copy.title}
                  </h2>
                  <p className="mt-4 font-sans text-base leading-relaxed text-slate-700 md:text-lg">
                    {copy.body}
                  </p>
                  <div className="mt-8">
                    <AdresseCards />
                  </div>
                </section>
              );
            } else if (item.id === "installations" && copy.images) {
              sectionContent = (
                <section id={item.id} className="scroll-mt-24 py-8">
                  <h2 className="font-sans text-xl font-bold uppercase tracking-wide text-slate-900 md:text-2xl">
                    {copy.title}
                  </h2>
                  <p className="mt-4 font-sans text-base leading-relaxed text-slate-700 md:text-lg">
                    {copy.body}
                  </p>
                  <div className="mt-8">
                    <InstallationsPhotos images={copy.images} />
                  </div>
                </section>
              );
            } else {
              sectionContent = (
                <section id={item.id} className="scroll-mt-24 py-8">
                  <h2 className="font-sans text-xl font-bold uppercase tracking-wide text-slate-900 md:text-2xl">
                    {copy.title}
                  </h2>
                  <div className="mt-8 grid items-center gap-8 md:grid-cols-2 md:gap-12">
                    {imageLeft ? (
                      <>
                        <SafeSectionImage src={copy.imageSrc} alt={copy.title} />
                        <p className="font-sans text-base leading-relaxed text-slate-700 md:text-lg">
                          {copy.body}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="order-2 font-sans text-base leading-relaxed text-slate-700 md:order-1 md:text-lg">
                          {copy.body}
                        </p>
                        <div className="order-1 md:order-2">
                          <SafeSectionImage src={copy.imageSrc} alt={copy.title} />
                        </div>
                      </>
                    )}
                  </div>
                </section>
              );
            }

            return (
              <div key={item.id}>
                {sectionContent}
                {!isLast && (
                  <div className="py-12">
                    <div className="h-px w-full" style={{ backgroundColor: GREEN }} aria-hidden />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
