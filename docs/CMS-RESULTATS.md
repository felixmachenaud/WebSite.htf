# Intégration CMS — Section Résultats Bac

## Structure des données

Le composant `ResultatsSection` attend un objet `ResultatsBacData` :

```typescript
interface ResultatsBacData {
  titre: string;        // ex: "LES RÉSULTATS"
  sousTitre: string;   // ex: "100 % de réussite au bac, 91 % de mentions"
  annees: ResultatAnnee[];
}

interface ResultatAnnee {
  annee: number;       // ex: 2025
  mentions: ResultatMention[];
}

interface ResultatMention {
  label: "TB" | "B" | "AB" | "Passable" | "Échec" | "Admis";
  value: number;       // pourcentage
  color: string;       // hex (optionnel, dérivé automatiquement si absent)
}
```

## Schéma Sanity (exemple)

```javascript
// schemas/resultatsBac.js
export default {
  name: 'resultatsBac',
  title: 'Résultats Bac',
  type: 'document',
  fields: [
    { name: 'titre', title: 'Titre', type: 'string', initialValue: 'LES RÉSULTATS' },
    { name: 'sousTitre', title: 'Sous-titre', type: 'string' },
    {
      name: 'annees',
      title: 'Années',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'annee', title: 'Année', type: 'number' },
          {
            name: 'mentions',
            title: 'Mentions',
            type: 'array',
            of: [{
              type: 'object',
              fields: [
                { name: 'label', title: 'Label', type: 'string', options: { list: ['TB', 'B', 'AB', 'Passable', 'Échec', 'Admis'] } },
                { name: 'value', title: 'Pourcentage', type: 'number' }
              ]
            }
          }
        ]
      }]
    }
  ]
}
```

## Requête GROQ (Sanity)

```groq
*[_type == "resultatsBac"][0] {
  titre,
  sousTitre,
  annees[] {
    annee,
    mentions[] {
      label,
      value
    }
  }
}
```

## Mapping des couleurs

Les couleurs sont appliquées automatiquement selon le label :
- TB : rouge
- B : vert
- AB : teal
- Passable : gris clair
- Échec : gris foncé
- Admis : gris moyen
