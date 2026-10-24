import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { bookings, bookingStatusHistory } from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { createBookingSchema } from "@/lib/validation";
import { computeQuote } from "@/lib/pricing";
import { generateBookingReference } from "@/lib/reference";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = createBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check the booking details and try again." }, { status: 400 });
  }
  const input = parsed.data;

  // Server is the only source of truth for the fare — never trust a client-sent price.
  const quote = await computeQuote({
    routeId: input.routeId,
    vehicleCategoryId: input.vehicleCategoryId,
    passengerCount: input.passengerCount,
    largeBags: input.largeBags,
    smallBags: input.smallBags,
    tripType: input.tripType,
  });
  if (!quote.ok) {
    return NextResponse.json({ ok: false, error: quote.error }, { status: 422 });
  }

  const db = await getDb();

  // Duplicate-submission guard: same contact + route + pickup slot within the last 2 minutes.
  const twoMinutesAgo = new Date(Date.now() - 2 * 60_000).toISOString();
  const [existing] = await db
    .select({ referenceCode: bookings.referenceCode })
    .from(bookings)
    .where(
      and(
        eq(bookings.email, input.email),
        eq(bookings.routeId, input.routeId),
        eq(bookings.pickupDate, input.pickupDate),
        eq(bookings.pickupTime, input.pickupTime),
        gt(bookings.createdAt, twoMinutesAgo),
      ),
    );
  if (existing) {
    return NextResponse.json({ ok: true, referenceCode: existing.referenceCode, duplicate: true });
  }

  let referenceCode = generateBookingReference();
  // Extremely unlikely collision given 33^12 keyspace, but guard anyway.
  for (let attempt = 0; attempt < 3; attempt++) {
    const [clash] = await db.select({ id: bookings.id }).from(bookings).where(eq(bookings.referenceCode, referenceCode));
    if (!clash) break;
    referenceCode = generateBookingReference();
  }

  const now = new Date().toISOString();
  const [created] = await db
    .insert(bookings)
    .values({
      referenceCode,
      routeId: input.routeId,
      vehicleCategoryId: input.vehicleCategoryId,
      tripType: input.tripType,
      pickupDate: input.pickupDate,
      pickupTime: input.pickupTime,
      returnDate: input.returnDate,
      returnTime: input.returnTime,
      isAirportPickup: Boolean(input.flightNumber || input.airline),
      airline: input.airline,
      flightNumber: input.flightNumber,
      scheduledArrival: input.scheduledArrival,
      passengerCount: input.passengerCount,
      largeBags: input.largeBags,
      smallBags: input.smallBags,
      specialRequests: input.specialRequests,
      customerName: input.customerName,
      email: input.email,
      phone: input.phone,
      whatsapp: input.whatsapp,
      preferredContact: input.preferredContact,
      quotedFare: quote.fare,
      currency: quote.currency,
      paymentMethod: "cash",
      paymentStatus: "unpaid",
      status: "requested",
      createdAt: now,
      updatedAt: now,
    })
    .returning({ id: bookings.id, referenceCode: bookings.referenceCode });

  await db.insert(bookingStatusHistory).values({
    bookingId: created.id,
    fromStatus: null,
    toStatus: "requested",
    note: "Booking request submitted by customer.",
    changedBy: "customer",
    createdAt: now,
  });

  return NextResponse.json({ ok: true, referenceCode: created.referenceCode });
}
