# Phase A — Variables Vercel Preview (web-site-htf)

> **Ne jamais committer de valeurs secrètes.** Ce document liste les noms et la procédure manuelle.

## Projet Vercel

| Champ | Valeur |
|-------|--------|
| Projet | `web-site-htf` |
| URL production | https://web-site-htf.vercel.app |
| Dépôt Git | https://github.com/felixmachenaud/WebSite.htf.git |
| Preview récente (6 j) | https://web-site-o0uxgyjme-felixmachenaud2-9491s-projects.vercel.app |

Le dépôt local **n'est pas lié** à Vercel (`vercel link` non exécuté). Les variables d'environnement ne peuvent pas être lues ni posées via CLI sans liaison préalable.

## Variables à configurer (Preview)

Dans [Vercel Dashboard](https://vercel.com) → **web-site-htf** → Settings → Environment Variables → cocher **Preview** :

| Variable | Description | Génération |
|----------|-------------|------------|
| `NEXT_PUBLIC_SITE_URL` | URL HTTPS canonique de la Preview (sans slash final). Ex. `https://web-site-htf-xxx.vercel.app` | Copier l'URL de la deployment Preview active |
| `ADMIN_PASSWORD_HASH` | Hash scrypt du mot de passe admin | `npm run hash-admin-password -- '<mot-de-passe-fort>'` |
| `AUTH_SECRET` | Pepper sessions (≥ 32 caractères) | `openssl rand -hex 32` |
| `UPSTASH_REDIS_REST_URL` | URL REST Upstash Redis | Console Upstash → REST API |
| `UPSTASH_REDIS_REST_TOKEN` | Token REST Upstash Redis | Console Upstash → REST API |
| `BLOB_READ_WRITE_TOKEN` | Token Vercel Blob (lecture/écriture) | Vercel Dashboard → Storage → Blob → token |

## Ordre recommandé

1. Lier le projet : `npx vercel link --project web-site-htf` (depuis la racine du dépôt).
2. Créer ou réutiliser une base Upstash Redis (région proche de Vercel).
3. Activer Vercel Blob sur le projet si absent.
4. Poser les 6 variables ci-dessus pour **Preview** uniquement.
5. Redéployer la branche `main` (push ou redeploy manuel).
6. Smoke test Preview : login admin, edit, save, reload, logout (Phase A4–A5).

## Notes

- Sans `NEXT_PUBLIC_SITE_URL`, sitemap/robots/OG utilisent `http://localhost:3000` (PH-03).
- Sans Redis en production, `/admin` reste « non configurée » et login renvoie 503.
- Sans Blob en production, save renvoie 503.
- Ne pas définir `ADMIN_PASSWORD` en clair : refusé en production.
