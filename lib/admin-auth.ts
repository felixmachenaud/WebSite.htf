import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "hf_admin";
const SESSION_SECONDS = 60 * 60 * 2;
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEYLEN = 64;

export type AuthConfig = "ok" | "unconfigured" | "plaintext-refused";

export function authConfig(): AuthConfig {
  if (process.env.NODE_ENV === "production" && process.env.ADMIN_PASSWORD) {
    return "plaintext-refused";
  }
  const hash = process.env.ADMIN_PASSWORD_HASH ?? "";
  const secret = process.env.AUTH_SECRET ?? "";
  if (!hash.startsWith("scrypt$") || secret.length < 32) return "unconfigured";
  return "ok";
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const n = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  if (n !== SCRYPT_N || r !== SCRYPT_R || p !== SCRYPT_P) return false;
  let salt: Buffer;
  let expected: Buffer;
  try {
    salt = Buffer.from(parts[4], "base64url");
    expected = Buffer.from(parts[5], "base64url");
  } catch {
    return false;
  }
  if (salt.length === 0 || expected.length !== KEYLEN) return false;
  const actual = scryptSync(password, salt, KEYLEN, { N: n, r, p, maxmem: 64 * 1024 * 1024 });
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function sessionKey(token: string): string {
  const secret = process.env.AUTH_SECRET ?? "";
  return createHmac("sha256", secret).update(token).digest("hex");
}

export function newSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export async function readSessionToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value ?? null;
}

export async function writeSessionCookie(token: string): Promise<void> {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function sessionTtlSeconds(): number {
  return SESSION_SECONDS;
}

export function isAdminFetch(request: Request): boolean {
  if (request.headers.get("x-hautefeuille-admin") !== "1") return false;
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return false;
    } catch {
      return false;
    }
  }
  return true;
}

export function clientAddress(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || "local";
}
