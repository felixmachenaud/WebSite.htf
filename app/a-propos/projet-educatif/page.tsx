import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { getContent } from "@/lib/content-store";

const IMAGES = [
  "/images/photos/htf-0057487.jpg",
  "/images/photos/htf-0057786.jpg",
  "/images/photos/htf-0057883.jpg",
];

const VALUE_PAGES = [
  "/a-propos/projet-educatif/viser-l-excellence",
  "/a-propos/projet-educatif/s-ouvrir-au-monde",
  "/a-propos/projet-educatif/donner-du-sens",
];

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
      <PageHeader title={projet.title} imageUrl="/images/photos/htf-0057772.jpg" />
      <section className="px-6 py-16 md:px-12" style={{ backgroundColor: "var(--page-bg)" }} aria-label={projet.title}>
        <p className="mx-auto max-w-2xl font-serif text-lg font-bold italic leading-relaxed text-slate-800 md:text-xl md:whitespace-nowrap">
          <span className="quote-lettrine"><span className="quote-lettrine-char">{initial}</span></span>
          {rest}
        </p>
      </section>
      <div className="py-0">
        {projet.sections.map((section, i) => (
          <section
            key={section.title}
            className={`grid items-center gap-8 md:grid-cols-2 md:gap-12 ${i % 2 === 0 ? "bg-slate-100" : "bg-slate-200/80"}`}
          >
            <div className={i % 2 === 0 ? "order-2 md:order-1" : "order-2"}>
              <img src={IMAGES[i]} alt="" className="h-[320px] w-full object-cover md:h-[400px]" />
            </div>
            <div className={`px-6 py-12 md:px-12 ${i % 2 === 0 ? "order-1 md:order-2" : ""}`}>
              <h2 className="font-serif text-2xl font-bold uppercase tracking-wider text-slate-900">{section.title}</h2>
              <p className="mt-6 font-sans text-base leading-relaxed text-slate-700">{section.text}</p>
              {VALUE_PAGES[i] ? (
                <Link
                  href={VALUE_PAGES[i]}
                  className="mt-6 inline-block font-sans text-sm font-semibold text-[#14532d] underline-offset-4 hover:underline"
                >
                  En savoir plus →
                </Link>
              ) : null}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
