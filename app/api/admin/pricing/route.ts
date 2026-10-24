import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { pricingRules } from "@/db/schema";
import { eq } from "drizzle-orm";
import { upsertPricingSchema } from "@/lib/validation";

export async function GET() {
  const db = await getDb();
  const rows = await db.select().from(pricingRules);
  return NextResponse.json({ ok: true, pricing: rows });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = upsertPricingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const input = parsed.data;
  const db = await getDb();
  const now = new Date().toISOString();

  if (input.id) {
    await db
      .update(pricingRules)
      .set({ ...input, updatedAt: now })
      .where(eq(pricingRules.id, input.id));
    return NextResponse.json({ ok: true, id: input.id });
  }

  const [created] = await db
    .insert(pricingRules)
    .values({ ...input, effectiveDate: now, createdAt: now, updatedAt: now })
    .returning({ id: pricingRules.id });
  return NextResponse.json({ ok: true, id: created.id });
}
