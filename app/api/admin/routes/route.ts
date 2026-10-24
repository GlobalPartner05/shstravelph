import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { routes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { upsertRouteSchema } from "@/lib/validation";

export async function GET() {
  const db = await getDb();
  const rows = await db.select().from(routes);
  return NextResponse.json({ ok: true, routes: rows });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = upsertRouteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const input = parsed.data;
  const db = await getDb();
  const now = new Date().toISOString();

  if (input.id) {
    await db
      .update(routes)
      .set({ ...input, updatedAt: now })
      .where(eq(routes.id, input.id));
    return NextResponse.json({ ok: true, id: input.id });
  }

  const [created] = await db
    .insert(routes)
    .values({ ...input, createdAt: now, updatedAt: now })
    .returning({ id: routes.id });
  return NextResponse.json({ ok: true, id: created.id });
}
