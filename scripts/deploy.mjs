// Déploiement sûr du site sur Cloudflare Workers (skill deploiement-cloudflare, adapté à OpenNext).
// Usage : node scripts/deploy.mjs <preview|production>
// Avant Wrangler : affiche `wrangler whoami`, le Worker et l'état d'indexation ;
// la production exige de taper « production ».
// Le build est refait pour chaque cible : NEXT_PUBLIC_SITE_URL (vars de la cible) est inlinée par Next.
import process from "node:process";
import console from "node:console";
import { readFileSync, rmSync, mkdirSync } from "node:fs";
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
const missing = [
  ...(target.d1_databases ?? []).filter((db) => !db.database_id).map((db) => `D1 ${db.binding}`),
];
if (missing.length) {
  console.error(`Identifiants non renseignés dans env.${env} : ${missing.join(", ")} (créer les ressources puis coller les id).`);
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
// Contenu CMS en ligne → .data/cms-snapshot.json, lu par getContent pendant le build :
// les pages prérendues partent des textes enregistrés, pas des textes par défaut.
const snapshot = ".data/cms-snapshot.json";
rmSync(snapshot, { force: true });
mkdirSync(".data", { recursive: true });
const cms = target.r2_buckets?.find((bucket) => bucket.binding === "CMS_BUCKET");
if (cms) {
  const got = run("npx", ["wrangler", "r2", "object", "get", `${cms.bucket_name}/site-content.json`, "--remote", "--file", snapshot]);
  console.log(got.status === 0 ? `Contenu CMS récupéré depuis R2 (${cms.bucket_name}).` : "Pas encore de contenu CMS dans R2 : textes par défaut.");
}
if (!target.vars?.ACCESS_TEAM_DOMAIN || !target.vars?.ACCESS_AUD) {
  console.log("⚠️  ACCESS_TEAM_DOMAIN / ACCESS_AUD vides : /admin affichera « Administration non configurée ».");
}
const buildEnv = { NEXT_PUBLIC_SITE_URL: siteUrl };
for (const args of [
  ["opennextjs-cloudflare", "build", "--env", env],
  ["opennextjs-cloudflare", "deploy", "--env", env],
]) {
  const result = run("npx", args, buildEnv);
  if (result.status !== 0) process.exit(result.status ?? 1);
}
