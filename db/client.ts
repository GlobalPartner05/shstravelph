import { drizzle } from "drizzle-orm/d1";
import { env } from "cloudflare:workers";
import * as schema from "./schema";

let db: ReturnType<typeof createDb> | undefined;

function createDb() {
  return drizzle(env.DB, { schema });
}

/**
 * Cloudflare D1 via the platform `DB` binding (see wrangler.jsonc).
 * Created on first use so build-time imports without bindings don't throw.
 */
export async function getDb() {
  db ??= createDb();
  return db;
}
