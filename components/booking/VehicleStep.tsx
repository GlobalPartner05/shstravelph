"use client";

import { useEffect, useState } from "react";
import type { ActiveRoute } from "@/lib/queries";
import type { BookingFormState, VehicleCategory, ApiResult } from "@/lib/types";

type Props = {
  vehicles: VehicleCategory[];
  selectedRoute: ActiveRoute | null;
  form: BookingFormState;
  onChange: (patch: Partial<BookingFormState>) => void;
  onNext: () => void;
  onBack: () => void;
};

type QuoteByVehicle = Record<number, { fare: number; currency: string; error?: string } | undefined>;

export default function VehicleStep({ vehicles, selectedRoute, form, onChange, onNext, onBack }: Props) {
  const [quotes, setQuotes] = useState<QuoteByVehicle>({});

  const eligible = vehicles.filter(
    (v) => v.maxPassengers >= form.passengerCount && v.maxLargeBags >= form.largeBags && v.maxSmallBags >= form.smallBags,
  );

  useEffect(() => {
    if (!selectedRoute) return;
    let cancelled = false;

    Promise.all(
      eligible.map(async (v) => {
        const res = await fetch("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            routeId: selectedRoute.id,
            vehicleCategoryId: v.id,
            passengerCount: form.passengerCount,
            largeBags: form.largeBags,
            smallBags: form.smallBags,
            tripType: form.tripType,
          }),
        });
        const data = (await res.json()) as ApiResult;
        return [
          v.id,
          data.ok
            ? { fare: Number(data.fare), currency: String(data.currency) }
            : { fare: 0, error: data.error, currency: "PHP" },
        ] as const;
      }),
    ).then((entries) => {
      if (cancelled) return;
      setQuotes(Object.fromEntries(entries));
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoute?.id, form.passengerCount, form.largeBags, form.smallBags, form.tripType]);

  const canContinue = form.vehicleCategoryId != null && quotes[form.vehicleCategoryId]?.fare;

  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--color-charcoal)]">Choose your vehicle</h2>
      <p className="mt-1 text-sm text-[var(--color-charcoal-soft)]">
        Showing vehicles that fit {form.passengerCount} passenger{form.passengerCount === 1 ? "" : "s"} and your luggage.
      </p>

      {eligible.length === 0 && (
        <p className="mt-4 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
          No vehicle currently fits that many passengers/bags. Please reduce the count or contact us for a custom arrangement.
        </p>
      )}

      <div className="mt-5 grid gap-4">
        {eligible.map((v) => {
          const quote = quotes[v.id];
          const unavailable = quote?.error;
          return (
            <button
              type="button"
              key={v.id}
              disabled={Boolean(unavailable)}
              onClick={() => onChange({ vehicleCategoryId: v.id })}
              className={`flex items-center justify-between rounded-xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
                form.vehicleCategoryId === v.id
                  ? "border-[var(--color-coral)] bg-[var(--color-coral-light)]"
                  : "border-[var(--color-border-muted)] hover:border-[var(--color-coral)]/50"
              }`}
            >
              <div>
                <p className="font-semibold text-[var(--color-charcoal)]">{v.name}</p>
                <p className="text-xs text-[var(--color-charcoal-soft)]">
                  Up to {v.maxPassengers} passengers &middot; {v.maxLargeBags} large + {v.maxSmallBags} small bags
                </p>
                {v.isPlaceholder && (
                  <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                    Placeholder
                  </span>
                )}
              </div>
              <div className="text-right">
                {!quote ? (
                  <span className="text-xs text-[var(--color-charcoal-soft)]">Loading&hellip;</span>
                ) : unavailable ? (
                  <span className="text-xs text-red-600">{unavailable}</span>
                ) : quote ? (
                  <p className="font-bold text-[var(--color-charcoal)]">&#8369;{quote.fare.toLocaleString()}</p>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex gap-3">
        <button type="button" onClick={onBack} className="rounded-full border border-[var(--color-border-muted)] px-6 py-3 font-semibold text-[var(--color-charcoal)]">
          Back
        </button>
        <button
          type="button"
          disabled={!canContinue}
          onClick={onNext}
          className="flex-1 rounded-full bg-[var(--color-coral)] py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-8"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
