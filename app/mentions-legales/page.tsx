import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getContent } from "@/lib/content-store";

export const metadata: Metadata = {
  title: "Mentions légales | Collège Lycée Hautefeuille",
  description: "Éditeur, responsable de publication et hébergeur du site du Collège Lycée Hautefeuille.",
};

export default async function MentionsLegalesPage() {
  const { chrome } = await getContent();
  return (
    <>
      <Navbar chrome={chrome} />
      <main className="min-h-screen bg-page safe-navbar-pt">
        <article className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="font-serif text-3xl font-bold text-slate-900 md:text-4xl">
            Mentions légales
          </h1>
          <p className="mt-4 text-sm text-slate-500">
            Dernière mise à jour : 30 septembre 2026. Les éléments marqués « à confirmer »
            doivent être relus par l&apos;établissement avant la mise en production.
          </p>

          <h2 className="mt-10 font-serif text-xl font-semibold text-slate-900">Éditeur</h2>
          <p className="mt-3 leading-relaxed text-slate-700">
            Collège Lycée Hautefeuille
            <br />
            5 Rue Armand Silvestre, 92400 Courbevoie, France
            <br />
            26 rue Pierre Joigneaux, 92270 Bois-Colombes, France
            <br />
            Téléphone : 01 43 33 24 02
            <br />
            Courriel : hautefeuille92@gmail.com
          </p>
          <p className="mt-3 leading-relaxed text-slate-700">
            Forme juridique, raison sociale et numéro SIRET : à confirmer par l&apos;établissement.
          </p>

          <h2 className="mt-10 font-serif text-xl font-semibold text-slate-900">
            Responsable de la publication
          </h2>
          <p className="mt-3 leading-relaxed text-slate-700">
            La direction du Collège Lycée Hautefeuille. Identité nominative : à confirmer par
            l&apos;établissement.
          </p>

          <h2 className="mt-10 font-serif text-xl font-semibold text-slate-900">Hébergeur</h2>
          <p className="mt-3 leading-relaxed text-slate-700">
            Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. Cet hébergeur
            correspond à la cible de déploiement du site et reste à confirmer au moment de la mise
            en ligne.
          </p>

          <h2 className="mt-10 font-serif text-xl font-semibold text-slate-900">Contact</h2>
          <p className="mt-3 leading-relaxed text-slate-700">
            Pour toute question relative au site : hautefeuille92@gmail.com ou 01 43 33 24 02.
            Le traitement des données personnelles est décrit dans la politique de confidentialité.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
