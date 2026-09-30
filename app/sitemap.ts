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
