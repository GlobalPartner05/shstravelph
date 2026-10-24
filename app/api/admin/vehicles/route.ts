import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { vehicleCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { upsertVehicleSchema } from "@/lib/validation";

export async function GET() {
  const db = await getDb();
  const rows = await db.select().from(vehicleCategories);
  return NextResponse.json({ ok: true, vehicles: rows });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = upsertVehicleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const input = parsed.data;
  const db = await getDb();
  const now = new Date().toISOString();

  if (input.id) {
    await db
      .update(vehicleCategories)
      .set({ ...input, updatedAt: now })
      .where(eq(vehicleCategories.id, input.id));
    return NextResponse.json({ ok: true, id: input.id });
  }

  const [created] = await db
    .insert(vehicleCategories)
    .values({ ...input, createdAt: now, updatedAt: now })
    .returning({ id: vehicleCategories.id });
  return NextResponse.json({ ok: true, id: created.id });
}
