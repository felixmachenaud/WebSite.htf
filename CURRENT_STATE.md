# CURRENT_STATE

Photographie **actuelle** du projet (6 octobre 2026). Ce fichier est remplacé/mis à jour, pas historisé. Anomalies détaillées : `PROJECT_HEALTH.md`.

| | |
|---|---|
| Branche active | `vague-2` (alignée `origin/vague-2`) |
| `main` | 3 commits en retard vs vagues 0–2 |
| Stash | `wip-landing-avant-vagues-audit` sur `main` — **non appliqué** |
| Mail école | Envoyé — réponse en attente (juridique, chiffres, email, Calendly) |

---

## Fonctionnalités opérationnelles

- Site public : toutes les routes App Router (accueil, à-propos, actualités, contact, juridique)
- SEO : metadata, Open Graph, favicon, `robots.ts`, `sitemap.ts` (sans `/admin`)
- Sécurité : CSP, en-têtes, `poweredByHeader: false`, pas de `.env` versionné
- Mini-CMS : code complet (`/admin`, API, `SiteContent`, Blob/local)
- Auth admin : scrypt, sessions Redis, rate limit login (code en place)
- Build : `next build` OK au 30/09 sur `vague-2` (16 pages)
- Pages juridiques : publiées avec mentions « à confirmer »

---

## Fonctionnalités partielles

| Élément | État | Bloquant |
|---------|------|----------|
| **CMS contenu** | Code OK ; persistance prod = Blob non testé en recette | Preview smoke test (CMS-01) |
| **Admin login** | Code OK ; recette Preview non faite | AUTH-02, SEC-12 |
| **Mentions légales** | Publiées ; SIRET, raison sociale, responsable « à confirmer » | Prod (SEC-02) |
| **Contact / email** | Gmail + Calendly ; non confirmés par l'école | Contenu (SEC-06, SEC-08) |
| **Chiffres collège/lycée** | Identiques (240 / 19) — copie probable | Contenu (CODE-05) |
| **Newsletter** | Texte placeholder footer ; pas de formulaire | Aucun (volontaire) |
| **Messagerie** | Uniquement `mailto:` externe ; pas de module site | Aucun (hors scope) |
| **URL canonique prod** | Fallback `localhost` sans `NEXT_PUBLIC_SITE_URL` | Preview/prod (PH-03) |

---

## Travaux en cours

1. **Attente retour école** (juridique, effectifs, email, Calendly)
2. **Phase A** prête à lancer dès validation merge (voir ci-dessous)
3. **Vague 3** non démarrée (branche inexistante)

---

## Plan d'exécution — Phases A à D

> **Emplacement officiel des phases A–D** : ce fichier (`CURRENT_STATE.md`).  
> Chaque étape renvoie aux IDs de `PROJECT_HEALTH.md` quand ils existent.

### Phase A — Technique (sans attendre l'école)

| ID | Étape | Tickets / notes |
|----|-------|-----------------|
| A1 | Merge séquentiel `vague-0` → `vague-1` → `vague-2` sur `main` | Hors registre ; PR #7, #8, vague-2 |
| A2 | `npm ci` + `next build` sur clone propre après chaque merge | SEC-09 |
| A3 | Poser `NEXT_PUBLIC_SITE_URL` (HTTPS) sur Vercel Preview | PH-03 |
| A4 | Variables admin + Blob sur Preview ; smoke test login / edit / save / reload / logout | CMS-01, AUTH-02 |
| A5 | Smoke test rate limit login (mauvais MDP, trop d'essais) | SEC-12 |
| A6 | Comparaison visuelle pages branchées CMS vs avant | CMS-02 |
| A7 | Recette site public (routes, 404 slug, footer, CSP, sitemap, pas X-Powered-By) | ARCH-03, SEC-04, ARCH-05, SEC-07, CODE-06 |
| A8 | Appliquer stash `wip-landing-avant-vagues-audit` ; résoudre conflits landing | Hors registre — **après A1–A7** |

**Statut Phase A** : ⏳ Prête à lancer (merge non encore effectué).

### Phase B — Contenu école (après retour mail)

| ID | Étape | Tickets |
|----|-------|---------|
| B1 | Raison sociale, SIRET, responsable publication, hébergeur | SEC-02 |
| B2 | Email Gmail confirmé ou remplacé | SEC-08 |
| B3 | URL Calendly confirmée | SEC-06 |
| B4 | Chiffres collège / lycée (+ taux brevet/bac si fournis) | CODE-05 |
| B5 | Relecture direction → clôturer mentions « à confirmer » | SEC-02 |

**Statut Phase B** : ⏸ En attente mail école.

### Phase C — Publication production

| ID | Étape | Tickets |
|----|-------|---------|
| C1 | `NEXT_PUBLIC_SITE_URL` en production HTTPS | PH-03 |
| C2 | Admin + Blob + Redis configurés en prod ; smoke test | CMS-01, AUTH-02 |
| C3 | Mentions légales sans placeholder (ou accord écrit école) | SEC-02 |

**Statut Phase C** : 🔒 Bloquée par Phase A + minimum Phase B (juridique).

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

- [ ] Phase A complète
- [ ] Retour et intégration mail école (Phase B)
- [ ] Go production (Phase C)
- [ ] Vague 3 (Phase D)
- [ ] Mise à jour `PROJECT_HEALTH.md` après chaque étape significative

---

## Dépendances et blocages connus

| Blocage | Impact | Levier |
|---------|--------|--------|
| Mail école non reçu | Phase B, prod « propre » | Relance établissement |
| Merges vagues non faits | Preview à jour, Phase A | Exécuter A1 |
| Variables Vercel Preview absentes | Recette admin impossible | A3, A4 |
| Stash landing | Travail accueil en suspens | A8 après recette |
| Vague 3 absente | Lint, CI, perf images, a11y | Phase D séparée |
