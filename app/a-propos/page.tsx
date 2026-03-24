import { PageHeader } from "@/components/PageHeader";

export const metadata = {
  title: "À propos | Collège Lycée Hautefeuille",
  description: "Viser l'excellence académique, s'ouvrir au monde et aux autres, donner du sens à sa vie.",
};

export default function AProposPage() {
  return (
    <main className="min-h-screen bg-page safe-navbar-pt">
      <PageHeader
        title="À propos"
        imageUrl="https://picsum.photos/1920/600?random=about"
      />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-center font-serif text-2xl leading-relaxed text-slate-800 md:text-3xl">
          Viser l&apos;excellence académique, s&apos;ouvrir au monde et aux autres, donner du sens à sa vie.
        </p>
      </div>
    </main>
  );
}
