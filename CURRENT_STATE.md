# CURRENT_STATE

Photographie **actuelle** du projet (20 novembre 2026). Anomalies détaillées : `PROJECT_HEALTH.md`.

| | |
|---|---|
| Branche active | `main` |
| `main` | Phase A + B + C (partielle) — push `9ce09c2`, prod live |
| Hébergement | **Cloudflare Workers uniquement** — aperçu https://hautefeuille-preview.felixmachenaud2.workers.dev ; Vercel abandonné (projet à supprimer par Félix après export du Blob, ARCH-09) |
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

## Hébergement

- **App** : Cloudflare Workers (seule cible, `docs/DEPLOIEMENT-CLOUDFLARE.md`). **Domaine** : OVH (DNS) possible.
- **Mentions légales** : hébergeur Cloudflare, Inc. (`lib/site-hosting.ts`), à valider par la direction (`hostConfirmed`).
- Docs Vercel (`DEPLOYMENT-HOSTING`, `PHASE-A-VERCEL-ENV`, `PHASE-C-PRODUCTION`) : historiques, obsolètes.

## CI

Workflow `.github/workflows/ci.yml` (push `main`, pull requests) : `npm ci`, `npm run lint`, `npm run typecheck`, `npm run build`, smoke public. Node 20. Aucun secret.

Le premier run (13 oct.) a échoué sur `npm ci`. Le 14 oct., `picomatch` est figé en 2.3.2 et 4.0.7. Le run [38520821227](https://github.com/felixmachenaud/WebSite.htf/actions/runs/38520821227) est vert : `npm ci`, lint, `tsc`, build, smoke public.

Le reste de la chaîne a été vérifié en local le 13 oct. (Node 24), sans `.env.local` : lint 0 erreur, `tsc` OK, build 22 routes, smoke public **26/26**.

Le smoke admin (login, 429) reste local ou Preview : il a besoin de secrets et de Redis.

---

## Wording et photos (19 nov. 2026, branche `claude/site-architecture-photos-86defe`)

- Textes repris de la maquette `références/site Hautefeuille maquette chemin v2` dans les defaults CMS, sur la structure de routes actuelle : menu (Qui sommes-nous, Nos valeurs, Informations pratiques), accueil en 7 étapes (devise, 3 valeurs, collège, lycée, vie à Hautefeuille), collège, lycée, valeurs, histoire, infos pratiques, actualités.
- Accueil : photos de « Photos chemin Htf » (mêmes visuels que la maquette), en couleur. Pages intérieures : photos de « Photos sélectionnées », redimensionnées dans `public/images/photos/`.
- 9 pages ajoutées depuis la maquette (gabarit `components/ContentPage.tsx`, textes `data/pages.ts`, statiques hors CMS) : `/a-propos/projet-educatif/{viser-l-excellence,s-ouvrir-au-monde,donner-du-sens}`, `/a-propos/{vie-a-hautefeuille,familles,temoignages,documentation,soutenez-nous,inscriptions}`. Menu, sitemap, encadrés d'accueil et lien « Inscriptions » de l'en-tête branchés. Smoke public local 35/35.
- À lever avant prod : CONT-01 (droit à l'image), CONT-02 (adresse), CMS-05 (Blob).

---

## Cloudflare Workers (19 nov. 2026, branche `claude/cloudflare-workers`)

- Aperçu déployé : https://hautefeuille-preview.felixmachenaud2.workers.dev (compte Félix, indexation fermée). Smoke public 35/35.
- Sans CMS (textes par défaut, admin non configuré). Next 16.4.6. Détail : `docs/DEPLOIEMENT-CLOUDFLARE.md`.
- **Décision 19 nov. : Vercel abandonné, toutes les modifications doivent aboutir sur le Worker Cloudflare.** Le projet Vercel tourne encore tant qu'il n'est pas débranché.
- Déploiement auto de l'aperçu après CI verte sur `main` (`deploy-cloudflare.yml`) — actif dès que les secrets GitHub `CLOUDFLARE_API_TOKEN` et `CLOUDFLARE_ACCOUNT_ID` sont posés.

---

## Accueil prototype et pages regroupées (20 nov. 2026, branche `claude/landing-page-site-rebuild-4a5314`)

- Accueil = réplique du prototype validé (`hautefeuille-chemin-prototype…chatgpt.site`) : mêmes textes, mise en page, ruban doré, 8 visuels (`public/images/accueil/`), CSS du prototype isolée sous `.chemin` (`app/chemin.css`), composant `components/CheminLanding.tsx`. Seul écart voulu : les photos défilent de bas en haut (comme l'ancien accueil) au lieu du fondu. Retirés : mentions « prototype », lien « version de référence ». Boutons du prototype non reliés → branchés sur les pages du site.
- Ancien accueil supprimé (`ScrollHijackLanding`, `components/scroll/`, `landing.overlays` du CMS et de l'admin, images `landing/` et `path/`).
- Pages intérieures regroupées (14 → 7 pages de contenu) : Qui sommes-nous (histoire + familles + témoignages), Nos valeurs (3 valeurs détaillées en place), Collège, Lycée, La vie à Hautefeuille (`/nouvelles` : activités + actualités), Informations pratiques (+ documentation), Inscriptions (+ soutenez-nous). Anciennes URL → redirections 308 (`next.config.js`). Menu CMS réordonné.
- Actualités par défaut : Rome, Montmartre, Notre-Dame (ajoutée, texte court) avec photos et dates du prototype, puis goodies.

- 20 nov. (suite) : menu latéral unique (`components/MenuDrawer.tsx`) sur l'accueil et les pages intérieures, ouvert au survol du bouton, refermé quand la souris le quitte ; page de fond seulement floutée, rien ne se décale. Menu à 7 entrées : Accueil, Qui sommes-nous ? (histoire + valeurs/étapes du parcours + familles + témoignages), Le Collège, Le Lycée, Informations pratiques (+ vie à Hautefeuille, actualités, documentation), Inscriptions, Contact. `/a-propos/projet-educatif` et `/nouvelles` redirigés (308) ; les articles restent sous `/nouvelles/<slug>`.

---

## Prochaines actions

1. Commit/déployer correctifs locaux (saveContent, smoke `--admin-only`, juridique B4) si pas encore sur `main`
2. Relecture direction (B4) — transmettre `docs/RELECTURE-DIRECTION-B4.md` — SEC-02
3. Exporter le contenu Vercel Blob avant de supprimer le projet Vercel ; CMS sur Cloudflare (ARCH-09)
4. Domaine de l'école → `routes` custom_domain dans `wrangler.jsonc` quand le nom final est fixé
