import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { randomBytes, pbkdf2Sync } from 'node:crypto';
import { resolve } from 'node:path';

// All commands here use local D1; no Cloudflare account or production changes.
const root = resolve(import.meta.dirname, '..');
process.chdir(root);
const env = { ...process.env, XDG_CONFIG_HOME: resolve('.local-config') };
const database = '49594773-5f37-4d0c-906d-3e8d519e1410';
function cf(args) {
  const result = spawnSync(process.execPath, ['node_modules/cf/bin/cf', ...args, '--local', '--persist-to', '.cloudflare/state'], { env, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || 'Local database setup failed');
  return result.stdout;
}
cf(['d1', 'migrations', 'apply', database, '--dir', 'migrations', '--pattern', 'migrations/*/migration.sql']);
process.env.XDG_CONFIG_HOME = env.XDG_CONFIG_HOME;
const { Miniflare } = await import('miniflare');
const runtime = new Miniflare({
  workers: [{ config: {
    name: 'local-setup', compatibilityDate: '2026-10-18',
    env: { DB: { type: 'd1', id: database } },
    manifest: { mainModule: 'index.js', modules: {
      'index.js': { type: 'esm', contents: 'export default { fetch() { return new Response("local setup"); } }' }
    } }
  } }],
  resourcePersistencePath: resolve('.cloudflare/state/v3'),
});
try {
const db = await runtime.getD1Database('DB');
const query = (sql) => db.prepare(sql).run();
const count = await db.prepare('SELECT count(*) AS count FROM routes').first('count');
if (count === 0) {
  const seed = readFileSync('scripts/seed-d1.sql', 'utf8').split('-- First admin login')[0];
  const statements = seed.replace(/^--.*$/gm, '').split(';').map(s => s.trim()).filter(Boolean);
  await db.batch(statements.map(sql => db.prepare(sql)));
}
if (!existsSync('.dev.vars')) writeFileSync('.dev.vars', `ADMIN_SESSION_SECRET=${randomBytes(32).toString('hex')}\n`, { mode: 0o600 });
mkdirSync('.local', { recursive: true });
if (!existsSync('.local/admin.json')) {
  const email = 'admin@localhost.test';
  const password = randomBytes(18).toString('base64url');
  const salt = randomBytes(16).toString('hex');
  const hash = `pbkdf2$60000$${salt}$${pbkdf2Sync(password, Buffer.from(salt, 'hex'), 60000, 32, 'sha256').toString('hex')}`;
  await query(`INSERT INTO admin_users (email, password_hash) VALUES ('${email}', '${hash}') ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash`);
  writeFileSync('.local/admin.json', JSON.stringify({ email, password }, null, 2) + '\n', { mode: 0o600 });
}
console.log('Local database ready. Admin credentials: .local/admin.json. Run npm run dev.');

} finally { await runtime.dispose(); }
