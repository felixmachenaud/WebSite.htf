import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import Link from "next/link";
import { SafeSectionImage } from "@/components/SafeSectionImage";
import { AdresseCards } from "@/components/AdresseCards";
import { getContent } from "@/lib/content-store";
import type { InfoSection } from "@/lib/site-content";

const GREEN = "#14532d";
const HEADER = "/images/informations-generales-header.jpg";
const UNIFORM_IMAGE = "/images/informations-generales/collage-2.jpg";
const INSTALLATION_IMAGES = [
  "/images/informations-generales/collage3-1.jpg",
  "/images/informations-generales/collage3.2.jpg",
  "/images/informations-generales/collage-3.3.jpg",
];

export async function generateMetadata(): Promise<Metadata> {
  const { infos } = await getContent();
  return { title: infos.metaTitle, description: infos.metaDescription };
}

function InstallationsPhotos({
  images,
  captions,
}: {
  images: string[];
  captions: string[];
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {images.map((src, index) => (
        <div key={src} className="flex flex-col">
          <div className="aspect-[4/3] w-full overflow-hidden rounded bg-slate-200">
            <img src={src} alt={captions[index] ?? ""} className="h-full w-full object-cover" />
          </div>
          <p className="mt-3 text-center font-sans text-sm font-semibold text-slate-800">{captions[index]}</p>
        </div>
      ))}
    </div>
  );
}

export default async function InformationGeneralePage() {
  const { infos } = await getContent();
  return (
    <main className="min-h-screen bg-page safe-navbar-pt">
      <PageHeader title={infos.title} imageUrl={HEADER} />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-center font-sans text-2xl font-bold uppercase tracking-wide text-slate-900 md:text-3xl">
          {infos.welcome}
        </p>
        <p
          className="mt-4 text-center font-sans text-sm font-semibold uppercase tracking-wider md:text-base"
          style={{ color: GREEN }}
        >
          {infos.kicker}
        </p>

        <section className="mt-14" aria-label={infos.indexTitle}>
          <h2 className="font-sans text-lg font-bold uppercase tracking-wider md:text-xl" style={{ color: GREEN }}>
            {infos.indexTitle}
          </h2>
          <div className="mt-4 h-px w-full" style={{ backgroundColor: GREEN }} />
          <div className="grid grid-cols-2 gap-3 py-6 md:grid-cols-4 md:gap-4">
            {infos.sections.map((item) => (
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

        <div className="mt-8">
          {infos.sections.map((item, index) => (
            <SectionBlock key={item.id} item={item} index={index} total={infos.sections.length} infos={infos} />
          ))}
        </div>
      </div>
    </main>
  );
}

function SectionBlock({
  item,
  index,
  total,
  infos,
}: {
  item: InfoSection;
  index: number;
  total: number;
  infos: Awaited<ReturnType<typeof getContent>>["infos"];
}) {
  const imageLeft = index % 2 === 0;
  let sectionContent: React.ReactNode;

  if (item.id === "transport") {
    sectionContent = (
      <section id={item.id} className="scroll-mt-24 py-8">
        <h2 className="font-sans text-xl font-bold uppercase tracking-wide text-slate-900 md:text-2xl">{item.title}</h2>
        <p className="mt-4 font-sans text-base leading-relaxed text-slate-700 md:text-lg">{item.body}</p>
        <div className="mt-8">
          <AdresseCards
            mapButton={infos.mapButton}
            collegeTitle={infos.collegeCardTitle}
            lyceeTitle={infos.lyceeCardTitle}
            collegeAddress={infos.collegeAddress}
            lyceeAddress={infos.lyceeAddress}
          />
        </div>
      </section>
    );
  } else if (item.id === "installations") {
    sectionContent = (
      <section id={item.id} className="scroll-mt-24 py-8">
        <h2 className="font-sans text-xl font-bold uppercase tracking-wide text-slate-900 md:text-2xl">{item.title}</h2>
        <p className="mt-4 font-sans text-base leading-relaxed text-slate-700 md:text-lg">{item.body}</p>
        <div className="mt-8">
          <InstallationsPhotos images={INSTALLATION_IMAGES} captions={infos.installationCaptions} />
        </div>
      </section>
    );
  } else if (item.id === "uniforme") {
    sectionContent = (
      <section id={item.id} className="scroll-mt-24 py-8">
        <h2 className="font-sans text-xl font-bold uppercase tracking-wide text-slate-900 md:text-2xl">{item.title}</h2>
        <div className="mt-8 grid items-center gap-8 md:grid-cols-2 md:gap-12">
          {imageLeft ? (
            <>
              <SafeSectionImage src={UNIFORM_IMAGE} alt={item.title} />
              <p className="font-sans text-base leading-relaxed text-slate-700 md:text-lg">{item.body}</p>
            </>
          ) : (
            <>
              <p className="order-2 font-sans text-base leading-relaxed text-slate-700 md:order-1 md:text-lg">{item.body}</p>
              <div className="order-1 md:order-2">
                <SafeSectionImage src={UNIFORM_IMAGE} alt={item.title} />
              </div>
            </>
          )}
        </div>
      </section>
    );
  } else {
    sectionContent = (
      <section id={item.id} className="scroll-mt-24 py-8">
        <h2 className="font-sans text-xl font-bold uppercase tracking-wide text-slate-900 md:text-2xl">{item.title}</h2>
        <p className="mt-4 font-sans text-base leading-relaxed text-slate-700 md:text-lg">{item.body}</p>
      </section>
    );
  }

  return (
    <div>
      {sectionContent}
      {index < total - 1 ? (
        <div className="py-12">
          <div className="h-px w-full" style={{ backgroundColor: GREEN }} aria-hidden />
        </div>
      ) : null}
    </div>
  );
}
