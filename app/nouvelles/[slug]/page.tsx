import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { getContent } from "@/lib/content-store";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const { actualites } = await getContent();
  return actualites.filter((item) => item.slug).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { actualites } = await getContent();
  const actu = actualites.find((item) => item.slug === slug);
  if (!actu) return { title: "Actualité | Hautefeuille" };
  return {
    title: `${actu.titre} | Hautefeuille`,
    description: actu.excerpt.slice(0, 160),
  };
}

export default async function ActualitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getContent();
  const actu = content.actualites.find((item) => item.slug === slug);
  if (!actu) notFound();

  return (
    <>
      <Navbar chrome={content.chrome} />
      <main className="min-h-screen bg-page safe-navbar-pt">
        <PageHeader title={actu.titre} imageUrl={actu.imageUrl || undefined} />
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-lg leading-relaxed text-slate-700">{actu.excerpt}</p>
          <Link
            href="/nouvelles"
            className="mt-12 inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            ← {content.actualitesPage.backLabel}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
