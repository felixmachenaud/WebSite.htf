import { hostLegalText } from "@/lib/site-hosting";

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
  legalName: "ASSOC POUR PROMOT ACTIV SCOLAI ET EDUCAT (APASE)",
  legalForm: "Association",
  siret: "44345731200025",
  /** Identité nominative LCEN ; courriel de contact direction : dimitri.dugas-de-baudan@hautefeuille92.fr */
  publicationDirector: "Dimitri de Baudan",
  /** Passer à true quand la direction valide le texte hébergeur (après choix Vercel ou OVH). */
  hostConfirmed: false,
  contactEmail: "hautefeuille92@gmail.com",
  contactEmailConfirmed: true,
  collegeStats: ["213 élèves", "2 classes par division de la 6e à la 3e"],
  lyceeStats: ["111 élèves", "2 classes par division de la 2de à la terminale"],
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

/** Texte hébergeur : SITE_HOSTING (vercel | ovh | pending) + validation direction. */
export function hostDisplay(): string {
  const text = hostLegalText();
  if (ecolePending.hostConfirmed) return text;
  if (text.includes("en cours de finalisation")) return text;
  return `${text} Texte ${PENDING_LABEL} par la direction.`;
}
