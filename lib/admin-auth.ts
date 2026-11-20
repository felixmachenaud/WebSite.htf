import { verifyAccessJwt, type AccessKey } from "@/lib/access-jwt";

/**
 * L'admin est protégée par Cloudflare Access : l'utilisateur saisit son courriel, reçoit un code à 6 chiffres,
 * et seuls les courriels autorisés par la politique Access entrent. Le Worker vérifie quand même le jeton
 * (en-tête Cf-Access-Jwt-Assertion) : sans cela, une route non couverte par Access contournerait la protection.
 * ACCESS_TEAM_DOMAIN (ex. ecole.cloudflareaccess.com) et ACCESS_AUD (audience de l'application) : vars de wrangler.jsonc.
 */
export type AuthConfig = "ok" | "unconfigured";

const team = () => (process.env.ACCESS_TEAM_DOMAIN ?? "").trim();
const audience = () => (process.env.ACCESS_AUD ?? "").trim();
const devMode = () => process.env.NODE_ENV === "development";

export function authConfig(): AuthConfig {
  if (devMode()) return "ok";
  return team() && audience() ? "ok" : "unconfigured";
}

let cachedKeys: { at: number; keys: AccessKey[] } | null = null;

async function accessKeys(maxAgeMs = 10 * 60_000): Promise<AccessKey[]> {
  if (cachedKeys && Date.now() - cachedKeys.at < maxAgeMs) return cachedKeys.keys;
  const response = await fetch(`https://${team()}/cdn-cgi/access/certs`);
  if (!response.ok) throw new Error(`access-certs-${response.status}`);
  const { keys } = (await response.json()) as { keys: AccessKey[] };
  cachedKeys = { at: Date.now(), keys };
  return keys;
}

/** Vrai si la requête porte un jeton Access valide pour l'application admin (toujours vrai en `next dev`). */
export async function isAdmin(headers: { get(name: string): string | null }): Promise<boolean> {
  if (devMode()) return true;
  // En-tête posé par Access sur les chemins protégés ; sinon le cookie de session Access (même jeton signé).
  const cookie = headers.get("cookie")?.match(/(?:^|;\s*)CF_Authorization=([^;]+)/)?.[1];
  const token = headers.get("cf-access-jwt-assertion") || cookie;
  if (!token || authConfig() !== "ok") return false;
  try {
    const check = async (keys: AccessKey[]) => verifyAccessJwt(token, { team: team(), audience: audience(), keys });
    // Access fait tourner ses clés : un refus relit les clés si elles datent de plus d'une minute.
    return (await check(await accessKeys())) || (await check(await accessKeys(60_000)));
  } catch {
    return false;
  }
}

/** Anti-CSRF : en-tête maison (impose un preflight CORS) et même origine. */
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
