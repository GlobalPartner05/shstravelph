import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "sakurahire-ph",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-18",
    compatibilityFlags: ["nodejs_compat"],
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      DB: bindings.d1({
        id: "49594773-5f37-4d0c-906d-3e8d519e1410",
        name: "sakurahire-ph",
      }),
    },
  }),
});
