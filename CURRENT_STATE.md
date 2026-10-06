# CURRENT_STATE

Photographie **actuelle** du projet (6 octobre 2026). Anomalies détaillées : `PROJECT_HEALTH.md`.

| | |
|---|---|
| Branche active | `main` |
| `main` | Phase A + B exécutées localement ; push remote non fait |
| Mail école | Envoyé — réponse en attente (juridique, chiffres, email) |

---

## Fonctionnalités opérationnelles

- Site public : routes App Router complètes
- Contact : téléphone + courriel uniquement (**Calendly retiré**)
- SEO, sécurité, mini-CMS, auth admin (code + smoke local)
- Pages juridiques branchées sur `lib/ecole-pending.ts`
- Defaults CMS (`site-content`) synchronisés avec `ecole-pending` (email, stats, brevet)
- Build OK (22 routes) ; smoke `scripts/phase-a-smoke.mjs` 35/35

---

## Fonctionnalités partielles

| Élément | État | Bloquant prod |
|---------|------|---------------|
| **Identité juridique** | Placeholders « à confirmer » (B1) | Oui — SEC-02 |
| **Email Gmail** | Affiché ; `contactEmailConfirmed: false` | Prod « propre » |
| **Chiffres collège/lycée** | Source `ecole-pending` ; valeurs identiques | Oui — CODE-05 |
| **Relecture direction** | Non faite (B4) | Oui — SEC-02 |
| **Preview Vercel** | Variables non posées | Phase C |

---

## Phase A — Statut

| ID | Statut |
|----|--------|
| A1–A2, A4–A5, A7–A8 | ✅ |
| A3, A4 Preview | ⚠️ Manuel Vercel |
| A6 visuel | ⚠️ Non fait |

---

## Phase B — Statut

| ID | Statut | Notes |
|----|--------|-------|
| B1 Juridique | ⚠️ | Infra OK ; valeurs `null` dans `ecole-pending.ts` |
| B2 Email | ⚠️ | Gmail par défaut ; flag confirmation à passer quand mail reçu |
| B3 Chiffres | ⚠️ | Defaults branchés ; valeurs à confirmer par l'école |
| B4 Relecture | ⏸ | Direction — SEC-02 reste `[MONITOR]` |

**Exécuté sans mail école** : retrait Calendly, centralisation `ecole-pending` → `site-content`, pages juridiques/contact/confidentialité à jour, checklist `docs/PHASE-B-ECOLE.md`.

**Bloque prod** : retour école (SIRET, raison sociale, responsable, chiffres, email confirmé) + relecture B4.

---

## Phase C / D

- **Phase C** : bloquée Preview Vercel + minimum B1/B4
- **Phase D** : backlog vague 3

---

## Prochaines actions

1. Remplir `lib/ecole-pending.ts` quand le mail arrive
2. `contactEmailConfirmed: true` si Gmail validé
3. Relecture direction (B4)
4. Vercel Preview (A3) + push `main`
