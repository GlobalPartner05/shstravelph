"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ActiveRoute } from "@/lib/queries";

export default function BookingWidget({ routes }: { routes: ActiveRoute[] }) {
  const router = useRouter();
  const [routeId, setRouteId] = useState(routes[0]?.id ? String(routes[0].id) : "");
  const [tripType, setTripType] = useState<"one_way" | "round_trip">("one_way");
  const [pickupDate, setPickupDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (routeId) params.set("routeId", String(routeId));
    params.set("tripType", tripType);
    if (pickupDate) params.set("pickupDate", pickupDate);
    params.set("passengers", String(passengers));
    router.push(`/book?${params.toString()}`);
  }

  if (routes.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--color-border-muted)] bg-white p-6 text-sm text-[var(--color-charcoal-soft)]">
        Online booking is being set up. Please check back soon, or reach out directly for a
        quote.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-2xl border border-[var(--color-border-muted)] bg-white p-4 shadow-sm sm:grid-cols-5 sm:items-end sm:p-5"
    >
      <label className="flex flex-col gap-1 text-sm sm:col-span-2">
        <span className="font-medium text-[var(--color-charcoal)]">Route</span>
        <select
          value={routeId}
          onChange={(e) => setRouteId(e.target.value)}
          className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2 text-sm"
        >
          {routes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.origin} &rarr; {r.destination}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-[var(--color-charcoal)]">Trip</span>
        <select
          value={tripType}
          onChange={(e) => setTripType(e.target.value as "one_way" | "round_trip")}
          className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2 text-sm"
        >
          <option value="one_way">One-way</option>
          <option value="round_trip">Round-trip</option>
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-[var(--color-charcoal)]">Pickup date</span>
        <input
          type="date"
          value={pickupDate}
          onChange={(e) => setPickupDate(e.target.value)}
          min={new Date().toISOString().slice(0, 10)}
          className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-[var(--color-charcoal)]">Passengers</span>
        <input
          type="number"
          min={1}
          max={20}
          value={passengers}
          onChange={(e) => setPassengers(Number(e.target.value))}
          className="rounded-lg border border-[var(--color-border-muted)] px-3 py-2 text-sm"
        />
      </label>

      <button
        type="submit"
        className="rounded-lg bg-[var(--color-coral)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)] sm:col-span-5"
      >
        Check Price &amp; Book
      </button>
    </form>
  );
}
