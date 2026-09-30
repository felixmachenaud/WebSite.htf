import { randomBytes, scryptSync } from "crypto";

const password = process.argv[2];
if (!password) {
  console.error("Usage: npm run hash-admin-password -- <mot-de-passe>");
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64, {
  N: 16384,
  r: 8,
  p: 1,
  maxmem: 64 * 1024 * 1024,
});

process.stdout.write(
  `scrypt$16384$8$1$${salt.toString("base64url")}$${hash.toString("base64url")}\n`,
);
