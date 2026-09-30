"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/site-content";
import { LogoutButton } from "./LogoutButton";

const TABS = [
  ["accueil", "Accueil — textes du bandeau"],
  ["college", "Collège — page collège"],
  ["lycee", "Lycée — page lycée et résultats"],
  ["histoire", "Histoire — récit et fondements"],
  ["projet", "Projet — citation et trois blocs"],
  ["infos", "Infos pratiques — huit rubriques"],
  ["actualites", "Actualités — liste libre"],
  ["contact", "Contact — téléphone et rendez-vous"],
  ["footer", "Footer — bas de chaque page"],
] as const;

type TabId = (typeof TABS)[number][0];

function Field({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  const className = "mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm";
  return (
    <label className="block text-sm font-medium text-slate-800">
      {label}
      {rows ? (
        <textarea className={className} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className={className} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

export function Editor({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState(initial);
  const [tab, setTab] = useState<TabId>("accueil");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  function patch<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setContent((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    setPending(true);
    setMessage("");
    const response = await fetch("/api/admin/save", {
      method: "POST",
      headers: { "content-type": "application/json", "x-hautefeuille-admin": "1" },
      body: JSON.stringify(content),
    });
    setPending(false);
    setMessage(response.ok ? "Enregistré. Rechargez la page publique pour vérifier." : "Enregistrement refusé.");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl">Textes du site</h1>
        <LogoutButton />
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded px-3 py-1.5 text-sm ${tab === id ? "bg-slate-900 text-white" : "bg-white text-slate-700"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-6 space-y-4 rounded bg-white p-5 shadow-sm">
        {tab === "accueil" ? (
          <>
            <Field label="Titre sous le bandeau d'accueil" value={content.home.welcomeTitle} onChange={(welcomeTitle) => patch("home", { welcomeTitle })} />
            <Field label="Nom dans le menu" value={content.chrome.brand} onChange={(brand) => patch("chrome", { ...content.chrome, brand })} />
            <Field label="Libellé École directe" value={content.chrome.ecoleDirecte} onChange={(ecoleDirecte) => patch("chrome", { ...content.chrome, ecoleDirecte })} />
            <Field label="Libellé Contact dans la barre" value={content.chrome.contactLabel} onChange={(contactLabel) => patch("chrome", { ...content.chrome, contactLabel })} />
            {content.chrome.nav.map((item, index) => (
              <Field
                key={item.href}
                label={`Menu — ${item.href}`}
                value={item.label}
                onChange={(label) => {
                  const nav = content.chrome.nav.map((entry, i) => (i === index ? { ...entry, label } : entry));
                  patch("chrome", { ...content.chrome, nav });
                }}
              />
            ))}
            {content.landing.overlays.map((overlay, index) => (
              <div key={index} className="space-y-3 border-t border-slate-200 pt-4">
                <p className="text-sm font-semibold">Encadré {index + 1} du bandeau</p>
                <Field label="Titre" value={overlay.title} onChange={(title) => {
                  const overlays = content.landing.overlays.map((entry, i) => (i === index ? { ...entry, title } : entry));
                  patch("landing", { overlays });
                }} />
                <Field label="Texte" rows={3} value={overlay.body} onChange={(body) => {
                  const overlays = content.landing.overlays.map((entry, i) => (i === index ? { ...entry, body } : entry));
                  patch("landing", { overlays });
                }} />
                <Field label="Lien" value={overlay.href} onChange={(href) => {
                  const overlays = content.landing.overlays.map((entry, i) => (i === index ? { ...entry, href } : entry));
                  patch("landing", { overlays });
                }} />
                <Field label="Bouton" value={overlay.buttonLabel} onChange={(buttonLabel) => {
                  const overlays = content.landing.overlays.map((entry, i) => (i === index ? { ...entry, buttonLabel } : entry));
                  patch("landing", { overlays });
                }} />
              </div>
            ))}
          </>
        ) : null}
        {tab === "college" ? (
          <>
            <Field label="Titre de page" value={content.college.title} onChange={(title) => patch("college", { ...content.college, title })} />
            <Field label="Introduction" rows={4} value={content.college.intro} onChange={(intro) => patch("college", { ...content.college, intro })} />
            <Field label="Titre des résultats" value={content.college.resultsTitle} onChange={(resultsTitle) => patch("college", { ...content.college, resultsTitle })} />
            <Field label="Texte des résultats" value={content.college.resultsBody} onChange={(resultsBody) => patch("college", { ...content.college, resultsBody })} />
            <Field label="Titre informations pratiques" value={content.college.practicalTitle} onChange={(practicalTitle) => patch("college", { ...content.college, practicalTitle })} />
            {content.college.stats.map((stat, index) => (
              <Field key={index} label={`Chiffre ${index + 1}`} value={stat} onChange={(value) => {
                const stats = content.college.stats.map((entry, i) => (i === index ? value : entry));
                patch("college", { ...content.college, stats });
              }} />
            ))}
            <Field label="Titre direction" value={content.college.directionTitle} onChange={(directionTitle) => patch("college", { ...content.college, directionTitle })} />
            {content.college.direction.map((person, index) => (
              <div key={index} className="grid gap-3 border-t border-slate-200 pt-4 md:grid-cols-2">
                <Field label={`Direction ${index + 1} — nom`} value={person.name} onChange={(name) => {
                  const direction = content.college.direction.map((entry, i) => (i === index ? { ...entry, name } : entry));
                  patch("college", { ...content.college, direction });
                }} />
                <Field label="Fonction" value={person.role} onChange={(role) => {
                  const direction = content.college.direction.map((entry, i) => (i === index ? { ...entry, role } : entry));
                  patch("college", { ...content.college, direction });
                }} />
              </div>
            ))}
          </>
        ) : null}
        {tab === "lycee" ? (
          <>
            <Field label="Titre de page" value={content.lycee.title} onChange={(title) => patch("lycee", { ...content.lycee, title })} />
            <Field label="Introduction" rows={4} value={content.lycee.intro} onChange={(intro) => patch("lycee", { ...content.lycee, intro })} />
            <Field label="Titre du graphique" value={content.lycee.resultats.titre} onChange={(titre) => patch("lycee", { ...content.lycee, resultats: { ...content.lycee.resultats, titre } })} />
            <Field label="Sous-titre du graphique" value={content.lycee.resultats.sousTitre} onChange={(sousTitre) => patch("lycee", { ...content.lycee, resultats: { ...content.lycee.resultats, sousTitre } })} />
            {content.lycee.resultats.annees.map((annee, index) => (
              <div key={index} className="space-y-3 border-t border-slate-200 pt-4">
                <Field label="Année" value={String(annee.annee)} onChange={(value) => {
                  const annees = content.lycee.resultats.annees.map((entry, i) => i === index ? { ...entry, annee: Number(value) || 0 } : entry);
                  patch("lycee", { ...content.lycee, resultats: { ...content.lycee.resultats, annees } });
                }} />
                {annee.mentions.map((mention, mentionIndex) => (
                  <div key={mentionIndex} className="grid gap-3 md:grid-cols-2">
                    <Field label="Mention" value={mention.label} onChange={(label) => {
                      const annees = content.lycee.resultats.annees.map((entry, i) => i === index ? { ...entry, mentions: entry.mentions.map((m, j) => j === mentionIndex ? { ...m, label } : m) } : entry);
                      patch("lycee", { ...content.lycee, resultats: { ...content.lycee.resultats, annees } });
                    }} />
                    <Field label="Pourcentage" value={String(mention.value)} onChange={(value) => {
                      const annees = content.lycee.resultats.annees.map((entry, i) => i === index ? { ...entry, mentions: entry.mentions.map((m, j) => j === mentionIndex ? { ...m, value: Number(value) || 0 } : m) } : entry);
                      patch("lycee", { ...content.lycee, resultats: { ...content.lycee.resultats, annees } });
                    }} />
                  </div>
                ))}
                <button type="button" className="text-sm text-red-700" onClick={() => {
                  const annees = content.lycee.resultats.annees.filter((_, i) => i !== index);
                  patch("lycee", { ...content.lycee, resultats: { ...content.lycee.resultats, annees } });
                }}>Retirer cette année</button>
              </div>
            ))}
            <button type="button" className="text-sm font-medium" onClick={() => {
              const annees = [...content.lycee.resultats.annees, { annee: new Date().getFullYear(), mentions: [{ label: "TB", value: 0 }] }];
              patch("lycee", { ...content.lycee, resultats: { ...content.lycee.resultats, annees } });
            }}>Ajouter une année</button>
            <Field label="Titre informations pratiques" value={content.lycee.practicalTitle} onChange={(practicalTitle) => patch("lycee", { ...content.lycee, practicalTitle })} />
            {content.lycee.stats.map((stat, index) => (
              <Field key={index} label={`Chiffre ${index + 1}`} value={stat} onChange={(value) => {
                const stats = content.lycee.stats.map((entry, i) => (i === index ? value : entry));
                patch("lycee", { ...content.lycee, stats });
              }} />
            ))}
            {content.lycee.direction.map((person, index) => (
              <div key={index} className="grid gap-3 border-t border-slate-200 pt-4 md:grid-cols-2">
                <Field label={`Direction ${index + 1} — nom`} value={person.name} onChange={(name) => {
                  const direction = content.lycee.direction.map((entry, i) => (i === index ? { ...entry, name } : entry));
                  patch("lycee", { ...content.lycee, direction });
                }} />
                <Field label="Fonction" value={person.role} onChange={(role) => {
                  const direction = content.lycee.direction.map((entry, i) => (i === index ? { ...entry, role } : entry));
                  patch("lycee", { ...content.lycee, direction });
                }} />
              </div>
            ))}
          </>
        ) : null}
        {tab === "histoire" ? (
          <>
            <Field label="Titre du bandeau" value={content.histoire.heroTitle} onChange={(heroTitle) => patch("histoire", { ...content.histoire, heroTitle })} />
            <Field label="Chapô" rows={3} value={content.histoire.heroLead} onChange={(heroLead) => patch("histoire", { ...content.histoire, heroLead })} />
            <Field label="Accroche" rows={2} value={content.histoire.accroche} onChange={(accroche) => patch("histoire", { ...content.histoire, accroche })} />
            <Field label="Titre fondation" value={content.histoire.convictionTitle} onChange={(convictionTitle) => patch("histoire", { ...content.histoire, convictionTitle })} />
            <Field label="Paragraphe 1" rows={4} value={content.histoire.convictionP1} onChange={(convictionP1) => patch("histoire", { ...content.histoire, convictionP1 })} />
            <Field label="Paragraphe 2" rows={3} value={content.histoire.convictionP2} onChange={(convictionP2) => patch("histoire", { ...content.histoire, convictionP2 })} />
            <Field label="Titre des fondements" value={content.histoire.fondementsTitle} onChange={(fondementsTitle) => patch("histoire", { ...content.histoire, fondementsTitle })} />
            <Field label="Introduction des fondements" rows={2} value={content.histoire.fondementsLead} onChange={(fondementsLead) => patch("histoire", { ...content.histoire, fondementsLead })} />
            {content.histoire.fondements.map((item, index) => (
              <div key={index} className="space-y-3 border-t border-slate-200 pt-4">
                <Field label={`Fondement ${index + 1} — titre`} value={item.titre} onChange={(titre) => {
                  const fondements = content.histoire.fondements.map((entry, i) => (i === index ? { ...entry, titre } : entry));
                  patch("histoire", { ...content.histoire, fondements });
                }} />
                <Field label="Phrase" rows={2} value={item.phrase} onChange={(phrase) => {
                  const fondements = content.histoire.fondements.map((entry, i) => (i === index ? { ...entry, phrase } : entry));
                  patch("histoire", { ...content.histoire, fondements });
                }} />
                <button type="button" className="text-sm text-red-700" onClick={() => {
                  patch("histoire", { ...content.histoire, fondements: content.histoire.fondements.filter((_, i) => i !== index) });
                }}>Retirer</button>
              </div>
            ))}
            <button type="button" className="text-sm font-medium" onClick={() => {
              patch("histoire", { ...content.histoire, fondements: [...content.histoire.fondements, { titre: "", phrase: "" }] });
            }}>Ajouter un fondement</button>
            <Field label="Titre du blason" value={content.histoire.blasonTitle} onChange={(blasonTitle) => patch("histoire", { ...content.histoire, blasonTitle })} />
            <Field label="Texte du blason, avant les mots en gras" rows={3} value={content.histoire.blasonBefore} onChange={(blasonBefore) => patch("histoire", { ...content.histoire, blasonBefore })} />
            <Field label="Mot en gras : parents" value={content.histoire.blasonParents} onChange={(blasonParents) => patch("histoire", { ...content.histoire, blasonParents })} />
            <Field label="Suite" value={content.histoire.blasonMid1} onChange={(blasonMid1) => patch("histoire", { ...content.histoire, blasonMid1 })} />
            <Field label="Mot en gras : professeurs" value={content.histoire.blasonTeachers} onChange={(blasonTeachers) => patch("histoire", { ...content.histoire, blasonTeachers })} />
            <Field label="Suite" value={content.histoire.blasonMid2} onChange={(blasonMid2) => patch("histoire", { ...content.histoire, blasonMid2 })} />
            <Field label="Mot en gras : élèves" value={content.histoire.blasonStudents} onChange={(blasonStudents) => patch("histoire", { ...content.histoire, blasonStudents })} />
            <Field label="Fin du paragraphe" rows={2} value={content.histoire.blasonAfter} onChange={(blasonAfter) => patch("histoire", { ...content.histoire, blasonAfter })} />
            <Field label="Second paragraphe du blason" rows={3} value={content.histoire.blasonP2} onChange={(blasonP2) => patch("histoire", { ...content.histoire, blasonP2 })} />
            <Field label="Titre de conclusion" value={content.histoire.conclusionTitle} onChange={(conclusionTitle) => patch("histoire", { ...content.histoire, conclusionTitle })} />
            <Field label="Conclusion" rows={3} value={content.histoire.conclusionBody} onChange={(conclusionBody) => patch("histoire", { ...content.histoire, conclusionBody })} />
            <Field label="Bouton projet éducatif" value={content.histoire.ctaProjet} onChange={(ctaProjet) => patch("histoire", { ...content.histoire, ctaProjet })} />
            <Field label="Bouton nous rencontrer" value={content.histoire.ctaRencontrer} onChange={(ctaRencontrer) => patch("histoire", { ...content.histoire, ctaRencontrer })} />
          </>
        ) : null}
        {tab === "projet" ? (
          <>
            <Field label="Titre de page" value={content.projet.title} onChange={(title) => patch("projet", { ...content.projet, title })} />
            <Field label="Citation" rows={2} value={content.projet.quote} onChange={(quote) => patch("projet", { ...content.projet, quote })} />
            {content.projet.sections.map((section, index) => (
              <div key={index} className="space-y-3 border-t border-slate-200 pt-4">
                <Field label={`Bloc ${index + 1} — titre`} value={section.title} onChange={(title) => {
                  const sections = content.projet.sections.map((entry, i) => (i === index ? { ...entry, title } : entry));
                  patch("projet", { ...content.projet, sections });
                }} />
                <Field label="Texte" rows={4} value={section.text} onChange={(text) => {
                  const sections = content.projet.sections.map((entry, i) => (i === index ? { ...entry, text } : entry));
                  patch("projet", { ...content.projet, sections });
                }} />
              </div>
            ))}
          </>
        ) : null}
        {tab === "infos" ? (
          <>
            <Field label="Titre du bandeau" value={content.infos.title} onChange={(title) => patch("infos", { ...content.infos, title })} />
            <Field label="Phrase d'accueil" value={content.infos.welcome} onChange={(welcome) => patch("infos", { ...content.infos, welcome })} />
            <Field label="Bouton des cartes" value={content.infos.mapButton} onChange={(mapButton) => patch("infos", { ...content.infos, mapButton })} />
            <Field label="Carte collège — titre" value={content.infos.collegeCardTitle} onChange={(collegeCardTitle) => patch("infos", { ...content.infos, collegeCardTitle })} />
            <Field label="Adresse du collège" value={content.infos.collegeAddress} onChange={(collegeAddress) => patch("infos", { ...content.infos, collegeAddress })} />
            <Field label="Carte lycée — titre" value={content.infos.lyceeCardTitle} onChange={(lyceeCardTitle) => patch("infos", { ...content.infos, lyceeCardTitle })} />
            <Field label="Adresse du lycée" value={content.infos.lyceeAddress} onChange={(lyceeAddress) => patch("infos", { ...content.infos, lyceeAddress })} />
            {content.infos.sections.map((section, index) => (
              <div key={section.id} className="space-y-3 border-t border-slate-200 pt-4">
                <Field label={`${section.label} — libellé de l'index`} value={section.label} onChange={(label) => {
                  const sections = content.infos.sections.map((entry, i) => (i === index ? { ...entry, label } : entry));
                  patch("infos", { ...content.infos, sections });
                }} />
                <Field label="Titre" value={section.title} onChange={(title) => {
                  const sections = content.infos.sections.map((entry, i) => (i === index ? { ...entry, title } : entry));
                  patch("infos", { ...content.infos, sections });
                }} />
                <Field label="Texte" rows={3} value={section.body} onChange={(body) => {
                  const sections = content.infos.sections.map((entry, i) => (i === index ? { ...entry, body } : entry));
                  patch("infos", { ...content.infos, sections });
                }} />
              </div>
            ))}
          </>
        ) : null}
        {tab === "actualites" ? (
          <>
            <Field label="Titre de la page" value={content.actualitesPage.title} onChange={(title) => patch("actualitesPage", { ...content.actualitesPage, title })} />
            <Field label="Lien de retour" value={content.actualitesPage.backLabel} onChange={(backLabel) => patch("actualitesPage", { ...content.actualitesPage, backLabel })} />
            {content.actualites.map((item, index) => (
              <div key={item.id || index} className="space-y-3 border-t border-slate-200 pt-4">
                <Field label="Titre" value={item.titre} onChange={(titre) => {
                  const actualites = content.actualites.map((entry, i) => (i === index ? { ...entry, titre } : entry));
                  patch("actualites", actualites);
                }} />
                <Field label="Adresse (slug)" value={item.slug} onChange={(slug) => {
                  const actualites = content.actualites.map((entry, i) => (i === index ? { ...entry, slug } : entry));
                  patch("actualites", actualites);
                }} />
                <Field label="Texte" rows={4} value={item.excerpt} onChange={(excerpt) => {
                  const actualites = content.actualites.map((entry, i) => (i === index ? { ...entry, excerpt } : entry));
                  patch("actualites", actualites);
                }} />
                <Field label="Chemin d'une image déjà publiée (vide = pas d'image)" value={item.imageUrl} onChange={(imageUrl) => {
                  const actualites = content.actualites.map((entry, i) => (i === index ? { ...entry, imageUrl } : entry));
                  patch("actualites", actualites);
                }} />
                <button type="button" className="text-sm text-red-700" onClick={() => patch("actualites", content.actualites.filter((_, i) => i !== index))}>Retirer</button>
              </div>
            ))}
            <button type="button" className="text-sm font-medium" onClick={() => patch("actualites", [...content.actualites, { id: `item-${Date.now()}`, slug: "", titre: "", excerpt: "", imageUrl: "" }])}>Ajouter une actualité</button>
          </>
        ) : null}
        {tab === "contact" ? (
          <>
            <Field label="Titre" value={content.contact.title} onChange={(title) => patch("contact", { ...content.contact, title })} />
            <Field label="Introduction" rows={3} value={content.contact.intro} onChange={(intro) => patch("contact", { ...content.contact, intro })} />
            <Field label="Titre téléphone" value={content.contact.phoneTitle} onChange={(phoneTitle) => patch("contact", { ...content.contact, phoneTitle })} />
            <Field label="Titre courriel" value={content.contact.emailTitle} onChange={(emailTitle) => patch("contact", { ...content.contact, emailTitle })} />
            <Field label="Bouton Calendly" value={content.contact.calendlyLabel} onChange={(calendlyLabel) => patch("contact", { ...content.contact, calendlyLabel })} />
            <Field label="URL Calendly" value={content.contact.calendlyUrl} onChange={(calendlyUrl) => patch("contact", { ...content.contact, calendlyUrl })} />
          </>
        ) : null}
        {tab === "footer" ? (
          <>
            <Field label="Titre de la lettre" value={content.footer.newsletterTitle} onChange={(newsletterTitle) => patch("footer", { ...content.footer, newsletterTitle })} />
            <Field label="Texte de la lettre" rows={3} value={content.footer.newsletterBody} onChange={(newsletterBody) => patch("footer", { ...content.footer, newsletterBody })} />
            <Field label="Titre contact" value={content.footer.contactTitle} onChange={(contactTitle) => patch("footer", { ...content.footer, contactTitle })} />
            <Field label="Nom" value={content.footer.schoolName} onChange={(schoolName) => patch("footer", { ...content.footer, schoolName })} />
            <Field label="Téléphone affiché" value={content.footer.phone} onChange={(phone) => patch("footer", { ...content.footer, phone })} />
            <Field label="Courriel" value={content.footer.email} onChange={(email) => patch("footer", { ...content.footer, email })} />
            <Field label="Lien mentions légales" value={content.footer.legalMentions} onChange={(legalMentions) => patch("footer", { ...content.footer, legalMentions })} />
            <Field label="Lien confidentialité" value={content.footer.legalPrivacy} onChange={(legalPrivacy) => patch("footer", { ...content.footer, legalPrivacy })} />
          </>
        ) : null}
      </div>
      <div className="mt-4 flex items-center gap-4">
        <button type="button" onClick={save} disabled={pending} className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
          Enregistrer
        </button>
        {message ? <p className="text-sm text-slate-700">{message}</p> : null}
      </div>
    </div>
  );
}
