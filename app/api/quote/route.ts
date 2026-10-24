import { NextRequest, NextResponse } from "next/server";
import { quoteSchema } from "@/lib/validation";
import { computeQuote } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const result = await computeQuote(parsed.data);
  if (!result.ok) {
    return NextResponse.json(result, { status: 422 });
  }
  return NextResponse.json(result);
}
