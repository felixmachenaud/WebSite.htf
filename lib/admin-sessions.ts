import { Redis } from "@upstash/redis";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { sessionKey, sessionTtlSeconds } from "@/lib/admin-auth";

const LOCAL_FILE = path.join(process.cwd(), ".data", "admin-sessions.json");
const WINDOW_SECONDS = 15 * 60;
const MAX_ATTEMPTS = 8;

type LocalStore = {
  sessions: Record<string, number>;
  rates: Record<string, { count: number; resetAt: number }>;
};

/** Credentials REST read-write uniquement — jamais les variables *_READ_ONLY_* (Vercel KV). */
function redisRestCredentials(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL?.trim() ||
    process.env.KV_REST_API_URL?.trim() ||
    "";
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.KV_REST_API_TOKEN?.trim() ||
    "";
  if (!url || !token) return null;
  return { url, token };
}

function redisClient(): Redis | null {
  const creds = redisRestCredentials();
  if (!creds) return null;
  return new Redis(creds);
}

export function sessionStoreReady(): boolean {
  if (redisClient()) return true;
  return process.env.NODE_ENV !== "production";
}

async function readLocal(): Promise<LocalStore> {
  try {
    const raw = await readFile(LOCAL_FILE, "utf8");
    const parsed = JSON.parse(raw) as LocalStore;
    return {
      sessions: parsed.sessions ?? {},
      rates: parsed.rates ?? {},
    };
  } catch {
    return { sessions: {}, rates: {} };
  }
}

async function writeLocal(store: LocalStore): Promise<void> {
  await mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await writeFile(LOCAL_FILE, JSON.stringify(store), "utf8");
}

export async function createSession(token: string): Promise<void> {
  const key = `sess:${sessionKey(token)}`;
  const redis = redisClient();
  if (redis) {
    await redis.set(key, "1", { ex: sessionTtlSeconds() });
    return;
  }
  if (process.env.NODE_ENV === "production") throw new Error("redis-missing");
  const store = await readLocal();
  store.sessions[key] = Date.now() + sessionTtlSeconds() * 1000;
  await writeLocal(store);
}

export async function sessionExists(token: string | null): Promise<boolean> {
  if (!token) return false;
  const key = `sess:${sessionKey(token)}`;
  const redis = redisClient();
  if (redis) {
    const value = await redis.get(key);
    return value === "1" || value === 1;
  }
  if (process.env.NODE_ENV === "production") return false;
  const store = await readLocal();
  const exp = store.sessions[key];
  return typeof exp === "number" && exp > Date.now();
}

export async function destroySession(token: string | null): Promise<void> {
  if (!token) return;
  const key = `sess:${sessionKey(token)}`;
  const redis = redisClient();
  if (redis) {
    await redis.del(key);
    return;
  }
  if (process.env.NODE_ENV === "production") return;
  const store = await readLocal();
  delete store.sessions[key];
  await writeLocal(store);
}

export async function registerLoginFailure(ip: string): Promise<{ limited: boolean }> {
  const key = `rl:${ip}`;
  const redis = redisClient();
  if (redis) {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, WINDOW_SECONDS);
    return { limited: count > MAX_ATTEMPTS };
  }
  if (process.env.NODE_ENV === "production") return { limited: true };
  const store = await readLocal();
  const now = Date.now();
  const current = store.rates[key];
  if (!current || current.resetAt < now) {
    store.rates[key] = { count: 1, resetAt: now + WINDOW_SECONDS * 1000 };
  } else {
    current.count += 1;
  }
  await writeLocal(store);
  return { limited: store.rates[key].count > MAX_ATTEMPTS };
}

export async function clearLoginFailures(ip: string): Promise<void> {
  const key = `rl:${ip}`;
  const redis = redisClient();
  if (redis) {
    await redis.del(key);
    return;
  }
  if (process.env.NODE_ENV === "production") return;
  const store = await readLocal();
  delete store.rates[key];
  await writeLocal(store);
}

export async function loginIsLimited(ip: string): Promise<boolean> {
  const key = `rl:${ip}`;
  const redis = redisClient();
  if (redis) {
    const count = Number(await redis.get(key) ?? 0);
    return count > MAX_ATTEMPTS;
  }
  if (process.env.NODE_ENV === "production") return true;
  const store = await readLocal();
  const current = store.rates[key];
  if (!current || current.resetAt < Date.now()) return false;
  return current.count > MAX_ATTEMPTS;
}
