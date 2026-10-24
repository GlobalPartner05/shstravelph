import { getDb } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export const SETTING_KEYS = {
  whatsappNumber: "whatsapp_number",
  waitingTimePolicy: "waiting_time_policy",
  cancellationPolicy: "cancellation_policy",
  dispatchContact: "dispatch_contact",
} as const;

export type SiteSetting = { key: string; value: string; isConfirmed: boolean };

export async function getAllSettings(): Promise<Record<string, SiteSetting>> {
  const db = await getDb();
  const rows = await db.select().from(siteSettings);
  return Object.fromEntries(rows.map((r) => [r.key, { key: r.key, value: r.value, isConfirmed: r.isConfirmed }]));
}

export async function setSetting(key: string, value: string, isConfirmed: boolean) {
  const db = await getDb();
  await db
    .insert(siteSettings)
    .values({ key, value, isConfirmed, updatedAt: new Date().toISOString() })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value, isConfirmed, updatedAt: new Date().toISOString() },
    });
}

export async function getSetting(key: string): Promise<SiteSetting | null> {
  const db = await getDb();
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
  if (!row) return null;
  return { key: row.key, value: row.value, isConfirmed: row.isConfirmed };
}
