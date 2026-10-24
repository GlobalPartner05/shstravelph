import { Users, Briefcase, Luggage, Snowflake } from "lucide-react";

type VehicleCardProps = {
  name: string;
  tagline: string | null;
  maxPassengers: number;
  maxLargeBags: number;
  maxSmallBags: number;
  amenities: string | null;
  isPlaceholder: boolean;
};

export default function VehicleCard({
  name,
  tagline,
  maxPassengers,
  maxLargeBags,
  maxSmallBags,
  amenities,
  isPlaceholder,
}: VehicleCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--color-border-muted)] bg-white p-5 shadow-sm">
      {isPlaceholder && (
        <span className="mb-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
          Placeholder
        </span>
      )}
      <div className="flex h-32 items-center justify-center rounded-xl bg-[var(--color-coral-light)]">
        <Users className="h-10 w-10 text-[var(--color-coral)]/40" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-[var(--color-charcoal)]">{name}</h3>
      {tagline && <p className="text-sm text-[var(--color-charcoal-soft)]">{tagline}</p>}

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 text-[var(--color-charcoal-soft)]">
            <Users className="h-4 w-4" /> Max Passengers
          </dt>
          <dd className="font-semibold text-[var(--color-charcoal)]">{maxPassengers}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 text-[var(--color-charcoal-soft)]">
            <Briefcase className="h-4 w-4" /> Large Bags
          </dt>
          <dd className="font-semibold text-[var(--color-charcoal)]">{maxLargeBags}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 text-[var(--color-charcoal-soft)]">
            <Luggage className="h-4 w-4" /> Small Bags
          </dt>
          <dd className="font-semibold text-[var(--color-charcoal)]">{maxSmallBags}</dd>
        </div>
        {amenities && (
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-2 text-[var(--color-charcoal-soft)]">
              <Snowflake className="h-4 w-4" /> Amenities
            </dt>
            <dd className="text-right font-medium text-[var(--color-charcoal)]">{amenities}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
