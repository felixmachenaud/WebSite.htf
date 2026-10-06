# PROJECT_CONTEXT

Contexte structurel permanent du site **Collège Lycée Hautefeuille**. Ce fichier ne décrit ni l'état du jour ni les anomalies (voir `CURRENT_STATE.md` et `PROJECT_HEALTH.md`).

| | |
|---|---|
| Dépôt | `felixmachenaud/WebSite.htf` |
| Client | Collège Lycée Hautefeuille (Courbevoie / Bois-Colombes) |
| Dernière mise à jour | 6 octobre 2026 |

---

## Objectif du produit

Site vitrine institutionnel pour un établissement scolaire privé : présenter le collège, le lycée, l'histoire, le projet éducatif, les informations pratiques, les actualités et les coordonnées. Permettre à la direction de modifier les textes clés sans développeur, via un mini-CMS intégré.

Pas de compte visiteur, pas de formulaire de contact intégré, pas de newsletter fonctionnelle à ce stade.

---

## Utilisateurs / cibles

| Profil | Besoin |
|--------|--------|
| **Familles / futurs parents** | Découvrir l'établissement, résultats, vie scolaire, contact |
| **Élèves / communauté** | Actualités, informations pratiques |
| **Direction / équipe admin** | Éditer contenus via `/admin` |
| **Agence (WebSite Studio)** | Maintenir, déployer, sécuriser |

---

## Fonctionnalités principales

- **Site public** : accueil (landing scroll), pages institutionnelles, actualités, contact, mentions légales, confidentialité
- **Mini-CMS** : édition de textes (`SiteContent`) via `/admin`, persistance Vercel Blob (prod) ou fichier local (dev)
- **Auth admin** : mot de passe hashé scrypt, cookie HMAC, sessions Upstash Redis (prod)
- **SEO natif Next.js** : metadata, Open Graph, sitemap, robots, favicon
- **Contact** : liens `mailto:` et téléphone (pas de messagerie in-app)
- **Sécurité** : CSP, en-têtes HTTP, rate limit login, pas de route d'upload

Hors périmètre actuel : formulaire contact, newsletter, upload médias, Sanity/Payload, analytics.

---

## Architecture

```
app/                    # App Router Next.js
  page.tsx              # Accueil (ScrollHijackLanding)
  a-propos/**           # Pages institutionnelles
  nouvelles/**          # Liste + détail actualités
  contact/              # Coordonnées (téléphone, courriel)
  mentions-legales/     # Texte juridique (hors CMS)
  confidentialite/      # RGPD (hors CMS)
  admin/                # Interface CMS
  api/admin/            # login, logout, save
  sitemap.ts, robots.ts
components/             # UI (Navbar, Footer, landing, etc.)
lib/
  site-content.ts       # Schéma SiteContent + defaults
  content-store.ts      # Lecture/écriture Blob ou .data/
  admin-auth.ts         # Auth cookie + scrypt
  admin-sessions.ts     # Sessions Redis / fichier local
  site-url.ts           # URL canonique
data/resultats.ts       # Couleurs graphique bac (hors CMS)
public/images/          # Assets statiques
```

Flux contenu public : `getContent()` → merge defaults + Blob/local → pages server components.

Flux admin : login → session Redis → `Editor.tsx` → POST `/api/admin/save` → Blob.

---

## Stack technique

| Couche | Choix |
|--------|--------|
| Framework | Next.js 16.3 (App Router) |
| UI | React 18, Tailwind CSS 3 |
| Langage | TypeScript 5 |
| Animations | GSAP (landing) |
| Graphiques | Recharts (page Lycée) |
| Hébergement cible | Vercel |
| Stockage contenu | Vercel Blob (JSON privé) |
| Sessions admin | Upstash Redis REST |
| Node | ≥ 20.9.0 |

---

## Services externes

| Service | Usage |
|---------|--------|
| **Vercel** | Hébergement, Blob |
| **Upstash Redis** | Sessions admin |
| **Google Maps** | Carte contact (chargement au clic) |
| **Gmail** (`hautefeuille92@gmail.com`) | Contact familles (mailto, sous-traitant RGPD) |

Variables : voir `.env.example`.

---

## Environnements

| Env | Rôle | Particularités |
|-----|------|----------------|
| **Dev local** | Développement | Contenu dans `.data/site-content.json` si pas de Blob ; sessions fichier local |
| **Preview Vercel** | Recette pré-prod | Toutes les variables à poser ; smoke tests admin et site public |
| **Production Vercel** | Site public | `NEXT_PUBLIC_SITE_URL` HTTPS obligatoire ; admin + Blob + Redis configurés |

Branchement Git actuel : vagues d'audit `vague-0` → `vague-1` → `vague-2` à merger séquentiellement vers `main`.

---

## Contraintes importantes

- Conformité LCEN / RGPD : mentions légales et confidentialité validées par l'établissement avant prod
- Pas de photos d'élèves sans autorisation écrite (Rome, Montmartre retirées)
- Pas de mot de passe admin en clair en production
- Pas de dépendance lourde (Sanity, etc.) sans décision explicite
- `PROJECT_HEALTH.md` : registre d'anomalies jamais purgé
- Contenu chiffré collège/lycée : ne pas inventer — confirmation école requise

---

## Conventions structurantes

- Contenu éditable : schéma central `SiteContent` dans `lib/site-content.ts`
- Pages publiques : Server Components + `getContent()` async
- Pages juridiques : texte en dur dans `app/`, modifiable au code (pas dans l'éditeur admin)
- Images : dossiers thématiques sous `public/images/` ; README par dossier
- SEO : `generateMetadata` par page ; URL canonique via `siteUrl()`
- Admin : en-tête custom `x-hautefeuille-admin` requis sur les routes API
- Documentation agent : `AGENTS.md`, `CURRENT_STATE.md`, `PROJECT_HEALTH.md`, `docs/standards/` ; règles Cursor `.cursor/rules/*.mdc`
