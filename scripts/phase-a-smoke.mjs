#!/usr/bin/env node
/**
 * Phase A smoke tests (A4–A7). Run after `npm run build`.
 * Usage:
 *   node scripts/phase-a-smoke.mjs
 *   node scripts/phase-a-smoke.mjs --public-only --base=https://example.com
 *   node scripts/phase-a-smoke.mjs --admin-only --base=https://example.com
 *     (/admin derrière Cloudflare Access, enregistrement refusé sans jeton)
 */
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_ONLY = process.argv.includes("--public-only");
const ADMIN_ONLY = process.argv.includes("--admin-only");
const BASE_ARG = process.argv.find((a) => a.startsWith("--base="));
const EXTERNAL_BASE = BASE_ARG ? BASE_ARG.slice("--base=".length).replace(/\/$/, "") : null;

const results = [];
let failed = 0;

function pass(id, detail = "") {
  results.push({ id, ok: true, detail });
  console.log(`  ✅ ${id}${detail ? ` — ${detail}` : ""}`);
}

function fail(id, detail = "") {
  results.push({ id, ok: false, detail });
  failed += 1;
  console.log(`  ❌ ${id}${detail ? ` — ${detail}` : ""}`);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForServer(base, timeoutMs = 60_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${base}/`, { signal: AbortSignal.timeout(3000) });
      if (res.ok || res.status === 404) return;
    } catch {
      /* retry */
    }
    await sleep(500);
  }
  throw new Error(`Server not ready at ${base} after ${timeoutMs}ms`);
}

function startServer(port, env, mode = "start") {
  const cmd = mode === "dev" ? "dev" : "start";
  const child = spawn("npx", ["next", cmd, "-p", String(port)], {
    cwd: ROOT,
    env: { ...process.env, ...env },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.on("data", () => {});
  child.stderr.on("data", () => {});
  return child;
}

/** Image paths removed in SEC-07 — slug text in URLs/titles is expected. */
const BANNED_IMAGE_REFS = [
  "rome-latin.jpg",
  "cinquiemes-montmartre.jpg",
  "/images/nouvelles/rome-latin",
  "/images/nouvelles/cinquiemes-montmartre",
];

function stopServer(child) {
  if (!child || child.killed) return;
  child.kill("SIGTERM");
}

function adminHeaders(base) {
  const host = new URL(base).host;
  return {
    "content-type": "application/json",
    "x-hautefeuille-admin": "1",
    origin: base.replace(/\/$/, ""),
    host,
  };
}

async function testUnconfiguredAdmin(base) {
  console.log("\n── A4.1 Admin sans configuration Access (production) ──");
  const adminRes = await fetch(`${base}/admin`);
  const adminHtml = await adminRes.text();
  if (adminRes.status === 200 && adminHtml.includes("Administration non configurée")) {
    pass("A4.1a", "/admin affiche « non configurée »");
  } else {
    fail("A4.1a", `status=${adminRes.status}, snippet=${adminHtml.slice(0, 120)}`);
  }
  await testSaveRefused(base, "A4.1b");
}

/** Sans jeton Cloudflare Access, l'enregistrement est refusé (401) ou intercepté par Access (redirection). */
async function testSaveRefused(base, id) {
  const res = await fetch(`${base}/api/admin/save`, {
    method: "POST",
    headers: adminHeaders(base),
    body: JSON.stringify({ chrome: { brand: "pirate" } }),
    redirect: "manual",
  });
  if ([401, 302, 303, 403].includes(res.status)) {
    pass(id, `POST /api/admin/save sans jeton → ${res.status}`);
  } else {
    fail(id, `expected 401/302/403, got ${res.status}`);
  }
}

async function testExternalAdmin(base) {
  console.log(`\n── Admin externe : ${base} ──`);
  const res = await fetch(`${base}/admin`, { redirect: "manual" });
  const location = res.headers.get("location") || "";
  if ([302, 303].includes(res.status) && location.includes("cloudflareaccess.com")) {
    pass("A4.2", "/admin → connexion Cloudflare Access");
  } else {
    const html = await res.text();
    if (html.includes("Accès réservé") || html.includes("Administration non configurée")) {
      fail("A4.2", "/admin n'est pas derrière Cloudflare Access (jeton vérifié par le Worker, mais pas de page de connexion)");
    } else {
      fail("A4.2", `status=${res.status}, location=${location}`);
    }
  }
  await testSaveRefused(base, "A4.3");
}

async function testPublicRoutes(base) {
  console.log("\n── A7 Recette site public ──");
  const routes200 = [
    "/",
    "/mentions-legales",
    "/confidentialite",
    "/contact",
    "/a-propos/college",
    "/a-propos/lycee",
    "/a-propos/information-generale",
    "/a-propos",
    "/a-propos/inscriptions",
  ];
  for (const route of routes200) {
    const res = await fetch(`${base}${route}`);
    if (res.status === 200) {
      pass(`A7-route${route}`, "200");
    } else {
      fail(`A7-route${route}`, `expected 200, got ${res.status}`);
    }
  }

  // Anciennes pages regroupées : redirection permanente vers leur nouvelle section.
  for (const route of ["/a-propos/histoire", "/a-propos/familles", "/a-propos/vie-a-hautefeuille", "/a-propos/soutenez-nous", "/a-propos/projet-educatif", "/nouvelles"]) {
    const res = await fetch(`${base}${route}`, { redirect: "manual" });
    if (res.status === 308) pass(`A7-redirect${route}`, `308 → ${res.headers.get("location")}`);
    else fail(`A7-redirect${route}`, `expected 308, got ${res.status}`);
  }

  const unknown = await fetch(`${base}/nouvelles/slug-inconnu`);
  if (unknown.status === 404) {
    pass("A7-404-slug", "/nouvelles/slug-inconnu → 404");
  } else {
    fail("A7-404-slug", `expected 404, got ${unknown.status}`);
  }

  for (const asset of ["/favicon.ico", "/robots.txt", "/sitemap.xml"]) {
    const res = await fetch(`${base}${asset}`);
    if (res.status === 200) {
      pass(`A7-asset${asset}`, "200");
    } else {
      fail(`A7-asset${asset}`, `expected 200, got ${res.status}`);
    }
  }

  const sitemapRes = await fetch(`${base}/sitemap.xml`);
  const sitemap = await sitemapRes.text();
  if (!sitemap.includes("/admin")) {
    pass("A7-sitemap-no-admin", "sitemap sans /admin");
  } else {
    fail("A7-sitemap-no-admin", "sitemap contient /admin");
  }

  const homeRes = await fetch(`${base}/`);
  const homeHtml = await homeRes.text();
  if (!/<form[^>]*>[\s\S]*?<button[^>]*type=["']submit["']/i.test(homeHtml)) {
    pass("A7-footer-no-form", "footer sans formulaire submit");
  } else {
    fail("A7-footer-no-form", "formulaire submit trouvé");
  }
  if (homeHtml.includes('href="/mentions-legales"') && homeHtml.includes('href="/confidentialite"')) {
    pass("A7-footer-legal", "liens mentions-legales et confidentialite");
  } else {
    fail("A7-footer-legal", "liens juridiques manquants");
  }

  const nouvellesRes = await fetch(`${base}/a-propos/information-generale`);
  const nouvellesHtml = await nouvellesRes.text();
  const foundBanned = BANNED_IMAGE_REFS.filter((b) => nouvellesHtml.includes(b));
  if (foundBanned.length === 0) {
    pass("A7-no-student-images", "pas d'images Rome/Montmartre sur la page des actualités");
  } else {
    fail("A7-no-student-images", `trouvé: ${foundBanned.join(", ")}`);
  }

  for (const slug of ["rome-latin", "cinquiemes-montmartre"]) {
    const art = await fetch(`${base}/nouvelles/${slug}`);
    const html = await art.text();
    const bad = BANNED_IMAGE_REFS.filter((b) => html.includes(b));
    if (bad.length === 0) {
      pass(`A7-article-${slug}`, "sans images interdites");
    } else {
      fail(`A7-article-${slug}`, bad.join(", "));
    }
  }

  const rootHeaders = await fetch(`${base}/`, { method: "GET" });
  if (!rootHeaders.headers.get("x-powered-by")) {
    pass("A7-no-x-powered-by", "pas de X-Powered-By sur /");
  } else {
    fail("A7-no-x-powered-by", `X-Powered-By=${rootHeaders.headers.get("x-powered-by")}`);
  }

  for (const route of ["/", "/a-propos/lycee", "/a-propos/information-generale", "/contact"]) {
    const res = await fetch(`${base}${route}`);
    const csp = res.headers.get("content-security-policy");
    if (csp && csp.includes("default-src")) {
      pass(`A7-csp${route}`, "CSP présent");
    } else {
      fail(`A7-csp${route}`, `CSP absent ou incomplet`);
    }
  }

  const sidebarSrc = readFileSync(path.join(ROOT, "components/SidebarMenu.tsx"), "utf8");
  const navbarSrc = readFileSync(path.join(ROOT, "components/Navbar.tsx"), "utf8");
  if (navbarSrc.includes("MenuDrawer") && homeHtml.includes('href="/contact"')) {
    pass("A7-mobile-contact", "Contact dans le menu (nav → MenuDrawer → SidebarMenu, lien /contact sur /)");
  } else if (sidebarSrc.toLowerCase().includes("contact")) {
    pass("A7-mobile-contact", "Contact référencé dans SidebarMenu.tsx");
  } else {
    fail("A7-mobile-contact", "Contact absent du menu mobile");
  }
}

async function main() {
  console.log("Phase A smoke tests");
  console.log(`Root: ${ROOT}`);

  if (PUBLIC_ONLY && EXTERNAL_BASE) {
    await testPublicRoutes(EXTERNAL_BASE);
    printSummary();
    process.exit(failed > 0 ? 1 : 0);
  }

  if (PUBLIC_ONLY) {
    console.error("Usage: node scripts/phase-a-smoke.mjs --public-only --base=http://127.0.0.1:3456");
    process.exit(1);
  }

  if (ADMIN_ONLY && EXTERNAL_BASE) {
    await testExternalAdmin(EXTERNAL_BASE);
    printSummary();
    process.exit(failed > 0 ? 1 : 0);
  }

  if (ADMIN_ONLY) {
    console.error("Usage: node scripts/phase-a-smoke.mjs --admin-only --base=https://…");
    process.exit(1);
  }

  let unconfiguredChild = null;
  let configuredChild = null;

  try {
    const unconfiguredPort = 3455;
    const unconfiguredBase = `http://127.0.0.1:${unconfiguredPort}`;
    console.log("\n── Démarrage serveur non configuré (port 3455) ──");
    unconfiguredChild = startServer(unconfiguredPort, {
      NODE_ENV: "production",
      ACCESS_TEAM_DOMAIN: "",
      ACCESS_AUD: "",
    });
    await waitForServer(unconfiguredBase);
    await testUnconfiguredAdmin(unconfiguredBase);
    stopServer(unconfiguredChild);
    unconfiguredChild = null;
    await sleep(1000);

    const publicPort = 3456;
    const publicBase = `http://127.0.0.1:${publicPort}`;
    console.log("\n── Démarrage serveur public (port 3456, next start — CSP prod) ──");
    configuredChild = startServer(publicPort, {}, "start");
    await waitForServer(publicBase);
    await testPublicRoutes(publicBase);
  } finally {
    stopServer(unconfiguredChild);
    stopServer(configuredChild);
  }

  printSummary();
  process.exit(failed > 0 ? 1 : 0);
}

function printSummary() {
  console.log("\n═══════════════════════════════════════");
  console.log(`Total: ${results.length} | Pass: ${results.length - failed} | Fail: ${failed}`);
  if (failed > 0) {
    console.log("\nÉchecs:");
    for (const r of results.filter((x) => !x.ok)) {
      console.log(`  - ${r.id}: ${r.detail}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
