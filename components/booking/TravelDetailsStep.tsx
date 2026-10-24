import type { ActiveRoute } from "@/lib/queries";
import type { BookingFormState } from "@/lib/types";

type Props = {
  selectedRoute: ActiveRoute | null;
  form: BookingFormState;
  onChange: (patch: Partial<BookingFormState>) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function TravelDetailsStep({ selectedRoute, form, onChange, onNext, onBack }: Props) {
  const canContinue =
    form.pickupTime !== "" &&
    form.passengerCount >= 1 &&
    (form.tripType !== "round_trip" || (form.returnDate !== "" && form.returnTime !== ""));

  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--color-charcoal)]">Travel details</h2>
      <p className="mt-1 text-sm text-[var(--color-charcoal-soft)]">
        {selectedRoute ? `${selectedRoute.origin} → ${selectedRoute.destination}` : ""}
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-charcoal)]">Pickup time</span>
          <input
            type="time"
            required
            value={form.pickupTime}
            onChange={(e) => onChange({ pickupTime: e.target.value })}
            className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-charcoal)]">Passengers</span>
          <input
            type="number"
            min={1}
            max={20}
            value={form.passengerCount}
            onChange={(e) => onChange({ passengerCount: Number(e.target.value) })}
            className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-charcoal)]">Large bags</span>
          <input
            type="number"
            min={0}
            max={20}
            value={form.largeBags}
            onChange={(e) => onChange({ largeBags: Number(e.target.value) })}
            className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-charcoal)]">Small bags / carry-on</span>
          <input
            type="number"
            min={0}
            max={20}
            value={form.smallBags}
            onChange={(e) => onChange({ smallBags: Number(e.target.value) })}
            className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
          />
        </label>
      </div>

      {form.tripType === "round_trip" && (
        <div className="mt-4 grid gap-4 rounded-lg bg-[var(--color-coral-light)]/50 p-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-[var(--color-charcoal)]">Return date</span>
            <input
              type="date"
              value={form.returnDate}
              onChange={(e) => onChange({ returnDate: e.target.value })}
              className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-[var(--color-charcoal)]">Return time</span>
            <input
              type="time"
              value={form.returnTime}
              onChange={(e) => onChange({ returnTime: e.target.value })}
              className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
            />
          </label>
        </div>
      )}

      {selectedRoute?.isAirportPickup && (
        <div className="mt-4 rounded-lg border border-[var(--color-border-muted)] p-4">
          <p className="text-sm font-semibold text-[var(--color-charcoal)]">Flight details (optional but recommended)</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-[var(--color-charcoal)]">Airline</span>
              <input
                value={form.airline}
                onChange={(e) => onChange({ airline: e.target.value })}
                className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-[var(--color-charcoal)]">Flight number</span>
              <input
                value={form.flightNumber}
                onChange={(e) => onChange({ flightNumber: e.target.value })}
                className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-[var(--color-charcoal)]">Scheduled arrival</span>
              <input
                type="datetime-local"
                value={form.scheduledArrival}
                onChange={(e) => onChange({ scheduledArrival: e.target.value })}
                className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
              />
            </label>
          </div>
        </div>
      )}

      <label className="mt-4 flex flex-col gap-1 text-sm">
        <span className="font-medium text-[var(--color-charcoal)]">Special requests (optional)</span>
        <textarea
          value={form.specialRequests}
          onChange={(e) => onChange({ specialRequests: e.target.value })}
          rows={2}
          className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
        />
      </label>

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
