import type { ActiveRoute } from "@/lib/queries";
import type { BookingFormState } from "@/lib/types";

type Props = {
  routes: ActiveRoute[];
  form: BookingFormState;
  onChange: (patch: Partial<BookingFormState>) => void;
  onNext: () => void;
};

export default function RouteStep({ routes, form, onChange, onNext }: Props) {
  const canContinue = form.routeId != null && form.pickupDate !== "";

  if (routes.length === 0) {
    return (
      <p className="text-sm text-[var(--color-charcoal-soft)]">
        Online booking isn&apos;t available yet — routes and pricing are still being set up.
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--color-charcoal)]">Choose your route</h2>
      <p className="mt-1 text-sm text-[var(--color-charcoal-soft)]">
        Select a confirmed route and whether you need a one-way or round-trip ride.
      </p>

      <div className="mt-5 grid gap-3">
        {routes.map((r) => (
          <button
            type="button"
            key={r.id}
            onClick={() => onChange({ routeId: r.id })}
            className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
              form.routeId === r.id
                ? "border-[var(--color-coral)] bg-[var(--color-coral-light)]"
                : "border-[var(--color-border-muted)] hover:border-[var(--color-coral)]/50"
            }`}
          >
            <div>
              <p className="font-semibold text-[var(--color-charcoal)]">
                {r.origin} &rarr; {r.destination}
              </p>
              {r.estimatedDurationNote && (
                <p className="text-xs text-[var(--color-charcoal-soft)]">{r.estimatedDurationNote}</p>
              )}
            </div>
            {r.fromFare != null && (
              <p className="font-bold text-[var(--color-charcoal)]">&#8369;{r.fromFare.toLocaleString()}+</p>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-charcoal)]">Trip type</span>
          <select
            value={form.tripType}
            onChange={(e) => onChange({ tripType: e.target.value as "one_way" | "round_trip" })}
            className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
          >
            <option value="one_way">One-way</option>
            <option value="round_trip">Round-trip</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-charcoal)]">Pickup date</span>
          <input
            type="date"
            required
            min={new Date().toISOString().slice(0, 10)}
            value={form.pickupDate}
            onChange={(e) => onChange({ pickupDate: e.target.value })}
            className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2"
          />
        </label>
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={onNext}
        className="mt-6 w-full rounded-full bg-[var(--color-coral)] py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-8"
      >
        Continue
      </button>
    </div>
  );
}
