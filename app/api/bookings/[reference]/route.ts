import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { bookings, routes, vehicleCategories } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  const db = await getDb();

  const [row] = await db
    .select({
      referenceCode: bookings.referenceCode,
      status: bookings.status,
      pickupDate: bookings.pickupDate,
      pickupTime: bookings.pickupTime,
      tripType: bookings.tripType,
      flightNumber: bookings.flightNumber,
      passengerCount: bookings.passengerCount,
      largeBags: bookings.largeBags,
      smallBags: bookings.smallBags,
      quotedFare: bookings.quotedFare,
      currency: bookings.currency,
      paymentMethod: bookings.paymentMethod,
      paymentStatus: bookings.paymentStatus,
      customerName: bookings.customerName,
      routeOrigin: routes.origin,
      routeDestination: routes.destination,
      vehicleName: vehicleCategories.name,
    })
    .from(bookings)
    .innerJoin(routes, eq(bookings.routeId, routes.id))
    .innerJoin(vehicleCategories, eq(bookings.vehicleCategoryId, vehicleCategories.id))
    .where(eq(bookings.referenceCode, reference.toUpperCase()));

  if (!row) {
    return NextResponse.json({ ok: false, error: "Booking not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, booking: row });
}
