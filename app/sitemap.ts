import type { MetadataRoute } from "next";
import { ACTUALITES } from "@/data/actualites";
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

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();
  return [
    ...PATHS.map((path) => ({
      url: `${base}${path === "/" ? "" : path}`,
      lastModified: now,
    })),
    ...ACTUALITES.map((actu) => ({
      url: `${base}/nouvelles/${actu.slug}`,
      lastModified: now,
    })),
  ];
}
