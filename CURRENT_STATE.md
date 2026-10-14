# CURRENT_STATE

Photographie **actuelle** du projet (14 octobre 2026). Anomalies détaillées : `PROJECT_HEALTH.md`.

| | |
|---|---|
| Branche active | `main` |
| `main` | Phase A + B + C (partielle) — push `9ce09c2`, prod live |
| Production | https://web-site-htf.vercel.app |
| Mail école | Données APASE / effectifs / Gmail intégrées (13 oct. 2026) — relecture juridique + OVH en attente |

---

## Fonctionnalités opérationnelles

- Site public : routes App Router complètes
- Contact : téléphone + courriel uniquement (**Calendly retiré**)
- SEO, sécurité, mini-CMS, auth admin (smoke local 36/36 ; prod 401/429)
- Pages juridiques branchées sur `lib/ecole-pending.ts`
- Defaults CMS (`site-content`) synchronisés avec `ecole-pending` (email, stats, brevet)
- Build OK (22 routes) ; smoke `scripts/phase-a-smoke.mjs` 35/35

---

## Fonctionnalités partielles

| Élément | État | Bloquant prod |
|---------|------|---------------|
| **Identité juridique** | APASE + SIRET + responsable dans `ecole-pending` | Relecture B4 — SEC-02 |
| **Email Gmail** | Confirmé (`contactEmailConfirmed: true`) | SEC-08 FIXED |
| **Chiffres collège/lycée** | 213 / 111 dans defaults CMS | CODE-05 FIXED ; vérifier Blob admin |
| **Relecture direction** | Dossier `docs/RELECTURE-DIRECTION-B4.md` prêt ; hébergeur hors périmètre | SEC-02 |
| **Admin CMS prod** | Smoke prod 8/8 (14 oct.) : 401, save/revert, 429 | Déployer fix `saveContent` si commit local pas encore en prod |
| **Preview Vercel** | Auth, Blob et Redis (Production + Preview) | Phase C partielle |
| **CI** | Verte sur `main` (14 oct., run `38520821227`) | — |

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
| B1 Juridique | ⚠️ | APASE / SIRET / responsable renseignés ; validation écrite B4 |
| B2 Email | ⚠️ | Gmail par défaut ; flag confirmation à passer quand mail reçu |
| B3 Chiffres | ⚠️ | Defaults branchés ; valeurs à confirmer par l'école |
| B4 Relecture | ⏸ | Envoyer `docs/RELECTURE-DIRECTION-B4.md` ; accord écrit hors hébergeur → SEC-02 |

**Exécuté sans mail école** : retrait Calendly, centralisation `ecole-pending` → `site-content`, pages juridiques/contact/confidentialité à jour, checklist `docs/PHASE-B-ECOLE.md`.

**Bloque prod** : retour école (SIRET, raison sociale, responsable, chiffres, email confirmé) + relecture B4.

---

## Phase C — Statut (6 oct. 2026)

| ID | Statut | Notes |
|----|--------|-------|
| C1 (PH-03) | ✅ | `NEXT_PUBLIC_SITE_URL` Production + Preview |
| C2 Blob (CMS-01) | ✅ | Store `web-site-htf-blob`, token posé |
| C2 Auth (AUTH-02) | ⚠️ | `AUTH_SECRET` + `ADMIN_PASSWORD_HASH` Production + Preview |
| C2 Redis (CMS-01, AUTH-02) | ✅ | `upstash-kv-cyan-pocket`, Pay As You Go, `fra1`, Production + Preview |
| C3 (SEC-02) | ⏸ | Placeholders juridiques — bloqué retour école + B4 |
| Deploy prod | ✅ | Redis pris en compte ; CMS utilisé (13 oct.) |
| Smoke public prod | ✅ | 26/26 (`phase-a-smoke.mjs --public-only`) |
| Smoke admin prod | ✅ | 8/8 (`--admin-only` + `ADMIN_SMOKE_PASSWORD`, 14 oct.) |

Détail : `docs/PHASE-C-PRODUCTION.md`

---

## Phase D

- Backlog vague 3

---

## Hébergement (ambivalent)

- **Domaine** : OVH (DNS) — **App** : Vercel aujourd'hui, VPS OVH possible sans changer le CMS (Blob + Upstash).
- **Mentions légales** : `SITE_HOSTING=pending` par défaut — voir `docs/DEPLOYMENT-HOSTING.md`.
- **Décision Vercel vs OVH app** : en négociation ; puis `SITE_HOSTING=vercel|ovh` + relecture direction.

## CI

Workflow `.github/workflows/ci.yml` (push `main`, pull requests) : `npm ci`, `npm run lint`, `npm run typecheck`, `npm run build`, smoke public. Node 20. Aucun secret.

Le premier run (13 oct.) a échoué sur `npm ci`. Le 14 oct., `picomatch` est figé en 2.3.2 et 4.0.7. Le run [38520821227](https://github.com/felixmachenaud/WebSite.htf/actions/runs/38520821227) est vert : `npm ci`, lint, `tsc`, build, smoke public.

Le reste de la chaîne a été vérifié en local le 13 oct. (Node 24), sans `.env.local` : lint 0 erreur, `tsc` OK, build 22 routes, smoke public **26/26**.

Le smoke admin (login, 429) reste local ou Preview : il a besoin de secrets et de Redis.

---

## Prochaines actions

1. Commit/déployer correctifs locaux (saveContent, smoke `--admin-only`, juridique B4) si pas encore sur `main`
2. Relecture direction (B4) — transmettre `docs/RELECTURE-DIRECTION-B4.md` — SEC-02
3. Domaine OVH → CNAME Vercel (scénario A) quand le nom final est fixé
