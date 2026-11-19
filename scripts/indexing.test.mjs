// node --test scripts/indexing.test.mjs (Node >= 22.18, type stripping natif)
import { test } from "node:test";
import assert from "node:assert/strict";
import { serveWithIndexing } from "../lib/indexing.ts";

const page = () =>
  new Response("<html></html>", { status: 404, headers: { "Content-Security-Policy": "default-src 'self'" } });
const req = (path) => new Request(`https://site.test${path}`);

for (const value of [undefined, "", "off", "ON", "yes"]) {
  test(`indexation fermée si INDEXING=${value}`, async () => {
    const robots = await serveWithIndexing(req("/robots.txt"), value, () => new Response("Allow: /"));
    assert.equal(await robots.text(), "User-agent: *\nDisallow: /\n");
    assert.equal(robots.headers.get("X-Robots-Tag"), "noindex, nofollow");
    const other = await serveWithIndexing(req("/introuvable"), value, page);
    assert.equal(other.status, 404);
    assert.equal(other.headers.get("X-Robots-Tag"), "noindex, nofollow");
    assert.equal(other.headers.get("Content-Security-Policy"), "default-src 'self'");
  });
}

test("indexation ouverte uniquement avec INDEXING=on", async () => {
  const robots = await serveWithIndexing(req("/robots.txt"), "on", () => new Response("Sitemap: x"));
  assert.equal(await robots.text(), "Sitemap: x");
  assert.equal(robots.headers.get("X-Robots-Tag"), null);
});
