"use client";

import { useEffect, useState } from "react";
import type { ActiveRoute } from "@/lib/queries";
import type { BookingFormState, VehicleCategory, ApiResult } from "@/lib/types";

type Props = {
  form: BookingFormState;
  selectedRoute: ActiveRoute | null;
  selectedVehicle: VehicleCategory | null;
  onBack: () => void;
  onConfirm: () => void;
  submitting: boolean;
  submitError: string | null;
};

export default function ReviewStep({ form, selectedRoute, selectedVehicle, onBack, onConfirm, submitting, submitError }: Props) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [quote, setQuote] = useState<{ fare: number; currency: string; inclusionsNote: string | null; exclusionsNote: string | null } | null>(null);

  useEffect(() => {
    if (!selectedRoute || !selectedVehicle) return;
    fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        routeId: selectedRoute.id,
        vehicleCategoryId: selectedVehicle.id,
        passengerCount: form.passengerCount,
        largeBags: form.largeBags,
        smallBags: form.smallBags,
        tripType: form.tripType,
      }),
    })
      .then((r) => r.json() as Promise<ApiResult>)
      .then((data) => {
        if (data.ok) {
          setQuote({
            fare: Number(data.fare),
            currency: String(data.currency),
            inclusionsNote: (data.inclusionsNote as string | null) ?? null,
            exclusionsNote: (data.exclusionsNote as string | null) ?? null,
          });
        }
      });
  }, [selectedRoute, selectedVehicle, form.passengerCount, form.largeBags, form.smallBags, form.tripType]);

  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--color-charcoal)]">Review &amp; confirm</h2>
      <p className="mt-1 text-sm text-[var(--color-charcoal-soft)]">
        This is a booking <strong>request</strong>. Our dispatch team will confirm it shortly.
      </p>

      <dl className="mt-5 divide-y divide-[var(--color-border-muted)] rounded-xl border border-[var(--color-border-muted)]">
        <Row label="Route" value={selectedRoute ? `${selectedRoute.origin} → ${selectedRoute.destination}` : "-"} />
        <Row label="Trip type" value={form.tripType === "round_trip" ? "Round-trip" : "One-way"} />
        <Row label="Pickup" value={`${form.pickupDate} at ${form.pickupTime}`} />
        {form.tripType === "round_trip" && <Row label="Return" value={`${form.returnDate} at ${form.returnTime}`} />}
        {form.flightNumber && <Row label="Flight" value={`${form.airline || ""} ${form.flightNumber}`.trim()} />}
        <Row label="Vehicle" value={selectedVehicle?.name ?? "-"} />
        <Row label="Passengers / bags" value={`${form.passengerCount} passenger(s), ${form.largeBags} large + ${form.smallBags} small bag(s)`} />
        <Row label="Name" value={form.customerName} />
        <Row label="Contact" value={`${form.phone} · ${form.email}`} />
      </dl>

      <div className="mt-4 rounded-xl bg-[var(--color-coral-light)] p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium text-[var(--color-charcoal)]">Total fare</span>
          <span className="text-2xl font-extrabold text-[var(--color-charcoal)]">
            {quote ? `₱${quote.fare.toLocaleString()}` : "Calculating..."}
          </span>
        </div>
        <p className="mt-1 text-xs text-[var(--color-charcoal-soft)]">Payment: cash to the driver.</p>
        {quote?.inclusionsNote && <p className="mt-2 text-xs text-[var(--color-charcoal-soft)]">Includes: {quote.inclusionsNote}</p>}
        {quote?.exclusionsNote && <p className="mt-1 text-xs text-[var(--color-charcoal-soft)]">Excludes: {quote.exclusionsNote}</p>}
      </div>

      <label className="mt-4 flex items-start gap-2 text-sm text-[var(--color-charcoal-soft)]">
        <input type="checkbox" checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} className="mt-1" />
        <span>
          I understand this is a booking request, not a confirmed ride, until Sakura Hire Services confirms it. Cancellation
          terms will be shared on my confirmation page.
        </span>
      </label>

      {submitError && <p className="mt-3 text-sm text-red-600">{submitError}</p>}

      <div className="mt-6 flex gap-3">
        <button type="button" onClick={onBack} disabled={submitting} className="rounded-full border border-[var(--color-border-muted)] px-6 py-3 font-semibold text-[var(--color-charcoal)]">
          Back
        </button>
        <button
          type="button"
          disabled={!acknowledged || submitting || !quote}
          onClick={onConfirm}
          className="flex-1 rounded-full bg-[var(--color-coral)] py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-8"
        >
          {submitting ? "Submitting..." : "Request Confirmation"}
        </button>
      </div>
    </div>
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
