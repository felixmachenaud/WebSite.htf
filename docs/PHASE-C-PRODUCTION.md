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
| C2 (AUTH-02) | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | ❌ | **Bloquant admin** — voir ci-dessous |
| C3 (SEC-02) | Pages juridiques sans placeholders | ⏸ | Bloqué retour école (SIRET, raison sociale, responsable) + relecture B4 |

## Variables d'environnement (état 6 oct. 2026)

| Variable | Production | Preview | Development |
|----------|------------|---------|-------------|
| `NEXT_PUBLIC_SITE_URL` | ✅ | ✅ | — |
| `AUTH_SECRET` | ✅ | ✅ | — |
| `ADMIN_PASSWORD_HASH` | ✅ | ✅ | — |
| `BLOB_READ_WRITE_TOKEN` | ✅ | ✅ | ✅ |
| `UPSTASH_REDIS_REST_URL` | ❌ | ❌ | — |
| `UPSTASH_REDIS_REST_TOKEN` | ❌ | ❌ | — |

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

Les variables `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN` seront injectées automatiquement. Puis redéployer :

```bash
npx vercel --prod --yes
```

Sans Redis, `/admin` affiche « Administration non configurée » et `POST /api/admin/login` renvoie **503**.

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

### Admin (partiel — Redis manquant)

| Test | Attendu | Obtenu |
|------|---------|--------|
| GET `/admin` | Formulaire connexion | « Administration non configurée » |
| POST login (mauvais MDP) | 401 | 503 |
| POST login (bon MDP) | 200 | 503 |

Rejouer après pose Redis :

```bash
node scripts/phase-a-smoke.mjs --base=https://web-site-htf.vercel.app
```

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
