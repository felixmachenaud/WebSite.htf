# DECISIONS

Journal des décisions techniques et produit importantes. Modifications triviales non consignées.

Format : **date** — **décision** — raison — alternatives — conséquences

---

## 2026-09-30 — Mini-CMS maison (Blob JSON) plutôt que Sanity / Payload

**Décision** : Contenu éditable via `SiteContent` + Vercel Blob + interface `/admin`.

**Raison** : Besoin léger (textes institutionnels), coût/complexité Sanity disproportionné pour ce client.

**Alternatives abandonnées** : Sanity (documenté initialement dans `docs/CMS-RESULTATS.md`), Payload.

**Conséquences** : Pas d'upload médias ; couleurs du graphique bac restent dans `data/resultats.ts` ; pages juridiques hors éditeur.

---

## 2026-09-30 — Montée Next.js 14 → 16.3.7

**Décision** : Corriger les CVE critiques sur Next en montant sur la branche 16 stable.

**Raison** : `npm audit` et avis de sécurité sur App Router.

**Alternatives abandonnées** : Patch minimal 14.x (correctifs incomplets).

**Conséquences** : `params` async dans les routes dynamiques ; React 18 conservé ; `turbopack.root` fixé (PH-01).

---

## 2026-09-30 — Auth admin : scrypt + cookie HMAC + Redis

**Décision** : Mot de passe stocké en hash scrypt (`ADMIN_PASSWORD_HASH`), sessions dans Upstash Redis, pepper `AUTH_SECRET`.

**Raison** : Pas de credentials en clair ; sessions invalidables au logout.

**Alternatives abandonnées** : Mot de passe en variable d'env simple ; JWT stateless seul.

**Conséquences** : Sans Redis + secrets, `/admin` affiche « non configurée » et login 503 en prod.

---

## 2026-09-30 — Retrait des photos d'élèves (Rome, Montmartre)

**Décision** : Supprimer les fichiers image et ne servir que le texte des articles concernés.

**Raison** : Aucune trace de consentement dans le dépôt.

**Alternatives abandonnées** : Conserver les images en attendant validation.

**Conséquences** : SEC-07 FIXED ; ne pas réintroduire sans accord écrit de l'établissement.

---

## 2026-09-30 — Suppression du faux formulaire footer

**Décision** : Retirer le formulaire newsletter/contact du footer.

**Raison** : `onSubmit` annulait l'envoi ; mention d'une politique inexistante.

**Alternatives abandonnées** : Brancher un service email (Resend, etc.) immédiatement.

**Conséquences** : Texte « inscription bientôt disponible » ; pas de messagerie intégrée au site.

---

## 2026-09-30 — Contact : mailto + Calendly, carte Google au clic

**Décision** : Pas d'iframe Maps par défaut ; chargement carte après action utilisateur. Calendly en lien externe.

**Raison** : Réduire chargement tiers et surface RGPD/CSP.

**Alternatives abandonnées** : Carte embarquée d'emblée ; formulaire contact natif.

**Conséquences** : URL Calendly et compte Gmail à confirmer par l'établissement (SEC-06, SEC-08).

---

## 2026-09-30 — Pages juridiques hors CMS

**Décision** : `mentions-legales` et `confidentialite` en texte statique dans `app/`, relu par l'établissement.

**Raison** : Contenu juridique sensible ; ne doit pas être modifiable via le même panneau que le marketing.

**Alternatives abandonnées** : Onglet admin dédié juridique.

**Conséquences** : Mise à jour légale = commit code après validation école.

---

## 2026-09-30 — Merge par vagues séquentielles (0 → 1 → 2 → 3)

**Décision** : Merger `vague-0`, puis `vague-1`, puis `vague-2` sur `main` ; vague 3 séparée ; stash landing après merges.

**Raison** : Chaque vague = 1 commit empilé ; merge désordonné multiplie conflits et rollback.

**Alternatives abandonnées** : Merge unique des quatre branches.

**Conséquences** : Plan d'exécution phases A–D dans `CURRENT_STATE.md`.

---

## 2026-09-30 — Pas de route d'upload

**Décision** : Aucune API upload médias dans les vagues 0–2.

**Raison** : Hors besoin immédiat ; surface d'attaque et gouvernance des images élèves.

**Alternatives abandonnées** : Upload Vercel Blob depuis l'admin.

**Conséquences** : CMS-04 OPEN ; images changées par commit ou process manuel agence.

---

## 2026-10-06 — Fichiers sources de vérité agent (PROJECT_CONTEXT, DECISIONS, CURRENT_STATE, AGENTS)

**Décision** : Créer et maintenir quatre fichiers racine + conserver `PROJECT_HEALTH.md` pour les anomalies.

**Raison** : Séparer contexte stable, décisions, état courant et règles agent ; éviter de tout mélanger dans le chat.

**Alternatives abandonnées** : Issues GitHub uniquement ; tout dans PROJECT_HEALTH.

**Conséquences** : Agents lisent l'ensemble avant toute tâche ; phases opérationnelles dans `CURRENT_STATE.md`.

---

## 2026-10-06 — Standards engineering, sécurité et SEO

**Décision** : Checklist engineering + politiques sécurité et SEO complètes dans `docs/standards/` ; règles Cursor `alwaysApply` dans `.cursor/rules/`.

**Raison** : Mémoire projet permanente ; sécurité et SEO influencent chaque modification, pas seulement les audits finaux.

**Alternatives abandonnées** : Tout mettre dans `AGENTS.md` (trop long pour le contexte agent) ; règles uniquement en chat.

**Conséquences** : `.mdc` = rappel + résumé injecté à chaque session ; documents complets lus via outil Read quand la tâche l'exige.
