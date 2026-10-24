import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { getDb } from "@/db/client";
import { bookings, routes, vehicleCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAllSettings, SETTING_KEYS } from "@/lib/settings";
import { buildBookingInquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, PlaneTakeoff } from "lucide-react";
import PrintButton from "@/components/booking/PrintButton";

const STATUS_LABEL: Record<string, string> = {
  requested: "Request Received — Awaiting Confirmation",
  confirmed: "Confirmed",
  rejected: "Not Available",
  cancelled: "Cancelled",
  completed: "Completed",
};

export const dynamic = "force-dynamic";

export default async function ConfirmationPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  const db = await getDb();

  const [booking] = await db
    .select({
      referenceCode: bookings.referenceCode,
      status: bookings.status,
      tripType: bookings.tripType,
      pickupDate: bookings.pickupDate,
      pickupTime: bookings.pickupTime,
      flightNumber: bookings.flightNumber,
      passengerCount: bookings.passengerCount,
      largeBags: bookings.largeBags,
      smallBags: bookings.smallBags,
      quotedFare: bookings.quotedFare,
      currency: bookings.currency,
      paymentMethod: bookings.paymentMethod,
      customerName: bookings.customerName,
      isAirportPickup: bookings.isAirportPickup,
      routeOrigin: routes.origin,
      routeDestination: routes.destination,
      vehicleName: vehicleCategories.name,
    })
    .from(bookings)
    .innerJoin(routes, eq(bookings.routeId, routes.id))
    .innerJoin(vehicleCategories, eq(bookings.vehicleCategoryId, vehicleCategories.id))
    .where(eq(bookings.referenceCode, reference.toUpperCase()));

  if (!booking) notFound();

  const settings = await getAllSettings();
  const dispatch = settings[SETTING_KEYS.dispatchContact];
  const waiting = settings[SETTING_KEYS.waitingTimePolicy];
  const whatsappSetting = settings[SETTING_KEYS.whatsappNumber];

  const whatsappHref =
    whatsappSetting?.isConfirmed && whatsappSetting.value
      ? buildWhatsAppLink(
          whatsappSetting.value,
          buildBookingInquiryMessage({
            origin: booking.routeOrigin,
            destination: booking.routeDestination,
            pickupDate: booking.pickupDate,
            passengers: booking.passengerCount,
            flightNumber: booking.flightNumber ?? undefined,
            referenceCode: booking.referenceCode,
          }),
        )
      : null;

  return (
    <>
      <Header />
      <main className="flex-1 bg-[var(--color-cream)]">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 print:max-w-full">
          <div className="rounded-2xl border border-[var(--color-border-muted)] bg-white p-6 sm:p-8">
            <div className="flex items-center gap-2 text-[var(--color-coral)]">
              <CheckCircle2 className="h-6 w-6" />
              <span className="text-sm font-semibold uppercase tracking-wide">
                {STATUS_LABEL[booking.status] ?? booking.status}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold text-[var(--color-charcoal)]">
              Booking Reference: {booking.referenceCode}
            </h1>
            <p className="mt-1 text-sm text-[var(--color-charcoal-soft)]">
              Thank you, {booking.customerName}. {booking.status === "requested" ? "We've received your request and our dispatch team will confirm it shortly." : ""}
            </p>

            <dl className="mt-6 divide-y divide-[var(--color-border-muted)] rounded-xl border border-[var(--color-border-muted)]">
              <Row label="Route" value={`${booking.routeOrigin} → ${booking.routeDestination}`} />
              <Row label="Pickup" value={`${booking.pickupDate} at ${booking.pickupTime}`} />
              <Row label="Vehicle" value={booking.vehicleName} />
              <Row label="Passengers / bags" value={`${booking.passengerCount} passenger(s), ${booking.largeBags} large + ${booking.smallBags} small bag(s)`} />
              <Row label="Total fare" value={`₱${booking.quotedFare.toLocaleString()} (${booking.paymentMethod === "cash" ? "cash to driver" : booking.paymentMethod})`} />
            </dl>

            {booking.isAirportPickup && (
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-[var(--color-coral-light)] p-4 text-sm text-[var(--color-charcoal)]">
                <PlaneTakeoff className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-coral)]" />
                <p>
                  Airport meeting instructions for your terminal will appear here once your booking is confirmed.
                  {booking.flightNumber ? ` We have your flight number (${booking.flightNumber}) on file.` : ""}
                </p>
              </div>
            )}

            <div className="mt-4 flex items-start gap-2 rounded-xl border border-[var(--color-border-muted)] p-4 text-sm text-[var(--color-charcoal-soft)]">
              <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-coral)]" />
              <p>{waiting?.isConfirmed ? waiting.value : "Waiting-time and cancellation terms will be confirmed and shown here before launch."}</p>
            </div>

            <p className="mt-4 text-sm text-[var(--color-charcoal-soft)]">
              Need help? {dispatch?.isConfirmed ? dispatch.value : "Dispatch contact details will be shown here once confirmed."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 print:hidden">
              {whatsappHref && (
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white">
                  Message us on WhatsApp
                </a>
              )}
              <PrintButton />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <dt className="text-[var(--color-charcoal-soft)]">{label}</dt>
      <dd className="font-medium text-[var(--color-charcoal)]">{value}</dd>
    </div>
  );
}

