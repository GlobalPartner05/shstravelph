# Run Sakura Hire Services

Requires Node.js 22.13 or newer (tested on Node 24). No Cloudflare account is needed for local use.

```sh
npm ci
npm run build
npm run setup:local
npm run dev
```

Open **http://localhost:3001**. The booking form is at `/book`; admin login is at `/admin/login`.

Setup creates a persistent local D1 database, applies the schema, and loads the repository's demo route, vehicle, pricing and site settings. It generates a unique local admin password in `.local/admin.json` and a session secret in `.dev.vars`. These files and the local database are ignored by Git and excluded from the download. Run setup once before starting the app. Re-running setup preserves existing records and credentials.

Use the email and password in `.local/admin.json` for admin login. Never deploy these local credential files.

The seeded NAIA–Angeles City fare is **demo data**, with one active sedan option. Verify real prices, capacities, contact details and policies in Admin before accepting live bookings. Other seeded routes and vehicles remain inactive until configured.

## Verification

With the dev server running in one terminal, run in another:

```sh
npm run typecheck
npm run test:smoke
```

The smoke check verifies rendered pages, quote calculation, capacity rejection, booking creation and persistence, duplicate submission protection, confirmation, rejected incorrect passwords, authenticated admin access and protected APIs. It creates a local test booking; use only against the local demo database.

`npm run build` produces the Cloudflare Worker and browser assets. `npm start` previews the production build.

## Fixes included

- Corrected the SQLite primary-key option for the installed Drizzle version.
- Declared the admin session secret in the Cloudflare configuration and read it from the Worker binding, fixing login failures.
- Aligned the admin password generator with the runtime's 60,000 PBKDF2 iterations.
- Added local database and credential setup, repeatable startup scripts and a smoke check.

## Hosting status

This package has been built and tested locally. It has not been published to Sites or Cloudflare. The existing Cloudflare configuration retains the repository's database identifier; a new hosted deployment needs its own database, migrations and runtime session secret. Local database records are not production records.

Browser click-through and visual verification were not available in this environment; verification used the build, TypeScript and HTTP integration checks.
