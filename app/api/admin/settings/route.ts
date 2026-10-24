import { NextRequest, NextResponse } from "next/server";
import { getAllSettings, setSetting } from "@/lib/settings";
import { updateSettingSchema } from "@/lib/validation";

export async function GET() {
  const settings = await getAllSettings();
  return NextResponse.json({ ok: true, settings });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = updateSettingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  await setSetting(parsed.data.key, parsed.data.value, parsed.data.isConfirmed);
  return NextResponse.json({ ok: true });
}
