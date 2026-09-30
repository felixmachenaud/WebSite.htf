import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { getContent } from "@/lib/content-store";

export async function generateMetadata(): Promise<Metadata> {
  const { about } = await getContent();
  return { title: about.metaTitle, description: about.metaDescription };
}

export default async function AProposPage() {
  const { about } = await getContent();
  return (
    <main className="min-h-screen bg-page safe-navbar-pt">
      <PageHeader title={about.title} imageUrl="/images/college/header.jpg" />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-center font-serif text-2xl leading-relaxed text-slate-800 md:text-3xl">
          {about.quote}
        </p>
      </div>
    </main>
  );
}
