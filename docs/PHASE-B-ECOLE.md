# Phase B — Contenu école (checklist)

> **Source unique des champs en attente** : `lib/ecole-pending.ts`  
> **Contenu éditable CMS** : `lib/site-content.ts` (defaults branchés sur `ecole-pending`) + `/admin`  
> **Pages juridiques** : `app/mentions-legales/`, `app/confidentialite/` (helpers `ecole-pending`)

Ne pas inventer de SIRET, raison sociale, effectifs ou taux. Mettre à jour seulement après retour écrit de l'établissement.

**Calendly** : retiré du site (6 oct. 2026) — contact par téléphone et courriel uniquement.

---

## B1 — Identité juridique et hébergeur (SEC-02)

| Champ | Fichier à éditer | Bloque prod |
|-------|------------------|-------------|
| `legalName` | `lib/ecole-pending.ts` | Oui |
| `legalForm` | `lib/ecole-pending.ts` | Oui |
| `siret` | `lib/ecole-pending.ts` | Oui |
| `publicationDirector` | `lib/ecole-pending.ts` | Oui |
| `hostConfirmed` | `lib/ecole-pending.ts` | Relecture direction recommandée |

**Pages impactées** : mentions légales, confidentialité (via helpers).

**Ticket** : SEC-02 reste `[MONITOR]` tant que la direction n'a pas relu les pages sans placeholder.

---

## B2 — Email de contact (SEC-08)

| Champ | Fichier à éditer | Bloque prod |
|-------|------------------|-------------|
| `contactEmail` | `lib/ecole-pending.ts` | Non (Gmail actuel) |
| `contactEmailConfirmed` | `lib/ecole-pending.ts` → `true` | Oui pour prod « propre » |

**Propagation** : `site-content.ts` default `footer.email` lit `ecolePending.contactEmail`. Resynchroniser le CMS admin si une valeur différente était enregistrée.

---

## B3 — Chiffres collège / lycée (CODE-05)

| Champ | Fichier à éditer | Bloque prod |
|-------|------------------|-------------|
| `collegeStats` | `lib/ecole-pending.ts` | Oui — effectifs identiques collège/lycée |
| `lyceeStats` | `lib/ecole-pending.ts` | Oui |
| `collegeResults` | `lib/ecole-pending.ts` | Oui — taux brevet non vérifiés |
| Résultats bac | `lib/site-content.ts` → `lycee.resultats` | Oui |

**Defaults CMS** : `college.stats`, `lycee.stats`, `college.resultsBody` sont branchés sur `ecole-pending`. Après confirmation école, éditer `ecole-pending.ts` puis resynchroniser via admin si besoin.

---

## B4 — Relecture direction et clôture SEC-02

| Étape | Bloque prod |
|-------|-------------|
| Relecture mentions légales et confidentialité | Oui (Phase C) |
| Renseigner B1 + `contactEmailConfirmed` | Oui |
| Mettre SEC-02 à `[FIXED]` | **Uniquement après accord écrit école** |

---

## Ordre recommandé

1. Recevoir le mail école (juridique, email, chiffres).
2. Renseigner `lib/ecole-pending.ts` (B1–B3).
3. Vérifier pages publiques / admin (defaults mis à jour).
4. Relecture direction (B4).
5. Phase C.

---

## Bloquants prod Phase B (synthèse)

- [ ] Raison sociale, forme juridique, SIRET
- [ ] Responsable de publication nominatif
- [ ] Email confirmé (`contactEmailConfirmed: true`)
- [ ] Effectifs collège et lycée distincts et validés
- [ ] Taux brevet et bac confirmés
- [ ] Relecture écrite direction → SEC-02 clôturable
