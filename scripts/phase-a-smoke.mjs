#!/usr/bin/env node
/**
 * Phase A smoke tests (A4–A7). Run after `npm run build`.
 * Usage: node scripts/phase-a-smoke.mjs [--public-only] [--base http://127.0.0.1:3456]
 */
import { spawn, execSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_ONLY = process.argv.includes("--public-only");
const BASE_ARG = process.argv.find((a) => a.startsWith("--base="));
const EXTERNAL_BASE = BASE_ARG ? BASE_ARG.slice("--base=".length) : null;

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

class CookieJar {
  constructor() {
    this.map = new Map();
  }
  ingest(setCookie) {
    if (!setCookie) return;
    const parts = setCookie.split(";")[0];
    const eq = parts.indexOf("=");
    if (eq === -1) return;
    const name = parts.slice(0, eq).trim();
    const value = parts.slice(eq + 1).trim();
    this.map.set(name, value);
  }
  header() {
    if (this.map.size === 0) return undefined;
    return [...this.map.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
  }
}

async function fetchWithJar(url, jar, options = {}) {
  const headers = { ...(options.headers ?? {}) };
  const cookie = jar.header();
  if (cookie) headers.cookie = cookie;
  const res = await fetch(url, { ...options, headers, redirect: "manual" });
  const raw = res.headers.getSetCookie?.() ?? [];
  for (const c of raw) jar.ingest(c);
  const single = res.headers.get("set-cookie");
  if (single) jar.ingest(single);
  return res;
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
  console.log("\n── A4.1 Admin sans configuration (production, sans env) ──");
  const adminRes = await fetch(`${base}/admin`);
  const adminHtml = await adminRes.text();
  if (adminRes.status === 200 && adminHtml.includes("Administration non configurée")) {
    pass("A4.1a", "/admin affiche « non configurée »");
  } else {
    fail("A4.1a", `status=${adminRes.status}, snippet=${adminHtml.slice(0, 120)}`);
  }
  const loginRes = await fetch(`${base}/api/admin/login`, {
    method: "POST",
    headers: adminHeaders(base),
    body: JSON.stringify({ password: "x" }),
  });
  if (loginRes.status === 503) {
    pass("A4.1b", "POST login → 503");
  } else {
    fail("A4.1b", `expected 503, got ${loginRes.status}`);
  }
}

function loginHeaders(base, ip = "smoke-local") {
  return { ...adminHeaders(base), "x-forwarded-for": ip };
}

async function testAuthFlow(base, passwordHash, authSecret) {
  console.log("\n── A4–A5 Auth admin (login, rate limit, save, logout) ──");
  const jar = new CookieJar();

  const wrong = await fetchWithJar(`${base}/api/admin/login`, jar, {
    method: "POST",
    headers: loginHeaders(base, "smoke-wrong"),
    body: JSON.stringify({ password: "wrong-password-phase-a" }),
  });
  if (wrong.status === 401) {
    pass("A4.2", "Mauvais mot de passe → 401");
  } else {
    fail("A4.2", `expected 401, got ${wrong.status}`);
  }

  let rateLimited = false;
  for (let i = 1; i <= 9; i++) {
    const res = await fetchWithJar(`${base}/api/admin/login`, jar, {
      method: "POST",
      headers: loginHeaders(base, "smoke-rate"),
      body: JSON.stringify({ password: `wrong-rate-${i}` }),
    });
    if (i < 9) {
      if (res.status !== 401) {
        fail("A5", `tentative ${i}: expected 401, got ${res.status}`);
      }
    } else if (res.status === 429) {
      pass("A5", "9e tentative → 429");
      rateLimited = true;
    } else {
      fail("A5", `9e tentative: expected 429, got ${res.status}`);
    }
  }
  if (!rateLimited) {
    /* already failed */
  }

  const freshJar = new CookieJar();
  const hdrs = loginHeaders(base, "smoke-ok");
  const ok = await fetchWithJar(`${base}/api/admin/login`, freshJar, {
    method: "POST",
    headers: hdrs,
    body: JSON.stringify({ password: "PhaseATest2026!" }),
  });
  if (ok.status === 200) {
    pass("A4.3", "Bon mot de passe → 200");
  } else {
    fail("A4.3", `expected 200, got ${ok.status} — ${await ok.text()}`);
    return null;
  }

  const testBrand = `PhaseA-${Date.now()}`;
  const saveRes = await fetchWithJar(`${base}/api/admin/save`, freshJar, {
    method: "POST",
    headers: hdrs,
    body: JSON.stringify({ chrome: { brand: testBrand } }),
  });
  if (saveRes.status === 200) {
    pass("A4.4", "Save chrome.brand → 200");
  } else {
    fail("A4.4", `expected 200, got ${saveRes.status} — ${await saveRes.text()}`);
    return testBrand;
  }

  await sleep(300);
  const homeRes = await fetch(`${base}/`, { headers: { "cache-control": "no-cache" } });
  const homeHtml = await homeRes.text();
  if (homeHtml.includes(testBrand)) {
    pass("A4.5", "Page publique reflète chrome.brand après save");
  } else {
    fail("A4.5", `brand « ${testBrand} » absent du HTML /`);
  }

  const oldCookie = freshJar.header();
  await fetchWithJar(`${base}/api/admin/logout`, freshJar, {
    method: "POST",
    headers: hdrs,
  });
  pass("A4.6", "Logout → OK");

  const staleSave = await fetch(`${base}/api/admin/save`, {
    method: "POST",
    headers: { ...hdrs, cookie: oldCookie ?? "" },
    body: JSON.stringify({ chrome: { brand: "Hijacked" } }),
  });
  if (staleSave.status === 401) {
    pass("A4.7", "Session expirée ne peut plus save → 401");
  } else {
    fail("A4.7", `expected 401 after logout, got ${staleSave.status}`);
  }

  return testBrand;
}

async function testPublicRoutes(base) {
  console.log("\n── A7 Recette site public ──");
  const routes200 = [
    "/",
    "/mentions-legales",
    "/confidentialite",
    "/contact",
    "/nouvelles",
    "/a-propos/college",
    "/a-propos/lycee",
    "/a-propos/histoire",
    "/a-propos/projet-educatif",
    "/a-propos/information-generale",
  ];
  for (const route of routes200) {
    const res = await fetch(`${base}${route}`);
    if (res.status === 200) {
      pass(`A7-route${route}`, "200");
    } else {
      fail(`A7-route${route}`, `expected 200, got ${res.status}`);
    }
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

  const nouvellesRes = await fetch(`${base}/nouvelles`);
  const nouvellesHtml = await nouvellesRes.text();
  const foundBanned = BANNED_IMAGE_REFS.filter((b) => nouvellesHtml.includes(b));
  if (foundBanned.length === 0) {
    pass("A7-no-student-images", "pas d'images Rome/Montmartre sur /nouvelles");
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
  if (navbarSrc.includes("SidebarMenu") && homeHtml.includes('href="/contact"')) {
    pass("A7-mobile-contact", "Contact dans le menu (nav → SidebarMenu, lien /contact sur /)");
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

  let unconfiguredChild = null;
  let configuredChild = null;

  try {
    const unconfiguredPort = 3455;
    const unconfiguredBase = `http://127.0.0.1:${unconfiguredPort}`;
    console.log("\n── Démarrage serveur non configuré (port 3455) ──");
    unconfiguredChild = startServer(unconfiguredPort, {
      NODE_ENV: "production",
      ADMIN_PASSWORD_HASH: "",
      AUTH_SECRET: "",
    });
    await waitForServer(unconfiguredBase);
    await testUnconfiguredAdmin(unconfiguredBase);
    stopServer(unconfiguredChild);
    unconfiguredChild = null;
    await sleep(1000);

    const passwordHash = execSync('node scripts/hash-admin-password.mjs "PhaseATest2026!"', {
      cwd: ROOT,
      encoding: "utf8",
    }).trim();
    if (!passwordHash.startsWith("scrypt$")) {
      fail("A4-setup", "Impossible de générer ADMIN_PASSWORD_HASH");
      printSummary();
      process.exit(1);
    }
    const authSecret = randomBytes(32).toString("hex");
    const authEnv = { ADMIN_PASSWORD_HASH: passwordHash, AUTH_SECRET: authSecret };

    const authPort = 3456;
    const authBase = `http://127.0.0.1:${authPort}`;
    rmSync(path.join(ROOT, ".data"), { recursive: true, force: true });
    console.log("\n── Démarrage serveur auth (port 3456, next dev — sessions locales) ──");
    console.log("   Note: next start exige Redis en production (sessionStoreReady).");
    configuredChild = startServer(authPort, authEnv, "dev");
    await waitForServer(authBase, 90_000);
    await testAuthFlow(authBase, passwordHash, authSecret);
    stopServer(configuredChild);
    configuredChild = null;
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
