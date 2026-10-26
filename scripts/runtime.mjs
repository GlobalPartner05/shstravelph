import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
process.chdir(resolve(import.meta.dirname, '..'));
const mode = process.argv[2] || 'dev';
const args = mode === 'dev' ? ['dev', '--port', '3001'] : [mode];
const child = spawn(process.execPath, ['node_modules/vite/bin/vite.js', ...args, ...process.argv.slice(3)], {
  stdio: 'inherit',
  env: { ...process.env, XDG_CONFIG_HOME: process.env.XDG_CONFIG_HOME || resolve('.local-config'), CLOUDFLARE_CF_FETCH_ENABLED: 'false' },
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', code => process.exit(code ?? 1));
