#!/usr/bin/env node
// Generate a PBKDF2 admin hash compatible with the Workers runtime.
// Usage: node scripts/seed-admin.mjs <email> <password>
// Apply the resulting SQL with the local setup or D1 query command.

const [, , email, password] = process.argv;

if (!email || !password) {
  console.error("Usage: node scripts/seed-admin.mjs <email> <password>");
  process.exit(1);
}

const PBKDF2_ITERATIONS = 60_000;

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(pw) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, [
    "deriveBits",
  ]);
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    key,
    256,
  );
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toHex(salt.buffer)}$${toHex(derived)}`;
}

const hash = await hashPassword(password);
const sql = `INSERT INTO admin_users (email, password_hash) VALUES ('${email.toLowerCase().replace(/'/g, "''")}', '${hash}') ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash;`;

console.log(sql);
