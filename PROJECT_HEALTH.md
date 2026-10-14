# PROJECT_HEALTH

Registre des anomalies du site Collège Lycée Hautefeuille. Source de vérité permanente pour bugs, risques, dette et régressions.

| | |
|---|---|
| Dépôt | `felixmachenaud/WebSite.htf` |
| Référence d'audit | 30 septembre 2026, commit `6841649` |
| Dernière mise à jour | 14 octobre 2026 — smoke admin prod 401/429 ; merge save Blob ; CI verte (run 38520821227) |

Documentation associée : `PROJECT_CONTEXT.md`, `CURRENT_STATE.md` (phases A–D), `DECISIONS.md`, `AGENTS.md`, `docs/standards/` (checklist, sécurité, SEO), `.cursor/rules/*.mdc`.

Les identifiants reprennent ceux de l'audit. Une entrée n'est jamais supprimée.

---

### SEC-01 [FIXED] [CRITICAL] 2026-09-30

- Composant : `package.json` (`next@14.2.15`)
- Constat : Next.js 14.2.15 est exposé à un déni de service App Router et à d'autres avis dont la correction dépasse la branche 14.
- Cause : version antérieure aux correctifs de décembre 2025 et 2026.
- Action : monté sur `next@16.3.7` (dernière stable corrigée au 30 septembre 2026), `eslint-config-next@16.3.7`, Node `>=20.9.0`. `params` de `app/nouvelles/[slug]/page.tsx` est asynchrone. React 18 reste dans la plage acceptée par Next 16. `npm audit` ne signale plus d'avis critique ni haut sur `next`. `next build` passe (16 pages).

### SEC-02 [MONITOR] [CRITICAL] 2026-09-30

- Composant : `app/mentions-legales/page.tsx`, `app/confidentialite/page.tsx`, `lib/ecole-pending.ts`
- Constat : pages en ligne ; APASE, SIRET 44345731200025, responsable Dimitri de Baudan, Gmail confirmé. Intro pages alignée « relecture B4 en cours » ; confidentialité cite `legalIdentityLine()`. Dossier direction : `docs/RELECTURE-DIRECTION-B4.md` (hébergeur exclu de la relecture).
- Cause : accord écrit direction absent ; paragraphe hébergeur provisoire (`SITE_HOSTING=pending`) jusqu’à choix Vercel/OVH.
- Action : transmettre le dossier B4, obtenir validation écrite (hors hébergeur), puis `[FIXED]`. Mettre à jour hébergeur seul quand `SITE_HOSTING` + `hostConfirmed`.

### SEC-03 [FIXED] [HIGH] 2026-09-30

- Composant : `components/Footer.tsx`
- Constat : formulaire « Envoyer » qui n'envoyait rien et citait une politique absente.
- Cause : `onSubmit` annulait l'envoi, sans endpoint.
- Action : formulaire retiré. Texte « inscription bientôt disponible », sans champ.

### SEC-04 [FIXED] [HIGH] 2026-09-30

- Composant : `next.config.js`
- Constat : aucun en-tête de sécurité, `X-Powered-By: Next.js` présent.
- Cause : configuration sans `headers` ni `poweredByHeader: false`.
- Action : CSP (polices auto-hébergées, `frame-src` limité à Google), `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options: DENY` et `frame-ancestors 'none'`, `poweredByHeader: false`. HSTS seulement si `VERCEL=1` ou si `NEXT_PUBLIC_SITE_URL` est en HTTPS, pour ne pas l'envoyer sur le HTTP local.

### SEC-05 [FIXED] [HIGH] 2026-09-30

- Composant : `.gitignore`, `.env.example`
- Constat : `.env` n'était pas ignoré, pas de contrat d'environnement.
- Cause : seules les variantes `.env*.local` étaient ignorées.
- Action : `.env` et `.env.*` ignorés, exception `!.env.example`. L'exemple liste les noms sans valeur.

### SEC-06 [FIXED] [HIGH] 2026-09-30

- Composant : `app/a-propos/page.tsx`, `components/AdresseCards.tsx`, `app/contact/page.tsx`, `app/confidentialite/page.tsx`
- Constat : image picsum, iframes Google Maps sans action ; lien Calendly non confirmé.
- Cause : tiers chargés sans cadre ; Calendly hors besoin établissement.
- Action : picsum retiré, photo locale sur `/a-propos`. Carte Google au clic uniquement. Calendly retiré (6 oct. 2026) — contact téléphone + courriel.

### SEC-07 [FIXED] [CRITICAL] 2026-09-30

- Composant : `data/actualites.ts`, `public/images/nouvelles/rome-latin.jpg`, `public/images/nouvelles/cinquiemes-montmartre.jpg`
- Constat : sorties d'élèves illustrées sans trace de consentement dans le dépôt.
- Cause : images versionnées et prêtes à être publiées.
- Action : fichiers retirés du dépôt. Les articles restent en texte, sans image. Ne pas réintroduire ces fichiers sans autorisation écrite de l'établissement. Les portraits de la direction sont conservés (base distincte) et décrits dans la politique de confidentialité.

### SEC-08 [FIXED] [HIGH] 2026-09-30

- Composant : `app/contact/page.tsx`, `components/Footer.tsx`, `lib/ecole-pending.ts`
- Constat : contact des familles sur `hautefeuille92@gmail.com`.
- Cause : choix d'adresse à confirmer.
- Action : Gmail confirmé par l'établissement comme contact principal du site (13 oct. 2026). `contactEmailConfirmed: true`.

### SEC-09 [FIXED] [HIGH] 2026-09-30

- Composant : `package-lock.json`
- Constat : `npm ci` échouait (picomatch).
- Cause : lockfile incohérent avec la résolution npm.
- Action : lockfile régénéré avec la montée Next / PostCSS (30 sept.). Récidive le 13 oct. 2026 : `npm ci` sur Ubuntu (npm 10.8.2) refuse `picomatch` 2.3.1 / 4.0.3. Le 14 oct., `overrides` figent 2.3.2 et 4.0.7. `npm ci --os linux` passe en local. Ne pas lancer `npm audit fix`.

### SEC-10 [FIXED] [HIGH] 2026-09-30

- Composant : `package.json` (`postcss`)
- Constat : PostCSS 8.5.8 vulnérable.
- Cause : version antérieure au correctif de ligne.
- Action : figé sur `postcss@8.5.28`.

### SEC-11 [OPEN] [MEDIUM] 2026-09-30

- Composant : dépendances de développement (`eslint`, `eslint-config-next`, `glob`)
- Constat : avis hauts limités aux outils de dev au moment de l'audit.
- Cause : ESLint 8 et chaîne associée.
- Action : `npm run lint` passe (13 oct. 2026, ESLint 9 + config plate). `picomatch` est monté aux correctifs 2.3.2 et 4.0.7 (14 oct.). Les avis hauts restants côté outils de dev (`brace-expansion`, `browserslist`) restent en vague 3. Pas de `npm audit fix`.

### SEC-12 [FIXED] [MEDIUM] 2026-09-30

- Composant : `app/api/admin/login/route.ts`, `lib/admin-sessions.ts`
- Constat : le login limite les essais et exige l'en-tête `x-hautefeuille-admin`.
- Cause : recette prod absente jusqu'au branchement Redis (13 oct. 2026).
- Action : smoke local (6 oct.) ; prod (14 oct.) — 401 mauvais MDP, 429 après cumul IP (8e tentative post-401 sur Vercel). Script : `--admin-only --base=https://web-site-htf.vercel.app`.

### SEC-13 [OPEN] [MEDIUM] 2026-09-30

- Composant : page 404 par défaut
- Constat : 404 générique en anglais, pas de `app/error.tsx`.
- Cause : aucun fichier dédié.
- Action : vague 3.

### AUTH-01 [OPEN] [LOW] 2026-09-30

- Composant : site public
- Constat : pas d'authentification visiteur.
- Cause : brochure publique, comportement voulu.
- Action : conserver. L'accès admin existe ; les visiteurs restent sans compte.

### AUTH-02 [FIXED] [HIGH] 2026-09-30

- Composant : `lib/admin-auth.ts`, `lib/admin-sessions.ts`, `app/api/admin/`
- Constat : hash scrypt, cookie opaque, pepper `AUTH_SECRET`, sessions Redis. Prod (14 oct.) : smoke `--admin-only` 8/8 — 401, login 200, save, page publique, logout, 401 post-logout, revert brand, 429 rate limit.
- Cause : recette prod reportée jusqu’à Redis + fenêtre rate limit.
- Action : conserver `ADMIN_SMOKE_PASSWORD` hors dépôt ; respecter ~15 min entre runs prod depuis la même IP.

### CODE-01 [FIXED] [HIGH] 2026-09-30

- Composant : outillage ESLint
- Constat : `next lint` était inutilisable, aucune config.
- Cause : Next 16 n'expose plus la commande `lint` ; pas de `eslint.config`.
- Action : `eslint.config.mjs` (ESLint 9, `eslint-config-next` core-web-vitals + typescript). Script `lint` = `eslint .`. `npm run lint` sort 0 le 13 oct. 2026 (35 avertissements, 0 erreur). `no-require-imports` coupé sur `*.js` / `*.mjs` (`next.config.js`, scripts). Règles React Compiler coupées seulement sur la landing scroll (CODE-03, CODE-04).

### CODE-02 [FIXED] [HIGH] 2026-09-30

- Composant : CI et tests
- Constat : pas de tests, pas de CI, pas de script `typecheck` au moment de l'audit.
- Cause : outillage absent, puis lockfile `picomatch` refusé par `npm ci` sur Ubuntu (13 oct. 2026).
- Action : workflow `.github/workflows/ci.yml` (lint, tsc, build, smoke public). `picomatch` figé en 2.3.2 et 4.0.7. Run GitHub vert le 14 oct. 2026 : https://github.com/felixmachenaud/WebSite.htf/actions/runs/38520821227. Le smoke admin reste hors CI (AUTH-02).

### CODE-03 [OPEN] [MEDIUM] 2026-09-30

- Composant : `components/ScrollHijackLanding.tsx`
- Constat : landing monolithique, état global de module.
- Cause : animation et contenu dans le même fichier.
- Action : vague 3, extraction limitée, sans réécrire le moteur. ESLint (13 oct. 2026) : `react-hooks/refs`, `set-state-in-effect` et `immutability` désactivées sur ce fichier pour que la CI passe sans réécriture.

### CODE-04 [OPEN] [MEDIUM] 2026-09-30

- Composant : `components/ScrollLanding.tsx`, `components/scroll/*`, `components/ActualitesTimeline.tsx`, `gsap`, `lucide-react`
- Constat : code mort et dépendances inutilisées.
- Cause : ancienne landing conservée.
- Action : vague 3. ESLint (13 oct. 2026) : `react-hooks/refs`, `set-state-in-effect` et `immutability` désactivées sur `components/scroll/**`.

### CODE-05 [FIXED] [HIGH] 2026-09-30

- Composant : `app/a-propos/college/page.tsx`, `app/a-propos/lycee/page.tsx`, `lib/ecole-pending.ts`, `lib/site-content.ts`
- Constat : effectifs identiques collège/lycée (240 / 19 profs).
- Cause : copie non vérifiée.
- Action : effectifs confirmés — 213 collège, 111 lycée (13 oct. 2026). Lignes « professeurs » retirées des stats (photos direction suffisent). Bac déjà géré dans le CMS lycée. Resynchroniser le JSON Blob admin si d'anciennes stats persistent.

### CODE-06 [FIXED] [HIGH] 2026-09-30

- Composant : `app/a-propos/information-generale/page.tsx`
- Constat : cinq images référencées absentes (`materiel-scolaire`, `menu-scolaire`, `services`, `calendrier`, `extrascolaire`), rectangle gris via `SafeSectionImage`.
- Cause : `src` vers des fichiers qui ne sont pas dans `public/images/informations-generales/`.
- Action : ces blocs image ne sont plus rendus. Le texte des rubriques reste. Les photos d'installations et d'uniforme, présentes sur le disque, sont conservées.

### CODE-07 [OPEN] [MEDIUM] 2026-09-30

- Composant : navbar, couleurs, coordonnées
- Constat : valeurs magiques et coordonnées dupliquées.
- Cause : pas de source unique.
- Action : vague 3, après extraction CMS.

### CODE-08 [FIXED] [MEDIUM] 2026-09-30

- Composant : `app/nouvelles/[slug]/page.tsx`
- Constat : texte de chantier public « Page à enrichir via le CMS ».
- Cause : placeholder laissé visible.
- Action : phrase retirée. L'article affiche son extrait.

### CODE-09 [OPEN] [LOW] 2026-09-30

- Composant : `public/images/`, README
- Constat : extensions en majuscules, dossier accentué `informations-générales` en doublon.
- Cause : imports historiques.
- Action : vague 3. Le README des actualités est mis à jour en vague 0 uniquement pour ne plus citer les photos d'élèves retirées.

### ARCH-01 [OPEN] [MEDIUM] 2026-09-30

- Composant : pages `app/`
- Constat : contenu et présentation dans les mêmes fichiers.
- Cause : textes en dur dans le JSX.
- Action : vague 2.

### ARCH-02 [OPEN] [HIGH] 2026-09-30

- Composant : `public/images/`
- Constat : environ 9 Mo transférés sur l'accueil, images jusqu'à 7 Mo, pas de `next/image`.
- Cause : fichiers sources servis tels quels.
- Action : vague 3. `collage-3.3.jpg` (~7 Mo) reste servi en vague 0.

### ARCH-03 [FIXED] [HIGH] 2026-09-30

- Composant : `app/layout.tsx`, `app/favicon.ico`, `app/robots.ts`, `app/sitemap.ts`, `app/page.tsx`, `app/a-propos/information-generale/page.tsx`
- Constat : favicon 404, pas de robots/sitemap/Open Graph, pas de H1 sur l'accueil, double H1 sur Informations générales.
- Cause : SEO de base non posé.
- Action : favicon, robots, sitemap, Open Graph et `metadataBase` ajoutés. H1 unique sur l'accueil et sur Informations générales. L'URL canonique de production reste PH-03.

### ARCH-04 [OPEN] [HIGH] 2026-09-30

- Composant : `components/ScrollHijackLanding.tsx`, `components/Navbar.tsx`
- Constat : scroll hijack et menu peu accessibles (clavier, mouvement réduit, Échap).
- Cause : interaction uniquement à la molette / au clic.
- Action : vague 3.

### ARCH-05 [FIXED] [HIGH] 2026-09-30

- Composant : `components/SidebarMenu.tsx`
- Constat : lien Contact absent du menu mobile.
- Cause : Contact n'était rendu que dans la barre visible à partir de `md`.
- Action : entrée Contact ajoutée au menu latéral, utilisé par l'accueil et les pages intérieures.

### ARCH-06 [OPEN] [MEDIUM] 2026-09-30

- Composant : layouts
- Constat : coquille de page non partagée (menu et footer répétés).
- Cause : chaque page assemble son chrome.
- Action : vague 3.

### ARCH-07 [OPEN] [MEDIUM] 2026-09-30

- Composant : `app/a-propos/lycee/page.tsx`, Recharts
- Constat : page Lycée alourdie, graphique de taille -1 au build.
- Cause : ResponsiveContainer mesuré avant layout.
- Action : vague 3.

### CMS-01 [FIXED] [HIGH] 2026-09-30

- Composant : `lib/site-content.ts`, `lib/content-store.ts`, `app/admin`, `app/api/admin`
- Constat : `saveContent` merge sur `getContent()`. Prod (14 oct.) : save `chrome.brand` → HTML `/` → revert « Hautefeuille » via smoke admin.
- Cause : ancien save écrasait le Blob avec defaults + patch seul.
- Action : déployer le fix `saveContent` si pas encore sur `main` prod ; resynchroniser Blob admin si d’anciennes stats persistaient (CODE-05).

### CMS-02 [MONITOR] [MEDIUM] 2026-09-30

- Composant : pages publiques, `lib/site-content.ts`
- Constat : les textes des pages branchées passent par `getContent()`. Les pages juridiques restent hors éditeur. Landing mobile reçoit `overlays` CMS via props (stash A8).
- Cause : relecture visuelle non faite (A6 non exécutée). Les couleurs de mentions restent dans `data/resultats.ts`.
- Action : comparer visuellement l'accueil (desktop hijack + mobile snap), collège, lycée, histoire, projet et infos pratiques avec la version d'avant merge.

### CMS-03 [FIXED] [HIGH] 2026-09-30

- Composant : `docs/CMS-RESULTATS.md`, `data/resultats.ts`
- Constat : ces fichiers prescrivaient Sanity.
- Cause : document antérieur à la décision.
- Action : le document pointe vers `SiteContent`. Les couleurs restent dans le code, les chiffres dans le CMS.

### CMS-04 [OPEN] [LOW] 2026-09-30

- Composant : médias
- Constat : pas d'upload.
- Cause : hors périmètre des vagues 0 à 2.
- Action : ne pas ajouter de route d'upload. Traiter seulement si l'établissement le demande plus tard.

### PH-01 [FIXED] [LOW] 2026-09-30

- Composant : `next.config.js`
- Constat : au build Next 16, Turbopack ignorait le lockfile du dépôt et remontait vers un `package-lock.json` du dossier parent « WebSite Studio ».
- Cause : inférence de racine Turbopack dans une arborescence qui contient un autre lockfile.
- Action : `turbopack.root` fixé sur ce projet.

### PH-02 [OPEN] [MEDIUM] 2026-09-30

- Composant : dépendance de production transitive `baseline-browser-mapping`
- Constat : avis modéré (arrêt du processus sur entrée invalide), apparu après la montée de Next. Aucun avis critique ou haut restant sur les dépendances de production. Trois avis hauts restent côté outils de dev (`brace-expansion`, `browserslist`, `picomatch`).
- Cause : chaîne Browserslist / caniuse embarquée par le build.
- Action : hors correctif Next immédiat. À revoir en vague 3 avec l'audit CI. Ne pas lancer `npm audit fix` à l'aveugle.

### PH-03 [FIXED] [MEDIUM] 2026-09-30

- Composant : `lib/site-url.ts`, `.env.example`
- Constat : le domaine public de production n'était pas dans le dépôt. Sans `NEXT_PUBLIC_SITE_URL`, sitemap, robots et Open Graph utilisaient `http://localhost:3000`.
- Cause : variable absente sur Vercel avant Phase C.
- Action : `NEXT_PUBLIC_SITE_URL=https://web-site-htf.vercel.app` posé Production + Preview (6 oct. 2026). Vérifié : sitemap, robots, OG en HTTPS prod. Domaine custom éventuel = nouvelle variable si l'école en fournit un.
