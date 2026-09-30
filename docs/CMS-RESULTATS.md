# Résultats du bac

Les titres, années et pourcentages sont dans `SiteContent` (`lib/site-content.ts`), modifiables depuis `/admin`, onglet Lycée.

Les couleurs des mentions restent dans `data/resultats.ts`. Il n'y a pas de Sanity ni de Payload.

Une sauvegarde partielle conserve les années déjà enregistrées : si le tableau `annees` est absent du JSON, les valeurs par défaut du code sont utilisées.
