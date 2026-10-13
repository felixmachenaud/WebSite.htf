# Hébergement ambivalent — OVH (domaine) + Vercel ou OVH (application)

> Décision finale en négociation. **Un seul dépôt**, deux façons de déployer sans changer le mini-CMS.

## Principe

| Couche | Rôle | Où aujourd'hui | Ambivalent ? |
|--------|------|----------------|--------------|
| **Nom de domaine** | `www.…` | **OVH** (registrar / zone DNS) | Oui — DNS pointe vers Vercel **ou** vers un VPS OVH |
| **Application Next.js** | Site + `/admin` + API | **Vercel** (actuel) | Oui — même build sur **VPS OVH** (`next start`) |
| **Stockage CMS** | JSON `SiteContent` | **Vercel Blob** (`BLOB_READ_WRITE_TOKEN`) | Oui — utilisable depuis Vercel **ou** OVH (API HTTP) |
| **Sessions admin** | Redis | **Upstash** (REST) | Oui — indépendant de l'hébergeur |
| **Mentions légales hébergeur** | Texte LCEN | Variable `SITE_HOSTING` | `pending` jusqu'à décision |

Le **domaine chez OVH** ne oblige **pas** l'application à tourner chez OVH.

---

## Scénario A (recommandé en transition) — Domaine OVH, app Vercel

1. **Vercel** → Project **web-site-htf** → **Settings** → **Domains** → ajouter `www.votredomaine.fr` (et apex si besoin).
2. **OVH** → Zone DNS du domaine :
   - `www` → **CNAME** → `cname.vercel-dns.com` (ou la cible indiquée par Vercel)
   - Apex `@` → enregistrements **A** fournis par Vercel, ou redirection vers `www`
3. **Vercel** → **Environment Variables** :
   - `NEXT_PUBLIC_SITE_URL=https://www.votredomaine.fr`
   - `SITE_HOSTING=pending` (jusqu'à décision) puis `vercel`
   - Admin : `AUTH_SECRET`, `ADMIN_PASSWORD_HASH`, Redis, `BLOB_READ_WRITE_TOKEN`
4. Redeploy. Le site public et `/admin` restent sur Vercel ; le **registrar** reste OVH.

---

## Scénario B — Domaine OVH, app sur VPS OVH

1. VPS OVH : Node ≥ 20, `npm ci`, `next build`, `next start` (systemd + nginx + Let's Encrypt).
2. **Mêmes variables d'environnement** que sur Vercel (dont Blob + Upstash).
3. DNS OVH : `www` → **A** vers l'IP du VPS.
4. `SITE_HOSTING=ovh`, `NEXT_PUBLIC_SITE_URL=https://www.votredomaine.fr`
5. Pas de `@vercel/blob` côté infra Vercel obligatoire — le token Blob suffit depuis le VPS.

*(Migration stockage CMS vers Object Storage OVH = changement de code, hors scope ambivalent actuel.)*

---

## Variable `SITE_HOSTING` (mentions légales)

| Valeur | Texte hébergeur affiché |
|--------|-------------------------|
| *(absent ou `pending`)* | Message neutre « Vercel ou OVH en cours de finalisation » |
| `vercel` | Vercel Inc. |
| `ovh` | OVH SAS |

Code : `lib/site-hosting.ts`, utilisé par `hostDisplay()` dans les pages juridiques.

**Ne pas confondre** avec `VERCEL=1` (auto-injecté sur Vercel) : la mention légale ne suit **pas** automatiquement la plateforme, tant que la décision n'est pas prise.

---

## Déploiement Vercel (inchangé)

```bash
git push origin main          # ou
npx vercel --prod --yes
```

Blob + admin : voir `docs/PHASE-A-VERCEL-ENV.md` et `docs/PHASE-C-PRODUCTION.md`.

---

## Checklist décision finale

- [ ] Choix app : Vercel vs VPS OVH
- [ ] `SITE_HOSTING=vercel` ou `ovh`
- [ ] `ecolePending.hostConfirmed = true` après relecture direction (`lib/ecole-pending.ts`)
- [ ] DNS OVH aligné (CNAME Vercel ou A vers VPS)
- [ ] `NEXT_PUBLIC_SITE_URL` = URL publique HTTPS finale
