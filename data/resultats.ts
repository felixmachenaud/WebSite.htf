/**
 * Données Résultats Bac — structure CMS-ready
 *
 * Intégration CMS (Sanity) :
 * 1. Créer un document type "resultatsBac" avec :
 *    - titre (string)
 *    - sousTitre (string)
 *    - annees (array of { annee: number, mentions: array of { label, value } })
 * 2. Remplacer l'import RESULTATS_BAC par un fetch async dans la page Lycée
 * 3. Passer les données au composant ResultatsSection
 */

export const RESULTATS_COLORS = {
  TB: "#dc2626", // rouge
  B: "#16a34a", // vert
  AB: "#0d9488", // teal
  Passable: "#cbd5e1", // gris clair
  Échec: "#1e293b", // gris foncé
  Admis: "#94a3b8", // gris moyen
} as const;

export type MentionLabel = keyof typeof RESULTATS_COLORS;

export interface ResultatMention {
  label: MentionLabel;
  value: number;
  color: string;
}

export interface ResultatAnnee {
  annee: number;
  mentions: ResultatMention[];
}

export interface ResultatsBacData {
  titre: string;
  sousTitre: string;
  annees: ResultatAnnee[];
}

function buildMention(label: MentionLabel, value: number): ResultatMention {
  return {
    label,
    value,
    color: RESULTATS_COLORS[label],
  };
}

// Données par défaut — à remplacer par le CMS
export const RESULTATS_BAC: ResultatsBacData = {
  titre: "LES RÉSULTATS",
  sousTitre: "100 % de réussite au bac, 91 % de mentions",
  annees: [
    {
      annee: 2025,
      mentions: [
        buildMention("TB", 3),
        buildMention("B", 18.4),
        buildMention("AB", 52.6),
        buildMention("Admis", 26),
      ],
    },
    {
      annee: 2024,
      mentions: [
        buildMention("TB", 24),
        buildMention("B", 26),
        buildMention("AB", 30),
        buildMention("Passable", 20),
      ],
    },
    {
      annee: 2023,
      mentions: [
        buildMention("TB", 15.2),
        buildMention("B", 36.4),
        buildMention("AB", 42.4),
        buildMention("Passable", 3),
        buildMention("Échec", 3),
      ],
    },
  ],
};
