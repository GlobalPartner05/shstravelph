import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./db/schema.ts",
  // Applied with: wrangler d1 migrations apply <database> --remote
  out: "./migrations",
});
