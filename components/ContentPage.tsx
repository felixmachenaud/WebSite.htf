import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import type { ContentPageData } from "@/data/pages";

const GREEN = "#14532d";

type SmartLinkProps = { href: string; className: string; style?: React.CSSProperties; children: React.ReactNode };

function SmartLink({ href, className, style, children }: SmartLinkProps) {
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} style={style}>
      {children}
    </Link>
  );
}

export function contentPageMetadata(page: ContentPageData): Metadata {
  return { title: `${page.title} | Collège Lycée Hautefeuille`, description: page.intro };
}

/** Gabarit des pages issues de la maquette `références/` : bandeau photo, intro, cartes, encadré, étape suivante. */
export function ContentPage({ page }: { page: ContentPageData }) {
  const cols = page.cards.length % 3 === 0 ? "md:grid-cols-3" : "md:grid-cols-2";
  return (
    <main className="min-h-screen bg-page safe-navbar-pt">
      <PageHeader title={page.title} imageUrl={page.image} imageAlt={page.imageAlt} />
      <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
        <nav aria-label="Fil d'Ariane" className="font-sans text-sm text-slate-500">
          <ol className="flex flex-wrap gap-1">
            {[{ label: "Accueil", href: "/" }, ...page.breadcrumb].map((crumb) => (
              <li key={crumb.href} className="after:ml-1 after:content-['›'] last:after:content-none">
                <Link href={crumb.href} className="hover:text-slate-800">
                  {crumb.label}
                </Link>
              </li>
            ))}
            <li aria-current="page" className="text-slate-800">
              {page.title}
            </li>
          </ol>
        </nav>

        <p className="mt-8 max-w-3xl font-sans text-lg leading-relaxed text-slate-800">{page.intro}</p>

        <section className={`mt-10 grid gap-6 ${cols}`}>
          {page.cards.map((card) => (
            <article key={card.title} className="flex flex-col rounded-xl bg-slate-100 p-6">
              <h2 className="font-sans text-lg font-semibold" style={{ color: GREEN }}>
                {card.title}
              </h2>
              <p className="mt-3 flex-1 font-sans text-[0.95rem] leading-relaxed text-slate-700">{card.text}</p>
              {card.link ? (
                <SmartLink
                  href={card.link.href}
                  className="mt-4 font-sans text-sm font-semibold underline-offset-4 hover:underline"
                  style={{ color: GREEN }}
                >
                  {card.link.label} →
                </SmartLink>
              ) : null}
            </article>
          ))}
        </section>

        {page.stats ? (
          <section className="mt-10 rounded-xl px-6 py-8 text-white" style={{ backgroundColor: GREEN }}>
            <h2 className="font-sans text-xl font-semibold">{page.stats.title}</h2>
            <dl className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
              {page.stats.items.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse">
                  <dt className="mt-2 font-sans text-sm text-white/85">{stat.label}</dt>
                  <dd className="font-sans text-3xl font-bold">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {page.band ? (
          <section className="mt-10 rounded-xl border border-slate-200 bg-white px-6 py-8">
            <h2 className="font-serif text-xl font-bold text-slate-900">{page.band.title}</h2>
            <p className="mt-3 font-sans leading-relaxed text-slate-700">{page.band.text}</p>
            {page.band.link ? (
              <SmartLink
                href={page.band.link.href}
                className="mt-5 inline-block rounded-full border px-5 py-2 font-sans text-sm font-semibold transition-colors hover:bg-slate-50"
                style={{ color: GREEN, borderColor: GREEN }}
              >
                {page.band.link.label}
              </SmartLink>
            ) : null}
          </section>
        ) : null}

        <div className="mt-14 flex justify-center">
          <SmartLink
            href={page.next.href}
            className="rounded-full px-7 py-3 font-sans text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: GREEN }}
          >
            {page.next.label} →
          </SmartLink>
        </div>
      </div>
    </main>
  );
}
