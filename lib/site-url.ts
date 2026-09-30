/** URL canonique. Définir NEXT_PUBLIC_SITE_URL en Preview et en Production. */
export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  return "http://localhost:3000";
}
