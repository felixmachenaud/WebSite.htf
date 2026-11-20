import { Fragment } from "react";
import { ContentSection } from "@/components/ContentPage";
import { CONTENT_PAGES } from "@/data/pages";
import type { SiteContent } from "@/lib/site-content";

const IMAGES = [
  "/images/photos/htf-0057487.jpg",
  "/images/photos/htf-0057786.jpg",
  "/images/photos/htf-0057883.jpg",
];

// Même ordre que projet.sections. Ancre, étape du parcours d'accueil qui y renvoie, détail (maquette).
const VALUES = [
  { id: "excellence", step: "Se dépasser", line: "Essayer, recommencer, persévérer, et voir ses efforts porter du fruit.", page: CONTENT_PAGES.excellence },
  { id: "ouverture", step: "S’engager", line: "Prendre des responsabilités, et apprendre à servir les autres.", page: CONTENT_PAGES.ouverture },
  { id: "sens", step: "Prendre confiance", line: "Être encouragé, oser progresser, donner le meilleur de soi.", page: CONTENT_PAGES.sens },
];

/** Nos valeurs (CMS `projet`) dans la page Qui sommes-nous, avec les étapes du parcours d'accueil. */
export function ValeursSection({ projet }: { projet: SiteContent["projet"] }) {
  const initial = projet.quote.charAt(0);
  const rest = projet.quote.slice(1);
  return (
    <section id="valeurs" className="scroll-mt-20 border-t border-slate-200">
      <div className="px-6 py-16 text-center md:px-12">
        <h2 className="font-serif text-3xl font-bold text-slate-900 md:text-4xl">{projet.title}</h2>
        <p className="mx-auto mt-8 max-w-2xl font-serif text-lg font-bold italic leading-relaxed text-slate-800 md:text-xl">
          <span className="quote-lettrine">
            <span className="quote-lettrine-char">{initial}</span>
          </span>
          {rest}
        </p>
      </div>
      {projet.sections.map((section, i) => {
        const value = VALUES[i];
        return (
          <Fragment key={section.title}>
            <div
              id={value?.id}
              className={`grid scroll-mt-20 items-center gap-8 md:grid-cols-2 md:gap-12 ${i % 2 === 0 ? "bg-slate-100" : "bg-slate-200/80"}`}
            >
              <div className={i % 2 === 0 ? "order-2 md:order-1" : "order-2"}>
                <img src={IMAGES[i]} alt="" className="h-[320px] w-full object-cover md:h-[400px]" />
              </div>
              <div className={`px-6 py-12 md:px-12 ${i % 2 === 0 ? "order-1 md:order-2" : ""}`}>
                {value ? (
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#14532d]">{value.step}</p>
                ) : null}
                <h3 className="mt-2 font-serif text-2xl font-bold uppercase tracking-wider text-slate-900">{section.title}</h3>
                {value ? <p className="mt-4 font-serif text-lg italic text-slate-800">{value.line}</p> : null}
                <p className="mt-4 font-sans text-base leading-relaxed text-slate-700">{section.text}</p>
              </div>
            </div>
            {value ? (
              <div className="mx-auto max-w-5xl px-6 pb-16">
                <ContentSection page={value.page} heading={false} intro={false} />
              </div>
            ) : null}
          </Fragment>
        );
      })}
    </section>
  );
}
