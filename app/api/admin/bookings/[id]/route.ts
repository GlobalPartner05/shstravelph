import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { bookings, bookingStatusHistory, routes, vehicleCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateBookingStatusSchema } from "@/lib/validation";
import { getAdminSession } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();

  const [booking] = await db
    .select({
      id: bookings.id,
      referenceCode: bookings.referenceCode,
      status: bookings.status,
      tripType: bookings.tripType,
      pickupDate: bookings.pickupDate,
      pickupTime: bookings.pickupTime,
      returnDate: bookings.returnDate,
      returnTime: bookings.returnTime,
      isAirportPickup: bookings.isAirportPickup,
      airline: bookings.airline,
      flightNumber: bookings.flightNumber,
      scheduledArrival: bookings.scheduledArrival,
      passengerCount: bookings.passengerCount,
      largeBags: bookings.largeBags,
      smallBags: bookings.smallBags,
      specialRequests: bookings.specialRequests,
      customerName: bookings.customerName,
      email: bookings.email,
      phone: bookings.phone,
      whatsapp: bookings.whatsapp,
      preferredContact: bookings.preferredContact,
      quotedFare: bookings.quotedFare,
      currency: bookings.currency,
      paymentMethod: bookings.paymentMethod,
      paymentStatus: bookings.paymentStatus,
      adminNotes: bookings.adminNotes,
      createdAt: bookings.createdAt,
      routeOrigin: routes.origin,
      routeDestination: routes.destination,
      vehicleName: vehicleCategories.name,
    })
    .from(bookings)
    .innerJoin(routes, eq(bookings.routeId, routes.id))
    .innerJoin(vehicleCategories, eq(bookings.vehicleCategoryId, vehicleCategories.id))
    .where(eq(bookings.id, Number(id)));

  if (!booking) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });

  const history = await db
    .select()
    .from(bookingStatusHistory)
    .where(eq(bookingStatusHistory.bookingId, Number(id)));

  return NextResponse.json({ ok: true, booking, history });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = updateBookingStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const session = await getAdminSession();
  const db = await getDb();

  const [current] = await db.select({ status: bookings.status }).from(bookings).where(eq(bookings.id, Number(id)));
  if (!current) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });

  const now = new Date().toISOString();
  await db
    .update(bookings)
    .set({ status: parsed.data.status, adminNotes: parsed.data.note, updatedAt: now })
    .where(eq(bookings.id, Number(id)));

  await db.insert(bookingStatusHistory).values({
    bookingId: Number(id),
    fromStatus: current.status,
    toStatus: parsed.data.status,
    note: parsed.data.note,
    changedBy: session?.email ?? "admin",
    createdAt: now,
  });

  return NextResponse.json({ ok: true });
}
