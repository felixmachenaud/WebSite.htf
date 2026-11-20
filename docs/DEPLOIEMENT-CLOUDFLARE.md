# Déploiement — Cloudflare Workers

Next.js 16 adapté par OpenNext (`@opennextjs/cloudflare`). Aperçu sur le compte Cloudflare de Félix, production sur le compte de l'école. Méthode générale : skill `deploiement-cloudflare`. **Cloudflare Workers est la seule cible de déploiement** (décision du 19 nov. 2026) : Vercel est abandonné.

| Cible | Worker | Compte | Indexation |
|---|---|---|---|
| local | `hautefeuille-local` (`npm run cf:preview`) | aucun | fermée |
| `env.preview` | `hautefeuille-preview` — https://hautefeuille-preview.felixmachenaud2.workers.dev | Félix | fermée |
| `env.production` | `hautefeuille` (domaine de l'école) | école | ouverte (`INDEXING=on`) |

Aucun `account_id` dans le code : le compte est celui connecté à Wrangler (`npx wrangler whoami`).

## Fichiers

- `wrangler.jsonc` : cibles, `INDEXING`, `NEXT_PUBLIC_SITE_URL` (injectée au build par `scripts/deploy.mjs`).
- `open-next.config.ts` : cache en lecture seule (pages prérendues).
- `worker.ts` : Worker OpenNext entouré de `lib/indexing.ts` (robots fermé + `X-Robots-Tag: noindex` hors production). Test : `npm run test:indexing`.
- `scripts/deploy.mjs` : affiche le compte, rebuild pour la cible, déploie ; la production exige de taper `production`.

## Déploiement automatique

Chaque merge sur `main` déclenche, après une CI verte, `.github/workflows/deploy-cloudflare.yml` : test d'indexation, build OpenNext, déploiement de `hautefeuille-preview`, smoke public sur l'URL de l'aperçu. Relance manuelle : onglet Actions › Deploy Cloudflare › Run workflow.

Secrets GitHub à créer une fois (Félix) :

1. Cloudflare › My Profile › API Tokens › Create Token › modèle « Edit Cloudflare Workers », compte de Félix.
2. `gh secret set CLOUDFLARE_API_TOKEN` (coller le jeton) et `gh secret set CLOUDFLARE_ACCOUNT_ID --body <id du compte affiché par wrangler whoami>`.

La production (compte de l'école) n'est jamais déployée automatiquement.

## Aperçu (compte de Félix)

```sh
npx wrangler whoami                # compte de Félix
npm run deploy:htf:preview         # build OpenNext + déploiement
npx wrangler tail --env preview    # journaux
```

Pas de secret ni de ressource à créer : l'aperçu tourne **sans CMS** (pas de jeton Blob ni Redis). Il affiche les textes par défaut du code ; `/admin` affiche « Administration non configurée ».

## Avant une production Cloudflare

- [ ] Brancher le CMS : stockage propre au compte (R2 ou Blob dédié), sessions (Upstash Redis), secrets `ADMIN_PASSWORD_HASH`, `AUTH_SECRET`… via `npx wrangler secret put <NOM> --env production`.
- [ ] Remplacer le cache statique par `r2IncrementalCache` + `d1NextTagCache` (sinon `revalidatePath` après enregistrement admin est sans effet).
- [ ] Admin derrière Cloudflare Access.
- [ ] Domaine : `"routes": [{ "pattern": "www.domaine.fr", "custom_domain": true }]` à la place de `workers_dev`, et `NEXT_PUBLIC_SITE_URL` en production.
- [ ] `npx wrangler logout && npx wrangler login && npx wrangler whoami` → compte de l'école, puis `npm run deploy:htf:production`.
