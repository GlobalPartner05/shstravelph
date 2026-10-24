# Sakura Hire Services — Operating Guide

Sakura Hire Services (SHS) airport-transfer booking site, fully ported to
**Cloudflare Workers** (vinext — Next.js App Router on Vite) with a
**Cloudflare D1** database. Deployed and verified 2026-10-18.

## Live deployment

| Item | Value |
| --- | --- |
| Site | https://sakurahire-ph.johnny-05c.workers.dev |
| Worker | `sakurahire-ph` (account `05cc24ec…`, johnny@…) |
| Database | D1 `sakurahire-ph`, uuid `49594773-5f37-4d0c-906d-3e8d519e1410`, region APAC |
| Binding | `env.DB` (declared in `cloudflare.config.ts`) |
| Admin | https://sakurahire-ph.johnny-05c.workers.dev/admin |

### Admin credentials

- **Email:** `globalbiz.partner@protonmail.com`
- **Password:** not stored in this repository — set it yourself (see below)
- Session cookie: `sh_admin_session`, 12 h, `Secure; HttpOnly; SameSite=lax`

> **Never commit a plaintext admin password.** The seeded account is created
> by `scripts/seed-d1.sql`, which stores only a PBKDF2-SHA256 **hash**
> (`pbkdf2$60000$…`). That hash is not reversible and is safe to commit.
> The actual password lives in your password manager, and is set with:
>
> ```powershell
> # set/reset the admin password (writes a fresh PBKDF2 hash, then apply)
> $sql = (Get-Content scripts/seed-admin.mjs -Raw)   # prints a new hash for a given password
> cf d1 query 49594773-5f37-4d0c-906d-3e8d519e1410 --sql $sql
> ```
>
> If a plaintext password has ever been committed or shared, **rotate it** —
> treat the old value as public.

### Rotating the session secret

`ADMIN_SESSION_SECRET` is a Worker secret (set locally via `.dev.vars`, in
production via the `cf` CLI):

```powershell
# production (requires the worker to already exist)
cf workers secrets update ADMIN_SESSION_SECRET --worker sakurahire-ph --type secret_text --text <new-hex-value>

# local dev
# edit .dev.vars → ADMIN_SESSION_SECRET=<new-hex-value>
```

Changing it invalidates all existing admin sessions.

## Daily commands

```powershell
npm run lint      # eslint
npm run dev       # local dev server (vite + workerd + local D1), http://localhost:3001
npm run build     # production build (vite build → dist/)
npm run start     # preview the built worker locally (vite preview)
npm run deploy    # build + deploy to Cloudflare (vinext-cloudflare deploy)
npm run db:generate   # regenerate SQL migrations after editing db/schema.ts
```

> Local dev uses the Cloudflare Vite plugin: first boot on this machine takes
> several minutes (dependency optimization), later boots are fast. Local D1
> state and `.dev.vars` provide the session secret.

## Database operations (D1)

All commands run through the `cf` CLI (the project's designated tool — it is
authenticated to the **deploy account**; note `wrangler` on this machine is
logged into a *different* account and will 404 on this database).

```powershell
# run a query (single-line SQL; see "Gotchas" for why)
cf d1 query 49594773-5f37-4d0c-906d-3e8d519e1410 --sql "SELECT count(*) AS n FROM bookings"

# apply new migrations after `npm run db:generate`
cf d1 migrations apply 49594773-5f37-4d0c-906d-3e8d519e1410 --dir migrations --pattern "migrations/*/migration.sql"

# seed / reset launch data (routes, vehicles, pricing, settings, admin user)
$sql = (Get-Content scripts/seed-d1.sql -Raw).Trim()
cf d1 query 49594773-5f37-4d0c-906d-3e8d519e1410 --sql $sql
```

Schema lives in `db/schema.ts` (drizzle, SQLite dialect). Table/column names
are identical to the original Postgres schema; timestamps are ISO-8601 text.

### Current seed state

- 4 routes, 3 vehicles, 1 pricing rule, 4 site settings — all **DEV
  PLACEHOLDER** rows. Confirm real fares/photos/copy in **Admin → Routes /
  Vehicles / Settings** before launch (the admin dashboard's "Before you go
  live" checklist tracks this).
- 1 admin user (credentials above), password hashed with PBKDF2-SHA256.

## How a deploy works

1. `npm run deploy` → `vite build` (RSC + SSR environments, worker bundle +
   static assets) → upload via `cf` using `cloudflare.config.ts`.
2. Config: `cloudflare.config.ts` (`defineWorker`, entry
   `vinext/server/fetch-handler`, `nodejs_compat`, D1 + assets bindings) and
   `vite.config.ts` (vinext + `@cloudflare/vite-plugin`).
3. Secrets are **not** in the config — set once with `cf workers secrets update`.
4. D1 migrations are applied manually (above), never by the deploy.

## Known limitations / deliberate tradeoffs

- **PBKDF2 iterations = 60,000** (`lib/auth.ts`, and the seeded hash matches).
  The Workers **free plan caps CPU at ~10 ms/request**; measured ceiling:
  100k iterations pass, 130k gets the request killed (empty 500). 150k (the
  original value) always dies. If the account ever moves to Workers Paid,
  raise `PBKDF2_ITERATIONS` and re-seed the admin hash together —
  `verifyPassword` reads the iteration count from the stored hash, so changing
  only one side breaks login.
- **No edge/CDN cache, no KV data cache, no Cloudflare Images** — chosen at
  init for correctness (booking/admin pages must never serve stale HTML) and
  cost (Cloudflare Images is paid). Revisit in `cloudflare.config.ts` if
  traffic grows.
- Image optimization is off; local images (SHS emblem) serve as static assets.
- The site name/branding: **Sakura Hire Services** with SHS red `#cf0405` /
  navy `#0a2950` palette and the official emblem in header, footer, and
  favicon (`app/icon.png`).

## Gotchas (learned the hard way)

- **PowerShell + `$` in SQL:** never pass SQL containing `$` (e.g. PBKDF2
  hashes `pbkdf2$60000$…`) through a PowerShell double-quoted string —
  PowerShell expands `$…` as variables and silently corrupts the value. Write
  the SQL to a file and pass `(Get-Content file.sql -Raw).Trim()`.
- **PowerShell + `curl.exe` JSON:** single-quoted `--data-raw '{…}'` arguments
  get their inner double quotes stripped when passed to native exes, producing
  invalid JSON. Use `Invoke-WebRequest -Body '{…}'` instead.
- **Two Cloudflare accounts on this machine:** the `cf` CLI (used for
  everything here) is authed as `johnny@…` on account `05cc24ec…`; `wrangler`
  is authed as `info@…` on `a25e444c…`. Anything created through the wrong
  tool lands on the wrong account.
- **`browser.tabs.list` URL lags** behind client-side navigation — re-read
  after a screenshot before concluding a navigation failed.

## Repository map (post-port)

```
app/                    Next.js App Router pages + API routes (unchanged app code)
components/site/, components/admin/
db/schema.ts            drizzle schema — SQLite/D1 dialect
db/client.ts            drizzle(env.DB) from "cloudflare:workers"
drizzle.config.ts       dialect sqlite, migrations out → ./migrations
migrations/             generated SQL (apply manually, see above)
scripts/seed-d1.sql     launch seed + admin upsert
scripts/fix-admin-hash.sql  one-shot hash repair (already applied)
cloudflare.config.ts    Worker definition: bindings, D1, assets, compat flags
vite.config.ts          vinext + @cloudflare/vite-plugin
proxy.ts                admin auth middleware (unchanged)
.dev.vars               local ADMIN_SESSION_SECRET (never commit a real prod secret here if rotating)
lib/auth.ts             PBKDF2_ITERATIONS = 60_000 (see Known limitations)
```

Netlify artifacts (`netlify.toml`, `netlify/`, `@netlify/*` deps) were removed
as part of the port.

## Admin dashboard prototype

`shs_admin_dashboard_prototype.html` (committed earlier on `main`) is a
standalone, single-file admin prototype — 10 sections (Overview, Bookings,
Dispatch, Drivers, Fleet, Routes & Pricing, Customers, Payments, Reports,
Settings) running on **fictional in-browser data** with no backend, no login
and no real confirmations. Open it directly in a browser.

It is a design reference only and is **not** wired into the Next.js app; the
real admin lives at `app/admin/`.
