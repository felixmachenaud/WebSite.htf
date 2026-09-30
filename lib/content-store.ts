import { get, put } from "@vercel/blob";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { DEFAULT_CONTENT, mergeContent, type SiteContent } from "@/lib/site-content";

const BLOB_PATH = "hautefeuille-site-content.json";
const LOCAL_FILE = path.join(process.cwd(), ".data", "site-content.json");

function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readBlob(): Promise<unknown | null> {
  const result = await get(BLOB_PATH, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) return null;
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as unknown;
}

async function readLocal(): Promise<unknown | null> {
  try {
    return JSON.parse(await readFile(LOCAL_FILE, "utf8")) as unknown;
  } catch {
    return null;
  }
}

export async function getContent(): Promise<SiteContent> {
  try {
    if (blobConfigured()) {
      return mergeContent(DEFAULT_CONTENT, await readBlob());
    }
    if (process.env.NODE_ENV !== "production") {
      return mergeContent(DEFAULT_CONTENT, await readLocal());
    }
  } catch {
    return DEFAULT_CONTENT;
  }
  return DEFAULT_CONTENT;
}

export async function saveContent(input: unknown): Promise<"ok" | "unavailable"> {
  const merged = mergeContent(DEFAULT_CONTENT, input);
  const body = JSON.stringify(merged);
  if (blobConfigured()) {
    await put(BLOB_PATH, body, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return "ok";
  }
  if (process.env.NODE_ENV === "production") return "unavailable";
  await mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await writeFile(LOCAL_FILE, body, "utf8");
  return "ok";
}
