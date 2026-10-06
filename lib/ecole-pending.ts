/**
 * Données fournies par l'établissement — source unique pour les champs en attente (Phase B).
 * Ne pas inventer de valeurs : null = non reçu ; les helpers affichent « à confirmer par l'établissement ».
 */

export const PENDING_LABEL = "à confirmer par l'établissement";

/** Retourne la valeur si renseignée, sinon le libellé d'attente. */
export function legalLine(
  value: string | null | undefined,
  fallback: string = PENDING_LABEL,
): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export interface EcolePendingData {
  /** Raison sociale exacte (association, GIP, etc.) */
  legalName: string | null;
  /** Forme juridique */
  legalForm: string | null;
  /** Numéro SIRET */
  siret: string | null;
  /** Nom du responsable de publication (direction) */
  publicationDirector: string | null;
  /** Hébergeur Vercel confirmé par l'établissement */
  hostConfirmed: boolean;
  /** Adresse de contact affichée (Gmail actuel en attendant confirmation institutionnelle) */
  contactEmail: string;
  /** Email confirmé par l'établissement */
  contactEmailConfirmed: boolean;
  /** Effectifs collège — valeurs actuelles du site, à confirmer par l'établissement */
  collegeStats: readonly string[];
  /** Effectifs lycée — valeurs actuelles du site, à confirmer par l'établissement */
  lyceeStats: readonly string[];
  /** Résultats brevet (collège) — texte affiché, à confirmer */
  collegeResults: string;
}

export const ecolePending: EcolePendingData = {
  legalName: null,
  legalForm: null,
  siret: null,
  publicationDirector: null,
  hostConfirmed: true,
  contactEmail: "hautefeuille92@gmail.com",
  contactEmailConfirmed: false,
  // Copie probable (CODE-05) — ne pas modifier sans confirmation écrite de l'établissement
  collegeStats: ["240 élèves", "2 classes par division de la 6e à la 3e", "19 professeurs"],
  lyceeStats: ["240 élèves", "2 classes par division de la 2de à la terminale", "19 professeurs"],
  collegeResults: "100 % de réussite au brevet, 96 % de mentions",
};

/** Ligne éditeur : forme juridique, raison sociale et SIRET. */
export function legalIdentityLine(): string {
  const parts = [
    ecolePending.legalForm,
    ecolePending.legalName,
    ecolePending.siret ? `SIRET ${ecolePending.siret}` : null,
  ]
    .map((p) => p?.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return `Forme juridique, raison sociale et numéro SIRET : ${PENDING_LABEL}.`;
  }

  return parts.join(", ");
}

/** Email de contact avec mention si non confirmé. */
export function contactEmailDisplay(): string {
  if (ecolePending.contactEmailConfirmed) {
    return ecolePending.contactEmail;
  }
  return `${ecolePending.contactEmail} (${PENDING_LABEL})`;
}

/** Texte hébergeur selon confirmation établissement. */
export function hostDisplay(): string {
  const base =
    "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. Cet hébergeur correspond à la cible de déploiement du site";
  if (ecolePending.hostConfirmed) {
    return `${base}.`;
  }
  return `${base} et reste ${PENDING_LABEL} au moment de la mise en ligne.`;
}
