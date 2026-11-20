/**
 * Hébergeur affiché dans les mentions légales.
 * Décision du 19 nov. 2026 : Cloudflare Workers est la seule cible (Vercel abandonné).
 * Le domaine peut rester géré chez OVH (registrar) indépendamment de l'hébergeur.
 */

const CLOUDFLARE_LEGAL =
  "Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis (hébergement du site sur Cloudflare Workers).";

export function hostLegalText(): string {
  return CLOUDFLARE_LEGAL;
}
