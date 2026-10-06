# AGENTS

Règles permanentes pour tout agent (humain ou IA) travaillant sur ce dépôt.

---

## Avant toute tâche (obligatoire)

1. Lire **`CURRENT_STATE.md`** — état du jour, phases A–D, blocages
2. Lire **`PROJECT_HEALTH.md`** — anomalies ouvertes et historique
3. Parcourir **`docs/standards/ENGINEERING_CHECKLIST.md`** — sections pertinentes à la tâche
4. Lire **`PROJECT_CONTEXT.md`** si architecture, stack ou périmètre
5. Consulter **`DECISIONS.md`** si auth, CMS, déploiement ou contenu sensible

### Avant toute modification de code

6. Appliquer **`docs/standards/SECURITY_ENGINEERING.md`** (API, auth, admin, secrets, validation)
7. Appliquer **`docs/standards/SEO_OPTIMIZATION.md`** si page publique, metadata, sitemap, contenu indexable
8. Analyser le code existant ; respecter conventions du fichier cible

Les règles Cursor **`.cursor/rules/*.mdc`** (`alwaysApply: true`) rappellent cette lecture à chaque session agent.

---

## Principes de modification

- **Minimal et ciblé** : plus petit diff correct ; pas de refactor hors scope
- **Pas de duplication** : réutiliser `getContent()`, composants et libs existants
- **Pas de dépendance** sans justification documentée dans `DECISIONS.md`
- **Typage, validation, erreurs, sécurité** : maintenir le niveau actuel (TypeScript strict, routes API protégées)
- **Impacts transverses** : vérifier CSP, sitemap, admin, contenu CMS, pages juridiques avant de merger

---

## Hors scope automatique

Ne **jamais** corriger automatiquement un problème découvert en dehors de la demande explicite.

En revanche :

- **Enregistrer** toute anomalie dans `PROJECT_HEALTH.md` (ID, statut, sévérité, date, composant, cause, action)
- **Ne pas dupliquer** : mettre à jour l'entrée existante si l'ID existe déjà
- **Ne jamais supprimer** une entrée résolue : passer à `[FIXED]`

Un build réussi **ne prouve pas** que l'implémentation est saine.

---

## PROJECT_HEALTH.md — obligations

| Moment | Action |
|--------|--------|
| Début de tâche | Lire le registre |
| Après changement code, build, test, review ou audit | Mettre à jour si nouvelle anomalie ou changement de statut |
| Découverte hors scope | Enregistrer ; ne pas corriger sans demande |

Format d'entrée :

```
### ID [OPEN|FIXED|MONITOR] [CRITICAL|HIGH|MEDIUM|LOW] YYYY-MM-DD
- Composant : …
- Constat : …
- Cause : …
- Action : …
```

Registre : concis, factuel, chronologique, versionné dans Git.

---

## Fichiers sources de vérité — rôles

| Fichier | Rôle | Mise à jour |
|---------|------|-------------|
| `PROJECT_CONTEXT.md` | Contexte structurel stable | Changement d'architecture, stack, périmètre |
| `DECISIONS.md` | Journal décisions non triviales | Décision technique ou produit importante |
| `CURRENT_STATE.md` | État actuel + **phases A–D** | Après merge, recette, blocage levé, retour école |
| `PROJECT_HEALTH.md` | Anomalies et dette | Chaque bug, risque, régression |
| `AGENTS.md` | Ce fichier | Règles agent changées |
| `docs/standards/ENGINEERING_CHECKLIST.md` | Checklist par domaine + verbes agent | Nouveau domaine ou pratique |
| `docs/standards/SECURITY_ENGINEERING.md` | Politique sécurité complète | Évolution politique sécurité |
| `docs/standards/SEO_OPTIMIZATION.md` | Politique SEO Next.js complète | Évolution politique SEO |
| `.cursor/rules/*.mdc` | Règles injectées automatiquement par Cursor | Changement de règles agent |

---

## Spécificités projet

- Contenu éditable → `lib/site-content.ts` + Blob ; pages juridiques → code statique
- Pas de route d'upload sans décision explicite
- Pas de photos d'élèves sans autorisation écrite
- Pas de secrets dans Git ; contrat dans `.env.example` uniquement
- Merge vagues : ordre **0 → 1 → 2** ; stash landing **après** recette Phase A
- Messagerie = `mailto:` / téléphone externe ; pas de formulaire intégré sauf demande explicite

---

## Commits et déploiement

- Ne committer que si demandé explicitement
- Ne pas pousser vers remote sans demande
- Mettre à jour `CURRENT_STATE.md` et `PROJECT_HEALTH.md` dans le même lot de travail qu'un jalon significatif (merge, recette, prod)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
