import Link from "next/link";
import { ArrowRight, Clock, MapPin, Plane, Car } from "lucide-react";
import type { ActiveRoute } from "@/lib/queries";

export default function RouteCard({ route }: { route: ActiveRoute }) {
  const Icon = route.isAirportPickup ? Plane : Car;
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border-muted)] bg-white shadow-sm transition hover:shadow-md">
      <div className="relative flex h-36 items-center justify-center bg-[var(--color-coral-light)]">
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          <span className="rounded-full bg-[var(--color-coral)] px-3 py-1 text-xs font-semibold text-white">
            {route.categoryLabel}
          </span>
          {route.isPlaceholder && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
              Placeholder
            </span>
          )}
        </div>
        <MapPin className="h-10 w-10 text-[var(--color-coral)]/40" />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-[var(--color-coral)]">
          <Icon className="h-5 w-5" />
          <h3 className="text-lg font-bold text-[var(--color-charcoal)]">
            {route.origin} &rarr; {route.destination}
          </h3>
        </div>
        {route.description && (
          <p className="mt-2 text-sm text-[var(--color-charcoal-soft)]">{route.description}</p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-[var(--color-charcoal-soft)]">
            {route.estimatedDurationNote && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {route.estimatedDurationNote}
              </span>
            )}
          </div>
          {route.fromFare != null && (
            <div className="text-right">
              <p className="text-[10px] uppercase text-[var(--color-charcoal-soft)]">From</p>
              <p className="text-lg font-bold text-[var(--color-charcoal)]">
                &#8369;{route.fromFare.toLocaleString()}
              </p>
            </div>
          )}
        </div>
        <Link
          href={`/book?routeId=${route.id}`}
          className="mt-4 flex items-center justify-center gap-1 rounded-full bg-[var(--color-coral)] py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)]"
        >
          Check Price &amp; Book <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
