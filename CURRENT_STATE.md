# CURRENT_STATE

Photographie **actuelle** du projet (6 octobre 2026). Ce fichier est remplacé/mis à jour, pas historisé. Anomalies détaillées : `PROJECT_HEALTH.md`.

| | |
|---|---|
| Branche active | `main` @ `1862135` (Phase A + prep Phase B) |
| `main` | Vagues 0–2 mergées ; 4 commits en avance sur `origin/main` |
| Stash | `wip-landing-avant-vagues-audit` — **appliqué et droppé** (6 oct. 2026) |
| Mail école | Envoyé — réponse en attente (juridique, chiffres, email, Calendly) |

---

## Fonctionnalités opérationnelles

- Site public : toutes les routes App Router (accueil, à-propos, actualités, contact, juridique)
- SEO : metadata, Open Graph, favicon, `robots.ts`, `sitemap.ts` (sans `/admin`)
- Sécurité : CSP, en-têtes, `poweredByHeader: false`, pas de `.env` versionné
- Mini-CMS : code complet (`/admin`, API, `SiteContent`, Blob/local)
- Auth admin : scrypt, sessions Redis, rate limit login (code en place)
- Build : `next build` OK sur `main` (22 routes, 6 oct. 2026)
- Landing mobile : hero scroll natif + snap (stash appliqué, `LandingMobileHero`)
- Smoke test local : `scripts/phase-a-smoke.mjs` — 35/35 pass (6 oct. 2026)
- Pages juridiques : publiées avec mentions « à confirmer »

---

## Fonctionnalités partielles

| Élément | État | Bloquant |
|---------|------|----------|
| **CMS contenu** | Smoke local OK ; Preview Vercel + Blob non testés | Preview (CMS-01) |
| **Admin login** | Smoke local OK ; Preview Redis non testé | Preview (AUTH-02) |
| **Variables Vercel Preview** | Doc `docs/PHASE-A-VERCEL-ENV.md` ; dépôt non lié à Vercel CLI | A3 manuel (PH-03) |
| **Mentions légales** | Publiées ; SIRET, raison sociale, responsable « à confirmer » | Prod (SEC-02) |
| **Contact / email** | Gmail + Calendly ; non confirmés par l'école | Contenu (SEC-06, SEC-08) |
| **Chiffres collège/lycée** | Identiques (240 / 19) — copie probable | Contenu (CODE-05) |
| **Newsletter** | Texte placeholder footer ; pas de formulaire | Aucun (volontaire) |
| **Messagerie** | Uniquement `mailto:` externe ; pas de module site | Aucun (hors scope) |
| **URL canonique prod** | Fallback `localhost` sans `NEXT_PUBLIC_SITE_URL` | Preview/prod (PH-03) |
| **Comparaison visuelle CMS** | Non faite (A6) | CMS-02 |

---

## Travaux en cours

1. **Attente retour école** (juridique, effectifs, email, Calendly)
2. **Phase A** — technique locale complète ; **Preview Vercel** reste manuelle (A3–A4)
3. **Vague 3** non démarrée (branche inexistante)

---

## Plan d'exécution — Phases A à D

> **Emplacement officiel des phases A–D** : ce fichier (`CURRENT_STATE.md`).  
> Chaque étape renvoie aux IDs de `PROJECT_HEALTH.md` quand ils existent.

### Phase A — Technique (sans attendre l'école)

| ID | Étape | Statut | Notes |
|----|-------|--------|-------|
| A1 | Merge séquentiel `vague-0` → `vague-1` → `vague-2` sur `main` | ✅ | `main` @ 94b35be |
| A2 | `npm ci` + `next build` (clone propre + workspace) | ✅ | 22 routes, 6 oct. 2026 |
| A3 | `NEXT_PUBLIC_SITE_URL` + variables Preview Vercel | ⚠️ | CLI `npx vercel` OK ; dépôt non lié ; doc `docs/PHASE-A-VERCEL-ENV.md` |
| A4 | Smoke test login / edit / save / reload / logout | ✅ local / ⚠️ Preview | 35 checks ; auth via `next dev` (Redis requis en `next start` prod) |
| A5 | Smoke test rate limit login | ✅ local | 9e tentative → 429 confirmé |
| A6 | Comparaison visuelle pages branchées CMS vs avant | ⚠️ | Non exécutée |
| A7 | Recette site public (routes, 404, footer, CSP, sitemap) | ✅ | `scripts/phase-a-smoke.mjs` |
| A8 | Stash `wip-landing-avant-vagues-audit` | ✅ | Conflits résolus ; build OK ; `/` → 200 |

**Statut Phase A** : ✅ Technique locale complète — ⚠️ Preview Vercel (env + smoke) et A6 visuel restent ouverts.

**Preview URL documentée** : https://web-site-o0uxgyjme-felixmachenaud2-9491s-projects.vercel.app (6 j, peut être obsolète vs `main`).

**Push remote** : non effectué (non demandé).

### Phase B — Contenu école (après retour mail)

| ID | Étape | Statut | Fichier / notes |
|----|-------|--------|-----------------|
| B1 | Raison sociale, SIRET, responsable publication, hébergeur | ⚠️ prep | `lib/ecole-pending.ts` ; pages juridiques branchées |
| B2 | Email Gmail confirmé ou remplacé | ⚠️ prep | `contactEmail` défaut Gmail ; `contactEmailConfirmed: false` |
| B3 | URL Calendly confirmée | ⚠️ prep | `calendlyUrl` actuelle ; `calendlyConfirmed: false` |
| B4 | Chiffres collège / lycée (+ taux brevet/bac) | ⚠️ prep | Stats dans `ecole-pending` (réf.) ; édition CMS `site-content` |
| B5 | Relecture direction → clôturer mentions « à confirmer » | ⏸ | SEC-02 reste `[MONITOR]` — checklist `docs/PHASE-B-ECOLE.md` |

**Prep faite** : `lib/ecole-pending.ts`, `docs/PHASE-B-ECOLE.md`, mentions légales et confidentialité utilisent les helpers pending.

**Bloque prod Phase B** : retour mail école (B1–B4), relecture direction (B5), puis mise à jour CMS + flags `*Confirmed` dans `ecole-pending.ts`.

**Statut Phase B** : ⏸ En attente mail école — infrastructure prête à intégrer les réponses.

### Phase C — Publication production

| ID | Étape | Tickets |
|----|-------|---------|
| C1 | `NEXT_PUBLIC_SITE_URL` en production HTTPS | PH-03 |
| C2 | Admin + Blob + Redis configurés en prod ; smoke test | CMS-01, AUTH-02 |
| C3 | Mentions légales sans placeholder (ou accord écrit école) | SEC-02 |

**Statut Phase C** : 🔒 Bloquée par Preview Phase A + minimum Phase B (juridique).

### Phase D — Vague 3 (parallèle possible, non bloquante merge)

| Tickets | Sujet |
|---------|--------|
| CODE-01, CODE-02 | ESLint, CI, typecheck |
| SEC-11, PH-02 | Audit npm / deps dev |
| SEC-13 | 404 en français |
| ARCH-02 | Optimisation images / `next/image` |
| ARCH-04 | Accessibilité scroll hijack + menu |
| ARCH-06, ARCH-07 | Layout partagé, Recharts |
| CODE-03, CODE-04, CODE-07, CODE-09 | Refactor landing, code mort, assets |

**Statut Phase D** : 📋 Backlog — ne pas considérer comme mergé.

---

## Éléments restant à faire (synthèse)

- [x] Phase A locale (A1, A2, A4–A5, A7, A8)
- [ ] Lier Vercel + poser variables Preview + smoke Preview (A3–A4)
- [ ] Comparaison visuelle CMS (A6)
- [x] Commit landing stash (A8)
- [x] Prep Phase B (`ecole-pending`, checklist, pages juridiques)
- [ ] Retour et intégration mail école (Phase B — valeurs réelles)
- [ ] Go production (Phase C)
- [ ] Vague 3 (Phase D)

---

## Dépendances et blocages connus

| Blocage | Impact | Levier |
|---------|--------|--------|
| Mail école non reçu | Phase B, prod « propre » | Relance établissement |
| Dépôt non lié Vercel CLI | Env Preview non posables via CLI | `vercel link` + dashboard |
| Variables Preview absentes | Recette admin prod-like impossible | `docs/PHASE-A-VERCEL-ENV.md` |
| Redis requis en `next start` | Smoke auth local utilise `next dev` | Normal en Preview avec Upstash |
| Vague 3 absente | Lint, CI, perf images, a11y | Phase D séparée |
