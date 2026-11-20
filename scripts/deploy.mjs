// Déploiement sûr du site sur Cloudflare Workers (skill deploiement-cloudflare, adapté à OpenNext).
// Usage : node scripts/deploy.mjs <preview|production>
// Avant Wrangler : affiche `wrangler whoami`, le Worker et l'état d'indexation ;
// la production exige de taper « production ».
// Le build est refait pour chaque cible : NEXT_PUBLIC_SITE_URL (vars de la cible) est inlinée par Next.
import process from "node:process";
import console from "node:console";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";

const [env] = process.argv.slice(2);
if (!["preview", "production"].includes(env)) {
  console.error("Usage : node scripts/deploy.mjs <preview|production>");
  process.exit(2);
}
const config = JSON.parse(
  readFileSync("wrangler.jsonc", "utf8")
    .split("\n")
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n")
    .replace(/,(\s*[}\]])/g, "$1"),
);
const target = config.env?.[env];
if (!target) {
  console.error(`Environnement « ${env} » absent de wrangler.jsonc.`);
  process.exit(2);
}
const run = (cmd, args, extraEnv = {}, capture = false) =>
  spawnSync(cmd, args, {
    stdio: capture ? ["inherit", "pipe", "inherit"] : "inherit",
    encoding: "utf8",
    env: { ...process.env, ...extraEnv },
  });

const who = run("npx", ["wrangler", "whoami"], {}, true);
if (who.status !== 0) process.exit(who.status || 1);
console.log(who.stdout);
const siteUrl = target.vars?.NEXT_PUBLIC_SITE_URL || "";
console.log(
  `Cible : Worker « ${target.name} » (env ${env}), indexation ${target.vars?.INDEXING === "on" ? "OUVERTE" : "fermée"}, ` +
    `NEXT_PUBLIC_SITE_URL=${siteUrl || "(vide → localhost dans sitemap/OG)"}.`,
);
if (env === "production") {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(
    "Vérifier le compte ci-dessus (doit être celui du CLIENT). Taper « production » pour continuer : ",
  );
  rl.close();
  if (answer.trim() !== "production") {
    console.log("Annulé.");
    process.exit(1);
  }
}
const buildEnv = { NEXT_PUBLIC_SITE_URL: siteUrl };
for (const args of [
  ["opennextjs-cloudflare", "build", "--env", env],
  ["opennextjs-cloudflare", "deploy", "--env", env],
]) {
  const result = run("npx", args, buildEnv);
  if (result.status !== 0) process.exit(result.status ?? 1);
}
