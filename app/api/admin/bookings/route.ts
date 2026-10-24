import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { bookings, routes, vehicleCategories } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const db = await getDb();
  const rows = await db
    .select({
      id: bookings.id,
      referenceCode: bookings.referenceCode,
      status: bookings.status,
      pickupDate: bookings.pickupDate,
      pickupTime: bookings.pickupTime,
      customerName: bookings.customerName,
      phone: bookings.phone,
      quotedFare: bookings.quotedFare,
      currency: bookings.currency,
      createdAt: bookings.createdAt,
      routeOrigin: routes.origin,
      routeDestination: routes.destination,
      vehicleName: vehicleCategories.name,
    })
    .from(bookings)
    .innerJoin(routes, eq(bookings.routeId, routes.id))
    .innerJoin(vehicleCategories, eq(bookings.vehicleCategoryId, vehicleCategories.id))
    .orderBy(desc(bookings.createdAt));

  return NextResponse.json({ ok: true, bookings: rows });
}
