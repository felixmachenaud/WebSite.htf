import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { bindings } from "@/lib/cloudflare-bindings";
import { DEFAULT_CONTENT, mergeContent, type SiteContent } from "@/lib/site-content";

/** Clé de l'objet R2 (liaison CMS_BUCKET) qui contient les textes enregistrés depuis /admin. */
export const CMS_KEY = "site-content.json";
const LOCAL_FILE = path.join(process.cwd(), ".data", "site-content.json");
/** Copie du R2 téléchargée par scripts/deploy.mjs avant le build : les pages prérendues partent du contenu en ligne. */
const BUILD_SNAPSHOT = path.join(process.cwd(), ".data", "cms-snapshot.json");

async function readJsonFile(file: string): Promise<unknown | null> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as unknown;
  } catch {
    return null;
  }
}

export async function getContent(): Promise<SiteContent> {
  try {
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return mergeContent(DEFAULT_CONTENT, await readJsonFile(BUILD_SNAPSHOT));
    }
    const { CMS_BUCKET } = await bindings();
    if (CMS_BUCKET) {
      const object = await CMS_BUCKET.get(CMS_KEY);
      return mergeContent(DEFAULT_CONTENT, object ? (JSON.parse(await object.text()) as unknown) : null);
    }
    if (process.env.NODE_ENV !== "production") {
      return mergeContent(DEFAULT_CONTENT, await readJsonFile(LOCAL_FILE));
    }
  } catch {
    return DEFAULT_CONTENT;
  }
  return DEFAULT_CONTENT;
}

export async function saveContent(input: unknown): Promise<"ok" | "unavailable"> {
  const current = await getContent();
  const body = JSON.stringify(mergeContent(current, input));
  const { CMS_BUCKET } = await bindings();
  if (CMS_BUCKET) {
    await CMS_BUCKET.put(CMS_KEY, body, { httpMetadata: { contentType: "application/json" } });
    return "ok";
  }
  if (process.env.NODE_ENV === "production") return "unavailable";
  await mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await writeFile(LOCAL_FILE, body, "utf8");
  return "ok";
}
