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

### CMS (branché le 20 nov. 2026)

| Liaison | Rôle | Aperçu | Production |
|---|---|---|---|
| `CMS_BUCKET` (R2) | textes enregistrés depuis `/admin` (`site-content.json`) | `hautefeuille-cms-preview` | `hautefeuille-cms` |
| `NEXT_INC_CACHE_R2_BUCKET` (R2) | pages prérendues | `hautefeuille-cache-preview` | `hautefeuille-cache` |
| `NEXT_TAG_CACHE_D1` (D1) | invalidations (`revalidatePath`) | `hautefeuille-tags-preview` | `hautefeuille-tags` |

Aucun mot de passe ni secret : l'admin est protégée par **Cloudflare Access**. On saisit son courriel, on reçoit un code à 6 chiffres, et seuls les courriels de la politique entrent. Le Worker revérifie le jeton Access (`lib/admin-auth.ts`, `lib/access-jwt.ts`, test : `npm run test:access`).

Mise en place (une fois par compte, tableau de bord Cloudflare) :

1. Zero Trust › Access › Applications › Add an application › **Self-hosted**. Nom : « Hautefeuille admin (aperçu) ».
2. Destinations (2 lignes) : `hautefeuille-preview.felixmachenaud2.workers.dev` chemin `admin`, et le même domaine chemin `api/admin`.
3. Politique : action **Allow**, règle *Include › Emails* = courriels autorisés (direction, Félix). Méthode de connexion : **One-time PIN**.
4. Copier l'*Application Audience (AUD) Tag* et le domaine d'équipe (`<équipe>.cloudflareaccess.com`, Zero Trust › Settings) dans `ACCESS_AUD` et `ACCESS_TEAM_DOMAIN` de `env.preview` (`wrangler.jsonc`), puis redéployer.
5. Vérifier : `node scripts/phase-a-smoke.mjs --admin-only --base=https://hautefeuille-preview.felixmachenaud2.workers.dev` (redirection Access, enregistrement refusé sans jeton).

Ajouter ou retirer une personne = modifier la liste de courriels de la politique, sans redéployer.

`scripts/deploy.mjs` télécharge `site-content.json` depuis R2 avant le build (`.data/cms-snapshot.json`) : un redéploiement repart du contenu enregistré, pas des textes par défaut. Il refuse de déployer si un identifiant KV ou D1 est vide.

En local : `npm run dev` ouvre l'admin sans Access (développement) ; `npm run cf:preview` simule R2 et D1 (admin « non configurée » sans les vars Access).

## Avant une production Cloudflare

- [ ] Créer sur le compte de l'école : `npx wrangler r2 bucket create hautefeuille-cms`, `… hautefeuille-cache`, `npx wrangler d1 create hautefeuille-tags` ; coller l'id D1 dans `env.production`.
- [ ] Recopier le contenu : `npx wrangler r2 object get hautefeuille-cms-preview/site-content.json --remote --file cms.json` (compte Félix), puis `npx wrangler r2 object put hautefeuille-cms/site-content.json --remote --file cms.json` (compte école).
- [ ] Application Access sur le compte de l'école (domaine réel, chemins `admin` et `api/admin`, One-time PIN, courriels de la direction) ; `ACCESS_TEAM_DOMAIN` et `ACCESS_AUD` dans `env.production`.
- [ ] Domaine : `"routes": [{ "pattern": "www.domaine.fr", "custom_domain": true }]` à la place de `workers_dev`, et `NEXT_PUBLIC_SITE_URL` en production.
- [ ] `npx wrangler logout && npx wrangler login && npx wrangler whoami` → compte de l'école, puis `npm run deploy:htf:production`.
