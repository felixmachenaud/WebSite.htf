/**
 * Hébergement applicatif vs mentions légales — ambivalent jusqu'à décision établissement.
 * Le code et le CMS restent identiques sur Vercel ou sur un serveur OVH (Node).
 */

export type SiteHostingProvider = "vercel" | "ovh" | "pending";

const VERCEL_LEGAL =
  "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (hébergement applicatif Next.js).";

const OVH_LEGAL =
  "OVH SAS, 2 rue Kellermann, 59100 Roubaix, France (hébergement applicatif sur infrastructure OVH).";

const PENDING_LEGAL =
  "Le choix de l'hébergement applicatif (Vercel Inc. ou OVH SAS) est en cours de finalisation avec l'établissement. " +
  "Le nom de domaine peut rester géré chez OVH indépendamment de cette décision. " +
  "Les présentes mentions seront mises à jour dès validation.";

/** Valeur explicite uniquement — pas d'inférence automatique depuis VERCEL=1 (décision en négociation). */
export function siteHostingProvider(): SiteHostingProvider {
  const raw = process.env.SITE_HOSTING?.trim().toLowerCase();
  if (raw === "vercel" || raw === "ovh") return raw;
  return "pending";
}

export function hostLegalText(): string {
  switch (siteHostingProvider()) {
    case "vercel":
      return VERCEL_LEGAL;
    case "ovh":
      return OVH_LEGAL;
    default:
      return PENDING_LEGAL;
  }
}

/** Où tourne l'app Node (build/start). Indépendant du registrar DNS. */
export function runtimePlatform(): "vercel" | "node-self-hosted" {
  return process.env.VERCEL === "1" ? "vercel" : "node-self-hosted";
}
