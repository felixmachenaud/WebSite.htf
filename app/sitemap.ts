import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content-store";
import { siteUrl } from "@/lib/site-url";

const PATHS = [
  "/",
  "/a-propos",
  "/a-propos/college",
  "/a-propos/lycee",
  "/a-propos/histoire",
  "/a-propos/projet-educatif",
  "/a-propos/information-generale",
  "/a-propos/projet-educatif/viser-l-excellence",
  "/a-propos/projet-educatif/s-ouvrir-au-monde",
  "/a-propos/projet-educatif/donner-du-sens",
  "/a-propos/vie-a-hautefeuille",
  "/a-propos/familles",
  "/a-propos/temoignages",
  "/a-propos/documentation",
  "/a-propos/soutenez-nous",
  "/a-propos/inscriptions",
  "/contact",
  "/nouvelles",
  "/mentions-legales",
  "/confidentialite",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();
  const { actualites } = await getContent();
  return [
    ...PATHS.map((path) => ({
      url: `${base}${path === "/" ? "" : path}`,
      lastModified: now,
    })),
    ...actualites.filter((item) => item.slug).map((actu) => ({
      url: `${base}/nouvelles/${actu.slug}`,
      lastModified: now,
    })),
  ];
}
