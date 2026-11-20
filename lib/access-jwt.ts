/** Clé publique d'une équipe Cloudflare Access (https://<équipe>/cdn-cgi/access/certs). */
export type AccessKey = JsonWebKey & { kid?: string };

function base64url(value: string): Uint8Array<ArrayBuffer> {
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "===".slice((b64.length + 3) % 4));
  return Uint8Array.from(bin, (char) => char.charCodeAt(0));
}

function decodeJson(part: string): Record<string, unknown> | null {
  try {
    const value = JSON.parse(new TextDecoder().decode(base64url(part)));
    return value && typeof value === "object" ? value : null;
  } catch {
    return null;
  }
}

/**
 * Vérifie le jeton posé par Cloudflare Access (en-tête Cf-Access-Jwt-Assertion) :
 * signature RS256 par une clé de l'équipe, audience de l'application, émetteur et validité.
 */
export async function verifyAccessJwt(
  token: string,
  options: { team: string; audience: string; keys: AccessKey[]; now?: number },
): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 3 || !options.team || !options.audience) return false;
  const header = decodeJson(parts[0]);
  const payload = decodeJson(parts[1]);
  if (!header || !payload || header.alg !== "RS256") return false;
  const jwk = options.keys.find((key) => key.kid === header.kid);
  if (!jwk) return false;

  try {
    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, [
      "verify",
    ]);
    const signed = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    if (!(await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, base64url(parts[2]), signed))) return false;
  } catch {
    return false;
  }

  const now = options.now ?? Date.now() / 1000;
  const aud = payload.aud;
  const audienceOk = Array.isArray(aud) ? aud.includes(options.audience) : aud === options.audience;
  const nbf = payload.nbf;
  return (
    audienceOk &&
    payload.iss === `https://${options.team}` &&
    typeof payload.exp === "number" &&
    payload.exp > now &&
    (nbf === undefined || (typeof nbf === "number" && nbf <= now + 60))
  );
}
