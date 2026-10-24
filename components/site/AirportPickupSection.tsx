import { Plane, Phone, Clock, AlertCircle } from "lucide-react";
import { getAllSettings, SETTING_KEYS } from "@/lib/settings";

export default async function AirportPickupSection() {
  const settings = await getAllSettings();
  const waiting = settings[SETTING_KEYS.waitingTimePolicy];
  const cancellation = settings[SETTING_KEYS.cancellationPolicy];
  const dispatch = settings[SETTING_KEYS.dispatchContact];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-coral-dark)]">
        Airport Pickup
      </p>
      <h2 className="mt-2 text-balance text-3xl font-extrabold text-[var(--color-charcoal)] sm:text-4xl">
        Know Exactly Where to Go
      </h2>
      <p className="mt-2 max-w-2xl text-[var(--color-charcoal-soft)]">
        For airport transfers, we collect your flight details when you book so dispatch can
        track your arrival and coordinate your pickup.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-border-muted)] bg-white p-5">
          <Plane className="h-6 w-6 text-[var(--color-coral)]" />
          <h3 className="mt-3 font-semibold text-[var(--color-charcoal)]">Flight Tracking</h3>
          <p className="mt-1 text-sm text-[var(--color-charcoal-soft)]">
            We collect your airline, flight number, and scheduled arrival. Our dispatch team
            monitors your flight manually and adjusts your pickup time if needed.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-border-muted)] bg-white p-5">
          <Clock className="h-6 w-6 text-[var(--color-coral)]" />
          <h3 className="mt-3 font-semibold text-[var(--color-charcoal)]">Waiting Time</h3>
          <p className="mt-1 text-sm text-[var(--color-charcoal-soft)]">
            {waiting?.isConfirmed ? waiting.value : "Our waiting-time policy will be confirmed and shown here before launch."}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-border-muted)] bg-white p-5">
          <Phone className="h-6 w-6 text-[var(--color-coral)]" />
          <h3 className="mt-3 font-semibold text-[var(--color-charcoal)]">Can&apos;t Find Your Driver?</h3>
          <p className="mt-1 text-sm text-[var(--color-charcoal-soft)]">
            {dispatch?.isConfirmed ? dispatch.value : "Dispatch contact details will be shown here, and on your confirmation page, once confirmed."}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <p>
          {cancellation?.isConfirmed
            ? cancellation.value
            : "Cancellation terms will be confirmed before launch and shown here, on the booking review step, and on your confirmation page."}
        </p>
      </div>
    </section>
  );
}
