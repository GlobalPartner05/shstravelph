import { getDb } from "@/db/client";
import { bookings, bookingStatusHistory, routes, vehicleCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import BookingStatusActions from "@/components/admin/BookingStatusActions";

export const dynamic = "force-dynamic";

export default async function AdminBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
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

  if (!booking) notFound();

  const history = await db.select().from(bookingStatusHistory).where(eq(bookingStatusHistory.bookingId, Number(id)));

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">{booking.referenceCode}</h1>
        <p className="text-sm text-[var(--color-charcoal-soft)]">Submitted {booking.createdAt}</p>

        <dl className="mt-5 divide-y divide-[var(--color-border-muted)] rounded-xl border border-[var(--color-border-muted)] bg-white">
          <Row label="Status" value={booking.status} />
          <Row label="Route" value={`${booking.routeOrigin} → ${booking.routeDestination}`} />
          <Row label="Trip type" value={booking.tripType} />
          <Row label="Pickup" value={`${booking.pickupDate} at ${booking.pickupTime}`} />
          {booking.returnDate && <Row label="Return" value={`${booking.returnDate} at ${booking.returnTime}`} />}
          {booking.flightNumber && <Row label="Flight" value={`${booking.airline ?? ""} ${booking.flightNumber} (scheduled: ${booking.scheduledArrival ?? "n/a"})`} />}
          <Row label="Vehicle" value={booking.vehicleName} />
          <Row label="Passengers / bags" value={`${booking.passengerCount} pax, ${booking.largeBags} large + ${booking.smallBags} small bags`} />
          {booking.specialRequests && <Row label="Special requests" value={booking.specialRequests} />}
          <Row label="Customer" value={`${booking.customerName} · ${booking.phone} · ${booking.email}`} />
          {booking.whatsapp && <Row label="WhatsApp" value={booking.whatsapp} />}
          <Row label="Preferred contact" value={booking.preferredContact} />
          <Row label="Fare" value={`₱${booking.quotedFare.toLocaleString()} (${booking.paymentMethod}, ${booking.paymentStatus})`} />
          {booking.adminNotes && <Row label="Admin notes" value={booking.adminNotes} />}
        </dl>

        <div className="mt-6 rounded-xl border border-[var(--color-border-muted)] bg-white p-5">
          <h2 className="font-semibold text-[var(--color-charcoal)]">Update status</h2>
          <div className="mt-3">
            <BookingStatusActions bookingId={booking.id} currentStatus={booking.status} />
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-[var(--color-charcoal)]">Status history</h2>
        <ol className="mt-3 space-y-3">
          {history.map((h) => (
            <li key={h.id} className="rounded-lg border border-[var(--color-border-muted)] bg-white p-3 text-sm">
              <p className="font-medium text-[var(--color-charcoal)]">
                {h.fromStatus ?? "created"} &rarr; {h.toStatus}
              </p>
              <p className="text-xs text-[var(--color-charcoal-soft)]">
                {h.changedBy} &middot; {h.createdAt}
              </p>
              {h.note && <p className="mt-1 text-xs text-[var(--color-charcoal-soft)]">{h.note}</p>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3 text-sm">
      <dt className="text-[var(--color-charcoal-soft)]">{label}</dt>
      <dd className="text-right font-medium text-[var(--color-charcoal)]">{value}</dd>
    </div>
  );
}
