import assert from "node:assert/strict";
import { test } from "node:test";
import { verifyAccessJwt } from "../lib/access-jwt.ts";

const TEAM = "ecole.cloudflareaccess.com";
const AUD = "aud-admin";
const NOW = 1_800_000_000;

const b64url = (data) =>
  Buffer.from(typeof data === "string" ? new TextEncoder().encode(data) : data).toString("base64url");

async function setup() {
  const pair = await crypto.subtle.generateKey(
    { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["sign", "verify"],
  );
  const publicJwk = { ...(await crypto.subtle.exportKey("jwk", pair.publicKey)), kid: "k1" };
  const sign = async (payload, header = { alg: "RS256", kid: "k1" }) => {
    const body = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
    const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", pair.privateKey, new TextEncoder().encode(body));
    return `${body}.${b64url(new Uint8Array(signature))}`;
  };
  return { keys: [publicJwk], sign };
}

const valid = { aud: [AUD], iss: `https://${TEAM}`, exp: NOW + 600, nbf: NOW - 10, email: "direction@ecole.fr" };

test("jeton Access valide accepté", async () => {
  const { keys, sign } = await setup();
  assert.equal(await verifyAccessJwt(await sign(valid), { team: TEAM, audience: AUD, keys, now: NOW }), true);
});

test("jeton refusé : audience, émetteur, expiration, signature, algorithme ou config vide", async () => {
  const { keys, sign } = await setup();
  const opts = { team: TEAM, audience: AUD, keys, now: NOW };
  assert.equal(await verifyAccessJwt(await sign({ ...valid, aud: ["autre"] }), opts), false);
  assert.equal(await verifyAccessJwt(await sign({ ...valid, iss: "https://pirate.cloudflareaccess.com" }), opts), false);
  assert.equal(await verifyAccessJwt(await sign({ ...valid, exp: NOW - 1 }), opts), false);
  assert.equal(await verifyAccessJwt(await sign(valid, { alg: "none", kid: "k1" }), opts), false);
  assert.equal(await verifyAccessJwt(await sign(valid, { alg: "RS256", kid: "inconnue" }), opts), false);
  const [h, , s] = (await sign(valid)).split(".");
  const forged = `${h}.${b64url(JSON.stringify({ ...valid, email: "pirate@x.fr" }))}.${s}`;
  assert.equal(await verifyAccessJwt(forged, opts), false);
  assert.equal(await verifyAccessJwt("pas.un-jeton", opts), false);
  assert.equal(await verifyAccessJwt(await sign(valid), { ...opts, audience: "" }), false);
});
