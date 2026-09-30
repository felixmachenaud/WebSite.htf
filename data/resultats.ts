/**
 * Couleurs des mentions, laissées dans le code.
 * Les chiffres et libellés viennent de SiteContent.
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

export function toResultatsBac(data: {
  titre: string;
  sousTitre: string;
  annees: { annee: number; mentions: { label: string; value: number }[] }[];
}): ResultatsBacData {
  return {
    titre: data.titre,
    sousTitre: data.sousTitre,
    annees: data.annees.map((annee) => ({
      annee: annee.annee,
      mentions: annee.mentions.map((mention) => ({
        label: mention.label as MentionLabel,
        value: mention.value,
        color:
          mention.label in RESULTATS_COLORS
            ? RESULTATS_COLORS[mention.label as MentionLabel]
            : "#94a3b8",
      })),
    })),
  };
}
