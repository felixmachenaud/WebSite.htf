import Link from "next/link";
import { ACTUALITES } from "@/data/actualites";

const ARTICLE_DEFAULT =
  "group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md";

const ARTICLE_HOME =
  "group flex flex-col overflow-hidden rounded-lg border border-emerald-200/80 bg-emerald-50 shadow-sm transition-shadow hover:shadow-md";

type Props = {
  /** Cartes blanches (page Actualités) ou vert clair (accueil) */
  variant?: "default" | "home";
  className?: string;
};

export function ActualitesGrid({ variant = "default", className = "" }: Props) {
  const articleClass = variant === "home" ? ARTICLE_HOME : ARTICLE_DEFAULT;
  return (
    <div className={`grid gap-8 md:grid-cols-3 ${className}`.trim()}>
      {ACTUALITES.map((actu) => (
        <article key={actu.id} className={articleClass}>
          <div className="aspect-video w-full overflow-hidden bg-slate-200">
            <img src={actu.imageUrl} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="relative flex flex-1 flex-col p-6">
            <h2 className="font-serif text-lg font-bold text-slate-900">{actu.titre}</h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-4">
              {actu.excerpt}
            </p>
            <Link
              href={`/nouvelles/${actu.slug}`}
              className="mt-4 flex h-10 w-10 items-center justify-center self-end rounded-full border-2 border-slate-800 text-slate-800 transition-colors hover:border-black hover:bg-black hover:text-white"
              aria-label={`Lire ${actu.titre}`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
