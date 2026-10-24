import { NextResponse } from "next/server";
import { getActiveRoutesWithFromPrice, getActiveVehicleCategories } from "@/lib/queries";

export async function GET() {
  const [routes, vehicles] = await Promise.all([
    getActiveRoutesWithFromPrice(),
    getActiveVehicleCategories(),
  ]);
  return NextResponse.json({ routes, vehicles });
}
