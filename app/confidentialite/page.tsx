import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getContent } from "@/lib/content-store";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Collège Lycée Hautefeuille",
  description: "Finalités, destinataires et droits relatifs aux données du site Hautefeuille.",
};

export default async function ConfidentialitePage() {
  const { chrome } = await getContent();
  return (
    <>
      <Navbar chrome={chrome} />
      <main className="min-h-screen bg-page safe-navbar-pt">
        <article className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="font-serif text-3xl font-bold text-slate-900 md:text-4xl">
            Politique de confidentialité
          </h1>
          <p className="mt-4 text-sm text-slate-500">
            Dernière mise à jour : 30 septembre 2026. Texte à relire par l&apos;établissement avant
            la mise en production.
          </p>

          <h2 className="mt-10 font-serif text-xl font-semibold text-slate-900">Responsable</h2>
          <p className="mt-3 leading-relaxed text-slate-700">
            Le Collège Lycée Hautefeuille, 5 Rue Armand Silvestre, 92400 Courbevoie, et 26 rue
            Pierre Joigneaux, 92270 Bois-Colombes. Contact : hautefeuille92@gmail.com. La forme
            juridique exacte est à confirmer (voir les mentions légales).
          </p>

          <h2 className="mt-10 font-serif text-xl font-semibold text-slate-900">
            Données concernées
          </h2>
          <p className="mt-3 leading-relaxed text-slate-700">
            Le site ne crée pas de compte visiteur et ne collecte pas de formulaire. Il affiche des
            coordonnées, des textes institutionnels et, le cas échéant, des portraits de membres de
            la direction fournis par l&apos;établissement. Les illustrations de sorties d&apos;élèves
            ne sont pas publiées tant qu&apos;une autorisation écrite n&apos;est pas au dossier.
          </p>
          <p className="mt-3 leading-relaxed text-slate-700">
            Si vous écrivez à l&apos;adresse de contact ou prenez rendez-vous, le message peut
            contenir des informations sur un élève mineur (niveau, situation familiale, motif du
            rendez-vous). Ces informations sont alors traitées pour répondre à votre demande.
          </p>

          <h2 className="mt-10 font-serif text-xl font-semibold text-slate-900">
            Finalités et bases légales
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-slate-700">
            <li>Information des familles sur l&apos;établissement : intérêt légitime.</li>
            <li>
              Réponse aux demandes de contact et prise de rendez-vous : mesures précontractuelles
              et intérêt légitime.
            </li>
            <li>
              Publication des portraits de la direction : intérêt légitime d&apos;information
              institutionnelle, sous réserve de l&apos;accord des personnes concernées.
            </li>
          </ul>
          <p className="mt-3 leading-relaxed text-slate-700">
            La lettre d&apos;information n&apos;est pas encore ouverte : aucun prénom ni courriel
            n&apos;est recueilli à ce titre.
          </p>

          <h2 className="mt-10 font-serif text-xl font-semibold text-slate-900">
            Destinataires et sous-traitants
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-slate-700">
            <li>
              Messagerie : les courriels envoyés à hautefeuille92@gmail.com sont traités par Google.
              Une adresse sur le domaine de l&apos;établissement est à confirmer.
            </li>
            <li>
              Google Maps : la carte n&apos;est chargée qu&apos;après un clic sur « Afficher la carte ».
              Google peut alors recevoir votre adresse IP.
            </li>
            <li>
              Calendly : le bouton de rendez-vous ouvre https://calendly.com/hautefeuille dans un
              nouvel onglet. Ce compte reste à confirmer par l&apos;établissement. Calendly traite
              alors les données saisies sur son propre site.
            </li>
            <li>
              Hébergeur du site : Vercel Inc. (à confirmer à la mise en ligne). Les polices sont
              embarquées au moment de la construction du site et ne sont pas chargées depuis Google
              Fonts à la visite.
            </li>
          </ul>
          <p className="mt-3 leading-relaxed text-slate-700">
            Aucun outil de mesure d&apos;audience n&apos;est déposé par le site.
          </p>

          <h2 className="mt-10 font-serif text-xl font-semibold text-slate-900">
            Durées de conservation
          </h2>
          <p className="mt-3 leading-relaxed text-slate-700">
            Les échanges par courriel et les rendez-vous sont conservés le temps de traiter la
            demande, puis selon les obligations de l&apos;établissement. Les textes et photos
            publiés restent en ligne jusqu&apos;à leur retrait. La durée exacte applicable aux
            dossiers familles est à confirmer par l&apos;établissement.
          </p>

          <h2 className="mt-10 font-serif text-xl font-semibold text-slate-900">Mineurs</h2>
          <p className="mt-3 leading-relaxed text-slate-700">
            Le site s&apos;adresse aux familles. Il ne propose pas d&apos;espace élève. Les photos
            de groupes d&apos;élèves ne sont pas mises en ligne sans autorisation. Un parent peut
            demander le retrait d&apos;une information concernant son enfant à l&apos;adresse de
            contact.
          </p>

          <h2 className="mt-10 font-serif text-xl font-semibold text-slate-900">Vos droits</h2>
          <p className="mt-3 leading-relaxed text-slate-700">
            Vous pouvez demander l&apos;accès, la rectification, l&apos;effacement, la limitation ou
            l&apos;opposition au traitement, et saisir la CNIL (cnil.fr). Adressez votre demande à
            hautefeuille92@gmail.com en précisant l&apos;objet. Une réponse nominative du délégué
            ou du contact RGPD de l&apos;établissement reste à confirmer.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
