# ENGINEERING_CHECKLIST

Checklist permanente par domaine. **Avant toute modification**, parcourir les sections concernées par la tâche. Détail sécurité : `SECURITY_ENGINEERING.md`. Détail SEO pages publiques : `SEO_OPTIMIZATION.md`.

---

## SÉCURITÉ / SECRETS

- Variables d'environnement → sécuriser / isoler / masquer / externaliser
- Secrets / clés API → protéger / chiffrer / masquer / faire tourner (rotate)
- Credentials → sécuriser / révoquer / renouveler
- Données sensibles → chiffrer / minimiser / anonymiser / protéger
- Tokens → sécuriser / expirer / révoquer / renouveler
- Cookies → sécuriser / restreindre / expirer
- Entrées utilisateur → valider / filtrer / assainir (sanitize)
- Uploads → valider / limiter / scanner / isoler
- Dépendances → auditer / mettre à jour / verrouiller
- Permissions → restreindre / segmenter / moindre privilège
- Routes sensibles → protéger / authentifier / autoriser
- Endpoints → sécuriser / limiter / valider
- Logs → nettoyer / anonymiser / expurger les secrets
- Erreurs → masquer / journaliser / gérer proprement
- Surface d'attaque → réduire
- Vulnérabilités → détecter / corriger / mitiger
- Rate limiting → limiter / protéger / throttler
- CSRF → prévenir / bloquer
- XSS → prévenir / neutraliser
- Injection SQL → prévenir / paramétrer / bloquer

## AUTHENTIFICATION / AUTORISATION

- Authentification → sécuriser / renforcer / centraliser
- Autorisation → vérifier / restreindre
- Sessions → sécuriser / expirer / invalider
- Mots de passe → hacher / saler / protéger
- Rôles → définir / segmenter
- RBAC → appliquer / contrôler
- Accès admin → restreindre / protéger / auditer
- Middleware d'auth → centraliser / renforcer
- Permissions serveur → vérifier côté serveur
- Session utilisateur → valider / renouveler / invalider

## CODE / QUALITÉ

- Code → nettoyer / simplifier / sécuriser / optimiser
- Refactoring → simplifier / réduire / restructurer / factoriser
- Duplication → supprimer / factoriser
- Complexité → réduire
- Dette technique → identifier / réduire (→ `PROJECT_HEALTH.md`)
- Fonctions → simplifier / découpler / typer
- Modules → isoler / découpler / réutiliser
- Responsabilités → séparer
- Logique métier → centraliser / isoler
- Magic values → supprimer / centraliser
- Configuration → centraliser
- Naming → clarifier / uniformiser
- Types → renforcer / expliciter
- TypeScript → typer strictement
- Code mort → supprimer
- Imports → nettoyer / optimiser
- Exceptions → gérer / remonter proprement
- Fallbacks → prévoir / sécuriser
- Edge cases → identifier / traiter
- Side effects → limiter / isoler
- Conventions → homogénéiser

## ARCHITECTURE

- Architecture → structurer / simplifier / consolider
- Modules → découpler / isoler
- Dépendances → réduire / contrôler
- Couplage → réduire
- Cohésion → renforcer
- Services → modulariser
- Composants → rendre réutilisables
- Business logic → isoler (`lib/`, pas dans JSX)
- Infrastructure → séparer de la logique métier
- Configuration → externaliser (`.env`, `site-content`)
- Flux → clarifier / simplifier
- CMS futur → contenu via `SiteContent` + Blob

## API / BACKEND

- API → sécuriser / valider / limiter
- Payload → valider / typer (schéma)
- Réponses → standardiser ; pas de fuite d'info
- Codes HTTP → normaliser
- Timeout / retry → définir / limiter
- CORS → restreindre (same-origin par défaut ici)
- Rate limit → appliquer (login admin)
- Business rules → côté serveur uniquement

## FRONTEND / NEXT.JS

- Server Components → privilégier
- Client Components → limiter (`"use client"` justifié)
- Formulaires → valider (serveur si state-changing)
- Loading / error / empty states → prévoir
- Responsive → vérifier
- Accessibilité → améliorer (vague 3 : ARCH-04)
- SEO → voir `SEO_OPTIMIZATION.md`
- Images → optimiser (`next/image`, ARCH-02)
- Bundle → réduire

## PERFORMANCE

- Mesurer avant d'optimiser
- Cache → Redis sessions ; pas de cache public sur routes auth
- Images → compresser (ARCH-02)
- Lazy loading → contenu hors viewport
- Tiers (Maps, Calendly) → différer / clic utilisateur

## ROBUSTESSE / FIABILITÉ

- Erreurs → anticiper ; fallback `DEFAULT_CONTENT` si Blob indisponible
- Race conditions → sessions / save CMS
- Validation → renforcer aux frontières de confiance

## TESTS / QA

- Build → `npm ci` + `next build` sur clone propre
- Lint / typecheck → CODE-01, CODE-02 (vague 3)
- Auth admin → smoke Preview (AUTH-02, CMS-01)
- Régression → enregistrer dans PROJECT_HEALTH

## LOGS / OBSERVABILITÉ

- Pas de secrets ni mots de passe dans les logs
- Audit actions admin → à renforcer si besoin

## GIT / VERSIONING

- Branches isolées ; merge vagues séquentiel 0→1→2
- Diff → auditer secrets avant commit
- Documenter jalons → `CURRENT_STATE.md`, `DECISIONS.md`

## DÉPLOIEMENT / VERCEL

- Variables par environnement (Preview ≠ Prod)
- `NEXT_PUBLIC_SITE_URL` HTTPS en prod (PH-03)
- Preview → recette Phase A avant prod
- Rollback → tags / revert main

## STOCKAGE / VERCEL BLOB

- Blob privé ; token serveur uniquement
- JSON CMS → valider via `mergeContent` / schéma
- Pas d'upload fichiers sans décision (CMS-04)

## UX / INTERFACE

- Navigation cohérente ; Contact accessible mobile (ARCH-05 FIXED)
- Erreurs utilisateur → messages clairs
- Accessibilité scroll/menu → ARCH-04 (open)

## MAINTENABILITÉ

- Documentation → `PROJECT_*`, `docs/standards/`, `DECISIONS.md`
- Conventions → `AGENTS.md`, `PROJECT_CONTEXT.md`

---

## Verbes agent (consignes opérationnelles)

| Verbe | Sens |
|-------|------|
| Auditer | Rechercher les défauts existants |
| Sécuriser | Éliminer les vulnérabilités |
| Renforcer | Améliorer une protection existante |
| Refactorer | Structure sans changer le comportement |
| Factoriser | Supprimer les répétitions |
| Découpler / Isoler | Réduire les dépendances |
| Centraliser | Source unique de vérité |
| Standardiser / Homogénéiser | Règle commune partout |
| Valider / Sanitiser / Typer / Contraindre | Données et types sûrs |
| Optimiser | Perf ou ressources |
| Monitorer / Tracer / Journaliser | Observabilité |
| Mitiger | Réduire l'impact d'un risque |
| Révoquer / Expirer | Invalidation accès |
| Chiffrer / Hacher / Masquer / Externaliser | Protection des données |
| Tester / Stabiliser / Documenter / Nettoyer | Qualité et clarté |
