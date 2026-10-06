# Phase B — Contenu école (checklist)

> **Source unique des champs en attente** : `lib/ecole-pending.ts`  
> **Contenu éditable CMS** : `lib/site-content.ts` + `/admin`  
> **Pages juridiques** : code (`app/mentions-legales/`, `app/confidentialite/`)

Ne pas inventer de SIRET, raison sociale, effectifs ou taux. Mettre à jour seulement après retour écrit de l'établissement.

---

## B1 — Identité juridique et hébergeur (SEC-02)

| Champ | Fichier à éditer | Bloque prod |
|-------|------------------|-------------|
| `legalName` | `lib/ecole-pending.ts` | Oui — mentions légales incomplètes |
| `legalForm` | `lib/ecole-pending.ts` | Oui |
| `siret` | `lib/ecole-pending.ts` | Oui |
| `publicationDirector` | `lib/ecole-pending.ts` | Oui — responsable publication |
| `hostConfirmed` | `lib/ecole-pending.ts` | Non si `true` (Vercel par défaut) ; relecture direction recommandée |

**Pages impactées** : `app/mentions-legales/page.tsx`, `app/confidentialite/page.tsx` (via helpers).

**Ticket** : SEC-02 reste `[MONITOR]` tant que la direction n'a pas relu les pages sans placeholder.

---

## B2 — Email de contact (SEC-08)

| Champ | Fichier à éditer | Bloque prod |
|-------|------------------|-------------|
| `contactEmail` | `lib/ecole-pending.ts` | Non (Gmail actuel utilisable) |
| `contactEmailConfirmed` | `lib/ecole-pending.ts` → `true` après validation | Oui pour prod « propre » |

**Pages / composants à mettre à jour après confirmation** :

- `lib/site-content.ts` → `chrome.email` (CMS admin)
- `app/contact/page.tsx`, `components/Footer.tsx` (via `getContent()`)
- Mentions légales et confidentialité (déjà branchées sur `ecole-pending`)

---

## B3 — Calendly (SEC-06)

| Champ | Fichier à éditer | Bloque prod |
|-------|------------------|-------------|
| `calendlyUrl` | `lib/ecole-pending.ts` | Non (URL actuelle affichée) |
| `calendlyConfirmed` | `lib/ecole-pending.ts` → `true` | Oui pour prod « propre » |

**Pages / composants à mettre à jour après confirmation** :

- `lib/site-content.ts` → `contact.calendlyUrl` (si présent dans le schéma)
- `app/contact/page.tsx`, `components/AdresseCards.tsx`
- `app/confidentialite/page.tsx` (sous-traitant Calendly)

---

## B4 — Chiffres collège / lycée (CODE-05)

| Champ | Fichier à éditer | Bloque prod |
|-------|------------------|-------------|
| `collegeStats` | `lib/ecole-pending.ts` (référence) puis `lib/site-content.ts` → `college.stats` | Oui — effectifs identiques collège/lycée (copie probable) |
| `lyceeStats` | idem → `lycee.stats` | Oui |
| `collegeResults` | idem → `college.resultsBody` | Oui — taux brevet non vérifiés |
| Résultats bac | `lib/site-content.ts` → `lycee.resultats` | Oui — taux bac non vérifiés |

**Édition opérationnelle** : admin `/admin` une fois les valeurs confirmées (pas d'invention dans le code).

---

## B5 — Relecture direction et clôture SEC-02

| Étape | Fichier / action | Bloque prod |
|-------|------------------|-------------|
| Relecture mentions légales | Direction + `app/mentions-legales/page.tsx` | Oui (C3) |
| Relecture confidentialité | Direction + `app/confidentialite/page.tsx` | Oui (C3) |
| Retirer mentions « à confirmer » | Helpers `ecole-pending` + textes juridiques | Oui |
| Mettre SEC-02 à `[FIXED]` | `PROJECT_HEALTH.md` | **Uniquement après accord écrit école** |

---

## Ordre recommandé

1. Recevoir le mail école (juridique, email, Calendly, chiffres).
2. Renseigner `lib/ecole-pending.ts` (B1–B3).
3. Mettre à jour `lib/site-content.ts` via admin ou commit ciblé (B4).
4. Relecture direction des pages juridiques (B5).
5. Phase C : Preview Vercel validée + prod avec mentions complètes.

---

## Bloquants prod Phase B (synthèse)

- [ ] Raison sociale, forme juridique, SIRET (`legalName`, `legalForm`, `siret`)
- [ ] Responsable de publication nominatif (`publicationDirector`)
- [ ] Email institutionnel confirmé (`contactEmailConfirmed`)
- [ ] Compte Calendly confirmé (`calendlyConfirmed`)
- [ ] Effectifs collège et lycée distincts et validés (`collegeStats`, `lyceeStats`)
- [ ] Taux brevet et bac confirmés (`collegeResults`, `lycee.resultats`)
- [ ] Relecture écrite direction → SEC-02 clôturable
