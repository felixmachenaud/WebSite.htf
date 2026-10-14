# Phase C — Publication production (web-site-htf)

> **Ne jamais committer de valeurs secrètes.** Ce document liste les noms, l'état et la procédure — pas les tokens ni mots de passe.

## Projet Vercel

| Champ | Valeur |
|-------|--------|
| Projet | `web-site-htf` |
| URL production | https://web-site-htf.vercel.app |
| Dépôt Git | https://github.com/felixmachenaud/WebSite.htf.git |
| Déploiement (6 oct. 2026) | `dpl_5E29GsLvkmivTtJ5aghDL9qvCZZD` |

Le dépôt local est lié via `vercel link --project web-site-htf`.

## Checklist Phase C

| ID | Étape | Statut | Notes |
|----|-------|--------|-------|
| C1 (PH-03) | `NEXT_PUBLIC_SITE_URL` Production + Preview | ✅ | `https://web-site-htf.vercel.app` |
| C2 (CMS-01) | `BLOB_READ_WRITE_TOKEN` | ✅ | Store `web-site-htf-blob` (private, iad1) |
| C2 (AUTH-02) | `AUTH_SECRET`, `ADMIN_PASSWORD_HASH` | ✅ | Production + Preview |
| C2 (AUTH-02) | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | ✅ | `upstash-kv-cyan-pocket`, Pay As You Go, `fra1` (13 oct. 2026) |
| C3 (SEC-02) | Pages juridiques sans placeholders | ⏸ | Bloqué retour école (SIRET, raison sociale, responsable) + relecture B4 |

## Variables d'environnement (état 6 oct. 2026)

| Variable | Production | Preview | Development |
|----------|------------|---------|-------------|
| `NEXT_PUBLIC_SITE_URL` | ✅ | ✅ | — |
| `AUTH_SECRET` | ✅ | ✅ | — |
| `ADMIN_PASSWORD_HASH` | ✅ | ✅ | — |
| `BLOB_READ_WRITE_TOKEN` | ✅ | ✅ | ✅ |
| `UPSTASH_REDIS_REST_URL` | ✅ | ✅ | Intégration Upstash, 13 oct. 2026 |
| `UPSTASH_REDIS_REST_TOKEN` | ✅ | ✅ | Secret, non versionné |

### Mot de passe admin

Un mot de passe fort a été généré et hashé pour la production. **Il n'est pas stocké dans ce dépôt.** Le transmettre à la direction par canal sécurisé (pas par e-mail en clair si possible).

Regénérer le hash si besoin :

```bash
npm run hash-admin-password -- '<mot-de-passe-fort>'
npx vercel env add ADMIN_PASSWORD_HASH production --value "<hash>" --yes --sensitive
```

## Redis Upstash — action manuelle requise

L'installation marketplace Upstash (`upstash/upstash-kv`) ou Redis (`redis`) exige l'acceptation des conditions dans le navigateur :

1. Ouvrir https://vercel.com/felixmachenaud2-9491s-projects/~/integrations/accept-terms/upstash?source=cli
2. Accepter les conditions
3. Relancer :

```bash
npx vercel integration add upstash/upstash-kv -e production -e preview
```

Le code lit en priorité `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`, puis en secours `KV_REST_API_URL` / `KV_REST_API_TOKEN` (intégration Vercel KV). **Jamais** les tokens `*_READ_ONLY_*`.

Puis redéployer :

```bash
npx vercel --prod --yes
```

Sans Redis, `/admin` affiche « Administration non configurée » et `POST /api/admin/login` renvoie **503**.

État au 13 oct. 2026 : base `upstash-kv-cyan-pocket` liée à `web-site-htf` (Production et Preview, Pay As You Go, `fra1`). Le CMS a été utilisé. Le tableau admin ci-dessous est la recette du 6 oct., avant ce branchement.

## Recette production (6 oct. 2026)

### Site public

```bash
node scripts/phase-a-smoke.mjs --public-only --base=https://web-site-htf.vercel.app
```

Résultat : **26/26** (routes, CSP, footer, sitemap, assets).

### SEO

- `sitemap.xml` : URLs en `https://web-site-htf.vercel.app` (pas localhost)
- `robots.txt` : `Sitemap: https://web-site-htf.vercel.app/sitemap.xml`
- Open Graph : `og:image` en HTTPS production

### Admin

| Test | Attendu | Obtenu (14 oct. 2026) |
|------|---------|------------------------|
| POST login (mauvais MDP) | 401 | ✅ 401 |
| POST login (rate limit) | 429 | ✅ 429 (8e échec cumulé après A4.2, IP Vercel) |
| Save → `/` → revert brand | 200 + HTML + restauration | ⏸ local OK ; prod après déploiement merge + mot de passe |

Recette du 6 oct. (sans Redis) : `/admin` « non configurée », login 503.

Rejouer après pose Redis (401/429 sans secret ; save si mot de passe admin connu) :

```bash
node scripts/phase-a-smoke.mjs --admin-only --base=https://web-site-htf.vercel.app
# save + revert brand :
ADMIN_SMOKE_PASSWORD='…' node scripts/phase-a-smoke.mjs --admin-only --base=https://web-site-htf.vercel.app
```

Le save partiel merge désormais le Blob existant (`saveContent` lit `getContent()` avant écriture) ; le script restaure `chrome.brand` après A4.5.

## SEC-02 — publication partielle

La production est **techniquement en ligne** mais **juridiquement incomplète** :

- Mentions légales et confidentialité contiennent des champs « à confirmer »
- Ne pas promouvoir le site comme « conforme RGPD / légal » tant que l'école n'a pas relu (B4)

## Commandes utiles

```bash
# Lier le projet (une fois)
npx vercel link --project web-site-htf --yes

# Lister les variables
npx vercel env ls

# Déployer production
npx vercel --prod --yes

# Smoke public
node scripts/phase-a-smoke.mjs --public-only --base=https://web-site-htf.vercel.app
```
