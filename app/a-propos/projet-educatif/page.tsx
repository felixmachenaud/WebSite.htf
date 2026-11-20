import type { Metadata } from "next";
import { Fragment } from "react";
import { PageHeader } from "@/components/PageHeader";
import { getContent } from "@/lib/content-store";
import { ContentSection } from "@/components/ContentPage";
import { CONTENT_PAGES } from "@/data/pages";

const IMAGES = [
  "/images/photos/htf-0057487.jpg",
  "/images/photos/htf-0057786.jpg",
  "/images/photos/htf-0057883.jpg",
];

// Détail de chaque valeur (maquette), affiché sous son bloc ; même ordre que projet.sections.
const VALUES = [
  ["excellence", CONTENT_PAGES.excellence],
  ["ouverture", CONTENT_PAGES.ouverture],
  ["sens", CONTENT_PAGES.sens],
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const { projet } = await getContent();
  return { title: projet.metaTitle, description: projet.metaDescription };
}

export default async function ProjetEducatifPage() {
  const { projet } = await getContent();
  const quote = projet.quote;
  const initial = quote.charAt(0);
  const rest = quote.slice(1);
  return (
    <main className="min-h-screen bg-page safe-navbar-pt">
      <PageHeader
        title={projet.title}
        imageUrl="/images/photos/htf-0057772.jpg"
      />
      <section
        className="px-6 py-16 md:px-12"
        style={{ backgroundColor: "var(--page-bg)" }}
        aria-label={projet.title}
      >
        <p className="mx-auto max-w-2xl font-serif text-lg font-bold italic leading-relaxed text-slate-800 md:text-xl md:whitespace-nowrap">
          <span className="quote-lettrine">
            <span className="quote-lettrine-char">{initial}</span>
          </span>
          {rest}
        </p>
      </section>
      <div className="py-0">
        {projet.sections.map((section, i) => (
          <Fragment key={section.title}>
            <section
              id={VALUES[i]?.[0]}
              className={`grid scroll-mt-20 items-center gap-8 md:grid-cols-2 md:gap-12 ${i % 2 === 0 ? "bg-slate-100" : "bg-slate-200/80"}`}
            >
              <div className={i % 2 === 0 ? "order-2 md:order-1" : "order-2"}>
                <img
                  src={IMAGES[i]}
                  alt=""
                  className="h-[320px] w-full object-cover md:h-[400px]"
                />
              </div>
              <div
                className={`px-6 py-12 md:px-12 ${i % 2 === 0 ? "order-1 md:order-2" : ""}`}
              >
                <h2 className="font-serif text-2xl font-bold uppercase tracking-wider text-slate-900">
                  {section.title}
                </h2>
                <p className="mt-6 font-sans text-base leading-relaxed text-slate-700">
                  {section.text}
                </p>
              </div>
            </section>
            {VALUES[i] ? (
              <div className="mx-auto max-w-5xl px-6 pb-16">
                <ContentSection page={VALUES[i][1]} heading={false} intro={false} />
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>
    </main>
  );
}
