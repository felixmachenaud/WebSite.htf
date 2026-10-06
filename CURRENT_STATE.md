# CURRENT_STATE

Photographie **actuelle** du projet (6 octobre 2026). Anomalies détaillées : `PROJECT_HEALTH.md`.

| | |
|---|---|
| Branche active | `main` |
| `main` | Phase A + B + C (partielle) — push `9ce09c2`, prod live |
| Production | https://web-site-htf.vercel.app |
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
| **Admin CMS prod** | Redis Upstash manquant | `/admin` → 503 |
| **Preview Vercel** | Auth + Blob OK ; Redis manquant | Phase C partielle |

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

## Phase C — Statut (6 oct. 2026)

| ID | Statut | Notes |
|----|--------|-------|
| C1 (PH-03) | ✅ | `NEXT_PUBLIC_SITE_URL` Production + Preview |
| C2 Blob (CMS-01) | ✅ | Store `web-site-htf-blob`, token posé |
| C2 Auth (AUTH-02) | ⚠️ | `AUTH_SECRET` + `ADMIN_PASSWORD_HASH` Production + Preview |
| C2 Redis (CMS-01, AUTH-02) | ❌ | Terms marketplace Upstash — action navigateur requise |
| C3 (SEC-02) | ⏸ | Placeholders juridiques — bloqué retour école + B4 |
| Deploy prod | ✅ | `dpl_5E29GsLvkmivTtJ5aghDL9qvCZZD` |
| Smoke public prod | ✅ | 26/26 (`phase-a-smoke.mjs --public-only`) |
| Smoke admin prod | ❌ | 503 — Redis absent |

Détail : `docs/PHASE-C-PRODUCTION.md`

---

## Phase D

- Backlog vague 3

---

## Prochaines actions

1. Accepter terms Upstash + `vercel integration add upstash/upstash-kv` → redeploy → smoke admin prod
2. Remplir `lib/ecole-pending.ts` quand le mail arrive
3. `contactEmailConfirmed: true` si Gmail validé
4. Relecture direction (B4) — débloquer SEC-02
