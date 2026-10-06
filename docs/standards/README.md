# Standards agent — Hautefeuille

Documents de référence permanents pour audits, modifications et revues.

| Fichier | Contenu | Quand consulter |
|---------|---------|-----------------|
| `ENGINEERING_CHECKLIST.md` | Checklist par domaine (sécurité, auth, code, archi, API, perf, tests, déploiement, UX…) + verbes agent | **Avant toute modification** — sections pertinentes |
| `SECURITY_ENGINEERING.md` | Politique sécurité applicative complète (OWASP, validation, auth, cookies, uploads…) | Code, API, admin, auth, déploiement, secrets |
| `SEO_OPTIMIZATION.md` | Politique SEO Next.js (metadata, sitemap, rendering, CWV, structured data…) | Pages publiques, routes, contenu, images |

**Injection Cursor** : les règles `.cursor/rules/*.mdc` (`alwaysApply: true`) rappellent ces fichiers à chaque session agent. Les documents complets restent ici pour lecture ciblée (outil Read) sans saturer le contexte.

**Sources de vérité associées** : `AGENTS.md`, `PROJECT_CONTEXT.md`, `CURRENT_STATE.md`, `PROJECT_HEALTH.md`, `DECISIONS.md`.
