# Relecture direction — mentions légales et confidentialité (B4)

> **Objectif** : obtenir un **accord écrit** de la direction sur les textes publiés, pour clôturer **SEC-02** (`PROJECT_HEALTH.md`).  
> **Hors périmère de cette relecture** : le paragraphe **hébergeur** (choix Vercel vs OVH encore en négociation) — il reste en « en cours de finalisation » jusqu’à décision et `SITE_HOSTING=vercel|ovh`.

---

## URLs à relire (production)

| Page | URL |
|------|-----|
| Mentions légales | https://web-site-htf.vercel.app/mentions-legales |
| Politique de confidentialité | https://web-site-htf.vercel.app/confidentialite |

Version imprimable : ouvrir chaque page, impression navigateur (sans menu si possible).

---

## Déjà intégré dans le site (à valider, pas à réécrire)

Ces éléments viennent de `lib/ecole-pending.ts` et s’affichent sur les mentions légales :

| Élément | Valeur actuelle |
|---------|-----------------|
| Raison sociale | ASSOC POUR PROMOT ACTIV SCOLAI ET EDUCAT (APASE) |
| Forme juridique | Association |
| SIRET | 44345731200025 |
| Responsable de publication (nom) | Dimitri de Baudan |
| Courriel responsable (mentions) | dimitri.dugas-de-baudan@hautefeuille92.fr |
| Contact familles (site + RGPD) | hautefeuille92@gmail.com (confirmé établissement) |
| Adresses / téléphone | Courbevoie + Bois-Colombes, 01 43 33 24 02 |

**À confirmer par la direction** : exactitude de l’orthographe des noms, du SIRET et de l’adresse e-mail du responsable de publication.

---

## Paragraphe exclu (relecture ultérieure)

**Hébergeur** (mentions + renvoi en confidentialité) :

> Le choix de l'hébergement applicatif (Vercel Inc. ou OVH SAS) est en cours de finalisation avec l'établissement…

La direction peut **ignorer** ce bloc pour la signature B4, ou le cocher « lu, OK provisoire ». Mise à jour automatique après choix (`docs/DEPLOYMENT-HOSTING.md`).

---

## Checklist de relecture (tout le reste)

Cocher après lecture des deux pages :

### Mentions légales

- [ ] Éditeur : nom de l’établissement, adresses, téléphone, courriel contact familles
- [ ] Ligne APASE / Association / SIRET
- [ ] Responsable de publication : identité + courriel direction
- [ ] ~~Hébergeur~~ (reporté — voir ci-dessus)
- [ ] Contact et renvoi vers la politique de confidentialité

### Politique de confidentialité

- [ ] Responsable du traitement et identité juridique
- [ ] Données concernées (pas de compte visiteur, pas de formulaire, photos élèves, portraits direction)
- [ ] Finalités et bases légales (information, contact mail/tél, portraits direction)
- [ ] Newsletter « bientôt disponible » — conforme à l’intention de l’établissement
- [ ] Sous-traitants : Gmail, Google Maps (carte au clic), hébergeur (texte provisoire), pas d’analytics
- [ ] Durées de conservation (dont phrase « durée exacte dossiers familles à confirmer » — valider ou préciser par retour écrit)
- [ ] Mineurs et photos de groupes
- [ ] Droits RGPD + CNIL (contact : Gmail ; **contact RGPD nominatif** encore générique — indiquer un nom/rôle si souhaité)

---

## Retour attendu de l’établissement

Un **courriel ou PDF signé** (direction ou personne habilitée) indiquant :

1. **Validé tel quel** pour mentions + confidentialité (hors hébergeur), **ou**
2. **Modifications demandées** (liste précise : section, ancien texte, texte proposé).

Transmettre à l’agence sans publier de corrections juridiques sans ce retour (`DECISIONS.md` — pages juridiques hors CMS).

---

## Après accord écrit

| Action | Fichier / registre |
|--------|-------------------|
| Corrections texte si demandées | `app/mentions-legales/page.tsx`, `app/confidentialite/page.tsx`, éventuellement `lib/ecole-pending.ts` |
| Date « Dernière mise à jour » | Même fichiers pages |
| Clôture SEC-02 | `PROJECT_HEALTH.md` → `[FIXED]` |
| Phase B4 | `CURRENT_STATE.md` |
| Hébergeur définitif | Plus tard : `SITE_HOSTING`, `hostConfirmed`, relecture courte du seul paragraphe hébergeur |

---

## Rappels

- Le site est **déjà en ligne** ; cette relecture vise la **conformité juridique affichée**, pas un lancement futur.
- Contenu éditable (effectifs, textes marketing) ≠ pages juridiques : les chiffres **213 / 111** et le brevet se vérifient sur les pages Collège/Lycée, pas dans ce dossier B4.
