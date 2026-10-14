# Audit de pré-production — Collège Lycée Hautefeuille

| | |
|---|---|
| Date | 30 septembre 2026 |
| Dépôt | `felixmachenaud/WebSite.htf` |
| Commit audité | `6841649` (`main`, « bug page d'accueil ») |
| Périmètre | Code, configuration, contenu versionné, dépendances, comportement du build de production en local |
| Hors périmètre | Compte Vercel, DNS, boîtes mail, registres de consentement détenus hors dépôt |
| Méthode | Lecture du code, historique git (6 commits), gitleaks 8.28.0, `npm audit`, `tsc`, `next lint`, `next build`, serveur `next start`, sondes HTTP, Lighthouse headless |
| Modification du code applicatif | Aucune. Seul livrable : ce dossier `docs/audit/` |

Lecture des sévérités :

- **P0** — bloquant avant mise en production du site public.
- **P1** — à traiter avant la mise en production ou dans la foulée.
- **P2** — amélioration, dette, ou préparation d'une évolution.

Les écarts au mini-CMS qui n'empêchent pas de publier le site statique actuel sont en P1/P2. Ceux qui interdiraient d'ouvrir `/admin` sont signalés comme tels dans la section CMS.

---

## Résumé exécutif

Le dépôt **est bien un site Next.js** (14.2.15, App Router, React 18, TypeScript strict, Tailwind). Il n'y a pas de migration de framework à inventer pour accueillir le mini-CMS. En revanche le site n'est pas prêt à être publié, et il n'est pas prêt à recevoir le panneau `/admin`.

Le site se construit et les 12 routes prévues répondent. Il n'y a pas de secret dans git. Il n'y a pas de `dangerouslySetInnerHTML` dans le code du projet, pas de route API, pas de cookie, pas de base de données. La surface actuelle est celle d'une brochure.

Trois sujets bloquent une mise en ligne responsable :

1. **Next.js 14.2.15 est vulnérable**, y compris à un déni de service sur l'App Router (avis éditeur de décembre 2025, correctif de branche 14 en 14.2.35, et d'autres avis 2026 dont la plage couvre encore toute la branche 14). `npm` signale cette version comme ayant une faille de sécurité.
2. **Il n'existe aucune page de mentions légales ni de politique de confidentialité**, alors que le site s'adresse à des familles et parle d'élèves mineurs.
3. **Des actualités de sorties scolaires sont illustrées et prêtes à être publiées**, sans aucune trace de consentement à l'image dans le dépôt. La publication doit être validée par l'établissement.

Autour de ça : formulaire de newsletter qui n'envoie rien tout en demandant l'acceptation d'une politique absente, aucun en-tête de sécurité, images manquantes, visuels très lourds, lien Contact invisible sur mobile, chiffres collège/lycée recopiés à l'identique, et un outillage qualité absent (`next lint` ne peut pas tourner, pas de CI, pas de tests).

Pour le mini-CMS décrit dans le document joint : le patron (schéma `SiteContent`, defaults, `mergeContent`, Blob, `/admin`, scrypt, session Redis, cookie opaque, pepper `AUTH_SECRET`) **n'est implémenté nulle part**. Presque tous les textes visibles sont en dur dans le JSX. Un document interne (`docs/CMS-RESULTATS.md`) décrit au contraire une intégration **Sanity**, en contradiction avec la méthode retenue. Le bon chemin est d'abord de corriger la version de Next, puis d'ajouter `lib/` et `app/admin` sur l'App Router actuel, sans introduire Sanity ni Payload.

### Décompte

| Sévérité | Nombre | Identifiants |
|---|---|---|
| P0 | 3 | SEC-01, SEC-02, SEC-07 |
| P1 | 18 | SEC-03, SEC-04, SEC-05, SEC-06, SEC-08, SEC-09, SEC-10, AUTH-02, CODE-01, CODE-02, CODE-05, CODE-06, ARCH-02, ARCH-03, ARCH-04, ARCH-05, CMS-01, CMS-03 |
| P2 | 14 | SEC-11, SEC-12, SEC-13, AUTH-01, CODE-03, CODE-04, CODE-07, CODE-08, CODE-09, ARCH-01, ARCH-06, ARCH-07, CMS-02, CMS-04 |

CMS-01 est classé P1 pour le site statique (son absence ne bloque pas la brochure) et **bloquant avant toute ouverture de `/admin`**.

---

## Cartographie

### Stack

| Élément | Constat |
|---|---|
| Framework | Next.js **14.2.15** (`package.json`), App Router (`app/`) |
| UI | React 18.3.1, React DOM 18.3.1 |
| Langage | TypeScript 5.9.3, `"strict": true` (`tsconfig.json`) |
| Style | Tailwind 3.4.19, PostCSS 8.5.8, autoprefixer |
| Polices | `next/font/google` (Source Serif 4, DM Sans), auto-hébergées au build |
| Graphiques | Recharts 3.8.0, uniquement la page Lycée |
| Présents mais non utilisés par une page servie | `gsap` (seulement `components/scroll/ScrollContainer.tsx`, code mort), `lucide-react` (aucune importation) |
| Absent | `@vercel/blob`, client Redis / Upstash, middleware, routes `app/api`, tests, ESLint configuré, CI |
| Node déclaré | `>=18`. Audit exécuté avec Node 22.14 et npm 10.9.7 |
| Alias | `@/*` → racine du dépôt |

Le dossier `src/` n'existe pas. Les pages vivent dans `app/`, les composants dans `components/`, les données dans `data/`. C'est un App Router valide. Le document mini-CMS montre des chemins `src/lib` et `src/app` : c'est la convention du projet modèle, pas une obligation de Next.

### Arborescence utile

```
app/                  10 pages + layout racine + layout a-propos
components/           chrome (Navbar, Footer, menus) + landing + scroll/
data/                 actualites.ts, resultats.ts
public/images/        ~36 Mo, 51 fichiers
docs/CMS-RESULTATS.md schéma Sanity pour les résultats du bac
next.config.js        uniquement remotePatterns picsum.photos
```

Aucun `middleware.ts`, `vercel.json`, `robots.txt`, `sitemap`, `favicon`, `not-found.tsx`, `error.tsx`, `.env`, `.env.example`, workflow GitHub.

### Déploiement

Rien dans le dépôt ne relie le projet à un projet Vercel (`.vercel` est gitignoré et absent). Le commit `10c9907` (« downgrade React 19 to 18 for Next.js 14 / Vercel compatibility ») montre que la cible envisagée est Vercel + Next 14.

`next.config.js` ne définit ni en-têtes, ni redirections, ni `poweredByHeader: false`, ni `output: 'export'`. Le build produit un serveur Next classique, pas un export statique. Toutes les pages sont prérendues (statique ou SSG). Sur Vercel, le runtime App Router reste celui qui traite le protocole RSC : c'est ce runtime que visent les avis de déni de service cités en SEC-01.

Le HTML servi par `next start` porte `Cache-Control: s-maxage=31536000, stale-while-revalidate` et `X-Powered-By: Next.js`.

### Routes observées (`next start`, port local)

| Chemin | Statut | Rôle |
|---|---|---|
| `/` | 200 | Landing scroll-hijack + actualités + footer |
| `/a-propos` | 200 | Page courte, image externe picsum, absente du menu |
| `/a-propos/college` | 200 | Texte, chiffres, direction |
| `/a-propos/lycee` | 200 | Texte, graphiques bac, direction |
| `/a-propos/histoire` | 200 | Récit et 12 fondements |
| `/a-propos/projet-educatif` | 200 | Citation et 3 blocs |
| `/a-propos/information-generale` | 200 | 8 rubriques, cartes Google Maps |
| `/contact` | 200 | Téléphone, e-mail, bouton Calendly |
| `/nouvelles` | 200 | Grille des 3 actualités |
| `/nouvelles/goodies-40-ans`, `rome-latin`, `cinquiemes-montmartre` | 200 | SSG |
| `/nouvelles/slug-inconnu` | 404 | `notFound()` |
| `/admin`, `/api/admin/login` | 404 | Rien n'existe |
| `/mentions-legales`, `/confidentialite` | 404 | Rien n'existe |
| Chemin inconnu | 404 | Page Next par défaut, en anglais |

Aucune route n'émet de `Set-Cookie`. Aucun en-tête `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.

### Formulaires et endpoints

Un seul formulaire, dans `components/Footer.tsx`. Il est purement client (`onSubmit` appelle `preventDefault`). Pas d'`action`, pas de route API, pas d'envoi. Les champs n'ont pas d'attribut `name`.

Endpoints serveur : aucun. Pas d'upload. Pas de requête SQL, NoSQL ou shell.

### Dépendances et environnements

Dépendances directes de production : `next`, `react`, `react-dom`, `gsap`, `lucide-react`, `recharts`.

Aucune variable d'environnement n'est lue (`process.env` absent du code applicatif). Aucun fichier `.env` n'est versionné. gitleaks sur les 6 commits : **aucune fuite**.

`.gitignore` ignore `.env*.local` et pas `.env`.

### Contenu et données personnelles

Coordonnées publiques répétées : téléphone, deux adresses (Courbevoie, Bois-Colombes), adresse Gmail de contact. Noms et portraits de la direction. Trois actualités, dont deux décrivent des sorties d'élèves (latinistes de seconde à Rome, cinquièmes à Montmartre) et sont illustrées. Pas d'analytique, pas de bandeau cookies, pas de page juridique.

---

## Vérifications exécutées

| Commande | Résultat |
|---|---|
| `npm ci` | **Échec.** npm 10.9.7 : le lockfile ne satisfait pas la résolution actuelle de `picomatch` (`picomatch@2.3.1` vs exigence `4.0.7`, `picomatch@2.3.2` manquant). |
| `npm install` | Succès (432 paquets). Avertissement npm : `next@14.2.15` a une vulnérabilité, renvoi vers https://nextjs.org/blog/security-update-2025-12-11. Le lockfile modifié par cet install a été restauré et n'est pas dans le livrable. |
| `npx tsc --noEmit` | Succès, code de sortie 0. |
| `npx next lint` | **Échec**, code 1. Next demande de créer une config ESLint en interactif. Aucun `.eslintrc*` ni `eslint.config.*` dans le dépôt. Aucun fichier de config n'a été ajouté. |
| `npx next build` | Succès. 15 pages statiques. Avertissement Recharts pendant la génération de la page Lycée : largeur/hauteur de graphique à -1. `Browserslist` signale des données caniuse vieilles de 6 mois. |
| `npx next start` | Le site répond. Sondes ci-dessus. |
| gitleaks 8.28.0 `--redact` | 6 commits, ~392 Ko, **no leaks found**. trufflehog n'est pas installé ; le scan gitleaks couvre l'historique. |
| `npm audit` | 11 avis : 1 critique, 8 hauts, 1 modéré, 1 bas. Le paquet `next` porte l'avis critique. `postcss` (direct) et `eslint-config-next` (dev) sont hauts. |
| Lighthouse 12, page d'accueil, Chrome headless sur la VM | Performance 75, accessibilité 100, bonnes pratiques 96, SEO 100. Charge utile **9 058 KiB**. LCP laboratoire 46,1 s (machine d'audit, pas un mobile calibré : le chiffre absolu est gonflé, le poids ne l'est pas). Seule erreur console : `GET /favicon.ico` → 404. |

Le score Lighthouse accessibilité à 100 ne couvre pas l'usage clavier du scroll hijack ni le menu, qui ne sont pas exercés par un audit statique.

---

## 1. Sécurité

### Ce qui tient déjà

- Aucun secret, jeton ou clé dans l'arbre ni dans l'historique (gitleaks, 6 commits). Aucun `.env` versionné.
- Aucune utilisation de `dangerouslySetInnerHTML`, `eval`, `innerHTML` ou interpolation HTML dans le code du projet. Les textes passent par le texte React, donc échappés.
- `target="_blank"` vers Calendly et École Directe est accompagné de `rel="noopener noreferrer"`.
- Pas de stack trace renvoyée par une route applicative : il n'y a pas de handler d'erreur custom, et le 404 de production est la page générique Next, sans pile.
- `images.remotePatterns` ne contient que `picsum.photos`, pas un wildcard.
- Pas de journal applicatif qui écrirait un secret ou un e-mail (aucun `console.*` dans le code du projet).

### SEC-01 — Next.js 14.2.15 exposé à des dénis de service App Router

- **Sévérité :** P0
- **Preuves :** `package.json:16` (`"next": "14.2.15"`), lockfile `node_modules/next` version `14.2.15`. Avertissement à l'installation. `npm audit` : sévérité critique agrégée sur le paquet `next`. Avis éditeur : https://nextjs.org/blog/security-update-2025-12-11
- **Constat :** La version figée est antérieure à tous les correctifs de la branche 14.2 publiés depuis. L'avis du 11 décembre 2025 décrit, pour l'App Router :
  - un **déni de service** (CVE-2025-55184, correctif complet CVE-2025-67779) : une requête HTTP vers n'importe quel endpoint App Router peut bloquer le processus ;
  - l'exposition de code source de Server Functions (CVE-2025-55183) est indiquée pour Next 15+, pas pour la branche 14 dans ce même avis.
  - Le correctif indiqué par l'éditeur **pour rester en 14.x** est `next@14.2.35`.
  - `npm audit` au 30 septembre 2026 rattache en plus au paquet des avis dont la plage commence à Next 13 et s'arrête seulement en 15.5.15 ou 15.5.16 (déni de service Server Components, GHSA-q4gf-8mx6-v5v3, GHSA-8h8q-6873-q5fj, GHSA-h25m-26qc-wcjf). La correction proposée par `npm audit` est un saut majeur vers `next@16.3.7`.
  - Autres avis notables sur cette même version : contournement d'autorisation du **middleware** (GHSA-f82v-jwr5-mffw, critique, corrigé en 14.2.25 — pas exploitable aujourd'hui, aucun middleware), confusion de cache et injection de contenu sur l'optimiseur d'images, SSRF via redirection middleware, empoisonnement de cache.
- **Impact :** Un site public App Router peut être rendu indisponible par une requête, y compris hébergé sur Vercel. Il n'y a pas de contournement de configuration. Le jour où `/admin` serait protégé par un middleware sur cette version, le contournement critique du middleware s'appliquerait en plus.
- **Correctif :** Ne pas déployer 14.2.15. Monter au minimum sur `14.2.35` **et** revérifier `npm audit`. Si les avis dont la borne haute est 15.5.x couvrent encore 14.2.35, passer sur la dernière 15.5 ou 16 corrigée (16.3.x au moment de l'audit) plutôt que de rester sur une branche que l'éditeur ne rattrape plus. Aligner `eslint-config-next`. Refaire `npm ci`, le build et un essai des pages. Prévoir le coût de migration (React 19, `cookies()` / `params` asynchrones à partir de Next 15) avant d'écrire le CMS, pour ne pas le réécrire deux fois.

### SEC-02 — Aucune mention légale ni politique de confidentialité

- **Sévérité :** P0
- **Preuves :** Aucun fichier `app/mentions-legales` ni `app/confidentialite`. `GET /mentions-legales` et `GET /confidentialite` → 404. Le footer promet pourtant ce document : `components/Footer.tsx:42-44`. Aucun lien juridique dans `components/Footer.tsx`, `components/SidebarMenu.tsx`, `app/layout.tsx`.
- **Constat :** Un site d'établissement publié à titre professionnel doit identifier son éditeur (LCEN). Le traitement des données des familles (contact par e-mail, éventuelle newsletter, cartes Google, photos) doit être expliqué (RGPD). Le public comprend des parents et des élèves mineurs : la base légale, la durée de conservation, les destinataires et les droits doivent être écrits quelque part de joignable.
- **Impact :** Mise en ligne non conforme, et impossibilité pour une famille de savoir qui traite quoi. Le CMS, plus tard, ne doit pas servir à « remplir » ces pages au fil de l'eau sans relecture juridique : le document mini-CMS les laisse d'ailleurs hors éditeur.
- **Correctif :** Deux pages statiques, reliées depuis le footer de toutes les pages, rédigées avec l'établissement (raison sociale, responsable de publication, hébergeur, contact, finalités, base légale, durée, sous-traitants, droits, spécificité mineurs). Les publier avant le reste.

### SEC-03 — Newsletter factice qui invoque une politique absente

- **Sévérité :** P1
- **Preuves :** `components/Footer.tsx:31-52`. Le composant est client (`Footer.tsx:1`). `onSubmit` annule l'envoi. Champs `Prénom *` et `Courriel *` sans `name`, sans `<label>`, sans `required` effectif. Case à cocher non requise, texte non cliquable vers une page. Pas de honeypot, pas de limite de débit, pas d'endpoint.
- **Constat :** Le bouton dit « Envoyer ». Rien n'est transmis, rien n'est confirmé à l'écran. La case cite « les conditions et la politique de confidentialité », documents qui n'existent pas (SEC-02).
- **Impact :** Information trompeuse pour les familles. Si le formulaire est branché plus tard sur un outil d'e-mailing sans rate-limit, sans preuve de consentement et sans politique, il collectera des prénoms et e-mails de parents d'élèves.
- **Correctif :** Avant la mise en ligne, retirer le formulaire, ou le remplacer par un texte du type « inscription bientôt disponible » sans champs. Le jour où il enverra vraiment : endpoint serveur, validation, consentement horodaté, lien vers la politique, anti-spam, rate-limit (Redis en production, échec fermé), et pas de prénom obligatoire si l'e-mail suffit.

### SEC-04 — Aucun en-tête de sécurité

- **Sévérité :** P1
- **Preuves :** `next.config.js:1-14` (aucune clé `headers` ni `poweredByHeader`). Réponse réelle de `GET /` : `X-Powered-By: Next.js`, pas de CSP, HSTS, `X-Frame-Options` / `frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- **Constat :** Le document est intégrable dans une iframe. Le navigateur n'a pas de politique de contenu. HSTS ne peut de toute façon être honoré qu'en HTTPS chez l'hébergeur ; il doit quand même être posé en production.
- **Impact :** Clickjacking à impact limité sur une brochure, mais le site pousse vers École Directe et Calendly. Une CSP absente laissera aussi passer, plus tard, un HTML collé depuis le CMS si quelqu'un ajoute un rendu riche. Aujourd'hui le XSS stocké n'a pas de puits dans le code.
- **Correctif :** Fonction `headers()` dans `next.config.js` (ou équivalent de la version Next retenue) : `Content-Security-Policy` compatible avec `next/font` et, seulement si les iframes Maps restent, `frame-src` limité à Google ; `X-Content-Type-Options: nosniff` ; `Referrer-Policy: strict-origin-when-cross-origin` ; `Permissions-Policy` minimal ; `X-Frame-Options: DENY` ou `frame-ancestors 'none'` ; `Strict-Transport-Security` en production ; `poweredByHeader: false`.

### SEC-05 — `.env` non ignoré, aucun contrat d'environnement

- **Sévérité :** P1
- **Preuves :** `.gitignore:27-28` ignore uniquement `.env*.local`. Pas de `.env.example`. Aucune lecture de `process.env`.
- **Constat :** gitleaks ne trouve rien aujourd'hui. Le jour où `AUTH_SECRET`, `ADMIN_PASSWORD_HASH` ou `BLOB_READ_WRITE_TOKEN` seront mis dans un `.env` à la racine, `git add .` pourra les committer. Le mini-CMS interdit `ADMIN_PASSWORD` en clair en production.
- **Impact :** Fuite future de secrets au premier commit un peu rapide. Historique à réécrire si cela arrive.
- **Correctif :** Ignorer `.env`, `.env.*`, et ré-autoriser explicitement `.env.example`. Ajouter un exemple sans valeur, listant les clés du mini-CMS. Ne jamais committer de hash de mot de passe ni de jeton. Si un secret est un jour poussé : le révoquer / le faire tourner, pas seulement le supprimer du fichier.

### SEC-06 — Tiers chargés sans cadre cookies

- **Sévérité :** P1
- **Preuves :**
  - Google Maps : `components/AdresseCards.tsx:8-17` et `24-33`, iframes `google.com/maps`, sans `sandbox`, `referrerPolicy="no-referrer-when-downgrade"`. Page `app/a-propos/information-generale/page.tsx:163-165`.
  - Image tierce : `app/a-propos/page.tsx:13` (`https://picsum.photos/1920/600?random=about`), autorisée par `next.config.js:4-10`. Confirmé dans le HTML servi.
  - Calendly : `app/contact/page.tsx:9-10` et `50-58`. Le commentaire dit « À configurer ». Un `HEAD` anonyme vers cette URL répond 200 : il faut confirmer que le compte est bien celui de l'école.
- **Constat :** Pas de bandeau, pas de page qui liste ces tiers. `next/font` évite un appel runtime vers Google Fonts : c'est le bon choix, à conserver. Il n'y a pas de gtag ni d'autre analytique.
- **Impact :** L'iframe Maps peut déposer des cookies Google avant tout consentement. Picsum reçoit l'adresse IP des visiteurs de `/a-propos` et affiche une photo aléatoire, étrangère à l'école.
- **Correctif :** Retirer picsum et mettre une photo de l'établissement, ou dépublier `/a-propos` tant qu'elle n'est qu'un placeholder (elle n'est pas dans le menu). Pour les cartes : image statique ou iframe chargé au clic, et mention dans la politique. Confirmer l'URL Calendly avec l'établissement. Pas de bandeau tant qu'aucun traceur ne part tout seul.

### SEC-07 — Illustrations de sorties d'élèves sans trace de consentement

- **Sévérité :** P0
- **Preuves :** `data/actualites.ts:20-35` (séjour de latinistes de seconde à Rome ; cinquièmes à Montmartre). Fichiers `public/images/nouvelles/rome-latin.jpg`, `public/images/nouvelles/cinquiemes-montmartre.jpg`. Pages SSG `/nouvelles/rome-latin` et `/nouvelles/cinquiemes-montmartre`. Portraits nommés de la direction : `app/a-propos/college/page.tsx:15-18`, `app/a-propos/lycee/page.tsx:17-25`.
- **Constat :** L'audit n'a pas déterminé si les photos montrent des visages identifiables : ce n'est pas le rôle de ce document de le trancher en les publiant ici. Les textes, eux, parlent nommément de groupes d'élèves mineurs, et les images partent avec le site. Aucun registre, aucune mention « photo avec autorisation », aucune politique ne figure dans le dépôt. Les portraits de la direction sont une autre base (information institutionnelle) et doivent simplement être couverts par la politique et l'accord interne des personnes.
- **Impact :** Publication de données concernant des mineurs (image, contexte religieux ou scolaire) sans information aux familles.
- **Correctif :** Avant la mise en ligne, faire valider par la direction la liste des médias : droit à l'image, information RGPD, durée. Retirer du build toute photo non couverte. Ne pas committer de photos d'élèves « en attendant ».

### SEC-08 — Contact des familles sur une boîte Gmail

- **Sévérité :** P1
- **Preuves :** `app/contact/page.tsx:43-46`, `components/Footer.tsx:75-79`. Même adresse aux deux endroits.
- **Constat :** L'adresse est publique, ce n'est pas un secret divulgué par erreur. C'est une boîte grand public, pas un domaine d'établissement. Les parents y enverront des informations sur leurs enfants (niveau, situation, rendez-vous).
- **Impact :** Données de familles chez un sous-traitant non cadré dans le dépôt, accès difficile à gouverner (mot de passe personnel, pas de journal d'établissement, conservation opaque).
- **Correctif :** Adresse sur le domaine de l'école, personnes habilitées identifiées, mention dans la politique de confidentialité. Le texte de l'adresse, lui, a vocation à passer dans `SiteContent` le jour du CMS.

### SEC-09 — `npm ci` ne peut pas réinstaller le lockfile

- **Sévérité :** P1
- **Preuves :** `package-lock.json` (`lockfileVersion` 3). `npm ci` avec npm 10.9.7 échoue : `picomatch@2.3.1` ne satisfait pas `picomatch@4.0.7`, `picomatch@2.3.2` absent (dépendances imbriquées `tinyglobby` / `micromatch` / peer optionnel de `fdir`). `npm install` passe et réécrit le lockfile.
- **Constat :** Le build local a pu être fait après `npm install`. Une CI ou un Vercel configuré en install strict peut refuser le lockfile, ou résoudre autre chose que ce qui a été audité.
- **Impact :** Déploiement non reproductible. Mise à jour de transitive non revue.
- **Correctif :** Régénérer le lockfile avec la version de npm utilisée en CI / sur Vercel, committer, et faire de `npm ci` un passage obligé. À combiner avec SEC-01 pour ne pas figer une deuxième fois Next 14.2.15.

### SEC-10 — PostCSS 8.5.8 vulnérable

- **Sévérité :** P1
- **Preuves :** `package.json` dépendance directe `postcss` `^8.4.49`. Lockfile : `postcss@8.5.8`. `npm audit` : sévérité haute (XSS via `</style>` non échappé dans la sérialisation CSS ; lecture de fichiers via `sourceMappingURL` dans un commentaire CSS). `npm outdated` indique un correctif de ligne en 8.5.28.
- **Constat :** Le CSS du dépôt est écrit par l'équipe, pas par les visiteurs. Le risque immédiat est celui d'un CSS hostile au moment du build, pas un XSS sur la page publique actuelle.
- **Impact :** Devient réel si un contenu CMS ou un fichier CSS non relu alimente PostCSS, ou si une chaîne de build traite du CSS externe.
- **Correctif :** Monter `postcss` sur la version corrigée de la ligne 8.5, dans le même geste que SEC-09.

### SEC-11 — Avis hauts limités aux outils de développement

- **Sévérité :** P2
- **Preuves :** `npm audit` : `eslint` 8.57.1 déprécié et sans support ; `eslint-config-next@14.2.15` via `glob` (injection de commande dans la CLI `glob`, plage 10.2–10.4.5) ; `brace-expansion`, `js-yaml`, `nanoid`, `baseline-browser-mapping`, `postcss-selector-parser` en transitif. Avertissements `npm install` : `glob@7` / `glob@10.3`, `inflight`, `rimraf@3`.
- **Constat :** Ces paquets ne sont pas servis aux visiteurs tant qu'ESLint reste en `devDependencies`. Ils comptent sur les machines de build et les postes.
- **Impact :** Pas un RCE du site public. Une CI qui lancerait la CLI `glob` sur une entrée hostile serait concernée ; ce n'est pas le cas ici.
- **Correctif :** En montant Next (SEC-01), prendre l'ESLint et `eslint-config-next` de la même ligne. Ne pas promouvoir ESLint en dépendance de production.

### SEC-12 — Pas de rate-limit ni de CSRF, parce qu'il n'y a rien à protéger

- **Sévérité :** P2
- **Preuves :** Aucun `app/api/**`. Formulaire footer annulé côté client (`components/Footer.tsx:31`).
- **Constat :** Rien à forger, rien à inonder côté application. Ce constat change dès qu'un login admin ou une newsletter serveur existe. La méthode mini-CMS exige un rate-limit Redis en production, échec fermé s'il manque.
- **Impact :** Nul aujourd'hui. Élevé si `/api/admin/login` est ajouté sans ces contrôles.
- **Correctif :** Ne pas ajouter d'endpoint mutant sans validation serveur, cookie `SameSite`, et limite de débit. Détail en section CMS.

### SEC-13 — Page d'erreur générique en anglais

- **Sévérité :** P2
- **Preuves :** Pas de `app/not-found.tsx` ni `app/error.tsx`. `GET /cette-page-nexiste-pas` → 404, corps « 404: This page could not be found. » Le HTML de cette page Next contient un `dangerouslySetInnerHTML` de feuille de style **du framework**, pas du projet.
- **Constat :** Pas de fuite de pile en production sur ce 404. L'expérience et la langue ne sont pas celles du site. Aucun `global-error` maison.
- **Impact :** Mineur pour la sécurité. Gênant pour les familles et pour le référencement des URL cassées.
- **Correctif :** `app/not-found.tsx` en français, avec le menu et un lien vers l'accueil. `app/error.tsx` qui n'affiche pas l'objet erreur au visiteur.

---

## 2. Authentification et autorisation

### AUTH-01 — Aucune authentification, ce qui est cohérent avec le site actuel

- **Sévérité :** P2
- **Preuves :** Pas de `middleware.ts`. Pas de cookie (`Set-Cookie` absent sur `/`, `/contact`, `/admin`). `/admin` et `/api/admin/login` répondent 404. Aucun mot de passe, rôle ou session dans le code.
- **Constat :** Brochure publique. Il n'y a pas de zone à autoriser. Il n'y a pas non plus de rôle rédacteur / lecteur à faire évoluer.
- **Impact :** Nul tant que personne n'ajoute un accès restreint « en vitesse ».
- **Correctif :** Conserver l'absence de compte visiteur. Le seul accès à créer est celui du mini-CMS, selon AUTH-02.

### AUTH-02 — Rien du modèle d'auth mini-CMS n'existe ; ne pas ouvrir `/admin` sans lui

- **Sévérité :** P1 pour la brochure. **Bloquant avant d'exposer `/admin`.**
- **Preuves :** Recherche dans le dépôt : pas de `admin-auth`, `admin-sessions`, `scrypt`, `timingSafeEqual`, `AUTH_SECRET`, `ADMIN_PASSWORD`, cookie de session, Upstash. Seule occurrence « admin » : aucune route.
- **Constat :** La méthode jointe (document mini-CMS, sections 2, 3 et 6) demande, en production :

  | Exigence | État dans ce dépôt |
  |---|---|
  | `ADMIN_PASSWORD_HASH` scrypt (`N=16384`), script `hash-admin-password` | Absent |
  | Refus de `ADMIN_PASSWORD` en clair hors développement | Absent (rien ne distingue les environnements) |
  | `AUTH_SECRET` ≥ 32 caractères, distinct du mot de passe, pepper HMAC-SHA256 du jeton | Absent |
  | Cookie httpOnly, `Secure` en prod, `SameSite=lax`, durée 2 h, valeur = jeton opaque | Absent |
  | Session Redis Upstash, clé = digest HMAC, epoch de révocation | Absent |
  | JSON local uniquement hors production | Absent |
  | Rate-limit login, échec fermé sans Redis en prod | Absent |
  | Vérification `timingSafeEqual` | Absent |
  | Contrôle d'accès sur `POST /api/admin/save` côté serveur | Route absente |
  | `/admin` en `noindex` | Absent |

  Le modèle est mono-opérateur : un mot de passe, pas de RBAC. C'est assumé par la méthode. Il ne faut pas inventer des rôles. Il ne faut pas non plus « protéger » l'admin par un secret dans une variable `NEXT_PUBLIC_*`, par un mot de passe comparé dans un composant client, ou par un cookie égal au mot de passe.

  Middleware : utile pour rediriger `/admin`, **après** SEC-01. Sur Next 14.2.15, un middleware d'auth est contourable (GHSA-f82v-jwr5-mffw). Même corrigé, le middleware ne remplace pas le contrôle dans chaque route `save` / `upload`.
- **Impact :** Toute implémentation partielle (mot de passe en clair dans Vercel, cookie devinable, check seulement dans le composant React) expose la réécriture de tout le contenu public.
- **Correctif :** Implémenter le découpage du document : `lib/admin-auth.ts`, `lib/admin-sessions.ts`, routes `app/api/admin/{login,logout,save}`, gate dans `app/admin/page.tsx`. Production refusée si le hash, le secret ou Redis manquent. Rotation d'`AUTH_SECRET` = invalidation des sessions. Pas de valeur de secret dans le dépôt ni dans les logs.

---

## 3. Qualité de code

### Ce qui tient déjà

- `strict: true`, `tsc --noEmit` propre, y compris `React.ReactNode` dans `app/a-propos/information-generale/page.tsx` via les types globaux de React.
- Nommage lisible, composants par page, peu de `any` (aucun relevé).
- Pas de `TODO` / `FIXME` oubliés, pas de `console.log`.
- Le build de production réussit et les slugs d'actualités sont générés (`generateStaticParams`).

### CODE-01 — `next lint` est inutilisable

- **Sévérité :** P1
- **Preuves :** `package.json:12` script `"lint": "next lint"`. ESLint et `eslint-config-next` sont en devDependencies (`package.json:27-28`). Aucun fichier de configuration. Exécution : invite interactive « How would you like to configure ESLint? », code de sortie 1.
- **Constat :** Le script affiché dans `package.json` ne peut pas servir de garde en CI.
- **Impact :** Régressions (hooks, images, accessibilité jsx-a11y) non détectées. Le landing de 1 195 lignes est précisément le genre de fichier qu'un lint hooks aurait dû surveiller.
- **Correctif :** Ajouter la config ESLint recommandée par la version de Next retenue, en non interactif. Faire échouer la CI sur erreur.

### CODE-02 — Pas de tests, pas de CI, pas de script de typecheck

- **Sévérité :** P1
- **Preuves :** `package.json` scripts : `dev`, `build`, `start`, `lint` seulement. Pas de `.github/workflows`. Pas de dossier de tests. `engines.node` est large (`>=18`) sans version figée pour la CI.
- **Constat :** Le typecheck lancé pour cet audit passe, mais rien ne le relance. Les six commits vont de messages réels (« ajout d'un footer », « bug page d'accueil ») à des messages placeholder (« Votre message de commit », « Description de tes changements »).
- **Impact :** Le prochain correctif de la landing ou l'extraction CMS peut casser une page sans signal.
- **Correctif :** Workflow minimal : `npm ci`, `tsc --noEmit`, `next lint`, `next build`. Une poignée de tests de routes (200 sur les pages, 404 sur un slug inconnu) suffit pour commencer.

### CODE-03 — Landing monolithique et état global module

- **Sévérité :** P2
- **Preuves :** `components/ScrollHijackLanding.tsx` (1 195 lignes). État module `landingEngineRevision` et listeners : lignes 14-29. Écoute `wheel` / `touchmove` en `preventDefault` : lignes 817-890. Textes en dur : lignes 191-218. Second menu copié : lignes 1123-1192.
- **Constat :** La page d'accueil est un moteur d'animation impératif (refs DOM, `requestAnimationFrame`, phases `fwd_p1` / `fwd_p2` / `back_p1` / `back_p2`) mêlé au markup. L'historique git montre deux réécritures larges de ce fichier (`5fcccb0`, `6841649`).
- **Impact :** Coût de modification élevé au moment d'extraire les trois encadrés vers `SiteContent`. Risque de régression visuelle à chaque correctif.
- **Correctif :** Laisser le moteur en place pour la mise en ligne si le comportement actuel est accepté, puis isoler les constantes de contenu (textes, images, liens) dans un module de données avant le CMS. Ne pas réécrire l'animation dans le même ticket que l'admin.

### CODE-04 — Code mort et dépendances inutiles

- **Sévérité :** P2
- **Preuves :** `components/ScrollLanding.tsx` n'est importé par aucune page. `components/scroll/*` n'est importé que par `ScrollLanding` (et `ScrollContainer.tsx` importe `gsap`). `components/ActualitesTimeline.tsx` n'est importé nulle part. `lucide-react` n'est importé nulle part. `app/page.tsx` utilise `ScrollHijackLanding` et `ActualitesGrid`.
- **Constat :** Environ 700 lignes et deux dépendances (`gsap`, `lucide-react`) ne participent pas au site servi. Les README images décrivent encore parfois l'ancien découpage.
- **Impact :** Bruit pour la personne qui branchera le CMS. Surface `npm audit` élargie pour rien.
- **Correctif :** Supprimer le landing abandonné, le dossier `components/scroll`, `ActualitesTimeline`, puis retirer `gsap` et `lucide-react` si plus rien ne les importe. Vérifier le build.

### CODE-05 — Chiffres collège et lycée identiques

- **Sévérité :** P1
- **Preuves :** `app/a-propos/college/page.tsx:73-76` et `app/a-propos/lycee/page.tsx:74-77` : les deux pages affichent « 240 élèves » et « 19 professeurs ». Les légendes diffèrent (6e–3e vs 2de–terminale).
- **Constat :** Copier-coller probable. Les pourcentages de brevet (`college/page.tsx:65`) et de bac (`data/resultats.ts:52`) ne sont pas les mêmes, donc tout n'a pas été dupliqué.
- **Impact :** Information fausse possible sur un site d'école, reprise telle quelle par les familles.
- **Correctif :** Faire confirmer les deux jeux de chiffres avant publication. Même correction à prévoir pour les résultats de bac (`data/resultats.ts:49-83`), qui sont présentés comme des données réelles (2023, 2024, 2025).

### CODE-06 — Cinq images référencées sont absentes

- **Sévérité :** P1
- **Preuves :** `app/a-propos/information-generale/page.tsx:48-71` pointe vers `materiel-scolaire.jpg`, `menu-scolaire.jpg`, `services.jpg`, `calendrier.jpg`, `extrascolaire.jpg`. Ces fichiers ne sont pas dans `public/images/informations-generales/`. `GET` local → 404. `components/SafeSectionImage.tsx:5-9` avale l'erreur et rend un rectangle gris, sans texte alternatif de repli visible.
- **Constat :** Cinq rubriques sur huit montrent un bloc vide. Le composant a été écrit pour masquer le trou.
- **Impact :** Page « Informations générales » inachevée, visible en production. Les rubriques Transport, Uniforme et Installations ont, elles, des médias présents.
- **Correctif :** Ajouter les fichiers ou retirer l'emplacement d'image tant qu'ils n'existent pas. Ne pas compter sur le rectangle gris comme état final.

### CODE-07 — Valeurs magiques et chrome dupliqué

- **Sévérité :** P2
- **Preuves :** Vert `#14532d` dans `components/Footer.tsx:3`, `components/ResultatsSection.tsx:83-89`, `app/a-propos/information-generale/page.tsx:11`. Autre vert `#1F7A5A` dans `components/ScrollHijackLanding.tsx:177`. Navbar répétée : `components/Navbar.tsx:14-74` et `components/ScrollHijackLanding.tsx:1123-1192`. Coordonnées répétées entre footer, contact et `AdresseCards`.
- **Constat :** Tailwind n'a pas de couleur de marque dans `tailwind.config.ts`. Deux implémentations du bandeau peuvent diverger (liens, hauteur, menu).
- **Impact :** Un changement d'adresse ou de libellé devra être fait à plusieurs endroits, y compris après l'arrivée du CMS si l'extraction est incomplète.
- **Correctif :** Un module `site` pour l'identité (nom, téléphone, e-mails, adresses, couleur). Un seul composant de navigation, paramétré, utilisé par la landing et par les pages intérieures.

### CODE-08 — Texte de chantier visible par le public

- **Sévérité :** P2
- **Preuves :** `app/nouvelles/[slug]/page.tsx:33-35` : « Page à enrichir via le CMS (texte et photos supplémentaires). » Confirmé dans le HTML de `/nouvelles/goodies-40-ans`. `app/contact/page.tsx:9` : commentaire « À configurer » sur l'URL Calendly, commentaire non servi mais URL publiée.
- **Constat :** L'extrait d'actualité fait office de corps d'article. La page le dit elle-même.
- **Impact :** Aspect non terminé. Les extraits contiennent aussi une URL HelloAsso brute et des emojis (`data/actualites.ts:16-17`), affichés tels quels.
- **Correctif :** Retirer la phrase de chantier. Décider si l'article public est l'extrait seul ou un corps plus long, avant d'ouvrir l'éditeur.

### CODE-09 — Noms de fichiers, README et doublon de dossier accentué

- **Sévérité :** P2
- **Preuves :**
  - `public/images/college/collage-3.JPG` et `public/images/lycee/header.JPG` : extensions en majuscules. Les README du dossier demandent souvent `.jpg`.
  - `public/images/projet-educatif/header.jpg.webp` servi par `app/a-propos/projet-educatif/page.tsx:35`, alors que le README demande `header.jpg`.
  - Deux arborescences git : `public/images/informations-generales/` et `public/images/informations-générales/`. La seconde contient en plus `header.jpg`. Le code pointe vers le dossier sans accent et vers `public/images/informations-generales-header.jpg`. Les deux JPEG de 7,1 Mo répondent HTTP 200 si l'URL est encodée en UTF-8.
  - Empreintes identiques : `college/direction-1.jpg` = `lycee/direction-1.jpg`, `college/direction-3.jpg` = `lycee/direction-3.jpg`, `landing/3.JPG` = `lycee/header.JPG`.
- **Constat :** Vercel tourne sur un système sensible à la casse : les chemins du code correspondent aux fichiers réels aujourd'hui. Un « rangement » qui suivrait les README casserait les images. Le dossier accentué double environ 8 Mo et prête à confusion sur macOS.
- **Impact :** Images cassées au prochain renommage. Poids du dépôt inutile.
- **Correctif :** Un seul dossier, extensions en minuscules, chemins mis à jour dans le même commit, README alignés. Les doublons de portraits (mêmes personnes) peuvent rester assumés.

---

## 4. Architecture, performance, SEO, accessibilité

### ARCH-01 — Le contenu et la présentation sont le même fichier

- **Sévérité :** P2 (devient le cœur du chantier CMS, détaillé en CMS-02)
- **Preuves :** Textes dans le JSX de chaque `page.tsx`. Seules exceptions structurées : `data/actualites.ts`, `data/resultats.ts`. `components/ResultatsSection.tsx` reçoit déjà ses données en props : c'est le seul bloc vraiment prêt à être branché.
- **Constat :** Pas de couche `getContent()`. Pas de séparation qui permettrait de changer une phrase sans toucher au layout. C'est l'écart principal avec la règle A du mini-CMS.
- **Impact :** L'éditeur ne peut pas être posé « au-dessus » du site sans une passe d'extraction.
- **Correctif :** Voir CMS-02. Ne pas commencer par l'UI admin.

### ARCH-02 — Poids des images et pas d'optimisation Next

- **Sévérité :** P1
- **Preuves :** `public/` ≈ 35,8 Mo. Les plus gros fichiers : `informations-generales/collage-3.3.jpg` et sa copie accentuée (7,1 Mo chacun), `landing/1.jpg` (4,1 Mo, servi en 200), `college/header.jpg` (3,2 Mo), `lycee/header.JPG` et `landing/3.JPG` (2,2 Mo). Aucun `import Image from "next/image"` dans une page servie (`ParallaxImage.tsx` l'utilise mais n'est pas monté). Lighthouse page d'accueil : 9 058 KiB transférés, économie estimée de plusieurs Mo en formats modernes et en dimensions adaptées. Build : pas de pipeline d'images.
- **Constat :** Les `<img>` du dossier `public` sont envoyés tels quels, y compris sur mobile. Le LCP laboratoire à 46 s est celui de la VM d'audit et ne doit pas être cité comme mesure terrain ; le volume transféré, lui, est réel.
- **Impact :** Pages lentes en 4G, coût de bande passante, mauvais signal Core Web Vitals une fois le domaine public mesuré.
- **Correctif :** Exporter des WebP/AVIF plafonnés (bandeaux autour de 200–400 Ko, pas 4 Mo). Passer les images de contenu en `next/image` avec `sizes`, après le correctif Next de SEC-01 (l'optimiseur d'images de 14.2.15 a ses propres avis). Retirer la copie accentuée.

### ARCH-03 — SEO de base incomplet

- **Sévérité :** P1
- **Preuves :** `app/layout.tsx:17-20` : `title` et `description` seulement. Pas de `metadataBase`, `openGraph`, `twitter`, canonical, icône. Pas de `app/robots.ts` ni `app/sitemap.ts` (`robots.txt` absent, Lighthouse : contrôle non applicable). `GET /favicon.ico` → 404 (seule erreur console Lighthouse). Page d'accueil : le titre visible des encadrés est un `<h3>` (`ScrollHijackLanding.tsx:1051`), le bloc du dessous est un `<h2>` (`app/page.tsx:11`). Pas de `<h1>` sur `/`. `/a-propos/information-generale/page.tsx:109` ajoute un second `<h1>` sous celui de `PageHeader`.
- **Constat :** Chaque page intérieure définit son `title` et sa `description`. `lang="fr"` est posé. Lighthouse SEO de laboratoire donne 100 parce que title, meta description et viewport sont présents. Il n'y a pas de fichier d'exploration pour un moteur.
- **Impact :** Partages sociaux sans image ni titre dédié. Favicon manquant. Page d'accueil sans H1. Indexation possible (rien ne la bloque) mais sans sitemap.
- **Correctif :** `metadataBase` sur l'URL canonique réelle, Open Graph, `app/icon`, `app/robots.ts`, `app/sitemap.ts` listant les routes publiques (et excluant `/admin` le jour venu). Un seul H1 par page.

### ARCH-04 — Scroll hijack et menu peu utilisables autrement qu'à la souris

- **Sévérité :** P1
- **Preuves :** `components/ScrollHijackLanding.tsx:817-890` : `preventDefault` sur la molette et le touch quand le carrousel est actif. Aucun `keydown`. `app/globals.css:69-76` désactive l'animation CSS si `prefers-reduced-motion: reduce`, pas le moteur JS. Menu : bouton `aria-label="Menu"` sans `aria-expanded` (`ScrollHijackLanding.tsx:1131-1136`, `Navbar.tsx:21-26`). Panneau sans `role="dialog"`, sans piège de focus, sans Échap. Overlay `aria-hidden` (`Navbar.tsx:61`). Logos `alt=""` (`Footer.tsx:15`, `Navbar.tsx:33`, landing ligne 1150) alors que le texte « Hautefeuille » est à côté : acceptable pour un décor, à condition que le nom reste textuel (c'est le cas).
- **Constat :** Le carrousel ne se parcourt pas au clavier. Le mouvement réduit n'est respecté que pour l'apparition CSS des encadrés. Le menu mobile n'est pas exposé comme une boîte de dialogue.
- **Impact :** Visiteurs clavier, lecteurs d'écran et personnes sensibles au mouvement. Lighthouse accessibilité à 100 ne contredit pas ce constat : il n'a pas piloté le carrousel.
- **Correctif :** Flèches ou liens d'évitement « Aller au contenu », respecter `prefers-reduced-motion` en sautant le hijack, `aria-expanded` + fermeture Échap + focus renvoyé au bouton. À traiter avec CODE-03, pas forcément avant une première mise en ligne si l'établissement accepte le délai, d'où le classement P1 et non P0.

### ARCH-05 — Contact absent du menu mobile

- **Sévérité :** P1
- **Preuves :** `components/SidebarMenu.tsx:6-14` : pas d'entrée Contact. Le lien Contact est dans le bandeau `hidden ... md:flex` (`components/Navbar.tsx:36-50`, `ScrollHijackLanding.tsx:1156-1171`). Sous `md`, le côté droit du bandeau est un espace vide (`Navbar.tsx:52`).
- **Constat :** Sur un téléphone, le menu latéral ne mène pas à `/contact`. Le footer, lui, affiche téléphone et e-mail, donc les coordonnées restent atteignables après défilement. Le bouton Calendly, uniquement sur `/contact`, ne l'est pas.
- **Impact :** Parcours famille sur mobile incomplet.
- **Correctif :** Ajouter Contact (et, si souhaité, École Directe) à `MENU_ITEMS`. Un seul menu, cf. CODE-07.

### ARCH-06 — Coquille de page non partagée

- **Sévérité :** P2
- **Preuves :** `app/a-propos/layout.tsx` enveloppe Navbar + Footer. `app/contact/page.tsx`, `app/nouvelles/page.tsx` et `app/nouvelles/[slug]/page.tsx` répètent l'enveloppe. `app/page.tsx` n'utilise pas `Navbar` : la landing a le sien. `/a-propos` n'est pas dans le menu.
- **Constat :** Trois façons d'assembler une page. Branchement de `getContent()` à faire dans chaque entrée.
- **Impact :** Oubli probable du footer ou du `noindex` admin le jour du CMS.
- **Correctif :** Layout racine qui place le footer, layout marketing pour le menu, landing exclue explicitement. `/admin` aura son layout `noindex`, séparé.

### ARCH-07 — La page Lycée embarque Recharts

- **Sévérité :** P2
- **Preuves :** Build : `/a-propos/lycee` First Load JS **190 kB**, dont 103 kB de page, contre ~88–101 kB ailleurs. `components/ResultatsSection.tsx` est client à cause de Recharts. Avertissement au prérendu : width/height `-1`.
- **Constat :** Trois donuts pour une page éditoriale. Le prérendu serveur ne connaît pas la taille du conteneur.
- **Impact :** Téléchargement inutile pour lire un pourcentage. Graphique éventuellement vide une fraction de seconde, ou au prérendu.
- **Correctif :** `minWidth` / `minHeight` déjà partiellement posés (`ResultatsSection.tsx:29`) ; vérifier visuellement après hydratation. À plus long terme, un camembert CSS ou une image statique suffirait et sortirait Recharts du bundle.

---

## 5. Préparation au mini-CMS

Le document de méthode joint demande un mini-CMS maison : schéma TypeScript, defaults dans le code, surcharges JSON sur Vercel Blob, `/admin` mono-mot-de-passe. Référence d'origine : Next.js 16. Ce dépôt est **Next.js 14.2.15**. Ce n'est pas un autre framework.

### Verdict

Le site peut recevoir ce patron **sans migration de framework et sans changer l'organisation visuelle**. Il ne peut pas le recevoir proprement en l'état, pour quatre raisons indépendantes :

1. La version de Next doit être corrigée d'abord (SEC-01), idéalement vers une ligne encore patchée (15.5 ou 16), parce que le code d'auth du modèle utilise `cookies()` et que cet appel est synchrone en 14 et asynchrone à partir de 15. Écrire l'admin sur 14.2.15 puis monter de version, c'est le réécrire.
2. Aucun fichier du patron n'existe (AUTH-02, CMS-01).
3. Les textes visibles sont dans le JSX (CMS-02). La règle « zéro texte client en dur » est aujourd'hui non satisfaite sur toutes les pages.
4. Un document du dépôt prescrit Sanity pour les résultats du bac (CMS-03), en conflit avec le choix de Félix.

Adaptation de chemins recommandée, une fois Next à jour : garder `app/` à la racine et créer `lib/` (pas un déménagement vers `src/`). Le modèle `src/lib/admin-auth.ts` devient `lib/admin-auth.ts`, `src/app/admin` devient `app/admin`. Le comportement décrit dans la méthode ne change pas.

Écarts d'API à prévoir si la cible est Next 16 plutôt que 14 :

| Sujet | Next 14.2 (ici) | Next 15 / 16 (modèle mini-CMS) |
|---|---|---|
| `cookies()`, `headers()` | synchrones | asynchrones, à `await` |
| `params` de page | objet synchrone (`app/nouvelles/[slug]/page.tsx:12-21`) | promesse |
| `revalidateTag` / `revalidatePath` | présents | présents, signature de `revalidateTag` à vérifier sur la version exacte |
| `unstable_cache` | présent | encore utilisable ; ne pas mélanger avec `"use cache"` sans décision |
| React | 18 | 19 sur Next 15+ |

Le cache actuel `s-maxage=31536000` (pages statiques) rend obligatoire le `revalidatePath` / `revalidateTag` après sauvegarde. C'est le piège n°3 de la méthode : sans invalidation, l'éditeur croit que l'enregistrement a échoué.

### CMS-01 — Checklist du patron : tout est à créer

- **Sévérité :** P1 pour la brochure. **Bloquant avant d'ouvrir `/admin`.**
- **Preuves :** Arborescence du dépôt. Aucune dépendance `@vercel/blob`. Aucune variable Blob, Redis ou `AUTH_SECRET`.

| Élément de la méthode | Présent |
|---|---|
| App Router + Tailwind | Oui |
| `lib/admin-auth.ts` | Non |
| `lib/admin-sessions.ts` | Non |
| `lib/site-content.ts` (`SiteContent`, defaults, `mergeContent`) | Non |
| `lib/content-store.ts` (Blob / JSON local) | Non |
| `app/admin` (login, éditeur, `noindex`) | Non |
| `app/api/admin/login\|logout\|save` | Non |
| Script `hash-admin-password` | Non |
| Variables Vercel (hash, secret, Upstash, Blob) | Non |
| `getContent()` dans les pages | Non |
| Pages juridiques hors CMS | Non (SEC-02) |

- **Impact :** Brancher un admin « minimum » sans ce découpage laisserait le mot de passe ou le JSON de contenu au mauvais endroit.
- **Correctif :** Suivre la checklist de la méthode après SEC-01, SEC-02 et SEC-05. Production : absence de hash → écran « non configuré » ; absence de Redis → 503 sur le login ; absence de Blob → 503 sur Enregistrer. Développement : JSON local, jamais commité (`data/` ou répertoire ignoré, pas le `data/*.ts` actuel qui est du code source).

### CMS-02 — Carte des textes à extraire

- **Sévérité :** P2 comme dette actuelle, travail obligatoire du chantier CMS.
- **Preuves :** pages listées ci-dessous. Règle A du document mini-CMS.

| Zone | Où c'est écrit aujourd'hui | Type de liste pour `mergeContent` |
|---|---|---|
| Identité, nav, footer, téléphone, e-mail, adresses | `SidebarMenu.tsx`, `Navbar.tsx`, `Footer.tsx`, `contact/page.tsx`, `AdresseCards.tsx` | Champs fixes |
| Trois encadrés de la landing | `ScrollHijackLanding.tsx:191-218` | Slots fixes (`mergeByIndex`) : le moteur suppose 3 images |
| Titre « Bienvenue à Hautefeuille » | `app/page.tsx:12` | Champ fixe |
| Actualités | `data/actualites.ts` | Liste libre (`preferArray`) |
| Collège / Lycée (texte, chiffres, direction) | `college/page.tsx`, `lycee/page.tsx` | Slots fixes pour la direction (3 personnes), champs pour les chiffres |
| Résultats bac | `data/resultats.ts` + `ResultatsSection` | Liste libre d'années, mentions contraintes par le type `MentionLabel` |
| Histoire et 12 fondements | `histoire/page.tsx:18-31` et corps de page | Fondements : liste libre |
| Projet éducatif | `projet-educatif/page.tsx:9-28` | Slots fixes (3), le layout alterne l'image |
| Informations générales | `information-generale/page.tsx:14-73` | Slots fixes (8 ancres) : l'UI dépend des `id` |
| Contact / Calendly | `contact/page.tsx` | Champs fixes. L'URL Calendly est une config tierce : la méthode la laisse hors CMS au départ ; ici elle est déjà un placeholder, autant la rendre éditable |
| Newsletter | `Footer.tsx` | Hors CMS tant que le formulaire n'envoie rien (SEC-03) |
| Pages juridiques | absentes | Hors CMS, pages dédiées |

Les couleurs de mentions (`data/resultats.ts:13-20`) sont de la présentation : les laisser dans le code, pas dans le JSON éditable, sinon un hex mal saisi casse le graphique. Le composant sait déjà dériver la couleur du label.

- **Impact :** Un `SiteContent` incomplet (labels éditables, valeurs « 240 » ou « 15 min » restées en dur) reproduit le piège n°1 de la méthode.
- **Correctif :** Écrire `DEFAULT_CONTENT` en copiant le texte actuel, brancher `mergeContent`, remplacer les chaînes par les props **sans changer les classes**. Un champ admin = un rendu réel. Onglets : Accueil, Collège, Lycée, Histoire, Projet, Infos pratiques, Actualités, Contact, Footer.

### CMS-03 — Le dépôt documente Sanity, pas le mini-CMS

- **Sévérité :** P1
- **Preuves :** `docs/CMS-RESULTATS.md:1-4` et `26-78` (schéma Sanity, requête GROQ). `data/resultats.ts:3-10` répète « Intégration CMS (Sanity) ». Aucune dépendance `sanity` ni `next-sanity` : ce n'est pas commencé, seulement prescrit.
- **Constat :** Deux méthodes contradictoires. Sanity ajouterait un studio, un projet hébergé, des jetons et un modèle de contenu parallèle, ce que la méthode jointe écarte explicitement.
- **Impact :** Le prochain intervenant peut installer Sanity « parce que c'est écrit dans `docs/` » et doubler la source de vérité des pourcentages de bac.
- **Correctif :** Marquer `docs/CMS-RESULTATS.md` comme obsolète ou le réécrire en types `SiteContent` (le tableau des couleurs, lui, reste utile). Une seule source : defaults + Blob.

### CMS-04 — Médias et uploads

- **Sévérité :** P2
- **Preuves :** La méthode, section 10, laisse les photos hors CMS au départ. Le site, lui, est tenu par ses images (ARCH-02, CODE-06). `next.config.js` n'autorise comme hôte distant que picsum.
- **Constat :** L'éditeur de textes peut vivre sans upload. Les rubriques vides et les JPEG de plusieurs mégaoctets ne seront pas réparés par un champ « légende ».
- **Impact :** Pression pour ajouter vite un upload non cadré (types MIME, taille, accès Blob public, contenu d'élèves).
- **Correctif :** Vague CMS = textes seulement. Vague ultérieure, si le besoin est confirmé : upload via la route dédiée de la méthode, Blob privé, types image limités, taille max, pas de SVG, et la même session admin que le save. Les photos d'élèves restent soumises à SEC-07.

### Ordre de branchement recommandé

1. SEC-01 (version Next) et SEC-09 (lockfile) ensemble.
2. SEC-02, SEC-03, SEC-07, CODE-05, CODE-06 : le site public peut alors être montré.
3. SEC-04, SEC-05, ARCH-02, ARCH-03, ARCH-05 : durcissement et finition.
4. CMS-01 + AUTH-02 + CMS-02, en copiant le patron, pas Sanity.
5. CODE-01, CODE-04, ARCH-04 : qualité une fois le contenu extrait.

---

## Plan de tickets proposé

Aucun ticket n'a été créé dans un outil externe. Les identifiants ci-dessous sont une proposition de découpage.

### Vague 0 — Bloquants avant production

**T0.1 — Corriger Next.js et rendre l'install reproductible**
Inclut SEC-01, SEC-09, SEC-10.
Critères d'acceptation : la version de `next` n'est plus dans les plages d'avis de déni de service RSC actives au moment du correctif ; `npm ci` réussit ; `next build` réussit ; les pages actuelles répondent. Si le saut est 15 ou 16, les `params` de `app/nouvelles/[slug]/page.tsx` compilent.

**T0.2 — Mentions légales et politique de confidentialité**
Inclut SEC-02.
Critères d'acceptation : `/mentions-legales` et `/confidentialite` répondent 200 ; éditeur, hébergeur, contact, finalités, droits et mention des mineurs sont rédigés avec l'établissement ; le footer de toutes les pages pointe vers les deux URL.

**T0.3 — Retirer la newsletter inerte**
Inclut SEC-03.
Critères d'acceptation : plus de bouton « Envoyer » qui n'envoie rien ; plus de case qui cite une politique absente. Si le formulaire reste, T0.2 est en production et l'envoi est réel, validé, limité en débit.

**T0.4 — Feu vert contenu de l'établissement**
Inclut SEC-07, SEC-08, CODE-05, et la confirmation Calendly (SEC-06).
Critères d'acceptation : liste écrite des photos autorisées ; chiffres collège et lycée confirmés ou corrigés ; adresse de contact institutionnelle ou acceptation explicite de la boîte actuelle, reportée dans la politique ; URL Calendly confirmée.

**T0.5 — Images manquantes des informations générales**
Inclut CODE-06.
Critères d'acceptation : chaque `src` servi par cette page répond 200, ou le bloc image est retiré. Plus de rectangle gris « par erreur ».

### Vague 1 — Durcissement

**T1.1 — En-têtes HTTP**
Inclut SEC-04.
Critères d'acceptation : la réponse de `/` contient CSP, nosniff, Referrer-Policy, Permissions-Policy, anti-frame ; plus de `X-Powered-By` ; HSTS actif sur le domaine HTTPS.

**T1.2 — Hygiène des secrets**
Inclut SEC-05.
Critères d'acceptation : `.env` est ignoré ; `.env.example` liste les clés sans valeur ; un essai `git status` après création d'un `.env` local ne le propose pas.

**T1.3 — Tiers et pages placeholder**
Inclut SEC-06, CODE-08.
Critères d'acceptation : plus d'appel à picsum ; cartes soit statiques soit chargées après action ; phrase « à enrichir via le CMS » retirée des articles publics.

**T1.4 — SEO minimum**
Inclut ARCH-03.
Critères d'acceptation : favicon 200 ; `robots.txt` et sitemap générés ; `metadataBase` et Open Graph sur le layout ; un H1 sur l'accueil.

**T1.5 — Contact joignable au mobile**
Inclut ARCH-05.
Critères d'acceptation : le menu latéral contient Contact sur une largeur inférieure à `md`, et le lien mène à `/contact`.

### Vague 2 — Mini-CMS

**T2.1 — Schéma et defaults**
Inclut CMS-02, CMS-03, ARCH-01.
Critères d'acceptation : `lib/site-content.ts` exporte `SiteContent`, `DEFAULT_CONTENT` complet et `mergeContent` ; une sauvegarde partielle ne vide pas une section ; `docs/CMS-RESULTATS.md` ne prescrit plus Sanity ; le layout visuel des sections est inchangé.

**T2.2 — Stockage Blob**
Critères d'acceptation : `getContent` / `saveContent` lisent un JSON privé via le SDK Blob en production et un JSON local ignoré par git en développement ; clé du type `hautefeuille-site-content.json` ; après save, `revalidateTag` et `revalidatePath` ; sans Blob en production, Enregistrer répond 503 et le site public continue d'afficher les defaults.

**T2.3 — Auth admin**
Inclut AUTH-02, SEC-12.
Critères d'acceptation : hash scrypt en production, mot de passe clair refusé hors dev ; cookie opaque httpOnly / Secure / SameSite=lax / 2 h ; clé Redis = HMAC-SHA256(`AUTH_SECRET`, jeton) ; `AUTH_SECRET` ≥ 32 et distinct du mot de passe ; rate-limit, échec fermé sans Redis en production ; `POST /api/admin/save` revérifie la session côté serveur ; `/admin` est `noindex` ; aucun secret dans les logs ni dans le dépôt.

**T2.4 — Éditeur**
Critères d'acceptation : onglets par zone, libellés en français indiquant l'emplacement à l'écran ; champs fixes sans ajout/suppression là où le layout est un slot ; listes libres avec ajout/suppression pour les actualités et les fondements ; smoke test manuel : login, modification d'un titre, enregistrement, rechargement forcé, le titre public a changé, logout, l'ancienne session ne sauve plus.

**T2.5 — Uploads**
Hors de cette vague (CMS-04), sauf demande contraire. Critère : aucune route d'upload mergée « au passage ».

### Vague 3 — Qualité et architecture

**T3.1 — CI**
Inclut CODE-01, CODE-02.
Critères d'acceptation : pull request refusée si `npm ci`, `tsc --noEmit`, lint ou build échoue.

**T3.2 — Alléger le dépôt**
Inclut CODE-04, CODE-09, ARCH-02.
Critères d'acceptation : plus de landing mort ni de `gsap` / `lucide-react` inutilisés ; un seul dossier d'infos générales ; images de hero sous un budget défini (par exemple 400 Ko) ; build toujours vert.

**T3.3 — Un seul chrome de navigation**
Inclut CODE-03 (extraction des textes seulement), CODE-07, ARCH-06.
Critères d'acceptation : un composant de menu ; coordonnées et couleur de marque définies une fois ; la landing consomme les mêmes données que le CMS.

**T3.4 — Accessibilité de la landing et du menu**
Inclut ARCH-04.
Critères d'acceptation : le contenu sous la landing est atteignable au clavier ; `prefers-reduced-motion` désactive le hijack ; le menu a un nom, un état ouvert/fermé et se ferme avec Échap.

**T3.5 — Page Lycée plus légère**
Inclut ARCH-07.
Critères d'acceptation : les pourcentages restent lisibles sans JavaScript ou le graphique a une taille non nulle au premier rendu ; le surcoût Recharts est accepté explicitement ou retiré.

---

## Annexe — Limites de cet audit

- Pas d'accès au projet Vercel, au domaine, ni aux boîtes mail. La config réelle de production peut différer du dépôt (aujourd'hui elle ne peut pas être meilleure que le code : il n'y a pas d'en-têtes dans le dépôt).
- Lighthouse a tourné en headless sur la VM d'audit, une seule page, une seule passe. Les scores servent de signal, pas de certificat.
- Les photos n'ont pas été examinées pour identifier des personnes. SEC-07 porte sur le fait de publier ces reportages, pas sur une reconnaissance.
- `npm audit` dépend de la base d'avis du 30 septembre 2026. Les numéros de version cibles (14.2.35, 15.5.16, 16.3.7) sont ceux indiqués par l'éditeur ou par npm à cette date ; il faut prendre la dernière correction de la ligne choisie le jour du ticket T0.1.
- trufflehog n'était pas disponible. gitleaks 8.28.0 a parcouru les 6 commits, sans fuite. Aucune valeur secrète n'est recopiée dans ce document, faute d'en avoir trouvé.
