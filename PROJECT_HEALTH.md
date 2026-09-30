# PROJECT_HEALTH

Registre des anomalies du site Collège Lycée Hautefeuille. Source de vérité permanente.

| | |
|---|---|
| Dépôt | `felixmachenaud/WebSite.htf` |
| Référence d'audit | 30 septembre 2026, commit `6841649` |
| Dernière mise à jour | 30 septembre 2026 — vague 0 |

Les identifiants reprennent ceux de l'audit. Une entrée n'est jamais supprimée.

---

### SEC-01 [FIXED] [CRITICAL] 2026-09-30

- Composant : `package.json` (`next@14.2.15`)
- Constat : Next.js 14.2.15 est exposé à un déni de service App Router et à d'autres avis dont la correction dépasse la branche 14.
- Cause : version antérieure aux correctifs de décembre 2025 et 2026.
- Action : monté sur `next@16.3.7` (dernière stable corrigée au 30 septembre 2026), `eslint-config-next@16.3.7`, Node `>=20.9.0`. `params` de `app/nouvelles/[slug]/page.tsx` est asynchrone. React 18 reste dans la plage acceptée par Next 16. `npm audit` ne signale plus d'avis critique ni haut sur `next`. `next build` passe (16 pages).

### SEC-02 [MONITOR] [CRITICAL] 2026-09-30

- Composant : `app/mentions-legales/page.tsx`, `app/confidentialite/page.tsx`, `components/Footer.tsx`
- Constat : aucune page juridique n'existait. Les pages sont maintenant servies et liées depuis le footer.
- Cause : pages absentes du dépôt ; l'établissement n'a pas encore transmis la raison sociale, le SIRET, le nom du responsable de publication ni confirmé l'hébergeur.
- Action : textes rédigés à partir des coordonnées déjà publiées, avec les champs juridiques inconnus explicitement marqués « à confirmer ». Ne pas considérer le ticket fermé tant que l'établissement n'a pas relu ces pages.

### SEC-03 [FIXED] [HIGH] 2026-09-30

- Composant : `components/Footer.tsx`
- Constat : formulaire « Envoyer » qui n'envoyait rien et citait une politique absente.
- Cause : `onSubmit` annulait l'envoi, sans endpoint.
- Action : formulaire retiré. Texte « inscription bientôt disponible », sans champ.

### SEC-04 [OPEN] [HIGH] 2026-09-30

- Composant : `next.config.js`
- Constat : aucun en-tête de sécurité, `X-Powered-By: Next.js` présent.
- Cause : configuration sans `headers` ni `poweredByHeader: false`.
- Action : vague 1.

### SEC-05 [OPEN] [HIGH] 2026-09-30

- Composant : `.gitignore`
- Constat : `.env` n'est pas ignoré, pas de `.env.example`.
- Cause : seules les variantes `.env*.local` sont ignorées.
- Action : vague 1, avant tout secret du mini-CMS.

### SEC-06 [OPEN] [HIGH] 2026-09-30

- Composant : `app/a-propos/page.tsx`, `components/AdresseCards.tsx`, `app/contact/page.tsx`
- Constat : image picsum, iframes Google Maps sans consentement, URL Calendly commentée « à configurer » (`https://calendly.com/hautefeuille`).
- Cause : tiers chargés sans cadre. L'établissement n'a pas confirmé le compte Calendly.
- Action : vague 1 pour picsum et les cartes. L'URL Calendly n'est pas modifiée tant que l'école ne la confirme pas.

### SEC-07 [FIXED] [CRITICAL] 2026-09-30

- Composant : `data/actualites.ts`, `public/images/nouvelles/rome-latin.jpg`, `public/images/nouvelles/cinquiemes-montmartre.jpg`
- Constat : sorties d'élèves illustrées sans trace de consentement dans le dépôt.
- Cause : images versionnées et prêtes à être publiées.
- Action : fichiers retirés du dépôt. Les articles restent en texte, sans image. Ne pas réintroduire ces fichiers sans autorisation écrite de l'établissement. Les portraits de la direction sont conservés (base distincte) et décrits dans la politique de confidentialité.

### SEC-08 [MONITOR] [HIGH] 2026-09-30

- Composant : `app/contact/page.tsx`, `components/Footer.tsx`
- Constat : contact des familles sur `hautefeuille92@gmail.com`.
- Cause : aucune adresse de domaine d'établissement n'a été fournie.
- Action : adresse inchangée, mentionnée comme sous-traitant dans la politique de confidentialité. Remplacer dès qu'une adresse institutionnelle est confirmée.

### SEC-09 [FIXED] [HIGH] 2026-09-30

- Composant : `package-lock.json`
- Constat : `npm ci` échouait (picomatch).
- Cause : lockfile incohérent avec la résolution npm.
- Action : lockfile régénéré avec la montée Next / PostCSS. `npm ci` doit passer sur un clone propre.

### SEC-10 [FIXED] [HIGH] 2026-09-30

- Composant : `package.json` (`postcss`)
- Constat : PostCSS 8.5.8 vulnérable.
- Cause : version antérieure au correctif de ligne.
- Action : figé sur `postcss@8.5.28`.

### SEC-11 [OPEN] [MEDIUM] 2026-09-30

- Composant : dépendances de développement (`eslint`, `eslint-config-next`, `glob`)
- Constat : avis hauts limités aux outils de dev au moment de l'audit.
- Cause : ESLint 8 et chaîne associée.
- Action : `eslint-config-next` est aligné sur Next 16. npm signale `eslint@9.39.5` comme version plus supportée. La config, le passage de `npm run lint` et les avis hauts restants (`brace-expansion`, `browserslist`, `picomatch`) restent en vague 3.

### SEC-12 [OPEN] [MEDIUM] 2026-09-30

- Composant : authentification admin (absente)
- Constat : pas de rate-limit ni de CSRF sur un login qui n'existe pas encore.
- Cause : pas de route d'auth.
- Action : à créer avec le login, vague 2.

### SEC-13 [OPEN] [MEDIUM] 2026-09-30

- Composant : page 404 par défaut
- Constat : 404 générique en anglais, pas de `app/error.tsx`.
- Cause : aucun fichier dédié.
- Action : vague 3.

### AUTH-01 [OPEN] [LOW] 2026-09-30

- Composant : site public
- Constat : pas d'authentification visiteur.
- Cause : brochure publique, comportement voulu.
- Action : conserver. Seul l'accès admin est à créer (vague 2).

### AUTH-02 [OPEN] [HIGH] 2026-09-30

- Composant : `/admin` (absent)
- Constat : aucun modèle d'auth (scrypt, session Redis, cookie opaque, pepper).
- Cause : mini-CMS non implémenté.
- Action : vague 2. Ne pas ouvrir `/admin` avant.

### CODE-01 [OPEN] [HIGH] 2026-09-30

- Composant : outillage ESLint
- Constat : `next lint` inutilisable, aucune config.
- Cause : pas de `.eslintrc` ni de `eslint.config`.
- Action : vague 3.

### CODE-02 [OPEN] [HIGH] 2026-09-30

- Composant : CI et tests
- Constat : pas de tests, pas de CI, pas de script `typecheck`.
- Cause : outillage absent.
- Action : vague 3.

### CODE-03 [OPEN] [MEDIUM] 2026-09-30

- Composant : `components/ScrollHijackLanding.tsx`
- Constat : landing monolithique, état global de module.
- Cause : animation et contenu dans le même fichier.
- Action : vague 3, extraction limitée, sans réécrire le moteur.

### CODE-04 [OPEN] [MEDIUM] 2026-09-30

- Composant : `components/ScrollLanding.tsx`, `components/scroll/*`, `components/ActualitesTimeline.tsx`, `gsap`, `lucide-react`
- Constat : code mort et dépendances inutilisées.
- Cause : ancienne landing conservée.
- Action : vague 3.

### CODE-05 [OPEN] [HIGH] 2026-09-30

- Composant : `app/a-propos/college/page.tsx`, `app/a-propos/lycee/page.tsx`, `data/resultats.ts`
- Constat : collège et lycée affichent les mêmes chiffres (240 élèves, 19 professeurs).
- Cause : copie. L'établissement n'a pas confirmé les effectifs, le nombre de professeurs ni les taux de brevet/bac.
- Action : chiffres laissés en l'état. Ne pas inventer de valeurs. Mettre à jour seulement après confirmation écrite.

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

### CODE-08 [OPEN] [MEDIUM] 2026-09-30

- Composant : `app/nouvelles/[slug]/page.tsx`
- Constat : texte de chantier public « Page à enrichir via le CMS ».
- Cause : placeholder laissé visible.
- Action : vague 1.

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

### ARCH-03 [OPEN] [HIGH] 2026-09-30

- Composant : metadata, favicon, sitemap
- Constat : favicon 404, pas de robots/sitemap/Open Graph/`metadataBase`, pas de H1 sur l'accueil, double H1 sur Informations générales.
- Cause : SEO de base non posé.
- Action : vague 1.

### ARCH-04 [OPEN] [HIGH] 2026-09-30

- Composant : `components/ScrollHijackLanding.tsx`, `components/Navbar.tsx`
- Constat : scroll hijack et menu peu accessibles (clavier, mouvement réduit, Échap).
- Cause : interaction uniquement à la molette / au clic.
- Action : vague 3.

### ARCH-05 [OPEN] [HIGH] 2026-09-30

- Composant : menu mobile
- Constat : lien Contact absent du menu mobile.
- Cause : Contact n'est rendu que dans la barre desktop.
- Action : vague 1.

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

### CMS-01 [OPEN] [HIGH] 2026-09-30

- Composant : `lib/`, `app/admin`
- Constat : aucun fichier du mini-CMS.
- Cause : non implémenté. Bloquant avant d'ouvrir `/admin`, pas avant la brochure.
- Action : vague 2.

### CMS-02 [OPEN] [MEDIUM] 2026-09-30

- Composant : textes des pages
- Constat : carte des textes à extraire vers `SiteContent` non faite.
- Cause : textes en dur.
- Action : vague 2.

### CMS-03 [OPEN] [HIGH] 2026-09-30

- Composant : `docs/CMS-RESULTATS.md`, `data/resultats.ts`
- Constat : ces fichiers prescrivent Sanity, en contradiction avec le mini-CMS retenu.
- Cause : document antérieur à la décision.
- Action : vague 2.

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
